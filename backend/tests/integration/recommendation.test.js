/**
 * Integration tests for recommendation endpoint
 */
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Recommendation from '../../src/models/Recommendation.js'

dotenv.config()

const TEST_MONGO_URI = process.env.TEST_MONGO_URI || process.env.MONGO_URI

describe('Recommendation Integration Tests', () => {
  beforeAll(async () => {
    if (TEST_MONGO_URI) {
      await mongoose.connect(TEST_MONGO_URI)
    }
  })

  afterAll(async () => {
    await mongoose.connection.close()
  })

  beforeEach(async () => {
    // Clean up test recommendations
    await Recommendation.deleteMany({ 'input.location': 'test-location' })
  })

  test('should generate input hash correctly', () => {
    const input = {
      location: 'test-location',
      budgetRange: 'medium',
      lengthDays: 5,
      travelStyle: 'culture',
      interests: ['history'],
    }

    const hash1 = Recommendation.generateInputHash(input)
    const hash2 = Recommendation.generateInputHash(input)

    expect(hash1).toBe(hash2)
    expect(typeof hash1).toBe('string')
    expect(hash1.length).toBe(32) // MD5 hash length
  })

  test('should create recommendation with correct structure', async () => {
    const input = {
      location: 'test-location',
      budgetRange: 'medium',
      lengthDays: 5,
      travelStyle: 'culture',
      interests: ['history'],
    }

    const inputHash = Recommendation.generateInputHash(input)

    const recommendation = await Recommendation.create({
      input,
      inputHash,
      results: [
        {
          name: 'Test Destination',
          score: 8,
          reason: 'Test reason',
          topPlaces: [{ name: 'Place 1', description: 'Desc 1' }],
          sampleItineraryText: 'Test itinerary',
        },
      ],
    })

    expect(recommendation.inputHash).toBe(inputHash)
    expect(recommendation.results.length).toBe(1)
    expect(recommendation.results[0].name).toBe('Test Destination')
  })
})
