import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import Input from '../../ui/Input'
import Button from '../../ui/Button'
import { cn } from '../../../utils/cn'

function CompactSearchBar({ className = '' }) {
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
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
    <form
      onSubmit={handleSubmit}
      className={cn('flex gap-2 w-full', className)}
    >
      <div className="flex-1 min-w-0">
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search destinations..."
          leftIcon={<Search className="h-4 w-4" />}
          className="w-full"
        />
      </div>
      <Button type="submit" variant="primary" size="md">
        Search
      </Button>
    </form>
  )
}

export default CompactSearchBar
