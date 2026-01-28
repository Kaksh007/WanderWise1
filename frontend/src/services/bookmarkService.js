import api from './api'

export const bookmarkService = {
  async getBookmarks() {
    return await api.get('/bookmarks')
  },

  async addBookmark(destinationId, destinationName = '', note = '') {
    return await api.post('/bookmarks', { destinationId, destinationName, note })
  },

  async removeBookmark(destinationId) {
    return await api.delete(`/bookmarks/${destinationId}`)
  },
}

