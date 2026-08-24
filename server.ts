import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import connectDB from "./server/db";
import authRoutes from './server/routes/auth.js';
import tripRoutes from './server/routes/trips.js';
import cors from 'cors';

app.use(cors({
  origin: [
    'https://chologhuri.vercel.app', // Your Vercel frontend domain
    'http://localhost:3000',
    'http://localhost:5173'
  ],
  credentials: true
}));

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '2mb' }));
app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes); // user-scoped trip CRUD (auth required)

// Server-side Gemini AI initialization with telemetry header
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// -------------------------------------------------------------
// REST API ENDPOINTS
// -------------------------------------------------------------

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    app: "CholoGhuri Travel Ecosystem",
    scope: "Version 1 (MVP) - Chattogram Division",
    timestamp: new Date().toISOString(),
  });
});

// AI Trip Planner Endpoint
app.post("/api/plan-trip", async (req, res) => {
  try {
    const { destination, days = 3, budgetBDT = 10000, persona = "Solo Travelers" } = req.body;
    const ai = getGeminiClient();

    if (ai) {
      const prompt = `You are an expert Bangladesh travel planner for CholoGhuri.
Generate a realistic day-by-day travel itinerary strictly inside Chattogram Division, Bangladesh for the destination: "${destination}".
Trip Details:
- Duration: ${days} days
- Total Budget: ৳${budgetBDT} BDT
- Traveler Persona: ${persona}

Return your response strictly as valid JSON matching this structure:
{
  "title": "Custom ${days}-Day ${destination} ${persona} Experience",
  "destination": "${destination}",
  "days": ${days},
  "budgetBDT": ${budgetBDT},
  "budgetUSD": ${Math.round(budgetBDT / 115)},
  "persona": "${persona}",
  "itinerary": [
    {
      "day": 1,
      "title": "Arrival & Initial Exploration",
      "morning": "Morning activity description...",
      "afternoon": "Afternoon activity & local food...",
      "evening": "Evening sunset or relaxation...",
      "estExpenseBDT": ${Math.round(budgetBDT / days)}
    }
  ],
  "placesVisited": ["Spot 1", "Spot 2"],
  "travelersCount": 1,
  "notes": "Essential travel advice, security tip, or packing note."
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.7,
        },
      });

      const responseText = response.text || "";
      try {
        const parsed = JSON.parse(responseText.trim());
        return res.json({ success: true, plan: parsed, source: "gemini-ai" });
      } catch (parseErr) {
        console.warn("JSON parse failed for Gemini response, using fallback format");
      }
    }

    // Smart Fallback itinerary generator if Gemini API key is unconfigured
    const perDayBudget = Math.round(budgetBDT / Math.max(1, days));
    const fallbackItinerary = Array.from({ length: Number(days) }, (_, i) => ({
      day: i + 1,
      title: i === 0 
        ? `Journey to ${destination} & Scenic Overview`
        : i === Number(days) - 1
        ? `Final Spot Visits & Return to Chattogram`
        : `Deep Exploration of ${destination} Landmarks`,
      morning: `Early morning departure and breakfast. Trek or drive to primary attraction in ${destination}.`,
      afternoon: `Enjoy authentic local cuisine (e.g. Bamboo Chicken or fresh seafood) followed by scenic spot walk.`,
      evening: `Sunset viewing from mountain gazebo/sea beach. Relax at local eco resort with hot tea.`,
      estExpenseBDT: perDayBudget,
    }));

    return res.json({
      success: true,
      plan: {
        title: `${days}-Day ${destination} ${persona} Tour`,
        destination,
        district: destination.includes("Sajek") || destination.includes("Kaptai") ? "Rangamati" : "Chattogram City",
        days: Number(days),
        budgetBDT: Number(budgetBDT),
        budgetUSD: Math.round(Number(budgetBDT) / 115),
        persona,
        status: "Upcoming",
        itinerary: fallbackItinerary,
        placesVisited: [destination, `${destination} Viewpoint`, `${destination} Eco Spot`],
        travelersCount: persona === "Couples" ? 2 : persona === "Families" ? 4 : 1,
        notes: "Bring NID copy for army checkposts. Stay hydrated and carry cash.",
      },
      source: "standard-planner",
    });
  } catch (error: any) {
    console.error("Error generating trip plan:", error);
    return res.status(500).json({ error: "Failed to generate trip plan." });
  }
});

// AI Chatbot endpoint for real-time travel queries
app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;
    const ai = getGeminiClient();

    if (ai) {
      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: message,
        config: {
          systemInstruction:
            "You are CholoGhuri's AI Travel Assistant specialized strictly in Chattogram Division, Bangladesh (Sajek, Cox's Bazar, Bandarban, Rangamati, Sitakunda, Patenga, Foy's Lake, Mirsarai, St. Martin). Provide warm, concise, practical travel guidance including transport routes, cost in BDT, best visiting hours, and local food recommendations.",
        },
      });
      return res.json({ reply: response.text });
    }

    // Friendly offline advice fallback
    return res.json({
      reply: `Regarding "${message}": For destinations in Chattogram Division like Sajek, Nilgiri, or Chandranath Hill, the best time to visit is October to March (or July-Sept for monsoonal waterfalls). Chander Gari jeeps are standard transport in hill districts. Feel free to use our AI Trip Planner tab for a custom itinerary!`,
    });
  } catch (err: any) {
    return res.status(500).json({ reply: "Sorry, I am having trouble connecting to AI assistant right now." });
  }
});

// -------------------------------------------------------------
// VITE & STATIC FILES SETUP
// -------------------------------------------------------------
async function startServer() {
  try {
    // Connect MongoDB first
    await connectDB();

    if (process.env.NODE_ENV !== "production") {
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
      });

      app.use(vite.middlewares);
    } else {
      const distPath = path.join(process.cwd(), "dist");

      app.use(express.static(distPath));

      app.get("*", (req, res) => {
        res.sendFile(path.join(distPath, "index.html"));
      });
    }

    app.listen(PORT, "0.0.0.0", () => {
      console.log(
        `CholoGhuri Full-Stack Server running on http://0.0.0.0:${PORT}`
      );
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
