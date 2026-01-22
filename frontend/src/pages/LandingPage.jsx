import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { topDestinationsService } from '../services/topDestinationsService'
import HorizontalScrollSection from '../components/HorizontalScrollSection'
import MonthSelector from '../components/MonthSelector'
import CompactSearchBar from '../components/CompactSearchBar'
import LoadingSpinner from '../components/LoadingSpinner'

function LandingPage() {
  const navigate = useNavigate()
  const [selectedMonth, setSelectedMonth] = useState(null)
  const [indiaDestinations, setIndiaDestinations] = useState([])
  const [worldDestinations, setWorldDestinations] = useState([])
  const [loadingIndia, setLoadingIndia] = useState(true)
  const [loadingWorld, setLoadingWorld] = useState(true)
  const [error, setError] = useState(null)

  // Load destinations when month changes
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">WanderWise</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
            AI-Powered Travel Recommendations Tailored to Your Style
          </p>
          <div className="max-w-2xl mx-auto mb-8">
            <CompactSearchBar />
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/advanced-search"
              className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
            >
              Advanced Search
            </Link>
            <button
              onClick={() => navigate('/results')}
              className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors duration-200"
            >
              Browse All Destinations
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Month Selector */}
        <MonthSelector
          selectedMonth={selectedMonth}
          onMonthChange={handleMonthChange}
        />

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-8">
            {error}
          </div>
        )}

        {/* Top Destinations in India */}
        <HorizontalScrollSection
          title="Top Destinations in India"
          destinations={indiaDestinations}
          region="india"
          isLoading={loadingIndia}
        />

        {/* Top Destinations in World */}
        <HorizontalScrollSection
          title="Top Destinations in World"
          destinations={worldDestinations}
          region="world"
          isLoading={loadingWorld}
        />
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">WanderWise</h3>
              <p className="text-gray-400">
                Your AI-powered travel companion for discovering the perfect
                destinations.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link to="/advanced-search" className="hover:text-white">
                    Advanced Search
                  </Link>
                </li>
                <li>
                  <Link to="/results" className="hover:text-white">
                    Browse Destinations
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">About</h4>
              <p className="text-gray-400">
                Get personalized travel recommendations based on your budget,
                interests, and travel style.
              </p>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 WanderWise. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
