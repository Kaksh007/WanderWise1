import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, BookmarkIcon, LogOut, MapPin } from 'lucide-react'
import { useAuthStore } from '../store/useAuthStore'
import { bookmarkService } from '../services/bookmarkService'
import Container from '../components/layout/Container'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'

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

  const initials = useMemo(() => {
    if (!user?.name) return '?'
    const parts = user.name.trim().split(' ')
    const first = parts[0]?.[0] || ''
    const last = parts.length > 1 ? parts[parts.length - 1][0] : ''
    return (first + last).toUpperCase()
  }, [user])

  const totalBookmarks = bookmarks.length

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <Container>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <User className="h-8 w-8 text-primary-600" />
              <span>Profile</span>
            </h1>
            <p className="text-gray-600 mt-1">
              Welcome back, <span className="font-semibold">{user?.name}</span>. Manage your
              account and revisit your favourite destinations.
            </p>
          </div>
          <Button
            variant="danger"
            size="md"
            onClick={handleLogout}
            leftIcon={<LogOut className="h-4 w-4" />}
          >
            Logout
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column: user summary */}
          <div className="lg:col-span-1 space-y-6">
            <Card padding="lg" hover>
              <Card.Header className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center text-2xl font-bold text-primary-700">
                  {initials}
                </div>
                <div>
                  <Card.Title className="flex items-center gap-2">
                    {user?.name || 'Wanderer'}
                    <Badge variant="primary" size="sm">
                      Explorer
                    </Badge>
                  </Card.Title>
                  <Card.Description>{user?.email}</Card.Description>
                </div>
              </Card.Header>

              <Card.Content className="mt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Saved bookmarks</span>
                  <span className="font-semibold text-gray-900 flex items-center gap-1">
                    <BookmarkIcon className="h-4 w-4 text-primary-600" />
                    {totalBookmarks}
                  </span>
                </div>
                {user?.prefs?.homeCountry && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Home base</span>
                    <span className="font-semibold text-gray-900 flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-primary-600" />
                      {user.prefs.homeCountry}
                    </span>
                  </div>
                )}
                {user?.prefs?.travelStyles?.length > 0 && (
                  <div>
                    <span className="text-sm text-gray-500">Travel styles</span>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {user.prefs.travelStyles.map((style) => (
                        <Badge key={style} variant="info" size="sm">
                          {style}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </Card.Content>
            </Card>

            <Card padding="md">
              <Card.Title className="text-lg">Account tips</Card.Title>
              <Card.Content className="mt-3 space-y-2 text-sm text-gray-600">
                <p>• Bookmark destinations you love to quickly revisit them later.</p>
                <p>• Use your profile to discover and refine your travel preferences.</p>
              </Card.Content>
            </Card>
          </div>

          {/* Right column: bookmarks */}
          <div className="lg:col-span-2 space-y-6">
            <Card padding="lg">
              <Card.Header className="flex items-center justify-between">
                <div>
                  <Card.Title>Saved Bookmarks</Card.Title>
                  <Card.Description>
                    All the destinations you’ve marked to explore or revisit later.
                  </Card.Description>
                </div>
              </Card.Header>

              <Card.Content>
                {loading ? (
                  <div className="py-10 text-center text-gray-500">Loading your bookmarks...</div>
                ) : totalBookmarks === 0 ? (
                  <div className="py-10 text-center text-gray-500">
                    You haven&apos;t bookmarked any destinations yet.
                    <br />
                    <Button
                      variant="primary"
                      size="sm"
                      className="mt-4"
                      onClick={() => navigate('/')}
                    >
                      Explore destinations
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {bookmarks.map((bookmark) => (
                      <div
                        key={bookmark._id}
                        className="group border border-gray-100 rounded-xl p-4 bg-white hover:bg-primary-50/60 hover:border-primary-200 transition-all cursor-pointer flex flex-col justify-between"
                        onClick={() => navigate(`/destination/${bookmark.destinationId}`)}
                      >
                        <div>
                          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                            <BookmarkIcon className="h-4 w-4 text-primary-600" />
                            {bookmark.destinationName || 'Destination'}
                          </h3>
                          {bookmark.note && (
                            <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                              {bookmark.note}
                            </p>
                          )}
                        </div>
                        <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
                          <span>
                            Saved on{' '}
                            {new Date(bookmark.createdAt).toLocaleDateString(undefined, {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                          <span className="group-hover:text-primary-700 font-medium">
                            View details →
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card.Content>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  )
}

export default ProfilePage

