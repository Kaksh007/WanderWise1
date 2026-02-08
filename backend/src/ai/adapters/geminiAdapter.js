import axios from 'axios'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta'

// Using Gemini 1.5 Flash as default (fast and efficient)
// You can change this to other models like 'gemini-pro' or 'gemini-1.5-pro'
const DEFAULT_MODEL = 'gemini-1.5-flash'

class GeminiAdapter {
  constructor(model = DEFAULT_MODEL) {
    this.model = model
    this.apiUrl = `${GEMINI_API_URL}/models/${model}:generateContent`
  }

  /**
   * Generate text using Google Gemini API
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
          const response = await axios.post(
            `${this.apiUrl}?key=${GEMINI_API_KEY}`,
            {
              contents: [
                {
                  parts: [
                    {
                      text: prompt,
                    },
                  ],
                },
              ],
              generationConfig: {
                maxOutputTokens: maxTokens,
                temperature: temperature,
              },
            },
            {
              headers: {
                'Content-Type': 'application/json',
              },
              timeout: 30000, // 30 seconds timeout
            }
          )

          // Extract text from Gemini response
          if (response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
            return response.data.candidates[0].content.parts[0].text
          }

          // Handle error responses from Gemini
          if (response.data?.promptFeedback?.blockReason) {
            throw new Error(`Content blocked: ${response.data.promptFeedback.blockReason}`)
          }

          // If no text found, return empty string
          return ''
        } catch (error) {
          lastError = error

          // Log detailed error for debugging
          if (error.response) {
            console.error(`Gemini API error [${error.response.status}]:`, error.response.data || error.message)
          } else {
            console.error('Gemini API network error:', error.message)
          }

          // If rate limited, wait before retry
          if (error.response?.status === 429) {
            const waitTime = Math.pow(2, attempt) * 1000 // Exponential backoff
            await new Promise((resolve) => setTimeout(resolve, waitTime))
            continue
          }

          // If quota exceeded, wait longer
          if (error.response?.status === 403 || error.response?.data?.error?.message?.includes('quota')) {
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
      console.error('Gemini API error:', error.message)
      throw new Error(`LLM generation failed: ${error.message}`)
    }
  }

  /**
   * Check if the model is available
   */
  async checkAvailability() {
    try {
      if (!GEMINI_API_KEY) {
        return false
      }

      // Do a very small inference call as a real health check
      const response = await axios.post(
        `${this.apiUrl}?key=${GEMINI_API_KEY}`,
        {
          contents: [
            {
              parts: [
                {
                  text: 'health check',
                },
              ],
            },
          ],
          generationConfig: {
            maxOutputTokens: 5,
            temperature: 0.0,
          },
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 10000,
        }
      )

      // If we got here without throwing, the provider is reachable
      return response.status === 200
    } catch (error) {
      // Check if it's an authentication error (API key invalid)
      if (error.response?.status === 401 || error.response?.status === 403) {
        console.error('Gemini API key is invalid or missing')
        return false
      }

      return false
    }
  }
}

export default GeminiAdapter
