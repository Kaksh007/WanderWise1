import api from './api'

export const feedbackService = {
  async submitFeedback(feedbackData) {
    return await api.post('/feedback', feedbackData)
  },
}

