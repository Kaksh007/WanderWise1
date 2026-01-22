function PlaceCard({ place }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow border-l-4 border-blue-500">
      <h3 className="text-lg font-bold text-gray-800 mb-2">{place.name}</h3>
      <p className="text-gray-600 text-sm mb-3">{place.description}</p>
      {place.category && (
        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
          {place.category}
        </span>
      )}
    </div>
  )
}

export default PlaceCard
