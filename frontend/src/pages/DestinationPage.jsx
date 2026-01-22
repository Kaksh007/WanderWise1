import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import BookmarkButton from '../components/BookmarkButton'
import FeedbackButtons from '../components/FeedbackButtons'
import PlaceCard from '../components/PlaceCard'
import RestaurantCard from '../components/RestaurantCard'
import StayCard from '../components/StayCard'
import { destinationService } from '../services/destinationService'
import { topDestinationsService } from '../services/topDestinationsService'

function DestinationPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [destination, setDestination] = useState(null)
  const [imageUrl, setImageUrl] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Scroll to top when component mounts or id changes
    window.scrollTo(0, 0)
    fetchDestination()
  }, [id])

  const fetchDestination = async () => {
    try {
      setLoading(true)
      setError(null)

      const decodedName = decodeURIComponent(id)

      // Fetch destination details from API (main data)
      const data = await destinationService.getDestination(id)
      setDestination(data)

      // If destination has image, use it
      if (data.image) {
        setImageUrl(data.image)
      } else {
        // Try to get destination image from top destinations config (current month)
        // This runs in parallel and doesn't block
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

        // Try current month for both regions
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
      {/* Back Button */}
      <div className="container mx-auto px-4 pt-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium mb-4"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back
        </button>
      </div>

      {/* Hero Image Section */}
      {imageUrl && (
        <div className="relative h-64 md:h-96 w-full overflow-hidden">
          <img
            src={imageUrl}
            alt={destination.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">
              {destination.name}
            </h1>
            <p className="text-lg md:text-xl">{destination.country}</p>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        {!imageUrl && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-4xl font-bold text-gray-800 mb-2">
                  {destination.name}
                </h1>
                <p className="text-lg text-gray-600">{destination.country}</p>
              </div>
              <BookmarkButton destinationId={id} />
            </div>
          </div>
        )}

        {/* Description Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          {imageUrl && (
            <div className="flex justify-end mb-4">
              <BookmarkButton destinationId={id} />
            </div>
          )}
          {destination.summary && (
            <p className="text-gray-700 text-lg mb-4 leading-relaxed">
              {destination.summary}
            </p>
          )}
          {destination.bestTimeToVisit && (
            <div className="flex items-center gap-2 text-gray-600">
              <svg
                className="w-5 h-5 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span className="font-semibold">Best Time to Visit:</span>
              <span>{destination.bestTimeToVisit}</span>
            </div>
          )}
        </div>

        {/* Top 5 Places to Visit */}
        {destination.topPlaces && destination.topPlaces.length > 0 && (
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              Top 5 Places to Visit
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {destination.topPlaces.slice(0, 5).map((place, index) => (
                <PlaceCard key={index} place={place} />
              ))}
            </div>
          </div>
        )}

        {/* Top 5 Restaurants */}
        {destination.restaurants && destination.restaurants.length > 0 && (
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              Top 5 Restaurants
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {destination.restaurants.slice(0, 5).map((restaurant, index) => (
                <RestaurantCard key={index} restaurant={restaurant} />
              ))}
            </div>
          </div>
        )}

        {/* Top 5 Property Stays */}
        {destination.stays && destination.stays.length > 0 && (
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              Top 5 Property Stays
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {destination.stays.slice(0, 5).map((stay, index) => (
                <StayCard key={index} stay={stay} />
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() =>
                navigate('/advanced-search', {
                  state: { prefillLocation: destination.name },
                })
              }
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-semibold transition-colors duration-200"
            >
              Get Recommendations for this Destination
            </button>
            <FeedbackButtons recommendationId={id} />
          </div>
        </div>

        {/* Empty State Messages */}
        {(!destination.topPlaces ||
          destination.topPlaces.length === 0) &&
          (!destination.restaurants ||
            destination.restaurants.length === 0) &&
          (!destination.stays || destination.stays.length === 0) && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
              <p className="text-yellow-800">
                Detailed information is being loaded. Please refresh the page in
                a moment.
              </p>
            </div>
          )}
      </div>
    </div>
  )
}

export default DestinationPage
