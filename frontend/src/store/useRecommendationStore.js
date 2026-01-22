import { create } from 'zustand'

const useRecommendationStore = create((set) => ({
  recommendations: [],
  setRecommendations: (recommendations) => set({ recommendations }),
  clearRecommendations: () => set({ recommendations: [] }),
}))

export { useRecommendationStore }

