# Quick Start Guide

## Prerequisites

- Node.js 18+ installed
- npm or yarn
- MongoDB Atlas account (free tier)
- API keys for:
  - Groq (free tier chat completions)
  - OpenTripMap (free tier)
  - GeoNames (free, just username)

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment Variables

**Backend (.env file in `backend/` folder):**

Create `backend/.env` from `backend/.env.example`:

```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/wanderwise?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
GROQ_API_KEY=your-groq-api-key
OPENTRIPMAP_API_KEY=your-opentripmap-api-key
GEONAMES_USERNAME=your-geonames-username
NODE_ENV=development
```

> `GROQ_API_KEY` powers the recommendation engine through `backend/src/ai/adapters/groqAdapter.js`; treat it like any other secret and verify it with `backend/scripts/deploy-check.js` if you're moving to staging or production.

**Frontend (.env file in `frontend/` folder):**

Create `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### 3. Get API Keys

#### Groq
1. Visit https://groq.com/console and access the API keys section
2. Create a new chat completions key (read-only rights are sufficient)
3. Store the value in `GROQ_API_KEY`

#### OpenTripMap
1. Go to https://opentripmap.io/docs
2. Sign up for free account
3. Get your API key
4. Copy to `OPENTRIPMAP_API_KEY`

#### GeoNames
1. Go to https://www.geonames.org/login
2. Create free account
3. Use your username (not a key) for `GEONAMES_USERNAME`

#### MongoDB Atlas
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free cluster
3. Get connection string
4. Replace `<password>` with your database password
5. Copy to `MONGO_URI`

### 4. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 5. Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Health Check: http://localhost:5000/api/health

## Testing the Application

1. Open http://localhost:3000
2. Fill in the search form:
   - Location: "Paris" or leave blank for "anywhere"
   - Budget: Select low/medium/high
   - Travel Length: Enter number of days
   - Travel Style: Select from dropdown
   - Interests: Click to select multiple
3. Click "Get Recommendations"
4. View the destination cards
5. Click on a destination to see details

## Troubleshooting

### Backend won't start
- Check MongoDB connection string
- Verify all environment variables are set
- Check if port 5000 is available

### Frontend can't connect to backend
- Verify backend is running on port 5000
- Check `VITE_API_BASE_URL` in frontend `.env`
- Check CORS settings in backend

### No recommendations returned
- Check Groq API key
- Check OpenTripMap API key
- Check browser console and backend logs
- System will fallback to rule-based recommendations if LLM fails

### MongoDB connection errors
- Verify connection string format
- Check IP whitelist in MongoDB Atlas
- Ensure database user has correct permissions

## Next Steps

- Read the full [README.md](README.md) for project overview
- Check [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment
- Review [PROJECT_GUIDE.md](PROJECT_GUIDE.md) for complete architecture details, development phases, and codebase navigation
- Run `cd backend && npm run deploy-check` once your env vars are set to confirm Groq and other keys are present

