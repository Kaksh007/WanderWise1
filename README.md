# WanderWise - AI-Powered Travel Recommender

WanderWise recommends travel destinations and top places to visit based on a user's budget, preferred location, travel style and interests. Built with MERN stack (MongoDB, Express, Node.js, React) and lightweight AI text generation using free/freemium inference APIs.

## Tech Stack

- **Frontend:** React 18 + JavaScript, Vite, Tailwind CSS, React Router v6, Zustand
- **Backend:** Node.js + Express, JWT, bcrypt
- **Database:** MongoDB Atlas (Mongoose)
- **AI/LLM:** Groq chat completions (llama-3.1-8b-instant by default) with rule-based fallback
- **POI Data:** OpenTripMap API, GeoNames API

## Project Structure

```
wanderwise/
├── frontend/          # React frontend application
├── backend/           # Express backend API
└── README.md
```

## Getting Started

See [QUICKSTART.md](QUICKSTART.md) for detailed setup instructions.

### Quick Setup

1. Install dependencies:
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```

2. Configure environment variables (see `QUICKSTART.md`)

3. Start servers:
   ```bash
   # Terminal 1 - Backend
   cd backend && npm run dev

   # Terminal 2 - Frontend
   cd frontend && npm run dev
   ```

## Features

- **AI-Powered Recommendations:** Get personalized travel suggestions using Groq LLM completions
- **POI Integration:** Real places of interest from OpenTripMap and GeoNames
- **User Authentication:** Secure JWT-based auth system
- **Bookmarks:** Save your favorite destinations
- **Feedback System:** Rate recommendations to improve results
- **Smart Caching:** Reduces API calls and improves response times
- **Fallback System:** Always returns recommendations even if LLM fails

## Documentation

- [QUICKSTART.md](QUICKSTART.md) - Detailed setup and configuration guide
- [DEPLOYMENT.md](DEPLOYMENT.md) - Production deployment instructions

## License

MIT

