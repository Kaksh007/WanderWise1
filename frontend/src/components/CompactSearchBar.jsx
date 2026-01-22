import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function CompactSearchBar({ className = '' }) {
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Navigate to results with basic search
      navigate('/results', {
        state: {
          searchData: {
            location: searchQuery.trim(),
            budgetRange: 'medium',
            lengthDays: 5,
            travelStyle: 'culture',
            interests: [],
          },
        },
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className={`flex gap-2 ${className}`}>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search destinations..."
        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1 min-w-0"
      />
      <button
        type="submit"
        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-semibold transition-colors duration-200 whitespace-nowrap"
      >
        Search
      </button>
    </form>
  )
}

export default CompactSearchBar
