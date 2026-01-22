import api from './api'

export const recommendationService = {
  async getRecommendations(searchData) {
    return await api.post('/search/recommend', searchData)
  },
}

