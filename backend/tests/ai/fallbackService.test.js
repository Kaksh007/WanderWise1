import fallbackService from '../../src/ai/fallbackService.js'

describe('FallbackService', () => {
  test('should generate recommendations for low budget', () => {
    const input = {
      budgetRange: 'low',
      travelStyle: 'culture',
      lengthDays: 5,
      interests: ['history', 'food'],
    }

    const result = fallbackService.generateRecommendations(input)

    expect(result).toHaveProperty('candidates')
    expect(result.candidates.length).toBeGreaterThan(0)
    expect(result.candidates[0]).toHaveProperty('name')
    expect(result.candidates[0]).toHaveProperty('score')
    expect(result.candidates[0]).toHaveProperty('reason')
    expect(result.candidates[0]).toHaveProperty('topPlaces')
    expect(result.candidates[0]).toHaveProperty('sampleItineraryText')
  })

  test('should generate recommendations for high budget', () => {
    const input = {
      budgetRange: 'high',
      travelStyle: 'relaxation',
      lengthDays: 7,
      interests: ['beach'],
    }

    const result = fallbackService.generateRecommendations(input)

    expect(result.candidates.length).toBeGreaterThan(0)
    expect(result.candidates[0].name).toBeDefined()
  })
})

