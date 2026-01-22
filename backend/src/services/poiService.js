import GroqAdapter from '../ai/adapters/groqAdapter.js'
import Destination from '../models/Destination.js'

class POIService {
  constructor() {
    this.groqAdapter = new GroqAdapter()
  }

  /**
   * Get POI data for a location using Groq API, with caching
   */
  async getPOIData(location, limit = 5) {
    try {
      // Check cache first
      const cached = await Destination.findOne({
        name: new RegExp(location, 'i'),
      })

      if (cached && this.isCacheValid(cached.cachedAt)) {
        return {
          name: cached.name,
          country: cached.country,
          coords: cached.coords,
          summary: cached.summary,
          topPlaces: cached.topPlaces,
        }
      }

      // If not cached or expired, generate data using Groq
      let destinationData = null

      if (location.toLowerCase() === 'anywhere' || !location) {
        // Generate popular destinations using Groq
        destinationData = await this.generatePopularDestinations(limit)
      } else {
        // Generate location and POI data using Groq
        destinationData = await this.generateLocationData(location, limit)
      }

      if (!destinationData) {
        throw new Error(`Could not generate POI data for location: ${location}`)
      }

      // Cache the result
      await this.cacheDestination(destinationData)

      return destinationData
    } catch (error) {
      console.error('POI Service error:', error.message)
      throw error
    }
  }

  /**
   * Generate location data using Groq API
   */
  async generateLocationData(location, limit = 5) {
    const prompt = `You are a travel information assistant. For the location "${location}", provide detailed information in JSON format only.

Return a JSON object with this exact structure (no extra text, only valid JSON):
{
  "name": "Full location name",
  "country": "Country name",
  "coords": {
    "lat": approximate latitude (number),
    "lon": approximate longitude (number)
  },
  "summary": "Brief 2-3 sentence description of the location",
  "topPlaces": [
    {
      "name": "Place name",
      "description": "Brief description of the attraction/place",
      "category": "attraction type"
    }
  ]
}

Requirements:
- Provide exactly ${limit} top places
- Use real, well-known attractions/places for this location
- Coordinates should be approximate but reasonable for the location
- All descriptions should be concise (1-2 sentences max)
- Output ONLY valid JSON, no markdown, no code blocks, no explanations`

    try {
      const response = await this.groqAdapter.generate(prompt, {
        maxTokens: 1000,
        temperature: 0.5,
        retries: 2,
      })

      // Parse JSON response
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        return parsed
      }

      return null
    } catch (error) {
      console.error('Error generating location data with Groq:', error.message)
      return null
    }
  }

  /**
   * Generate popular destinations using Groq API
   */
  async generatePopularDestinations(limit = 5) {
    const prompt = `You are a travel information assistant. Provide information about a popular travel destination in JSON format only.

Return a JSON object with this exact structure (no extra text, only valid JSON):
{
  "name": "Popular destination name (e.g., Paris, Tokyo, New York)",
  "country": "Country name",
  "coords": {
    "lat": approximate latitude (number),
    "lon": approximate longitude (number)
  },
  "summary": "Brief 2-3 sentence description of why this is a popular destination",
  "topPlaces": [
    {
      "name": "Place name",
      "description": "Brief description of the attraction/place",
      "category": "attraction type"
    }
  ]
}

Requirements:
- Choose a well-known, popular travel destination
- Provide exactly 5 top places
- Use real, famous attractions/places for this destination
- Coordinates should be approximate but reasonable
- All descriptions should be concise (1-2 sentences max)
- Output ONLY valid JSON, no markdown, no code blocks, no explanations`

    try {
      const response = await this.groqAdapter.generate(prompt, {
        maxTokens: 1000,
        temperature: 0.7,
        retries: 2,
      })

      // Parse JSON response
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        return parsed
      }

      return null
    } catch (error) {
      console.error('Error generating popular destinations with Groq:', error.message)
      return null
    }
  }

  /**
   * Check if cache is still valid (7 days)
   */
  isCacheValid(cachedAt) {
    if (!cachedAt) return false
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    return new Date(cachedAt) > sevenDaysAgo
  }

  /**
   * Cache destination data
   */
  async cacheDestination(destinationData) {
    try {
      await Destination.findOneAndUpdate(
        { name: destinationData.name },
        {
          ...destinationData,
          cachedAt: new Date(),
        },
        { upsert: true, new: true }
      )
    } catch (error) {
      console.error('Error caching destination:', error.message)
    }
  }

  /**
   * Get multiple destinations for "anywhere" searches using Groq
   */
  async getMultipleDestinations(limit = 5) {
    try {
      const destinations = []
      for (let i = 0; i < limit; i++) {
        const destination = await this.generatePopularDestinations(5)
        if (destination) {
          destinations.push(destination)
        }
        // Small delay to avoid rate limiting
        if (i < limit - 1) {
          await new Promise((resolve) => setTimeout(resolve, 500))
        }
      }
      return destinations
    } catch (error) {
      console.error('Error getting multiple destinations:', error.message)
      return []
    }
  }
}

export default new POIService()

