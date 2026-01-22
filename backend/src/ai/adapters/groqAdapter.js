import Groq from 'groq-sdk'

const GROQ_API_KEY = process.env.GROQ_API_KEY || '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'

// Using a fast model from Groq
// You can change this to other models like 'llama3-70b-8192', 'mixtral-8x7b-32768', etc.
const DEFAULT_MODEL = 'llama-3.1-8b-instant'

class GroqAdapter {
  constructor(model = DEFAULT_MODEL) {
    this.model = model
    this.groq = new Groq({ apiKey: GROQ_API_KEY })
  }

  /**
   * Generate text using Groq API
   */
  async generate(prompt, options = {}) {
    try {
      const {
        maxTokens = 500,
        temperature = 0.7,
        retries = 2,
      } = options

      let lastError = null

      for (let attempt = 0; attempt <= retries; attempt++) {
        try {
          const chatCompletion = await this.groq.chat.completions.create({
            messages: [
              {
                role: 'user',
                content: prompt,
              },
            ],
            model: this.model,
            max_tokens: maxTokens,
            temperature: temperature,
          })

          // Extract text from Groq response
          if (chatCompletion?.choices?.[0]?.message?.content) {
            return chatCompletion.choices[0].message.content
          }

          // If no text found, return empty string
          return ''
        } catch (error) {
          lastError = error

          // Log detailed error for debugging
          if (error.response) {
            console.error(`Groq API error [${error.response.status}]:`, error.response.data || error.message)
          } else {
            console.error('Groq API error:', error.message)
          }

          // If rate limited, wait before retry
          if (error.status === 429 || error.response?.status === 429) {
            const waitTime = Math.pow(2, attempt) * 1000 // Exponential backoff
            await new Promise((resolve) => setTimeout(resolve, waitTime))
            continue
          }

          // If quota exceeded, wait longer
          if (error.status === 403 || error.response?.status === 403) {
            const waitTime = Math.pow(2, attempt) * 2000
            await new Promise((resolve) => setTimeout(resolve, waitTime))
            continue
          }

          // For other errors, throw immediately
          throw error
        }
      }

      throw lastError || new Error('Failed to generate response after retries')
    } catch (error) {
      console.error('Groq API error:', error.message)
      throw new Error(`LLM generation failed: ${error.message}`)
    }
  }

  /**
   * Check if the model is available
   */
  async checkAvailability() {
    try {
      if (!GROQ_API_KEY) {
        return false
      }

      // Do a very small inference call as a real health check
      const chatCompletion = await this.groq.chat.completions.create({
        messages: [
          {
            role: 'user',
            content: 'health check',
          },
        ],
        model: this.model,
        max_tokens: 5,
        temperature: 0.0,
      })

      // If we got here without throwing, the provider is reachable
      return chatCompletion?.choices?.[0]?.message?.content !== undefined
    } catch (error) {
      // Check if it's an authentication error (API key invalid)
      if (error.status === 401 || error.status === 403 || error.response?.status === 401 || error.response?.status === 403) {
        console.error('Groq API key is invalid or missing')
        return false
      }

      return false
    }
  }
}

export default GroqAdapter
