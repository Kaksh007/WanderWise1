import { Star, MapPin } from 'lucide-react'
import Card from '../../ui/Card'
import Badge from '../../ui/Badge'

function StayCard({ stay }) {
  const getPriceVariant = (priceRange) => {
    switch (priceRange?.toLowerCase()) {
      case 'low':
        return 'success'
      case 'medium':
        return 'warning'
      case 'high':
        return 'error'
      default:
        return 'default'
    }
  }

  const renderStars = (rating) => {
    if (!rating) return null
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5
    const stars = []

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star
          key={i}
          className="h-4 w-4 text-yellow-400 fill-current"
        />
      )
    }

    if (hasHalfStar) {
      stars.push(
        <Star
          key="half"
          className="h-4 w-4 text-yellow-400 fill-current opacity-50"
        />
      )
    }

    return <div className="flex items-center gap-0.5">{stars}</div>
  }

  return (
    <Card hover className="h-full">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-bold text-gray-900 flex-1">
          {stay.name}
        </h3>
        {stay.rating && (
          <div className="flex items-center gap-1 ml-2">
            {renderStars(stay.rating)}
            <span className="text-sm text-gray-600 font-medium">
              {stay.rating.toFixed(1)}
            </span>
          </div>
        )}
      </div>
      <p className="text-gray-600 text-sm mb-3 leading-relaxed">
        {stay.description}
      </p>
      <div className="flex flex-wrap gap-2 items-center mb-2">
        {stay.type && (
          <Badge variant="info" size="sm">
            {stay.type}
          </Badge>
        )}
        {stay.priceRange && (
          <Badge variant={getPriceVariant(stay.priceRange)} size="sm">
            {stay.priceRange.toUpperCase()}
          </Badge>
        )}
      </div>
      {stay.location && (
        <div className="flex items-center text-xs text-gray-500 mt-2">
          <MapPin className="h-3 w-3 mr-1" />
          <span>{stay.location}</span>
        </div>
      )}
    </Card>
  )
}

export default StayCard
