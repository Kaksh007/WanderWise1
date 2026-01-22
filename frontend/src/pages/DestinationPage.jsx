import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import BookmarkButton from '../components/BookmarkButton'
import FeedbackButtons from '../components/FeedbackButtons'
import { destinationService } from '../services/destinationService'

function DestinationPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [destination, setDestination] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchDestination()
  }, [id])

  const fetchDestination = async () => {
    try {
      setLoading(true)
      setError(null)
      // Try to get from destination service, or use recommendation data if available
      try {
        const data = await destinationService.getDestination(id)
        setDestination(data)
      } catch (err) {
        // If destination not found, create a basic structure from the ID
        setDestination({
          name: decodeURIComponent(id),
          summary: 'Destination details',
          topPlaces: [],
          sampleItineraryText: 'Itinerary details will be available soon.',
        })
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
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-blue-600 hover:text-blue-800"
      >
        ← Back
      </button>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-4xl font-bold">{destination.name}</h1>
          <BookmarkButton destinationId={id} />
        </div>
        <p className="text-gray-600 mb-6">{destination.summary}</p>

        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">Top 5 Places to Visit</h2>
          <ul className="space-y-3">
            {destination.topPlaces?.map((place, index) => (
              <li key={index} className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-semibold">{place.name}</h3>
                <p className="text-gray-600">{place.description}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">Sample Itinerary</h2>
          <div className="bg-gray-50 p-4 rounded">
            <p className="whitespace-pre-line">{destination.sampleItineraryText}</p>
          </div>
        </div>

        <FeedbackButtons recommendationId={id} />
      </div>
    </div>
  )
}

export default DestinationPage

