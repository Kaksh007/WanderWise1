import { create } from 'zustand'

// Simple localStorage persistence
const loadFromStorage = () => {
  try {
    const stored = localStorage.getItem('auth-storage')
    return stored ? JSON.parse(stored) : { user: null, token: null }
  } catch {
    return { user: null, token: null }
  }
}

const saveToStorage = (state) => {
  try {
    localStorage.setItem('auth-storage', JSON.stringify({ user: state.user, token: state.token }))
  } catch {
    // Ignore storage errors
  }
}

const useAuthStore = create((set) => {
  const initialState = loadFromStorage()
  
  return {
    ...initialState,
    setUser: (user, token) => {
      set({ user, token })
      saveToStorage({ user, token })
    },
    logout: () => {
      set({ user: null, token: null })
      localStorage.removeItem('auth-storage')
    },
  }
})

export { useAuthStore }

