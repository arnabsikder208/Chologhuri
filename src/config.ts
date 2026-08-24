/**
 * Base URL for the CholoGhuri backend API.
 *
 * Local development uses the local Express server. Production uses the
 * Render backend unless Vercel provides VITE_API_URL explicitly.
 */
export const API_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV
    ? 'http://localhost:3000'
    : 'https://chologhuri-backend.onrender.com');
