import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import connectDB from "./server/db";
import authRoutes from './server/routes/auth.js';
import tripRoutes from './server/routes/trips.js';

dotenv.config();

const app = express();

// Allow the Vercel frontend to call this Render API in production.
// Keep localhost origins for local development.
const allowedOrigins = new Set([
  'https://chologhuri.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000',
]);

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (origin && allowedOrigins.has(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  next();
});

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
  const { destination, days = 3, budgetBDT = 10000, persona = "Solo Travelers" } = req.body;
  const numericDays = Math.max(1, Number(days) || 3);
  const numericBudget = Math.max(0, Number(budgetBDT) || 10000);

  try {
    const ai = getGeminiClient();

    if (ai) {
      try {
        const prompt = `You are an expert Bangladesh travel planner for CholoGhuri.
Generate a realistic day-by-day travel itinerary strictly inside Chattogram Division, Bangladesh for the destination: "${destination}".
Trip Details:
- Duration: ${numericDays} days
- Total Budget: ৳${numericBudget} BDT
- Traveler Persona: ${persona}

Return your response strictly as valid JSON matching this structure:
{
  "title": "Custom ${numericDays}-Day ${destination} ${persona} Experience",
  "destination": "${destination}",
  "days": ${numericDays},
  "budgetBDT": ${numericBudget},
  "budgetUSD": ${Math.round(numericBudget / 115)},
  "persona": "${persona}",
  "itinerary": [
    {
      "day": 1,
      "title": "Arrival & Initial Exploration",
      "morning": "Morning activity description...",
      "afternoon": "Afternoon activity & local food...",
      "evening": "Evening sunset or relaxation...",
      "estExpenseBDT": ${Math.round(numericBudget / numericDays)}
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
          },
        });

        const responseText = response.text || "";
        const parsed = JSON.parse(responseText.trim());

        if (parsed && Array.isArray(parsed.itinerary) && parsed.itinerary.length > 0) {
          return res.json({ success: true, plan: parsed, source: "gemini-ai" });
        }

        console.warn("Gemini returned an incomplete plan; using fallback planner.");
      } catch (aiError) {
        console.error("Gemini planner failed; using fallback planner:", aiError);
      }
    }

    // Smart fallback itinerary generator. This also runs when Gemini is
    // unavailable, misconfigured, rate-limited, or returns invalid JSON.
    const perDayBudget = Math.round(numericBudget / numericDays);
    const fallbackItinerary = Array.from({ length: numericDays }, (_, i) => ({
      day: i + 1,
      title: i === 0
        ? `Journey to ${destination} & Scenic Overview`
        : i === numericDays - 1
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
        title: `${numericDays}-Day ${destination} ${persona} Tour`,
        destination,
        district: destination?.includes("Sajek") || destination?.includes("Kaptai") ? "Rangamati" : "Chattogram City",
        days: numericDays,
        budgetBDT: numericBudget,
        budgetUSD: Math.round(numericBudget / 115),
        persona,
        status: "Upcoming",
        itinerary: fallbackItinerary,
        placesVisited: [destination, `${destination} Viewpoint`, `${destination} Eco Spot`],
        travelersCount: persona === "Couples" ? 2 : persona === "Families" ? 4 : 1,
        notes: "Bring NID copy for army checkposts. Stay hydrated and carry cash.",
      },
      source: "standard-planner",
    });
  } catch (error) {
    console.error("Unexpected error generating trip plan:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to generate trip plan.",
    });
  }
});

// AI Chatbot endpoint for real-time travel queries
app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;
    const ai = getGeminiClient();

    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: "gemini-3.6-flash",
          contents: message,
          config: {
            systemInstruction:
              "You are CholoGhuri's AI Travel Assistant specialized strictly in Chattogram Division, Bangladesh (Sajek, Cox's Bazar, Bandarban, Rangamati, Sitakunda, Patenga, Foy's Lake, Mirsarai, St. Martin). Provide warm, concise, practical travel guidance including transport routes, cost in BDT, best visiting hours, and local food recommendations.",
          },
        });
        return res.json({ reply: response.text });
      } catch (aiError) {
        console.error("Gemini chat failed; using offline response:", aiError);
      }
    }

    // Friendly offline advice fallback
    return res.json({
      reply: `Regarding "${message}": For destinations in Chattogram Division like Sajek, Nilgiri, or Chandranath Hill, the best time to visit is October to March (or July-Sept for monsoonal waterfalls). Chander Gari jeeps are standard transport in hill districts. Feel free to use our AI Trip Planner tab for a custom itinerary!`,
    });
  } catch (err) {
    console.error("Chat endpoint failed:", err);
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
