import api from './api'

export const authService = {
  async register(userData) {
    return await api.post('/auth/register', userData)
  },

  async login(credentials) {
    return await api.post('/auth/login', credentials)
  },

  async loginWithGoogle(payload) {
    return await api.post('/auth/google', payload)
  },
}

