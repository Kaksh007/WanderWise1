# Deployment Guide

## Prerequisites

- MongoDB Atlas account (free tier)
- Groq API key (`GROQ_API_KEY`)
- OpenTripMap API key
- GeoNames username (free, no key needed)
- Vercel account (for frontend)
- Render/Railway account (for backend)

## Backend Deployment (Render/Railway)

1. **Prepare Environment Variables:**
   ```
   PORT=5000
   MONGO_URI=your-mongodb-atlas-connection-string
   JWT_SECRET=your-secret-key
   GROQ_API_KEY=your-groq-api-key
   OPENTRIPMAP_API_KEY=your-opentripmap-key
   GEONAMES_USERNAME=your-geonames-username
   NODE_ENV=production
   ```

2. **Deploy to Render:**
   - Connect your GitHub repository
   - Create a new Web Service
   - Set build command: `cd backend && npm install`
   - Set start command: `cd backend && npm start`
   - Add all environment variables
   - Deploy

3. **Deploy to Railway:**
   - Connect your GitHub repository
   - Create a new project
   - Add a service from the backend folder
   - Add all environment variables
   - Deploy

## Frontend Deployment (Vercel)

1. **Prepare Environment Variables:**
   ```
   VITE_API_BASE_URL=https://your-backend-url.com/api
   ```

2. **Deploy:**
   - Connect your GitHub repository
   - Set root directory to `frontend`
   - Add environment variable `VITE_API_BASE_URL`
   - Deploy

## Post-Deployment Checklist

- [ ] Test health endpoint: `GET /api/health`
- [ ] Test authentication endpoints
- [ ] Test recommendation endpoint
- [ ] Verify CORS is working
- [ ] Check MongoDB connection
- [ ] Monitor error logs
- [ ] Test rate limiting

## API Keys Setup

### Groq
1. Visit https://groq.com/console (or the Groq Console API Keys page)
2. Sign up / log in and create a new API key for chat completions
3. Copy the key into `GROQ_API_KEY` in your backend environment variables

### OpenTripMap
1. Go to https://opentripmap.io/docs
2. Sign up for free API key
3. Add to backend environment variables

### GeoNames
1. Go to https://www.geonames.org/login
2. Create free account
3. Add username to backend environment variables

