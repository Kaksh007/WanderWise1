import llmService from '../ai/llmService.js'

/**
 * GET /api/ai/health
 * Reports LLM provider availability and fallback status
 */
export const getAIHealth = async (req, res, next) => {
  try {
    const hasApiKey = Boolean(process.env.GROQ_API_KEY)

    // If no API key, we already know LLM provider can't be used
    let providerAvailable = false
    if (hasApiKey) {
      providerAvailable = await llmService.checkAvailability()
    }

    res.json({
      status: 'ok',
      llm: {
        provider: 'groq',
        apiKeyConfigured: hasApiKey,
        providerAvailable,
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    next(error)
  }
}

