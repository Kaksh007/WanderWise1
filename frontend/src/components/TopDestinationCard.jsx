import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

function TopDestinationCard({ destination }) {
  const navigate = useNavigate()
  const [imageError, setImageError] = useState(false)

  const handleClick = () => {
    // Navigate to destination detail page
    navigate(`/destination/${encodeURIComponent(destination.name)}`)
  }

  const handleGetRecommendations = (e) => {
    e.stopPropagation()
    // Navigate to advanced search with destination pre-filled
    navigate('/advanced-search', {
      state: { prefillLocation: destination.name },
    })
  }

  const getBudgetColor = (budget) => {
    switch (budget?.toLowerCase()) {
      case 'low':
        return 'bg-green-100 text-green-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'high':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group relative flex-shrink-0 w-80"
      onClick={handleClick}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        {!imageError && destination.image ? (
          <img
            src={destination.image}
            alt={destination.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            onError={() => setImageError(true)}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
            <span className="text-white text-4xl font-bold drop-shadow-lg">
              {destination.name.charAt(0)}
            </span>
          </div>
        )}
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
          <button
            onClick={handleGetRecommendations}
            className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 shadow-lg"
          >
            Get Recommendations
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-1">
              {destination.name}
            </h3>
            <p className="text-sm text-gray-600">{destination.country}</p>
          </div>
          {destination.budgetRange && (
            <span
              className={`px-2 py-1 rounded text-xs font-semibold ${getBudgetColor(
                destination.budgetRange
              )}`}
            >
              {destination.budgetRange.toUpperCase()}
            </span>
          )}
        </div>

        <p className="text-gray-700 text-sm mb-3 line-clamp-2">
          {destination.description}
        </p>

        {destination.bestTimeToVisit && (
          <div className="flex items-center text-xs text-gray-500">
            <svg
              className="w-4 h-4 mr-1"
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
            <span>{destination.bestTimeToVisit}</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default TopDestinationCard
