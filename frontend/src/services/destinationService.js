import api from './api'

export const destinationService = {
  async getDestination(id) {
    return await api.get(`/destination/${id}`)
  },

  async searchDestinations(query) {
    return await api.get(`/destination/search?q=${encodeURIComponent(query)}`)
  },
}

