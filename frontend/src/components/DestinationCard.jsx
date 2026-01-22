import { useNavigate } from 'react-router-dom'

function DestinationCard({ destination }) {
  const navigate = useNavigate()

  const handleClick = () => {
    // Navigate to destination detail page
    // For now, we'll use the destination name as ID
    navigate(`/destination/${encodeURIComponent(destination.name)}`)
  }

  return (
    <div
      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
      onClick={handleClick}
    >
      <h3 className="text-xl font-bold mb-2">{destination.name}</h3>
      {destination.score && (
        <div className="mb-2">
          <span className="text-sm text-gray-600">Match Score: </span>
          <span className="font-semibold">{destination.score}/10</span>
        </div>
      )}
      <p className="text-gray-700 mb-4">{destination.reason}</p>
      {destination.topPlaces && destination.topPlaces.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-semibold mb-2">Top Places:</p>
          <ul className="text-sm text-gray-600 space-y-1">
            {destination.topPlaces.slice(0, 3).map((place, index) => (
              <li key={index}>• {place.name}</li>
            ))}
          </ul>
        </div>
      )}
      <button className="mt-4 text-blue-500 hover:text-blue-700 font-semibold">
        View Details →
      </button>
    </div>
  )
}

export default DestinationCard

