import { useState } from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { bookmarkService } from '../services/bookmarkService'
import toast from 'react-hot-toast'

function BookmarkButton({ destinationId }) {
  const { user } = useAuthStore()
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleBookmark = async () => {
    if (!user) {
      toast.error('Please login to bookmark destinations')
      return
    }

    setLoading(true)
    try {
      if (isBookmarked) {
        await bookmarkService.removeBookmark(destinationId)
        setIsBookmarked(false)
        toast.success('Bookmark removed')
      } else {
        await bookmarkService.addBookmark(destinationId)
        setIsBookmarked(true)
        toast.success('Bookmarked!')
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update bookmark')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleBookmark}
      disabled={loading || !user}
      className={`px-4 py-2 rounded ${
        isBookmarked
          ? 'bg-yellow-500 text-white hover:bg-yellow-600'
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
      } disabled:opacity-50`}
    >
      {isBookmarked ? '★ Bookmarked' : '☆ Bookmark'}
    </button>
  )
}

export default BookmarkButton

