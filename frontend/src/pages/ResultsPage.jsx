import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import DestinationCard from '../components/DestinationCard'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import { recommendationService } from '../services/recommendationService'

function ResultsPage() {
  const location = useLocation()
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const searchData = location.state?.searchData
    if (searchData) {
      fetchRecommendations(searchData)
    } else {
      setError('No search data provided')
      setLoading(false)
    }
  }, [location])

  const fetchRecommendations = async (searchData) => {
    try {
      setLoading(true)
      setError(null)
      const data = await recommendationService.getRecommendations(searchData)
      setRecommendations(data.candidates || [])
    } catch (err) {
      setError(err.message || 'Failed to fetch recommendations')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error} />

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Travel Recommendations</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map((destination, index) => (
          <DestinationCard key={index} destination={destination} />
        ))}
      </div>
    </div>
  )
}

export default ResultsPage

