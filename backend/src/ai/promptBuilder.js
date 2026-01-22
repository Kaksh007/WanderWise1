/**
 * Build prompts for LLM recommendation generation
 */
class PromptBuilder {
  /**
   * Build the main recommendation prompt
   */
  buildRecommendationPrompt(userInput, poiData = null) {
    const { location, budgetRange, lengthDays, travelStyle, interests } = userInput

    let prompt = `You are an expert travel assistant. Generate travel destination recommendations in JSON format only.

User Preferences:
- Location: ${location || 'anywhere'}
- Budget: ${budgetRange}
- Travel Length: ${lengthDays} days
- Travel Style: ${travelStyle}
- Interests: ${interests.join(', ') || 'general travel'}

${poiData ? this.addPOIContext(poiData) : ''}

Output exactly 3-5 destination recommendations in this JSON format (no extra text, only valid JSON):
{
  "candidates": [
    {
      "name": "Destination Name",
      "score": 8,
      "reason": "Short 2-3 sentence reason why this destination fits the user's preferences",
      "topPlaces": [
        {"name": "Place 1", "description": "Brief description"},
        {"name": "Place 2", "description": "Brief description"},
        {"name": "Place 3", "description": "Brief description"},
        {"name": "Place 4", "description": "Brief description"},
        {"name": "Place 5", "description": "Brief description"}
      ],
      "sampleItineraryText": "A sample ${lengthDays}-day itinerary with activities and timings"
    }
  ]
}

Important:
- Keep all text concise (max 200 words per destination)
- Score should be 1-10 based on how well it matches preferences
- Top 5 places should be real, popular attractions for each destination
- Sample itinerary should be practical and realistic for ${lengthDays} days
- Consider budget range: ${budgetRange}
- Consider travel style: ${travelStyle}
- Consider interests: ${interests.join(', ') || 'general travel'}
- Output ONLY valid JSON, no markdown, no code blocks, no explanations`

    return prompt
  }

  /**
   * Add POI context to the prompt
   */
  addPOIContext(poiData) {
    if (!poiData || !poiData.topPlaces || poiData.topPlaces.length === 0) {
      return ''
    }

    let context = `\nAvailable Places of Interest for ${poiData.name || 'the location'}:`
    poiData.topPlaces.slice(0, 10).forEach((place, index) => {
      context += `\n${index + 1}. ${place.name} - ${place.description || 'Popular attraction'}`
    })

    return context
  }

  /**
   * Build a simpler prompt for fallback scenarios
   */
  buildSimplePrompt(userInput) {
    const { location, budgetRange, lengthDays, travelStyle, interests } = userInput

    return `Suggest 3-5 travel destinations for:
Location: ${location || 'anywhere'}
Budget: ${budgetRange}
Days: ${lengthDays}
Style: ${travelStyle}
Interests: ${interests.join(', ')}

Return JSON with candidates array, each having: name, score, reason, topPlaces (5 items), sampleItineraryText.`
  }
}

export default new PromptBuilder()

