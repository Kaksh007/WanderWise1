import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'
import { bookmarkService } from '../services/bookmarkService'

function ProfilePage() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const [bookmarks, setBookmarks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchBookmarks()
    }
  }, [user])

  const fetchBookmarks = async () => {
    try {
      setLoading(true)
      const data = await bookmarkService.getBookmarks()
      setBookmarks(data)
    } catch (err) {
      console.error('Failed to fetch bookmarks:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  if (loading) return <div className="container mx-auto px-4 py-8">Loading...</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Profile</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">User Information</h2>
          <p><strong>Name:</strong> {user?.name}</p>
          <p><strong>Email:</strong> {user?.email}</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Saved Bookmarks</h2>
          {bookmarks.length === 0 ? (
            <p className="text-gray-600">No bookmarks yet</p>
          ) : (
            <div className="space-y-4">
              {bookmarks.map((bookmark) => (
                <div
                  key={bookmark._id}
                  className="border rounded p-4 hover:bg-gray-50 cursor-pointer"
                  onClick={() => navigate(`/destination/${bookmark.destinationId}`)}
                >
                  <h3 className="font-semibold">{bookmark.destinationName || 'Destination'}</h3>
                  {bookmark.note && <p className="text-gray-600">{bookmark.note}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProfilePage

