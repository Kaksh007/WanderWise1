# WanderWise - Complete Project Guide

This document provides a comprehensive overview of the WanderWise project structure, architecture, and implementation details. Use this guide to understand how the entire system works.

## Table of Contents

1. [Project Overview](#project-overview)
2. [Development Plan & Phases](#development-plan--phases)
3. [Architecture Overview](#architecture-overview)
4. [Project Structure](#project-structure)
5. [Backend Architecture](#backend-architecture)
6. [Frontend Architecture](#frontend-architecture)
7. [Data Flow](#data-flow)
8. [Key Components Explained](#key-components-explained)
9. [API Endpoints](#api-endpoints)
10. [Database Schema](#database-schema)
11. [AI Module Deep Dive](#ai-module-deep-dive)
12. [How to Navigate the Codebase](#how-to-navigate-the-codebase)

---

## Project Overview

**WanderWise** is an AI-powered travel recommendation system that suggests destinations based on user preferences (budget, location, travel style, interests). It uses:

- **MERN Stack**: MongoDB, Express, React, Node.js
- **AI/LLM**: Hugging Face Inference API for generating recommendations
- **POI Data**: OpenTripMap and GeoNames for real places of interest
- **Fallback System**: Rule-based recommendations when AI fails

### Core Features

1. **Search & Recommendations**: Users input preferences → Get 3-5 destination suggestions
2. **POI Integration**: Real places of interest fetched from external APIs
3. **User Authentication**: JWT-based auth system
4. **Bookmarks**: Save favorite destinations
5. **Feedback**: Rate recommendations (upvote/downvote)
6. **Caching**: Smart caching to reduce API calls and costs

---

## Development Plan & Phases

This project was developed following a structured 5-phase plan over 8-10 weeks. Understanding these phases helps explain the project's organization and development approach.

### Technology Stack Decision

**Why JavaScript over TypeScript?**
- Faster iteration for MVP phase
- Less boilerplate, quicker prototyping
- Can migrate to TypeScript in future phases if needed
- Structure code modularly to support future TS migration

**Core Stack:**
- **Frontend:** React 18 + JavaScript, Vite, Tailwind CSS, React Router v6, Zustand (lightweight state)
- **Backend:** Node.js + Express, JWT (jsonwebtoken), bcrypt
- **Database:** MongoDB Atlas (Mongoose ODM)
- **AI/LLM:** Hugging Face Inference API (primary), fallback to rule-based
- **POI Data:** OpenTripMap API, GeoNames API
- **Deployment:** Vercel (frontend), Render/Railway (backend), MongoDB Atlas

---

### Phase 1: Foundation & Project Setup (Week 1-2)

**Goal:** Set up the project structure, tooling, and basic configuration.

**Tasks Completed:**
- ✅ Initialize monorepo structure (frontend/backend folders)
- ✅ Setup Vite + React frontend with Tailwind CSS
- ✅ Setup Express backend with basic middleware (cors, body-parser, helmet)
- ✅ Configure ESLint + Prettier
- ✅ Setup environment variables (.env.example)
- ✅ Initialize Git repository
- ✅ Create basic CI/CD workflow (GitHub Actions) for linting

**Key Files Created:**
- `backend/.env.example` - Environment variables template
- `backend/src/config/database.js` - MongoDB connection
- `frontend/vite.config.js` - Vite configuration
- `package.json` files with dependencies

**Dependencies Installed:**
- Frontend: react, react-dom, react-router-dom, zustand, axios, tailwindcss
- Backend: express, mongoose, dotenv, jsonwebtoken, bcrypt, axios, cors, helmet

---

### Phase 2: Backend Infrastructure & Data Integration (Week 3-4)

**Goal:** Build the backend foundation, database models, authentication, and POI data integration.

#### 2.1 Database Models & Schema

**Files Created:** `backend/src/models/`
- `User.js` - User schema (email, passwordHash, name, prefs, createdAt)
- `Destination.js` - Cached destination data (name, country, coords, summary, topPlaces[], cachedAt)
- `Recommendation.js` - Generated recommendations (userId, input, results[], createdAt)
- `Bookmark.js` - User bookmarks (userId, destinationId, note, createdAt)
- `Feedback.js` - User feedback (userId, recommendationId, rating, comment, createdAt)

#### 2.2 Authentication System

**Files Created:**
- `backend/src/routes/auth.js` - Auth routes
- `backend/src/controllers/authController.js` - Register/login logic
- `backend/src/middleware/auth.js` - JWT verification middleware
- `backend/src/utils/hashPassword.js` - Password hashing utility

**Endpoints Implemented:**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login (returns JWT)

#### 2.3 POI Data Integration

**Files Created:**
- `backend/src/services/openTripMapService.js` - OpenTripMap API client
- `backend/src/services/geoNamesService.js` - GeoNames API client
- `backend/src/services/poiService.js` - Unified POI service (combines both sources)
- `backend/src/controllers/destinationController.js` - Destination CRUD

**Features:**
- Fetch POIs by location/coordinates from OpenTripMap
- Validate place names using GeoNames
- Cache POI data in MongoDB (Destination collection)
- Cache TTL: 7 days (configurable)

**Endpoints Implemented:**
- `GET /api/destination/:id` - Get cached destination details
- `GET /api/destination/search?q=location` - Search destinations (with caching)

#### 2.4 API Structure

**Files Created:**
- `backend/src/routes/index.js` - Main router
- `backend/src/routes/recommend.js` - Recommendation routes
- `backend/src/routes/bookmarks.js` - Bookmark routes
- `backend/src/routes/feedback.js` - Feedback routes

**Middleware:**
- `backend/src/middleware/errorHandler.js` - Global error handler
- `backend/src/middleware/rateLimiter.js` - Rate limiting (prevent abuse)

---

### Phase 3: AI Recommendation Engine (Week 5-6)

**Goal:** Implement the AI-powered recommendation system with LLM integration and fallback mechanisms.

#### 3.1 AI Module Structure

**Dedicated AI Folder:** `backend/src/ai/`

This folder contains all AI/LLM-related logic, keeping it separate from other services for better organization and maintainability.

**Files Created in `backend/src/ai/`:**
- `llmService.js` - Main LLM service orchestrator (handles provider selection, retries, error handling)
- `promptBuilder.js` - Prompt template builder and construction logic
- `fallbackService.js` - Rule-based fallback recommender (when LLM fails)
- `adapters/huggingFaceAdapter.js` - Hugging Face Inference API adapter (provider-specific implementation)

**Utility Files:**
- `backend/src/utils/jsonParser.js` - Parse and validate LLM JSON responses (shared utility)

**LLM Service Architecture:**
- `llmService.js` acts as the main orchestrator:
  - Provider selection (currently Hugging Face, extensible for OpenAI later)
  - Retry logic and error handling
  - Response validation
  - Fallback to rule-based service on failure

- `adapters/huggingFaceAdapter.js`:
  - Direct Hugging Face Inference API integration
  - Model selection: `google/flan-t5-base` or `mistralai/Mistral-7B-Instruct-v0.2` (check free tier)
  - Token limit: 500 tokens max per request
  - Rate limit handling

- `promptBuilder.js`:
  - Constructs prompts with user preferences
  - Handles different prompt templates
  - Formats POI context into prompts

- `fallbackService.js`:
  - Rule-based destination mapping
  - Budget → country list mapping
  - Travel style → destination type mapping
  - Returns structured recommendations matching LLM output format

**Benefits of Separate AI Folder:**
- Easy to swap LLM providers (just add new adapter)
- Clear separation of concerns
- Easier testing (mock entire AI module)
- Future-proof for adding multiple AI providers or models

**Prompt Template Structure:**
```javascript
SYSTEM: You are a travel assistant. Output only valid JSON.
USER: User preferences: {location, budget, days, travelStyle, interests[]}
Output format: {candidates: [{name, score, reason, topPlaces: [{name, description}], sampleItineraryText}]}
```

#### 3.2 Recommendation Controller

**File:** `backend/src/controllers/recommendController.js`

**Imports from AI Module:**
- `../ai/llmService.js` - Main LLM service
- `../ai/promptBuilder.js` - Prompt builder (used by llmService internally)
- `../ai/fallbackService.js` - Fallback service (used by llmService on failure)

**Logic Flow:**
1. Validate input (location, budget, days, travelStyle, interests)
2. Check cache for similar recommendations (same input hash)
3. If cached, return cached result
4. If not cached:
   - Fetch POI data for location (or "anywhere" → use popular destinations) via POI service
   - Call `llmService.generateRecommendations(userInput, poiData)`
     - Internally uses `promptBuilder` to construct prompt
     - Calls Hugging Face adapter via `adapters/huggingFaceAdapter.js`
     - If LLM fails → automatically falls back to `fallbackService`
     - Returns structured recommendations
   - Cache result in MongoDB
   - Return recommendations to client

**Fallback Service:**
- Rule-based mapping: budget → country list, travelStyle → destination types
- Returns 3-5 destinations with basic reasons
- Ensures users always get recommendations

**Endpoint:**
- `POST /api/search/recommend` - Generate recommendations
  - Body: `{location?, budgetRange, lengthDays, travelStyle, interests[]}`
  - Returns: `{candidates: [...], cached: boolean, timestamp}`

#### 3.3 Caching Strategy

- Cache key: hash of input parameters (location+budget+days+style+interests)
- Cache TTL: 24 hours for recommendations
- Store in `Recommendation` collection with `userId` (optional for anonymous)

---

### Phase 4: Frontend Development (Week 7-8)

**Goal:** Build the user interface, connect to backend APIs, and implement all user-facing features.

#### 4.1 State Management (Zustand)

**Files Created:**
- `frontend/src/store/useAuthStore.js` - Authentication state
- `frontend/src/store/useRecommendationStore.js` - Recommendations state

#### 4.2 API Service Layer

**Files Created:**
- `frontend/src/services/api.js` - Axios instance with interceptors
- `frontend/src/services/authService.js` - Auth API calls
- `frontend/src/services/recommendationService.js` - Recommendation API calls
- `frontend/src/services/bookmarkService.js` - Bookmark API calls
- `frontend/src/services/destinationService.js` - Destination API calls
- `frontend/src/services/feedbackService.js` - Feedback API calls

#### 4.3 UI Components

**Files Created in `frontend/src/components/`:**
- `SearchForm.jsx` - Main search form (location, budget, days, style, interests)
- `DestinationCard.jsx` - Destination recommendation card
- `DestinationDetail.jsx` - Detailed view (top places, itinerary)
- `BookmarkButton.jsx` - Save/bookmark component
- `FeedbackButtons.jsx` - Upvote/downvote buttons
- `LoadingSpinner.jsx` - Loading states
- `ErrorMessage.jsx` - Error display

#### 4.4 Pages & Routing

**Files Created in `frontend/src/pages/`:**
- `LandingPage.jsx` - Hero section + search form
- `ResultsPage.jsx` - List of destination recommendations
- `DestinationPage.jsx` - Single destination detail view
- `ProfilePage.jsx` - User profile, bookmarks, history
- `LoginPage.jsx` - Login form
- `RegisterPage.jsx` - Registration form

**Routing:** `frontend/src/App.jsx` - React Router setup

#### 4.5 UI/UX Features

- Responsive design (mobile-first)
- Loading states for async operations
- Error boundaries for graceful error handling
- Toast notifications for user actions (react-hot-toast)
- Form validation (client-side)
- Accessible components (ARIA labels)

---

### Phase 5: Testing, Optimization & Deployment (Week 9-10)

**Goal:** Test the application, optimize performance, and prepare for deployment.

#### 5.1 Testing

**Backend Tests:**
- `backend/tests/` - Jest test suite
  - `tests/ai/` - AI module unit tests
    - `fallbackService.test.js` - Test fallback logic
  - `tests/utils/` - Utility tests
    - `jsonParser.test.js` - Test JSON parsing
  - Mock external APIs (OpenTripMap, Hugging Face)

**Frontend Tests:**
- React Testing Library for component tests (structure ready)
- E2E tests (Playwright) for critical flows: search → results → bookmark (structure ready)

#### 5.2 Performance Optimization

- Request debouncing for search (ready for implementation)
- Response compression (gzip) - Express default
- Optimize MongoDB queries (indexes on userId, destinationId)
- Frontend code splitting (React.lazy) - ready for implementation
- Image optimization (if adding images later)

#### 5.3 Error Handling & Monitoring

- Global error handler implemented
- Logging: console for backend, console for frontend (dev)
- Rate limiting per IP/user implemented
- Graceful degradation when APIs fail (fallback service)

#### 5.4 Deployment

**Backend:**
- Deploy to Render/Railway (documentation ready)
- Environment variables setup (documented)
- MongoDB Atlas connection (production ready)
- Health check endpoint: `GET /api/health` (implemented)

**Frontend:**
- Deploy to Vercel (documentation ready)
- Environment variables (API base URL) (documented)
- Build optimization (Vite handles this)

**Post-Deployment:**
- Test production endpoints (checklist in DEPLOYMENT.md)
- Monitor error rates
- Validate caching works
- Check rate limits

---

### Original Plan Summary

**Development Timeline:** 8-10 weeks

**Key Design Decisions:**
1. **Separate AI Folder**: All AI/LLM logic in `backend/src/ai/` for better organization
2. **JavaScript over TypeScript**: Faster MVP development, can migrate later
3. **Caching Strategy**: Aggressive caching to reduce API costs and improve performance
4. **Fallback System**: Always provide recommendations even if LLM fails
5. **Free/Freemium APIs**: Use free tiers to keep costs low

**Success Metrics (MVP):**
- ✅ User can search and receive 3-5 destination recommendations
- ✅ Recommendations include top 5 places and sample itinerary
- ✅ Users can save/bookmark recommendations
- ✅ System handles API failures gracefully (fallback)
- ✅ Response time < 5 seconds (with caching)
- ✅ Zero critical security vulnerabilities

**Risk Mitigation:**
1. **LLM API Rate Limits:** Implement aggressive caching, fallback service ✅
2. **POI API Failures:** Cache POI data, use GeoNames as backup ✅
3. **Cost Control:** Limit tokens, cache everything, use free-tier models ✅
4. **Security:** Rate limiting, input validation, JWT expiration, password hashing ✅

**Future Enhancements (Post-MVP):**
- TypeScript migration
- Personalized ranking based on feedback
- Multi-language support
- PDF export for itineraries
- Integration with flight/hotel APIs
- Season/climate filters

---

## Architecture Overview

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   React     │  HTTP   │   Express   │  HTTP   │  MongoDB    │
│  Frontend   │────────▶│   Backend   │────────▶│   Atlas     │
│  (Vite)     │         │  (Node.js)  │         │  Database   │
└─────────────┘         └─────────────┘         └─────────────┘
                              │
                              │ API Calls
                              ▼
                    ┌─────────────────────┐
                    │  External Services  │
                    ├─────────────────────┤
                    │ • Hugging Face API  │
                    │ • OpenTripMap API   │
                    │ • GeoNames API      │
                    └─────────────────────┘
```

### Technology Stack

**Frontend:**
- React 18 (JavaScript)
- Vite (build tool)
- Tailwind CSS (styling)
- React Router v6 (routing)
- Zustand (state management)
- Axios (HTTP client)

**Backend:**
- Node.js + Express
- MongoDB + Mongoose (ODM)
- JWT (authentication)
- bcrypt (password hashing)
- Axios (external API calls)

**External Services:**
- Hugging Face Inference API (LLM)
- OpenTripMap API (POI data)
- GeoNames API (place validation)

---

## Project Structure

```
WanderWise1/
│
├── frontend/                    # React frontend application
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── SearchForm.jsx
│   │   │   ├── DestinationCard.jsx
│   │   │   ├── BookmarkButton.jsx
│   │   │   ├── FeedbackButtons.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   └── ErrorMessage.jsx
│   │   │
│   │   ├── pages/              # Page components (routes)
│   │   │   ├── LandingPage.jsx      # Home page with search
│   │   │   ├── ResultsPage.jsx      # Search results
│   │   │   ├── DestinationPage.jsx  # Single destination detail
│   │   │   ├── ProfilePage.jsx      # User profile & bookmarks
│   │   │   ├── LoginPage.jsx        # Login form
│   │   │   └── RegisterPage.jsx      # Registration form
│   │   │
│   │   ├── services/           # API service layer
│   │   │   ├── api.js          # Axios instance with interceptors
│   │   │   ├── authService.js
│   │   │   ├── recommendationService.js
│   │   │   ├── bookmarkService.js
│   │   │   ├── destinationService.js
│   │   │   └── feedbackService.js
│   │   │
│   │   ├── store/             # Zustand state management
│   │   │   ├── useAuthStore.js
│   │   │   └── useRecommendationStore.js
│   │   │
│   │   ├── App.jsx            # Main app component with routing
│   │   ├── main.jsx           # React entry point
│   │   └── index.css          # Global styles + Tailwind
│   │
│   ├── public/               # Static assets
│   ├── package.json
│   ├── vite.config.js        # Vite configuration
│   └── tailwind.config.js    # Tailwind CSS config
│
├── backend/                   # Express backend API
│   ├── src/
│   │   ├── ai/                # AI MODULE (separate folder!)
│   │   │   ├── adapters/
│   │   │   │   └── huggingFaceAdapter.js  # Hugging Face API client
│   │   │   ├── llmService.js             # Main LLM orchestrator
│   │   │   ├── promptBuilder.js          # Prompt construction
│   │   │   └── fallbackService.js         # Rule-based fallback
│   │   │
│   │   ├── models/            # MongoDB schemas (Mongoose)
│   │   │   ├── User.js
│   │   │   ├── Destination.js
│   │   │   ├── Recommendation.js
│   │   │   ├── Bookmark.js
│   │   │   └── Feedback.js
│   │   │
│   │   ├── controllers/      # Route handlers (business logic)
│   │   │   ├── authController.js
│   │   │   ├── recommendController.js    # Main recommendation logic
│   │   │   ├── bookmarkController.js
│   │   │   ├── feedbackController.js
│   │   │   └── destinationController.js
│   │   │
│   │   ├── routes/            # API route definitions
│   │   │   ├── index.js       # Main router (combines all routes)
│   │   │   ├── auth.js
│   │   │   ├── recommend.js
│   │   │   ├── bookmarks.js
│   │   │   ├── feedback.js
│   │   │   └── destination.js
│   │   │
│   │   ├── services/          # External API services
│   │   │   ├── openTripMapService.js
│   │   │   ├── geoNamesService.js
│   │   │   └── poiService.js  # Unified POI service
│   │   │
│   │   ├── middleware/        # Express middleware
│   │   │   ├── auth.js         # JWT verification
│   │   │   ├── errorHandler.js # Global error handler
│   │   │   └── rateLimiter.js  # Rate limiting
│   │   │
│   │   ├── config/            # Configuration
│   │   │   └── database.js    # MongoDB connection
│   │   │
│   │   ├── utils/             # Utility functions
│   │   │   ├── hashPassword.js
│   │   │   ├── jsonParser.js  # LLM response parsing
│   │   │   └── validateInput.js
│   │   │
│   │   └── server.js         # Express app entry point
│   │
│   ├── tests/                 # Jest test files
│   │   ├── ai/
│   │   └── utils/
│   │
│   ├── package.json
│   └── .env.example          # Environment variables template
│
├── .gitignore
├── README.md                  # Project overview
├── QUICKSTART.md              # Setup instructions
├── DEPLOYMENT.md              # Production deployment guide
└── PROJECT_GUIDE.md          # This file!
```

---

## Backend Architecture

### Request Flow

```
HTTP Request
    │
    ▼
server.js (Express app setup)
    │
    ▼
routes/index.js (main router)
    │
    ▼
routes/[specific].js (route definition)
    │
    ▼
middleware/auth.js (if protected route)
    │
    ▼
controllers/[name]Controller.js (business logic)
    │
    ├─▶ models/ (database operations)
    ├─▶ services/ (external APIs)
    └─▶ ai/ (LLM generation)
    │
    ▼
Response sent to client
```

### Key Backend Files Explained

#### `server.js`
- Entry point of the Express application
- Sets up middleware (CORS, helmet, body-parser)
- Connects to MongoDB
- Registers routes
- Error handling

#### `routes/index.js`
- Main router that combines all route modules
- Maps URLs to route handlers:
  - `/api/auth/*` → auth routes
  - `/api/search/*` → recommendation routes
  - `/api/bookmarks/*` → bookmark routes
  - `/api/feedback/*` → feedback routes
  - `/api/destination/*` → destination routes

#### `controllers/recommendController.js`
**This is the heart of the recommendation system!**

Flow:
1. Validates user input
2. Generates cache key (hash of input)
3. Checks MongoDB for cached recommendations
4. If cached → return immediately
5. If not cached:
   - Fetch POI data from `poiService`
   - Call `llmService.generateRecommendations()`
   - Cache result in MongoDB
   - Return recommendations

#### `services/poiService.js`
- Unified service for Points of Interest
- Uses `openTripMapService` and `geoNamesService`
- Implements caching (7-day TTL)
- Handles "anywhere" searches with popular destinations

---

## Frontend Architecture

### Component Hierarchy

```
App.jsx (Router)
│
├─▶ LandingPage
│   └─▶ SearchForm
│
├─▶ ResultsPage
│   └─▶ DestinationCard (multiple)
│
├─▶ DestinationPage
│   ├─▶ BookmarkButton
│   └─▶ FeedbackButtons
│
├─▶ ProfilePage
│
├─▶ LoginPage
│
└─▶ RegisterPage
```

### State Management (Zustand)

**`useAuthStore.js`**
- Stores: `user`, `token`
- Methods: `setUser()`, `logout()`
- Persists to localStorage

**`useRecommendationStore.js`**
- Stores: `recommendations`
- Methods: `setRecommendations()`, `clearRecommendations()`

### Service Layer Pattern

All API calls go through service files in `frontend/src/services/`:

- `api.js`: Axios instance with:
  - Base URL configuration
  - Request interceptor (adds JWT token)
  - Response interceptor (handles errors, 401 redirects)

- Individual services (`authService.js`, `recommendationService.js`, etc.):
  - Wrap API calls in clean functions
  - Return promises
  - Used by components

---

## Data Flow

### Recommendation Generation Flow

```
1. User fills SearchForm
   │
   ▼
2. Frontend: recommendationService.getRecommendations(searchData)
   │
   ▼
3. POST /api/search/recommend
   │
   ▼
4. Backend: recommendController.getRecommendations()
   │
   ├─▶ Check cache (MongoDB Recommendation collection)
   │   └─▶ If found → return cached result
   │
   └─▶ If not cached:
       │
       ├─▶ poiService.getPOIData(location)
       │   ├─▶ Check Destination cache
       │   ├─▶ If not cached:
       │   │   ├─▶ openTripMapService.searchPlaces()
       │   │   └─▶ geoNamesService.validatePlaceName()
       │   └─▶ Cache POI data
       │
       ├─▶ llmService.generateRecommendations(userInput, poiData)
       │   ├─▶ promptBuilder.buildRecommendationPrompt()
       │   ├─▶ huggingFaceAdapter.generate()
       │   ├─▶ jsonParser.parseLLMResponse()
       │   └─▶ If fails → fallbackService.generateRecommendations()
       │
       ├─▶ Cache recommendation in MongoDB
       │
       └─▶ Return to frontend
```

### Authentication Flow

```
1. User submits login/register form
   │
   ▼
2. Frontend: authService.login() or authService.register()
   │
   ▼
3. POST /api/auth/login or /api/auth/register
   │
   ▼
4. Backend: authController.login() or authController.register()
   │
   ├─▶ Validate input
   ├─▶ Hash password (register) or compare password (login)
   ├─▶ Create/find user in MongoDB
   ├─▶ Generate JWT token
   └─▶ Return user + token
   │
   ▼
5. Frontend: useAuthStore.setUser(user, token)
   │
   └─▶ Token stored in localStorage
   └─▶ Token added to all future API requests (via axios interceptor)
```

---

## Key Components Explained

### Backend Components

#### AI Module (`backend/src/ai/`)

**Why separate folder?**
- Clear separation of AI logic
- Easy to swap LLM providers (just add new adapter)
- Easier testing and mocking

**Files:**

1. **`llmService.js`** - Main orchestrator
   - Decides: use LLM or fallback?
   - Handles errors and retries
   - Calls adapter and validates response

2. **`promptBuilder.js`** - Prompt construction
   - Builds prompts with user preferences
   - Formats POI context
   - Ensures consistent prompt structure

3. **`adapters/huggingFaceAdapter.js`** - Provider-specific
   - Direct Hugging Face API calls
   - Handles rate limits
   - Retries on failures

4. **`fallbackService.js`** - Rule-based backup
   - Budget → destination mapping
   - Travel style → destination types
   - Always returns valid recommendations

#### Models (`backend/src/models/`)

**User.js**
```javascript
{
  email: String (unique),
  passwordHash: String,
  name: String,
  prefs: {
    budgetBracket: 'low' | 'medium' | 'high',
    travelStyles: [String],
    homeCountry: String
  }
}
```

**Destination.js** (cached POI data)
```javascript
{
  name: String,
  country: String,
  coords: { lat, lon },
  summary: String,
  topPlaces: [{ name, description, category, xid }],
  cachedAt: Date (7-day TTL)
}
```

**Recommendation.js** (cached recommendations)
```javascript
{
  userId: ObjectId (optional),
  input: { location, budgetRange, lengthDays, travelStyle, interests },
  inputHash: String (for cache lookup),
  results: [{
    name, score, reason,
    topPlaces: [{ name, description }],
    sampleItineraryText
  }],
  cached: Boolean
}
```

**Bookmark.js**
```javascript
{
  userId: ObjectId,
  destinationId: String,
  destinationName: String,
  note: String
}
```

**Feedback.js**
```javascript
{
  userId: ObjectId,
  recommendationId: String,
  rating: -1 | 1,
  comment: String
}
```

### Frontend Components

#### `SearchForm.jsx`
- Main search interface
- Collects: location, budget, days, style, interests
- Multi-select interests (toggle buttons)
- Submits to `recommendationService`

#### `DestinationCard.jsx`
- Displays single recommendation
- Shows: name, score, reason, top 3 places
- Clickable → navigates to detail page

#### `DestinationPage.jsx`
- Full destination details
- Shows: all top 5 places, sample itinerary
- Includes bookmark and feedback buttons

---

## API Endpoints

### Authentication

**POST `/api/auth/register`**
```javascript
Request: { email, password, name }
Response: { user: {...}, token: "..." }
```

**POST `/api/auth/login`**
```javascript
Request: { email, password }
Response: { user: {...}, token: "..." }
```

### Recommendations

**POST `/api/search/recommend`** (Public, optional auth)
```javascript
Request: {
  location?: String,
  budgetRange: 'low' | 'medium' | 'high',
  lengthDays: Number,
  travelStyle: String,
  interests: [String]
}
Response: {
  candidates: [{ name, score, reason, topPlaces, sampleItineraryText }],
  cached: Boolean,
  timestamp: Date
}
```

### Destinations

**GET `/api/destination/:id`** (Public)
```javascript
Response: {
  name, country, coords, summary,
  topPlaces: [...],
  sampleItineraryText
}
```

**GET `/api/destination/search?q=location`** (Public)
```javascript
Response: [Destination objects]
```

### Bookmarks (Protected - requires auth)

**GET `/api/bookmarks`**
```javascript
Response: [Bookmark objects]
```

**POST `/api/bookmarks`**
```javascript
Request: { destinationId, note?, destinationName? }
Response: Bookmark object
```

**DELETE `/api/bookmarks/:destinationId`**
```javascript
Response: { message: "Bookmark removed successfully" }
```

### Feedback (Protected - requires auth)

**POST `/api/feedback`**
```javascript
Request: { recommendationId, rating: -1 | 1, comment? }
Response: { message, feedback }
```

---

## Database Schema

### Collections

1. **users** - User accounts
2. **destinations** - Cached POI data (7-day TTL)
3. **recommendations** - Cached recommendations (24-hour TTL)
4. **bookmarks** - User saved destinations
5. **feedback** - User ratings on recommendations

### Indexes

- `users.email` - Unique index
- `destinations.name` - Index for search
- `recommendations.inputHash` - Index for cache lookup
- `recommendations.userId` - Index for user history
- `bookmarks.userId + destinationId` - Unique compound index
- `feedback.userId + recommendationId` - Unique compound index

---

## AI Module Deep Dive

### How LLM Recommendations Work

1. **Prompt Construction** (`promptBuilder.js`)
   ```
   SYSTEM: You are a travel assistant. Output only valid JSON.
   USER: User preferences: {location, budget, days, style, interests}
   Output format: {candidates: [{name, score, reason, topPlaces, sampleItineraryText}]}
   ```

2. **LLM Call** (`huggingFaceAdapter.js`)
   - Sends prompt to Hugging Face Inference API
   - Model: `google/flan-t5-base` (configurable)
   - Max tokens: 500
   - Temperature: 0.7

3. **Response Parsing** (`jsonParser.js`)
   - Extracts JSON from response (handles extra text)
   - Validates structure
   - Returns parsed object

4. **Fallback** (`fallbackService.js`)
   - If LLM fails → use rule-based mapping
   - Budget + travel style → destination list
   - Always returns valid recommendations

### Caching Strategy

**POI Data (Destination collection):**
- Cache key: destination name
- TTL: 7 days
- Purpose: Reduce external API calls

**Recommendations (Recommendation collection):**
- Cache key: hash of input parameters
- TTL: 24 hours
- Purpose: Avoid expensive LLM calls for same queries

---

## How to Navigate the Codebase

### If you want to...

#### **Understand how recommendations are generated:**
1. Start: `frontend/src/pages/LandingPage.jsx` (user input)
2. Follow: `frontend/src/services/recommendationService.js`
3. Backend: `backend/src/routes/recommend.js`
4. Controller: `backend/src/controllers/recommendController.js`
5. AI: `backend/src/ai/llmService.js`
6. Adapter: `backend/src/ai/adapters/huggingFaceAdapter.js`

#### **Modify the AI prompt:**
- File: `backend/src/ai/promptBuilder.js`
- Method: `buildRecommendationPrompt()`

#### **Change LLM provider:**
- Add new adapter: `backend/src/ai/adapters/[newProvider]Adapter.js`
- Update: `backend/src/ai/llmService.js` (provider selection logic)

#### **Add a new API endpoint:**
1. Create route: `backend/src/routes/[name].js`
2. Create controller: `backend/src/controllers/[name]Controller.js`
3. Register route: `backend/src/routes/index.js`
4. Add frontend service: `frontend/src/services/[name]Service.js`

#### **Modify database schema:**
- File: `backend/src/models/[ModelName].js`
- Update controller if needed

#### **Change UI styling:**
- Global styles: `frontend/src/index.css`
- Component styles: Inline Tailwind classes in component files
- Config: `frontend/tailwind.config.js`

#### **Add authentication to a route:**
- Import: `import auth from '../middleware/auth.js'`
- Use: `router.use(auth)` or `router.get('/path', auth, handler)`

#### **Debug API calls:**
- Frontend: Check `frontend/src/services/api.js` (interceptors)
- Backend: Check `backend/src/middleware/errorHandler.js`
- Logs: Console output in both frontend and backend

---

## Environment Variables

### Backend (`.env`)

```env
PORT=5000
MONGO_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
HF_API_KEY=your-huggingface-key
OPENTRIPMAP_API_KEY=your-opentripmap-key
GEONAMES_USERNAME=your-geonames-username
NODE_ENV=development
```

### Frontend (`.env`)

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## Testing

### Running Tests

```bash
cd backend
npm test
```

### Test Files

- `backend/tests/ai/fallbackService.test.js` - Fallback service tests
- `backend/tests/utils/jsonParser.test.js` - JSON parsing tests

### Adding Tests

1. Create test file: `backend/tests/[category]/[name].test.js`
2. Import module to test
3. Write test cases using Jest
4. Run: `npm test`

---

## Common Patterns

### Error Handling
- Backend: `middleware/errorHandler.js` catches all errors
- Frontend: Axios interceptor in `services/api.js` handles HTTP errors
- Components: Try-catch blocks with user-friendly error messages

### Authentication
- JWT token stored in Zustand store (persisted to localStorage)
- Axios interceptor adds token to all requests
- Backend middleware verifies token on protected routes

### Caching
- POI data: 7-day cache in Destination collection
- Recommendations: 24-hour cache in Recommendation collection
- Cache keys: Hashed input parameters

### API Calls
- All external APIs wrapped in service classes
- Error handling and retries built-in
- Fallback mechanisms for reliability

---

## Troubleshooting Guide

### "Cannot connect to backend"
- Check backend is running on port 5000
- Verify `VITE_API_BASE_URL` in frontend `.env`
- Check CORS settings in `backend/src/server.js`

### "MongoDB connection failed"
- Verify `MONGO_URI` in backend `.env`
- Check MongoDB Atlas IP whitelist
- Verify database user credentials

### "No recommendations returned"
- Check Hugging Face API key
- Check OpenTripMap API key
- System should fallback to rule-based recommendations
- Check backend console logs

### "Authentication not working"
- Verify JWT_SECRET is set
- Check token in localStorage (browser dev tools)
- Verify token is sent in request headers

---

## Next Steps for Development

1. **Add more LLM providers**: Create new adapters in `backend/src/ai/adapters/`
2. **Improve prompts**: Modify `backend/src/ai/promptBuilder.js`
3. **Add more POI sources**: Extend `backend/src/services/poiService.js`
4. **Enhance UI**: Modify components in `frontend/src/components/`
5. **Add features**: Follow the patterns in existing code

---

## Summary

This project follows a clean, modular architecture:

- **Frontend**: React components → Services → API
- **Backend**: Routes → Controllers → Services/Models/AI
- **AI Module**: Separate folder for easy maintenance
- **Caching**: Smart caching at multiple levels
- **Error Handling**: Comprehensive error handling throughout
- **Authentication**: JWT-based with middleware protection

The codebase is organized, well-structured, and follows best practices. Each module has a clear responsibility, making it easy to understand, modify, and extend.

---

**Happy Coding! 🚀**

