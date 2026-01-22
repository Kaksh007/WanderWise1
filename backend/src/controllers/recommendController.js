import Recommendation from '../models/Recommendation.js'
import poiService from '../services/poiService.js'
import llmService from '../ai/llmService.js'

/**
 * Generate travel recommendations
 */
export const getRecommendations = async (req, res, next) => {
  try {
    const { location, budgetRange, lengthDays, travelStyle, interests } = req.body
    const userId = req.userId || null // Optional auth

    // Validate input
    if (!budgetRange || !lengthDays || !travelStyle) {
      return res.status(400).json({
        message: 'budgetRange, lengthDays, and travelStyle are required',
      })
    }

    // Prepare input object
    const userInput = {
      location: location || 'anywhere',
      budgetRange,
      lengthDays: parseInt(lengthDays),
      travelStyle,
      interests: Array.isArray(interests) ? interests : [],
    }

    // Generate cache key (hash of input)
    const inputHash = Recommendation.generateInputHash(userInput)

    // Check cache
    const cachedRecommendation = await Recommendation.findOne({
      inputHash,
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }, // 24 hours
    }).sort({ createdAt: -1 })

    if (cachedRecommendation) {
      return res.json({
        candidates: cachedRecommendation.results,
        cached: true,
        timestamp: cachedRecommendation.createdAt,
      })
    }

    // Cache miss - generate new recommendations
    let poiData = null

    // Fetch POI data if location is specified
    if (userInput.location && userInput.location.toLowerCase() !== 'anywhere') {
      try {
        poiData = await poiService.getPOIData(userInput.location, 5)
      } catch (error) {
        console.warn('POI fetch failed, continuing without POI data:', error.message)
      }
    }

    // If "anywhere", get multiple popular destinations
    if (userInput.location.toLowerCase() === 'anywhere' || !userInput.location) {
      try {
        const multipleDestinations = await poiService.getMultipleDestinations(5)
        if (multipleDestinations.length > 0) {
          // Use first destination's POI data as context
          poiData = multipleDestinations[0]
        }
      } catch (error) {
        console.warn('Failed to get popular destinations:', error.message)
      }
    }

    // Generate recommendations using LLM
    const recommendations = await llmService.generateRecommendations(
      userInput,
      poiData
    )

    // Enhance recommendations with POI data if available
    if (poiData && recommendations.candidates) {
      recommendations.candidates = recommendations.candidates.map((candidate, index) => {
        // If we have POI data for a matching destination, use it
        if (poiData.name && candidate.name.toLowerCase().includes(poiData.name.toLowerCase())) {
          return {
            ...candidate,
            topPlaces: poiData.topPlaces || candidate.topPlaces,
          }
        }
        return candidate
      })
    }

    // Cache the result
    const savedRecommendation = await Recommendation.create({
      userId,
      input: userInput,
      inputHash,
      results: recommendations.candidates,
      cached: false,
    })

    res.json({
      candidates: recommendations.candidates,
      cached: false,
      timestamp: savedRecommendation.createdAt,
    })
  } catch (error) {
    console.error('Recommendation generation error:', error)
    next(error)
  }
}

