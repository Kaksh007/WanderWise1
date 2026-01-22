/**
 * Validate recommendation input
 */
export const validateRecommendationInput = (input) => {
  const errors = []

  if (!input.budgetRange) {
    errors.push('budgetRange is required')
  } else if (!['low', 'medium', 'high'].includes(input.budgetRange)) {
    errors.push('budgetRange must be low, medium, or high')
  }

  if (!input.lengthDays) {
    errors.push('lengthDays is required')
  } else if (isNaN(input.lengthDays) || input.lengthDays < 1 || input.lengthDays > 30) {
    errors.push('lengthDays must be between 1 and 30')
  }

  if (!input.travelStyle) {
    errors.push('travelStyle is required')
  } else if (
    !['trekking', 'relaxation', 'culture', 'adventure', 'beach', 'city'].includes(
      input.travelStyle
    )
  ) {
    errors.push('Invalid travelStyle')
  }

  if (input.interests && !Array.isArray(input.interests)) {
    errors.push('interests must be an array')
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

