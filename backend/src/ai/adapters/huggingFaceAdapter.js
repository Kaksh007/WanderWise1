import axios from 'axios'

const HF_API_KEY = process.env.HF_API_KEY
// Router API format: https://router.huggingface.co/{model}
const HF_API_URL = 'https://router.huggingface.co'

// Using a smaller, faster model for text generation
// You can change this to other models like 'mistralai/Mistral-7B-Instruct-v0.2'
const DEFAULT_MODEL = 'gpt2'    

class HuggingFaceAdapter {
  constructor(model = DEFAULT_MODEL) {
    this.model = model
    // Router API: https://router.huggingface.co/{model}
    this.apiUrl = `${HF_API_URL}/gpt2`
  }

  /**
   * Generate text using Hugging Face Inference API
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
            this.apiUrl,
            {
              inputs: prompt,
              parameters: {
                max_new_tokens: maxTokens,
                temperature: temperature,
                return_full_text: false,
              },
            },
            {
              headers: {
                Authorization: `Bearer ${HF_API_KEY}`,
                'Content-Type': 'application/json',
              },
              timeout: 30000, // 30 seconds timeout
            }
          )

          // Handle different response formats
          if (Array.isArray(response.data)) {
            return response.data[0]?.generated_text || response.data[0]?.text || ''
          }

          if (response.data.generated_text) {
            return response.data.generated_text
          }

          if (response.data[0]?.generated_text) {
            return response.data[0].generated_text
          }

          // If model is loading, wait and retry
          if (response.data.error && response.data.error.includes('loading')) {
            await new Promise((resolve) => setTimeout(resolve, 5000))
            continue
          }

          return response.data.text || ''
        } catch (error) {
          lastError = error

          // Log detailed error for debugging
          if (error.response) {
            console.error(`HF API error [${error.response.status}]:`, error.response.data || error.message)
          } else {
            console.error('HF API network error:', error.message)
          }

          // If rate limited, wait before retry
          if (error.response?.status === 429) {
            const waitTime = Math.pow(2, attempt) * 1000 // Exponential backoff
            await new Promise((resolve) => setTimeout(resolve, waitTime))
            continue
          }

          // If model is loading, wait
          if (error.response?.data?.error?.includes('loading')) {
            await new Promise((resolve) => setTimeout(resolve, 5000))
            continue
          }

          // For other errors, throw immediately
          throw error
        }
      }

      throw lastError || new Error('Failed to generate response after retries')
    } catch (error) {
      console.error('Hugging Face API error:', error.message)
      throw new Error(`LLM generation failed: ${error.message}`)
    }
  }

  /**
   * Check if the model is available
   */
  async checkAvailability() {
    try {
      if (!HF_API_KEY) {
        return false
      }

      // Do a very small inference call as a real health check.
      // This is more reliable than the model metadata endpoint,
      // especially on free/freemium hosted models.
      const response = await axios.post(
        this.apiUrl,
        {
          inputs: 'health check',
          parameters: {
            max_new_tokens: 8,
            temperature: 0.0,
            return_full_text: false,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${HF_API_KEY}`,
            'Content-Type': 'application/json',
          },
          timeout: 10000,
        }
      )

      // If we got here without throwing, the provider is reachable.
      // We don't care about the exact shape of the response.
      return response.status === 200
    } catch (error) {
      // If the model is still loading but the endpoint exists, treat as available
      if (error.response?.data?.error?.includes('loading')) {
        return true
      }

      return false
    }
  }
}

export default HuggingFaceAdapter

