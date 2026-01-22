import { topDestinations, getMonthName, getCurrentMonth } from '../config/topDestinations.js'

/**
 * Get top destinations for a specific region and month
 * GET /api/destinations/top?region=india&month=january
 */
export const getTopDestinations = async (req, res, next) => {
  try {
    const { region, month } = req.query

    // Validate region
    if (!region || !['india', 'world'].includes(region.toLowerCase())) {
      return res.status(400).json({
        message: 'Invalid region. Must be "india" or "world"',
      })
    }

    // Get month (default to current month if not provided)
    let monthKey = month
    if (!monthKey) {
      monthKey = getCurrentMonth()
    } else {
      // Normalize month name to lowercase
      monthKey = monthKey.toLowerCase()
    }

    // Validate month
    const validMonths = [
      'january',
      'february',
      'march',
      'april',
      'may',
      'june',
      'july',
      'august',
      'september',
      'october',
      'november',
      'december',
    ]

    if (!validMonths.includes(monthKey)) {
      return res.status(400).json({
        message: `Invalid month. Must be one of: ${validMonths.join(', ')}`,
      })
    }

    // Get destinations for the specified region and month
    const regionKey = region.toLowerCase()
    const destinations = topDestinations[regionKey]?.[monthKey] || []

    if (destinations.length === 0) {
      return res.status(404).json({
        message: `No destinations found for region "${region}" and month "${monthKey}"`,
      })
    }

    res.json({
      destinations,
      region: regionKey,
      month: monthKey,
      count: destinations.length,
    })
  } catch (error) {
    console.error('Error fetching top destinations:', error)
    next(error)
  }
}
