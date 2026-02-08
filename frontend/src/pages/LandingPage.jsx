import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Sparkles,
  Globe,
  MapPin,
  TrendingUp,
  Shield,
  Zap,
} from 'lucide-react'
import { topDestinationsService } from '../services/topDestinationsService'
import HorizontalScrollSection from '../components/HorizontalScrollSection'
import MonthSelector from '../components/MonthSelector'
import CompactSearchBar from '../components/features/search/CompactSearchBar'
import LoadingSpinner from '../components/common/LoadingSpinner'
import Footer from '../components/layout/Footer'
import Container from '../components/layout/Container'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'

function LandingPage() {
  const navigate = useNavigate()
  const [selectedMonth, setSelectedMonth] = useState(null)
  const [indiaDestinations, setIndiaDestinations] = useState([])
  const [worldDestinations, setWorldDestinations] = useState([])
  const [loadingIndia, setLoadingIndia] = useState(true)
  const [loadingWorld, setLoadingWorld] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadDestinations = async (month) => {
      try {
        setLoadingIndia(true)
        setLoadingWorld(true)
        setError(null)

        const [indiaData, worldData] = await Promise.all([
          topDestinationsService.getTopDestinations('india', month),
          topDestinationsService.getTopDestinations('world', month),
        ])

        setIndiaDestinations(indiaData)
        setWorldDestinations(worldData)
      } catch (err) {
        console.error('Error loading destinations:', err)
        setError('Failed to load destinations. Please try again later.')
      } finally {
        setLoadingIndia(false)
        setLoadingWorld(false)
      }
    }

    if (selectedMonth) {
      loadDestinations(selectedMonth)
    }
  }, [selectedMonth])

  const handleMonthChange = (month) => {
    setSelectedMonth(month)
  }

  const features = [
    {
      icon: <Sparkles className="h-6 w-6" />,
      title: 'AI-Powered',
      description: 'Get personalized recommendations using advanced AI',
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: 'Global Destinations',
      description: 'Discover amazing places around the world',
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: 'Trending Places',
      description: 'Find the most popular destinations this season',
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: 'Trusted Reviews',
      description: 'Real recommendations from verified travelers',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-purple-600 text-white">
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        <Container>
          <div className="relative py-20 md:py-28 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge variant="primary" className="mb-4 bg-white/20 text-white border-white/30">
                <Zap className="h-3 w-3 mr-1" />
                AI-Powered Travel Planning
              </Badge>
              <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
                Discover Your Next
                <br />
                <span className="text-white">Adventure</span>
              </h1>
              <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto text-blue-100">
                AI-Powered Travel Recommendations Tailored to Your Style,
                Budget, and Interests
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-2xl mx-auto mb-10"
            >
              <CompactSearchBar />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link to="/advanced-search">
                <Button variant="outline" size="lg" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                  Advanced Search
                </Button>
              </Link>
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate('/results')}
                className="bg-white text-primary-600 hover:bg-gray-100"
              >
                Browse All Destinations
              </Button>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-20">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose WanderWise?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Experience the future of travel planning with our intelligent
              recommendation system
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card hover className="h-full text-center">
                  <div className="flex justify-center mb-4 text-primary-600">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Main Content */}
      <section className="py-12 md:py-16 bg-gray-50">
        <Container>
          <MonthSelector
            selectedMonth={selectedMonth}
            onMonthChange={handleMonthChange}
          />

          {error && (
            <Card className="mb-8 border-error bg-red-50">
              <p className="text-error">{error}</p>
            </Card>
          )}

          <div className="space-y-12 mt-12">
            <HorizontalScrollSection
              title="Top Destinations in India"
              destinations={indiaDestinations}
              region="india"
              isLoading={loadingIndia}
            />

            <HorizontalScrollSection
              title="Top Destinations Worldwide"
              destinations={worldDestinations}
              region="world"
              isLoading={loadingWorld}
            />
          </div>
        </Container>
      </section>

    </div>
  )
}

export default LandingPage
