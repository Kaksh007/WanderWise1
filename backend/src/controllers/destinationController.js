import Destination from '../models/Destination.js'
import poiService from '../services/poiService.js'
import mongoose from 'mongoose'

export const getDestination = async (req, res, next) => {
  try {
    const { id } = req.params
    const decodedName = decodeURIComponent(id)

    // Try to find by ObjectId first (only if id is a valid ObjectId)
    let destination = null
    if (mongoose.Types.ObjectId.isValid(id)) {
      destination = await Destination.findById(id)
    }

    // If not found by ObjectId, try to find by name (case-insensitive)
    if (!destination) {
      destination = await Destination.findOne({
        name: new RegExp(`^${decodedName}$`, 'i'),
      })
    }

    // If found in database, check if cache is valid
    if (destination) {
      // Check if cache is still valid (7 days)
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      const isCacheValid = destination.cachedAt && new Date(destination.cachedAt) > sevenDaysAgo

      // If cache is valid and has all required fields, return it
      if (
        isCacheValid &&
        destination.topPlaces &&
        destination.topPlaces.length > 0 &&
        destination.restaurants &&
        destination.restaurants.length > 0 &&
        destination.stays &&
        destination.stays.length > 0
      ) {
        return res.json(destination)
      }

      // If cache expired or incomplete, fetch fresh data
      try {
        const freshData = await poiService.getDestinationDetails(decodedName)
        return res.json(freshData)
      } catch (error) {
        // If API fetch fails, return existing data (even if incomplete)
        console.warn('Failed to fetch fresh data, returning cached:', error.message)
        return res.json(destination)
      }
    }

    // If not found in database, fetch from Groq API
    try {
      const destinationData = await poiService.getDestinationDetails(decodedName)
      res.json(destinationData)
    } catch (error) {
      console.error('Error fetching destination details:', error.message)
      return res.status(404).json({
        message: `Destination "${decodedName}" not found and could not be fetched`,
      })
    }
  } catch (error) {
    next(error)
  }
}

export const searchDestinations = async (req, res, next) => {
  try {
    const { q } = req.query

    if (!q) {
      return res.status(400).json({ message: 'Search query is required' })
    }

    const destinations = await Destination.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { country: { $regex: q, $options: 'i' } },
      ],
    }).limit(10)

    res.json(destinations)
  } catch (error) {
    next(error)
  }
}

