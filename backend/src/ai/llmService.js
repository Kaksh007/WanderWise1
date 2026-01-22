import GroqAdapter from './adapters/groqAdapter.js'
import promptBuilder from './promptBuilder.js'
import fallbackService from './fallbackService.js'
import { parseLLMResponse, validateRecommendationStructure } from '../utils/jsonParser.js'

/**
 * Main LLM Service - Orchestrates AI recommendation generation
 */
class LLMService {
  constructor() {
    this.adapter = new GroqAdapter()
    this.useFallback = false
  }

  /**
   * Generate travel recommendations using LLM
   */
  async generateRecommendations(userInput, poiData = null) {
    try {
      // If fallback is forced or API key is missing, use fallback
      if (this.useFallback || !process.env.GROQ_API_KEY) {
        console.log('Using fallback service')
        return fallbackService.generateRecommendations(userInput)
      }

      // Build prompt
      const prompt = promptBuilder.buildRecommendationPrompt(userInput, poiData)

      // Call LLM with increased tokens for comprehensive responses
      const rawResponse = await this.adapter.generate(prompt, {
        maxTokens: 2000,
        temperature: 0.7,
        retries: 2,
      })

      // Parse response
      const parsed = parseLLMResponse(rawResponse)

      // Validate structure
      if (!validateRecommendationStructure(parsed)) {
        console.warn('Invalid LLM response structure, using fallback')
        return fallbackService.generateRecommendations(userInput)
      }

      return parsed
    } catch (error) {
      console.error('LLM generation error:', error.message)
      console.log('Falling back to rule-based recommendations')
      return fallbackService.generateRecommendations(userInput)
    }
  }

  /**
   * Force fallback mode (useful for testing or when API is down)
   */
  setFallbackMode(enabled) {
    this.useFallback = enabled
  }

  /**
   * Check if LLM service is available
   */
  async checkAvailability() {
    try {
      return await this.adapter.checkAvailability()
    } catch (error) {
      return false
    }
  }
}

export default new LLMService()

