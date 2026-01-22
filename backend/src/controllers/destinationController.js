import Destination from '../models/Destination.js'

export const getDestination = async (req, res, next) => {
  try {
    const { id } = req.params

    // Try to find by ObjectId first, then by name
    let destination = await Destination.findById(id)

    if (!destination) {
      destination = await Destination.findOne({
        name: decodeURIComponent(id),
      })
    }

    if (!destination) {
      return res.status(404).json({ message: 'Destination not found' })
    }

    res.json(destination)
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

