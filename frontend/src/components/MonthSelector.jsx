import { useState, useEffect } from 'react'
import { Calendar } from 'lucide-react'
import Card from './ui/Card'
import Badge from './ui/Badge'
import { cn } from '../utils/cn'

const MONTHS = [
  { value: 'january', label: 'January' },
  { value: 'february', label: 'February' },
  { value: 'march', label: 'March' },
  { value: 'april', label: 'April' },
  { value: 'may', label: 'May' },
  { value: 'june', label: 'June' },
  { value: 'july', label: 'July' },
  { value: 'august', label: 'August' },
  { value: 'september', label: 'September' },
  { value: 'october', label: 'October' },
  { value: 'november', label: 'November' },
  { value: 'december', label: 'December' },
]

function MonthSelector({ selectedMonth, onMonthChange }) {
  const [currentMonth, setCurrentMonth] = useState(selectedMonth)

  useEffect(() => {
    if (!selectedMonth) {
      const monthNames = [
        'january',
        'february',
        'march',
        'april',
        'may',
        'june',
        'july',
        'august',
        'september',
        'october',
        'november',
        'december',
      ]
      const now = new Date()
      const currentMonthName = monthNames[now.getMonth()]
      setCurrentMonth(currentMonthName)
      if (onMonthChange) {
        onMonthChange(currentMonthName)
      }
    } else {
      setCurrentMonth(selectedMonth)
    }
  }, [selectedMonth, onMonthChange])

  const handleMonthChange = (month) => {
    setCurrentMonth(month)
    if (onMonthChange) {
      onMonthChange(month)
    }
  }

  return (
    <Card className="mb-8" padding="md">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary-600" />
          <label className="text-lg font-semibold text-gray-900">
            Filter by Month:
          </label>
        </div>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide whitespace-nowrap">
          {MONTHS.map((month) => (
            <button
              key={month.value}
              onClick={() => handleMonthChange(month.value)}
              className={cn(
                'px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm',
                currentMonth === month.value
                  ? 'bg-primary-600 text-white shadow-md scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
              )}
            >
              {month.label}
            </button>
          ))}
        </div>
      </div>
    </Card>
  )
}

export default MonthSelector
