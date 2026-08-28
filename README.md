# 🌏 CholoGhuri — Chattogram Division Travel Ecosystem

> **Explore. Plan. Travel. Repeat.**

**CholoGhuri** is an AI-powered travel ecosystem designed specifically for exploring the beautiful destinations of **Chattogram Division, Bangladesh**. It helps travelers discover destinations, plan personalized trips, save their travel plans, and get AI-powered travel assistance — all through a modern and responsive web experience.

🔗 **Live Website:** https://chologhuri.vercel.app/
💻 **GitHub Repository:** https://github.com/arnabsikder208/Chologhuri

---

## ✨ Features

### 🗺️ Destination Exploration

Explore popular travel destinations across Chattogram Division, including:

* 🏔️ Sajek
* 🌊 Cox's Bazar
* ⛰️ Bandarban
* 🏞️ Rangamati
* 🌿 Sitakunda
* 🌅 Patenga
* 🌳 Foy's Lake
* 💦 Mirsarai
* 🏝️ Saint Martin

Discover destination information and explore places to visit.

### 🤖 AI Trip Planner

Generate personalized travel itineraries using AI.

Users can provide:

* Destination
* Number of days
* Travel budget
* Traveler type/persona

The system generates a structured itinerary containing:

* Morning activities
* Afternoon activities
* Evening activities
* Estimated daily expenses
* Places to visit
* Number of travelers
* Travel notes

### 💬 AI Travel Assistant

Chat with the integrated AI travel assistant for travel-related questions.

The assistant can provide information about:

* Transportation
* Estimated costs
* Best visiting times
* Local food
* Travel suggestions
* Popular destinations
* Practical travel advice

### 🔐 User Authentication

CholoGhuri includes a complete authentication system:

* User registration
* User login
* Password hashing using bcrypt
* Session/token-based authentication
* Current-session validation
* Profile management

Authentication uses signed **HMAC-SHA256 Bearer tokens** with a 7-day lifetime.

### 🧳 Personal Trip Management

Authenticated users can manage their own trips.

Users can:

* Create trips
* View saved trips
* Delete trips
* Store personalized itineraries
* Track destination and travel information

Each trip is linked to its owner, ensuring that users can only access their own saved trips.

### 🌙 Modern User Interface

The project includes a modern travel-focused interface featuring:

* Responsive design
* Liquid-glass inspired UI
* Dark mode
* English/Bangla language support
* Interactive components
* Smooth animations
* Destination showcase

---

## 🛠️ Technology Stack

| Category          | Technology               |
| ----------------- | ------------------------ |
| Frontend          | React                    |
| Language          | TypeScript               |
| Build Tool        | Vite                     |
| Backend           | Node.js + Express.js     |
| Database          | MongoDB                  |
| ODM               | Mongoose                 |
| Authentication    | HMAC-SHA256 Bearer Token |
| Password Security | bcrypt                   |
| AI                | Google Gemini            |
| Styling           | Tailwind CSS             |
| Icons             | Lucide React             |
| Animation         | Motion                   |
| Deployment        | Vercel                   |

---


### Trip Management

#### Get User Trips

```http
GET /api/trips
```

Requires authentication.

Returns trips belonging to the authenticated user.

## 🔒 Security

CholoGhuri implements several security measures:

* Passwords are hashed using **bcrypt**
* Authentication tokens are signed using **HMAC-SHA256**
* Authentication tokens expire after 7 days
* Protected APIs require Bearer authentication
* Trip ownership is validated server-side
* User-provided `userId` values are ignored when creating trips
* MongoDB is used for persistent data storage
* API keys are stored through environment variables


## 👥 Team Members

| #  | Team Member            |
| -- | ---------------------- |
| 01 | **Arnab Sikder**       |
| 02 | **Abdullah Al Jaber**  |
| 03 | **Md Irfan**           |
| 04 | **Md. Tanvir Rahman Abir** |

---

## 🎯 Project Scope

The current version of CholoGhuri focuses on **Chattogram Division, Bangladesh**.

The project aims to provide travelers with a centralized platform where they can:

```text
Discover Destinations
        ↓
Get Travel Information
        ↓
Generate AI Trip Plan
        ↓
Save Personal Trips
        ↓
Ask AI Travel Assistant
        ↓
Travel & Explore
```

---

## 🌐 Project Links

**Live Website**

https://chologhuri.vercel.app/

**GitHub Repository**

https://github.com/arnabsikder208/Chologhuri

---


## ❤️ Made for Travelers of Bangladesh

**CholoGhuri** is built to make discovering and planning trips around Chattogram Division easier, smarter, and more enjoyable.

> **CholoGhuri — Explore Chattogram. Discover Bangladesh. 🇧🇩**
