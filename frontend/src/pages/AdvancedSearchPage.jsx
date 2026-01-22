import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import SearchForm from '../components/SearchForm'

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
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-4 text-gray-800">
            Advanced Search
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Get personalized travel recommendations based on your preferences
          </p>
          <SearchForm onSubmit={handleSearch} initialData={prefillData} />
        </div>
      </div>
    </div>
  )
}

export default AdvancedSearchPage
