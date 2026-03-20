# WanderWise — AI‑Powered Travel Recommender

WanderWise recommends travel destinations and builds an itinerary-style response based on a user's budget, preferred location, travel style, and interests. It’s a MERN app (MongoDB, Express, React, Node) with AI-powered generation and a rule-based fallback when the LLM is unavailable.

## Tech stack (actual repo)

- **Frontend**: React 18 (Vite), Tailwind CSS, React Router v6, Zustand, Axios
- **Backend**: Node.js (Express), JWT auth, bcrypt, rate limiting, Helmet
- **Database**: MongoDB (Mongoose)
- **AI/LLM**: Groq chat completions via `groq-sdk` + deterministic fallback

## AI module (how it works)

- **Entry point**: `backend/src/ai/llmService.js` (`generateRecommendations`)
- **Prompt building**: `backend/src/ai/promptBuilder.js`
- **LLM provider (Groq)**: `backend/src/ai/adapters/groqAdapter.js` (uses `groq-sdk`)
- **Parsing + validation**: `backend/src/utils/jsonParser.js` (parses the raw model output + validates schema)
- **Fallback**: `backend/src/ai/fallbackService.js` (used when `GROQ_API_KEY` is missing or the response is invalid / the call fails)
- **Health check**: `GET /api/ai/health` (reports whether Groq is configured and reachable)

## Project structure

```
WanderWise1/
├── frontend/          # React frontend app (Vite)
├── backend/           # Express API + MongoDB + AI services
└── README.md
```

## Getting started

### Install

```bash
cd backend && npm install
cd ../frontend && npm install
```

### Backend environment variables

Create `backend/.env`:

- **Required**
  - `MONGO_URI`
  - `JWT_SECRET`
  - `GROQ_API_KEY` (if missing, the backend automatically falls back to the rule-based generator)
- **Optional**
  - `PORT` (defaults to `5000`)
  - `NODE_ENV`
  - `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI` (only if you’re using the Google login endpoint)

### Run (dev)

```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm run dev
```

## Key features (implemented)

- **AI-powered recommendations** with schema validation + **fallback** when the LLM fails
- **Destination details + caching** (MongoDB cache with a 7-day TTL in `backend/src/services/poiService.js`)
- **Authentication**: email/password JWT auth + Google OAuth exchange endpoint
- **Bookmarks + feedback** models and routes

## Useful endpoints

- **API health**: `GET /api/health`
- **AI health**: `GET /api/ai/health`

## License

MIT

