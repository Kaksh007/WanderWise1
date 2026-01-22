import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, Grid, List } from 'lucide-react'
import { cn } from '../utils/cn'
import DestinationCard from '../components/features/destinations/DestinationCard'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorMessage from '../components/common/ErrorMessage'
import { recommendationService } from '../services/recommendationService'
import Container from '../components/layout/Container'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { Skeleton } from '../components/ui/Skeleton'

function ResultsPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [viewMode, setViewMode] = useState('grid')

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

  if (loading) {
    return (
      <Container>
        <div className="py-12">
          <Skeleton className="h-10 w-64 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton.Card key={i} />
            ))}
          </div>
        </div>
      </Container>
    )
  }

  if (error) return <ErrorMessage message={error} />

  return (
    <div className="min-h-screen bg-gray-50 py-8 md:py-12">
      <Container>
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Travel Recommendations
              </h1>
              <p className="text-gray-600">
                {recommendations.length} destination{recommendations.length !== 1 ? 's' : ''} found
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/advanced-search')}
          >
            <Search className="h-4 w-4 mr-2" />
            New Search
          </Button>
        </div>

        {/* Results */}
        {recommendations.length === 0 ? (
          <Card className="text-center py-12">
            <p className="text-gray-600 mb-4">No recommendations found.</p>
            <Button
              variant="primary"
              onClick={() => navigate('/advanced-search')}
            >
              Start New Search
            </Button>
          </Card>
        ) : (
          <div
            className={cn(
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-4'
            )}
          >
            {recommendations.map((destination, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <DestinationCard destination={destination} />
              </motion.div>
            ))}
          </div>
        )}
      </Container>
    </div>
  )
}

export default ResultsPage
