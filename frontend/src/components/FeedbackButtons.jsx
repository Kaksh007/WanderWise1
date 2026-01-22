import { useState } from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { feedbackService } from '../services/feedbackService'
import toast from 'react-hot-toast'

function FeedbackButtons({ recommendationId }) {
  const { user } = useAuthStore()
  const [rating, setRating] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleFeedback = async (value) => {
    if (!user) {
      toast.error('Please login to provide feedback')
      return
    }

    setLoading(true)
    try {
      await feedbackService.submitFeedback({
        recommendationId,
        rating: value,
      })
      setRating(value)
      toast.success('Thank you for your feedback!')
    } catch (err) {
      toast.error(err.message || 'Failed to submit feedback')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mt-6">
      <p className="text-sm font-medium mb-2">Was this recommendation helpful?</p>
      <div className="flex gap-2">
        <button
          onClick={() => handleFeedback(1)}
          disabled={loading || !user || rating === 1}
          className={`px-4 py-2 rounded ${
            rating === 1
              ? 'bg-green-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          } disabled:opacity-50`}
        >
          👍 Helpful
        </button>
        <button
          onClick={() => handleFeedback(-1)}
          disabled={loading || !user || rating === -1}
          className={`px-4 py-2 rounded ${
            rating === -1
              ? 'bg-red-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          } disabled:opacity-50`}
        >
          👎 Not Helpful
        </button>
      </div>
    </div>
  )
}

export default FeedbackButtons

