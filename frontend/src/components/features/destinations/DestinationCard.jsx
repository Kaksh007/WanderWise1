import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, ArrowRight, Star } from 'lucide-react'
import Card from '../../ui/Card'
import Badge from '../../ui/Badge'
import { cn } from '../../../utils/cn'

function DestinationCard({ destination }) {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(`/destination/${encodeURIComponent(destination.name)}`)
  }

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      onClick={handleClick}
    >
      <Card hover className="h-full cursor-pointer">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors">
              {destination.name}
            </h3>
            {destination.country && (
              <div className="flex items-center text-sm text-gray-500">
                <MapPin className="h-3.5 w-3.5 mr-1" />
                <span>{destination.country}</span>
              </div>
            )}
          </div>
          {destination.score && (
            <Badge variant="primary" size="sm">
              <Star className="h-3 w-3 mr-1 fill-current" />
              {destination.score}/10
            </Badge>
          )}
        </div>

        {destination.reason && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
            {destination.reason}
          </p>
        )}

        {destination.topPlaces && destination.topPlaces.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
              Top Places
            </p>
            <ul className="text-sm text-gray-600 space-y-1">
              {destination.topPlaces.slice(0, 3).map((place, index) => (
                <li key={index} className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-primary-600 rounded-full mr-2"></span>
                  {place.name}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex items-center text-primary-600 text-sm font-medium group-hover:gap-2 transition-all pt-2 border-t border-gray-100">
          <span>View Details</span>
          <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
        </div>
      </Card>
    </motion.div>
  )
}

export default DestinationCard
