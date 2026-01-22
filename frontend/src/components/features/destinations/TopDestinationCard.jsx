import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, MapPin, ArrowRight } from 'lucide-react'
import Badge from '../../ui/Badge'
import { cn } from '../../../utils/cn'

function TopDestinationCard({ destination }) {
  const navigate = useNavigate()
  const [imageError, setImageError] = useState(false)

  const handleClick = () => {
    navigate(`/destination/${encodeURIComponent(destination.name)}`)
  }

  const getBudgetVariant = (budget) => {
    switch (budget?.toLowerCase()) {
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

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer group relative flex-shrink-0 w-80 hover:shadow-xl transition-all duration-300"
      onClick={handleClick}
    >
      {/* Image */}
      <div className="relative h-56 overflow-hidden">
        {!imageError && destination.image ? (
          <img
            src={destination.image}
            alt={destination.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={() => setImageError(true)}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-400 via-primary-500 to-purple-600 flex items-center justify-center">
            <span className="text-white text-5xl font-bold drop-shadow-lg">
              {destination.name.charAt(0)}
            </span>
          </div>
        )}
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Budget Badge */}
        {destination.budgetRange && (
          <div className="absolute top-3 right-3">
            <Badge variant={getBudgetVariant(destination.budgetRange)}>
              {destination.budgetRange.toUpperCase()}
            </Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="mb-3">
          <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors">
            {destination.name}
          </h3>
          <div className="flex items-center text-sm text-gray-500">
            <MapPin className="h-3.5 w-3.5 mr-1" />
            <span>{destination.country}</span>
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
          {destination.description}
        </p>

        {destination.bestTimeToVisit && (
          <div className="flex items-center text-xs text-gray-500 mb-3">
            <Calendar className="h-3.5 w-3.5 mr-1.5" />
            <span>{destination.bestTimeToVisit}</span>
          </div>
        )}

        <div className="flex items-center text-primary-600 text-sm font-medium group-hover:gap-2 transition-all">
          <span>Explore</span>
          <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </motion.div>
  )
}

export default TopDestinationCard
