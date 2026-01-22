import api from './api'

export const topDestinationsService = {
  /**
   * Get top destinations for a specific region and month
   * @param {string} region - 'india' or 'world'
   * @param {string} month - Month name (e.g., 'january', 'february') or null for current month
   * @returns {Promise} Promise resolving to destinations array
   */
  async getTopDestinations(region, month = null) {
    const params = new URLSearchParams({ region })
    if (month) {
      params.append('month', month)
    }
    const response = await api.get(`/destination/top?${params.toString()}`)
    return response.destinations || []
  },
}
