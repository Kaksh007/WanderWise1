import { Star, MapPin } from 'lucide-react'
import Card from '../../ui/Card'
import Badge from '../../ui/Badge'
import { cn } from '../../../utils/cn'

function RestaurantCard({ restaurant }) {
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
          {restaurant.name}
        </h3>
        {restaurant.rating && (
          <div className="flex items-center gap-1 ml-2">
            {renderStars(restaurant.rating)}
            <span className="text-sm text-gray-600 font-medium">
              {restaurant.rating.toFixed(1)}
            </span>
          </div>
        )}
      </div>
      <p className="text-gray-600 text-sm mb-3 leading-relaxed">
        {restaurant.description}
      </p>
      <div className="flex flex-wrap gap-2 items-center mb-2">
        {restaurant.cuisine && (
          <Badge variant="primary" size="sm">
            {restaurant.cuisine}
          </Badge>
        )}
        {restaurant.priceRange && (
          <Badge variant={getPriceVariant(restaurant.priceRange)} size="sm">
            {restaurant.priceRange.toUpperCase()}
          </Badge>
        )}
      </div>
      {restaurant.location && (
        <div className="flex items-center text-xs text-gray-500 mt-2">
          <MapPin className="h-3 w-3 mr-1" />
          <span>{restaurant.location}</span>
        </div>
      )}
    </Card>
  )
}

export default RestaurantCard
