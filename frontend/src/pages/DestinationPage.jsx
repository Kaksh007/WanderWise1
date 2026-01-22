import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Star,
  Utensils,
  Hotel,
  Share2,
  Bookmark,
} from 'lucide-react'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorMessage from '../components/common/ErrorMessage'
import BookmarkButton from '../components/BookmarkButton'
import FeedbackButtons from '../components/FeedbackButtons'
import PlaceCard from '../components/features/destinations/PlaceCard'
import RestaurantCard from '../components/features/destinations/RestaurantCard'
import StayCard from '../components/features/destinations/StayCard'
import { destinationService } from '../services/destinationService'
import { topDestinationsService } from '../services/topDestinationsService'
import Container from '../components/layout/Container'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import { cn } from '../utils/cn'

function DestinationPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [destination, setDestination] = useState(null)
  const [imageUrl, setImageUrl] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    window.scrollTo(0, 0)
    fetchDestination()
  }, [id])

  const fetchDestination = async () => {
    try {
      setLoading(true)
      setError(null)

      const decodedName = decodeURIComponent(id)
      const data = await destinationService.getDestination(id)
      setDestination(data)

      if (data.image) {
        setImageUrl(data.image)
      } else {
        const currentDate = new Date()
        const monthNames = [
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
        const currentMonth = monthNames[currentDate.getMonth()]

        for (const region of ['india', 'world']) {
          try {
            const topData = await topDestinationsService.getTopDestinations(
              region,
              currentMonth
            )
            const found = topData.find(
              (d) => d.name.toLowerCase() === decodedName.toLowerCase()
            )
            if (found && found.image) {
              setImageUrl(found.image)
              break
            }
          } catch (err) {
            // Continue searching
          }
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch destination')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error} />
  if (!destination) return <div>Destination not found</div>

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Image Section */}
      {imageUrl && (
        <div className="relative h-64 md:h-96 w-full overflow-hidden">
          <img
            src={imageUrl}
            alt={destination.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
          
          {/* Back Button - Overlay */}
          <div className="absolute top-4 left-4 z-10">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="bg-white/90 hover:bg-white text-gray-900"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>

          {/* Title Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
            <Container>
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold mb-2">
                    {destination.name}
                  </h1>
                  <div className="flex items-center gap-2 text-lg md:text-xl">
                    <MapPin className="h-5 w-5" />
                    <span>{destination.country}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <BookmarkButton destinationId={id} />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Container>
          </div>
        </div>
      )}

      <Container>
        <div className="py-8">
          {/* Back Button - No Image */}
          {!imageUrl && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          )}

          {/* Description Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="mb-8" padding="lg">
              {!imageUrl && (
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                      {destination.name}
                    </h1>
                    <div className="flex items-center gap-2 text-lg text-gray-600">
                      <MapPin className="h-5 w-5" />
                      <span>{destination.country}</span>
                    </div>
                  </div>
                  <BookmarkButton destinationId={id} />
                </div>
              )}
              
              {destination.summary && (
                <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                  {destination.summary}
                </p>
              )}
              
              {destination.bestTimeToVisit && (
                <div className="flex items-center gap-2 text-gray-700 bg-primary-50 rounded-lg p-4">
                  <Calendar className="h-5 w-5 text-primary-600" />
                  <div>
                    <span className="font-semibold">Best Time to Visit: </span>
                    <span>{destination.bestTimeToVisit}</span>
                  </div>
                </div>
              )}
            </Card>
          </motion.div>

          {/* Top 5 Places to Visit */}
          {destination.topPlaces && destination.topPlaces.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <MapPin className="h-7 w-7 text-primary-600" />
                Top 5 Places to Visit
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {destination.topPlaces.slice(0, 5).map((place, index) => (
                  <PlaceCard key={index} place={place} />
                ))}
              </div>
            </motion.section>
          )}

          {/* Top 5 Restaurants */}
          {destination.restaurants && destination.restaurants.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Utensils className="h-7 w-7 text-primary-600" />
                Top 5 Restaurants
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {destination.restaurants.slice(0, 5).map((restaurant, index) => (
                  <RestaurantCard key={index} restaurant={restaurant} />
                ))}
              </div>
            </motion.section>
          )}

          {/* Top 5 Property Stays */}
          {destination.stays && destination.stays.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Hotel className="h-7 w-7 text-primary-600" />
                Top 5 Property Stays
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {destination.stays.slice(0, 5).map((stay, index) => (
                  <StayCard key={index} stay={stay} />
                ))}
              </div>
            </motion.section>
          )}

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="mb-6" padding="lg">
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() =>
                    navigate('/advanced-search', {
                      state: { prefillLocation: destination.name },
                    })
                  }
                  className="flex-1"
                >
                  Get Recommendations for this Destination
                </Button>
                <FeedbackButtons recommendationId={id} />
              </div>
            </Card>
          </motion.div>

          {/* Empty State */}
          {(!destination.topPlaces ||
            destination.topPlaces.length === 0) &&
            (!destination.restaurants ||
              destination.restaurants.length === 0) &&
            (!destination.stays || destination.stays.length === 0) && (
              <Card className="border-warning bg-yellow-50">
                <p className="text-yellow-800 text-center">
                  Detailed information is being loaded. Please refresh the page
                  in a moment.
                </p>
              </Card>
            )}
        </div>
      </Container>
    </div>
  )
}

export default DestinationPage
