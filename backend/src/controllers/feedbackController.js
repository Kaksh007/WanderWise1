import Feedback from '../models/Feedback.js'

export const submitFeedback = async (req, res, next) => {
  try {
    const { recommendationId, rating, comment } = req.body

    if (!recommendationId || !rating) {
      return res
        .status(400)
        .json({ message: 'Recommendation ID and rating are required' })
    }

    if (![-1, 1].includes(rating)) {
      return res.status(400).json({ message: 'Rating must be -1 or 1' })
    }

    const feedback = await Feedback.findOneAndUpdate(
      {
        userId: req.userId,
        recommendationId,
      },
      {
        userId: req.userId,
        recommendationId,
        rating,
        comment: comment || '',
      },
      {
        upsert: true,
        new: true,
      }
    )

    res.json({ message: 'Feedback submitted successfully', feedback })
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: 'Feedback already submitted for this recommendation' })
    }
    next(error)
  }
}

