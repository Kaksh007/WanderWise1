/**
 * Parse and validate LLM JSON responses
 */
export const parseLLMResponse = (text) => {
  try {
    // Try to extract JSON from text (in case LLM adds extra text)
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0])
      return parsed
    }
    throw new Error('No JSON found in response')
  } catch (error) {
    console.error('JSON parsing error:', error.message)
    throw new Error('Invalid JSON response from LLM')
  }
}

/**
 * Validate recommendation structure
 */
export const validateRecommendationStructure = (data) => {
  if (!data || !Array.isArray(data.candidates)) {
    return false
  }

  for (const candidate of data.candidates) {
    if (!candidate.name || !candidate.reason) {
      return false
    }
  }

  return true
}

