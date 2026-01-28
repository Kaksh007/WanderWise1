import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
import connectDB from './config/database.js'
import errorHandler from './middleware/errorHandler.js'
import rateLimiter from './middleware/rateLimiter.js'
import routes from './routes/index.js'
import { logger } from './utils/logger.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Behind a proxy on platforms like Vercel/Render; trust X-Forwarded-* so rate limiting works
app.set('trust proxy', 1)

// Connect to MongoDB
connectDB()

// Middleware
app.use(helmet())
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser clients (curl/postman) + same-origin requests
      if (!origin) return callback(null, true)

      const isLocalhost = /^http:\/\/localhost:\d+$/.test(origin)
      const isVercel = /^https:\/\/.*\.vercel\.app$/.test(origin)

      if (isLocalhost || isVercel) return callback(null, true)
      return callback(new Error(`CORS blocked for origin: ${origin}`))
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
)
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Request logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`)
  next()
})

// Rate limiting
app.use('/api/', rateLimiter)

// Routes
app.use('/api', routes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Error handling middleware (must be last)
app.use(errorHandler)

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`)
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`)
})

