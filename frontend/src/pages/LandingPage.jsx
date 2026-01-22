import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SearchForm from '../components/SearchForm'

function LandingPage() {
  const navigate = useNavigate()

  const handleSearch = (searchData) => {
    // Store search data and navigate to results
    navigate('/results', { state: { searchData } })
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">WanderWise</h1>
          <p className="text-xl mb-8">
            AI-Powered Travel Recommendations Tailored to Your Style
          </p>
        </div>
      </div>

      {/* Search Form */}
      <div className="container mx-auto px-4 py-12">
        <SearchForm onSubmit={handleSearch} />
      </div>
    </div>
  )
}

export default LandingPage

