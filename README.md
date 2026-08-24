# CholoGhuri — Chattogram Division Travel Ecosystem

AI-powered travel platform for Chattogram Division, Bangladesh: destination explorer, hotels,
blogs, community, Gemini-powered trip planner, and a personal trip dashboard backed by MongoDB.

## Features

- **Authentication & access control** – bcrypt-hashed accounts in MongoDB, signed session tokens,
  login-only Dashboard / My Trips, guests are prompted with the Login / Sign Up modal.
- **User-scoped trips** – every trip is stored with the owner's user id; users only ever see,
  create and delete their own trips (`/api/trips`).
- **Liquid Glass UI** – frosted-glass cards, header, modals and dropdowns with soft shadows,
  animated floating gradients and particles in the background.
- **Dark mode** – header toggle, persisted in `localStorage`, smooth transition, all pages themed.
- **Language switcher** – English ↔ বাংলা for navigation and major UI labels, persisted.
- **3D Chattogram showcase** – draggable/hover-tilt 3D carousel of Sajek, Cox's Bazar, Patenga,
  Saint Martin's, Foy's Lake and Bandarban on the homepage.

## Run locally

**Prerequisites:** Node.js 18+, a MongoDB connection string.

1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env` and set:
   - `MONGODB_URI` – your MongoDB / Atlas connection string (whitelist your IP in Atlas)
   - `AUTH_SECRET` – long random string used to sign login tokens
   - `GEMINI_API_KEY` – optional; the planner/chatbot fall back to an offline generator without it
   - `PORT` – optional, defaults to `3000`
3. Start the dev server: `npm run dev` → http://localhost:3000

## Production

```
npm run build      # builds the client (dist/) and bundles the server (dist/server.cjs)
npm start          # NODE_ENV=production node dist/server.cjs
```

## API

| Method | Endpoint              | Auth | Description                          |
| ------ | --------------------- | ---- | ------------------------------------ |
| POST   | /api/auth/register    | –    | Create account, returns token + user |
| POST   | /api/auth/login       | –    | Login, returns token + user          |
| GET    | /api/auth/me          | ✓    | Validate stored token                |
| PUT    | /api/auth/profile     | ✓    | Update name / phone / avatar         |
| GET    | /api/trips            | ✓    | List the current user's trips        |
| POST   | /api/trips            | ✓    | Create a trip owned by current user  |
| DELETE | /api/trips/:id        | ✓    | Delete one of the user's own trips   |
| POST   | /api/plan-trip        | –    | Gemini AI itinerary generator        |
| POST   | /api/chat             | –    | AI travel chatbot                    |

Authenticated requests send `Authorization: Bearer <token>`.
