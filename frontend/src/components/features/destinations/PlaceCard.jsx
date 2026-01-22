import Card from '../../ui/Card'
import Badge from '../../ui/Badge'

function PlaceCard({ place }) {
  return (
    <Card hover className="h-full border-l-4 border-l-primary-500">
      <h3 className="text-lg font-bold text-gray-900 mb-2">{place.name}</h3>
      <p className="text-gray-600 text-sm mb-3 leading-relaxed">
        {place.description}
      </p>
      {place.category && (
        <Badge variant="primary" size="sm">
          {place.category}
        </Badge>
      )}
    </Card>
  )
}

export default PlaceCard
