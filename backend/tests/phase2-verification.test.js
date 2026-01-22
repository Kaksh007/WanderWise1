/**
 * Phase 2 Verification Tests
 * 
 * This file tests all Phase 2 components:
 * - Database Models
 * - Authentication System
 * - POI Data Integration
 * - API Routes and Middleware
 */

import mongoose from 'mongoose'
import dotenv from 'dotenv'
import User from '../src/models/User.js'
import Destination from '../src/models/Destination.js'
import Recommendation from '../src/models/Recommendation.js'
import Bookmark from '../src/models/Bookmark.js'
import Feedback from '../src/models/Feedback.js'
import { hashPassword, comparePassword } from '../src/utils/hashPassword.js'
import RecommendationModel from '../src/models/Recommendation.js'

dotenv.config()

// Connect to test database
const TEST_MONGO_URI = process.env.TEST_MONGO_URI || process.env.MONGO_URI

describe('Phase 2: Backend Infrastructure & Data Integration', () => {
  beforeAll(async () => {
    if (TEST_MONGO_URI) {
      await mongoose.connect(TEST_MONGO_URI)
    }
  })

  afterAll(async () => {
    await mongoose.connection.close()
  })

  describe('2.1 Database Models & Schema', () => {
    test('User model should have correct schema', () => {
      const userSchema = User.schema
      expect(userSchema.paths.email).toBeDefined()
      expect(userSchema.paths.passwordHash).toBeDefined()
      expect(userSchema.paths.name).toBeDefined()
      expect(userSchema.paths.prefs).toBeDefined()
    })

    test('Destination model should have correct schema', () => {
      const destSchema = Destination.schema
      expect(destSchema.paths.name).toBeDefined()
      expect(destSchema.paths.country).toBeDefined()
      expect(destSchema.paths.coords).toBeDefined()
      expect(destSchema.paths.topPlaces).toBeDefined()
      expect(destSchema.paths.cachedAt).toBeDefined()
    })

    test('Recommendation model should have correct schema', () => {
      const recSchema = Recommendation.schema
      expect(recSchema.paths.userId).toBeDefined()
      expect(recSchema.paths.input).toBeDefined()
      expect(recSchema.paths.inputHash).toBeDefined()
      expect(recSchema.paths.results).toBeDefined()
    })

    test('Bookmark model should have correct schema', () => {
      const bookmarkSchema = Bookmark.schema
      expect(bookmarkSchema.paths.userId).toBeDefined()
      expect(bookmarkSchema.paths.destinationId).toBeDefined()
    })

    test('Feedback model should have correct schema', () => {
      const feedbackSchema = Feedback.schema
      expect(feedbackSchema.paths.userId).toBeDefined()
      expect(feedbackSchema.paths.recommendationId).toBeDefined()
      expect(feedbackSchema.paths.rating).toBeDefined()
    })

    test('Recommendation model should have generateInputHash static method', () => {
      expect(typeof RecommendationModel.generateInputHash).toBe('function')
      
      const input = {
        location: 'Paris',
        budgetRange: 'medium',
        lengthDays: 5,
        travelStyle: 'culture',
        interests: ['history', 'food']
      }
      
      const hash1 = RecommendationModel.generateInputHash(input)
      const hash2 = RecommendationModel.generateInputHash(input)
      
      expect(hash1).toBe(hash2) // Same input should produce same hash
      expect(typeof hash1).toBe('string')
      expect(hash1.length).toBeGreaterThan(0)
    })
  })

  describe('2.2 Authentication System - Password Hashing', () => {
    test('hashPassword should hash a password', async () => {
      const password = 'testPassword123'
      const hash = await hashPassword(password)
      
      expect(hash).toBeDefined()
      expect(typeof hash).toBe('string')
      expect(hash).not.toBe(password)
      expect(hash.length).toBeGreaterThan(20) // bcrypt hashes are long
    })

    test('comparePassword should verify correct password', async () => {
      const password = 'testPassword123'
      const hash = await hashPassword(password)
      
      const isValid = await comparePassword(password, hash)
      expect(isValid).toBe(true)
    })

    test('comparePassword should reject incorrect password', async () => {
      const password = 'testPassword123'
      const wrongPassword = 'wrongPassword'
      const hash = await hashPassword(password)
      
      const isValid = await comparePassword(wrongPassword, hash)
      expect(isValid).toBe(false)
    })
  })

  describe('2.3 POI Service Structure', () => {
    test('Groq adapter should be importable', async () => {
      const groqAdapter = await import('../src/ai/adapters/groqAdapter.js')
      expect(groqAdapter.default).toBeDefined()
    })

    test('POI service should be importable', async () => {
      const poiService = await import('../src/services/poiService.js')
      expect(poiService.default).toBeDefined()
    })
  })

  describe('2.4 API Routes Structure', () => {
    test('All route files should be importable', async () => {
      const authRoutes = await import('../src/routes/auth.js')
      const bookmarkRoutes = await import('../src/routes/bookmarks.js')
      const feedbackRoutes = await import('../src/routes/feedback.js')
      const destinationRoutes = await import('../src/routes/destination.js')
      const recommendRoutes = await import('../src/routes/recommend.js')
      
      expect(authRoutes.default).toBeDefined()
      expect(bookmarkRoutes.default).toBeDefined()
      expect(feedbackRoutes.default).toBeDefined()
      expect(destinationRoutes.default).toBeDefined()
      expect(recommendRoutes.default).toBeDefined()
    })

    test('Main router should combine all routes', async () => {
      const mainRouter = await import('../src/routes/index.js')
      expect(mainRouter.default).toBeDefined()
    })
  })

  describe('2.4 Middleware Structure', () => {
    test('Auth middleware should be importable', async () => {
      const auth = await import('../src/middleware/auth.js')
      expect(auth.default).toBeDefined()
      expect(typeof auth.default).toBe('function')
    })

    test('Error handler middleware should be importable', async () => {
      const errorHandler = await import('../src/middleware/errorHandler.js')
      expect(errorHandler.default).toBeDefined()
      expect(typeof errorHandler.default).toBe('function')
    })

    test('Rate limiter middleware should be importable', async () => {
      const rateLimiter = await import('../src/middleware/rateLimiter.js')
      expect(rateLimiter.default).toBeDefined()
    })
  })
})
