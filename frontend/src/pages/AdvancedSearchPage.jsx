import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import SearchForm from '../components/features/search/SearchForm'
import Container from '../components/layout/Container'

function AdvancedSearchPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [prefillData, setPrefillData] = useState(null)

  useEffect(() => {
    // Check if location was pre-filled from navigation
    if (location.state?.prefillLocation) {
      setPrefillData({
        location: location.state.prefillLocation,
        budgetRange: 'medium',
        lengthDays: 5,
        travelStyle: 'culture',
        interests: [],
      })
    }
  }, [location.state])

  const handleSearch = (searchData) => {
    // Navigate to results with search data
    navigate('/results', { state: { searchData } })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 md:py-16">
      <Container>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Advanced Search
            </h1>
            <p className="text-lg text-gray-600">
              Get personalized travel recommendations based on your preferences
            </p>
          </div>
          <SearchForm onSubmit={handleSearch} initialData={prefillData} />
        </div>
      </Container>
    </div>
  )
}

export default AdvancedSearchPage
