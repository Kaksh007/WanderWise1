import { parseLLMResponse, validateRecommendationStructure } from '../../src/utils/jsonParser.js'

describe('JSON Parser', () => {
  test('should parse valid JSON response', () => {
    const jsonText = '{"candidates": [{"name": "Test", "score": 8}]}'
    const result = parseLLMResponse(jsonText)
    expect(result).toHaveProperty('candidates')
  })

  test('should extract JSON from text with extra content', () => {
    const text = 'Here is the result: {"candidates": [{"name": "Test"}]}'
    const result = parseLLMResponse(text)
    expect(result).toHaveProperty('candidates')
  })

  test('should validate recommendation structure', () => {
    const valid = {
      candidates: [
        { name: 'Test', score: 8, reason: 'Good', topPlaces: [], sampleItineraryText: '' },
      ],
    }
    expect(validateRecommendationStructure(valid)).toBe(true)

    const invalid = { candidates: [{ name: 'Test' }] } // Missing reason
    expect(validateRecommendationStructure(invalid)).toBe(false)
  })
})

