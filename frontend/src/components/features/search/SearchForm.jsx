import { useState, useEffect } from 'react'
import { MapPin, DollarSign, Calendar, Compass, Heart } from 'lucide-react'
import Card from '../../ui/Card'
import Input from '../../ui/Input'
import Button from '../../ui/Button'
import Badge from '../../ui/Badge'

function SearchForm({ onSubmit, initialData }) {
  const [formData, setFormData] = useState({
    location: '',
    budgetRange: 'medium',
    lengthDays: 5,
    travelStyle: 'culture',
    interests: [],
  })

  useEffect(() => {
    if (initialData) {
      setFormData(initialData)
    }
  }, [initialData])

  const travelStyles = [
    'trekking',
    'relaxation',
    'culture',
    'adventure',
    'beach',
    'city',
  ]
  const interestsOptions = [
    'nature',
    'photography',
    'history',
    'food',
    'nightlife',
    'shopping',
    'art',
    'music',
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleInterestToggle = (interest) => {
    setFormData({
      ...formData,
      interests: formData.interests.includes(interest)
        ? formData.interests.filter((i) => i !== interest)
        : [...formData.interests, interest],
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <Card className="max-w-3xl mx-auto" padding="lg">
      <Card.Header>
        <Card.Title>Find Your Perfect Destination</Card.Title>
        <Card.Description>
          Tell us your preferences and we'll recommend the best destinations for
          you
        </Card.Description>
      </Card.Header>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Location (optional)"
          name="location"
          type="text"
          value={formData.location}
          onChange={handleChange}
          placeholder="Enter city/country or leave blank for 'anywhere'"
          leftIcon={<MapPin className="h-4 w-4" />}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Budget Range
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                name="budgetRange"
                value={formData.budgetRange}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              >
                <option value="low">Low Budget</option>
                <option value="medium">Medium Budget</option>
                <option value="high">High Budget</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Travel Length (days)
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="number"
                name="lengthDays"
                value={formData.lengthDays}
                onChange={handleChange}
                min="1"
                max="30"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Travel Style
          </label>
          <div className="relative">
            <Compass className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <select
              name="travelStyle"
              value={formData.travelStyle}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            >
              {travelStyles.map((style) => (
                <option key={style} value={style}>
                  {style.charAt(0).toUpperCase() + style.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Interests (select multiple)
          </label>
          <div className="flex flex-wrap gap-2">
            {interestsOptions.map((interest) => (
              <button
                key={interest}
                type="button"
                onClick={() => handleInterestToggle(interest)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  formData.interests.includes(interest)
                    ? 'bg-primary-600 text-white shadow-md hover:bg-primary-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {interest.charAt(0).toUpperCase() + interest.slice(1)}
              </button>
            ))}
          </div>
          {formData.interests.length > 0 && (
            <p className="mt-2 text-sm text-gray-500">
              {formData.interests.length} interest(s) selected
            </p>
          )}
        </div>

        <Button type="submit" variant="primary" size="lg" className="w-full">
          Get Recommendations
        </Button>
      </form>
    </Card>
  )
}

export default SearchForm
