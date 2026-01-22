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
      // Check cache first - use exact match to avoid partial matches
      const escapedLocation = location.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      const cached = await Destination.findOne({
        name: new RegExp(`^${escapedLocation}$`, 'i'),
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

  /**
   * Get comprehensive destination details (places, restaurants, stays) using Groq API
   * Checks MongoDB cache first, then fetches from API if needed
   */
  async getDestinationDetails(location) {
    try {
      // Check cache first - use exact match to avoid partial matches
      // Escape special regex characters in location name
      const escapedLocation = location.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      const cached = await Destination.findOne({
        name: new RegExp(`^${escapedLocation}$`, 'i'),
      })

      if (cached && this.isCacheValid(cached.cachedAt)) {
        // Check if cached data has all required fields
        const hasAllFields = 
          cached.restaurants && 
          Array.isArray(cached.restaurants) && 
          cached.restaurants.length > 0 &&
          cached.stays && 
          Array.isArray(cached.stays) && 
          cached.stays.length > 0
        
        // If cache is valid and complete, return it
        if (hasAllFields) {
          return {
            name: cached.name,
            country: cached.country,
            coords: cached.coords,
            summary: cached.summary,
            bestTimeToVisit: cached.bestTimeToVisit,
            topPlaces: cached.topPlaces || [],
            restaurants: cached.restaurants || [],
            stays: cached.stays || [],
          }
        }
        
        // If cache is valid but incomplete (old format), log and continue to fetch fresh data
        console.log(`Cache for ${location} is valid but incomplete (missing restaurants/stays), fetching fresh data`)
      }

      // If not cached or expired, generate comprehensive data using Groq
      const destinationData = await this.generateDestinationDetails(location)

      if (!destinationData) {
        throw new Error(`Could not generate destination details for: ${location}`)
      }

      // Validate that we have all required data
      const hasRestaurants = destinationData.restaurants && Array.isArray(destinationData.restaurants) && destinationData.restaurants.length > 0
      const hasStays = destinationData.stays && Array.isArray(destinationData.stays) && destinationData.stays.length > 0
      const hasPlaces = destinationData.topPlaces && Array.isArray(destinationData.topPlaces) && destinationData.topPlaces.length > 0

      if (!hasRestaurants || !hasStays || !hasPlaces) {
        console.warn(`Incomplete data for ${location}: places=${hasPlaces}, restaurants=${hasRestaurants}, stays=${hasStays}`)
        // Still return the data, but log a warning
      }

      // Cache the result (even if incomplete, so we don't keep calling the API)
      await this.cacheDestination(destinationData)

      return destinationData
    } catch (error) {
      console.error('Error getting destination details:', error.message)
      throw error
    }
  }

  /**
   * Generate comprehensive destination details using Groq API
   * Includes: top places, restaurants, stays, best time to visit
   */
  async generateDestinationDetails(location) {
    const prompt = `You are a travel information assistant. For the destination "${location}", provide comprehensive travel information in JSON format only.

CRITICAL: You MUST include all three sections: topPlaces, restaurants, and stays. Each section must have exactly 5 items.

Return a JSON object with this exact structure (no extra text, only valid JSON):
{
  "name": "Full destination name",
  "country": "Country name",
  "coords": {
    "lat": approximate latitude (number),
    "lon": approximate longitude (number)
  },
  "summary": "Brief 2-3 sentence description of the destination",
  "bestTimeToVisit": "Best months or season to visit (e.g., 'November to February' or 'March to May')",
  "topPlaces": [
    {
      "name": "Place/attraction name",
      "description": "Brief description (1-2 sentences)",
      "category": "attraction type (e.g., 'beach', 'temple', 'fort', 'museum')"
    }
  ],
  "restaurants": [
    {
      "name": "Restaurant name",
      "description": "Brief description (1-2 sentences)",
      "location": "Area or address",
      "rating": rating number (1-5),
      "priceRange": "low" or "medium" or "high",
      "cuisine": "Cuisine type (e.g., 'Indian', 'Seafood', 'Continental')"
    }
  ],
  "stays": [
    {
      "name": "Property name",
      "description": "Brief description (1-2 sentences)",
      "location": "Area or address",
      "rating": rating number (1-5),
      "priceRange": "low" or "medium" or "high",
      "type": "Property type (e.g., 'hotel', 'resort', 'homestay', 'villa')"
    }
  ]
}

MANDATORY Requirements:
- You MUST provide exactly 5 items in topPlaces array
- You MUST provide exactly 5 items in restaurants array  
- You MUST provide exactly 5 items in stays array
- ALL three arrays (topPlaces, restaurants, stays) are REQUIRED and must not be empty
- Use real, well-known places, restaurants, and properties for this destination
- Ratings should be realistic numbers between 3.5 and 5.0
- Coordinates should be approximate but reasonable for the location
- All descriptions should be concise (1-2 sentences max)
- Output ONLY valid JSON, no markdown, no code blocks, no explanations, no additional text`

    try {
      const response = await this.groqAdapter.generate(prompt, {
        maxTokens: 3000, // Increased to ensure we get all data
        temperature: 0.5,
        retries: 2,
      })

      // Parse JSON response
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        
        // Validate that all required fields are present
        if (!parsed.restaurants || !Array.isArray(parsed.restaurants) || parsed.restaurants.length === 0) {
          console.warn(`Warning: No restaurants found in Groq response for ${location}`)
          console.log('Groq response sample:', response.substring(0, 500))
        }
        if (!parsed.stays || !Array.isArray(parsed.stays) || parsed.stays.length === 0) {
          console.warn(`Warning: No stays found in Groq response for ${location}`)
          console.log('Groq response sample:', response.substring(0, 500))
        }
        
        // Ensure arrays exist even if empty
        if (!parsed.restaurants) parsed.restaurants = []
        if (!parsed.stays) parsed.stays = []
        if (!parsed.topPlaces) parsed.topPlaces = []
        
        console.log(`Parsed data for ${location}: places=${parsed.topPlaces?.length || 0}, restaurants=${parsed.restaurants?.length || 0}, stays=${parsed.stays?.length || 0}`)
        
        return parsed
      }

      console.error('No JSON match found in Groq response')
      console.log('Groq response:', response.substring(0, 1000))
      return null
    } catch (error) {
      console.error('Error generating destination details with Groq:', error.message)
      console.error('Error stack:', error.stack)
      return null
    }
  }
}

export default new POIService()

