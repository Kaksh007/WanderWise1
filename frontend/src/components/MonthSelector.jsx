import { useState, useEffect } from 'react'

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
      // Get current month name
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
    <div className="bg-white rounded-lg shadow-md p-4 mb-8">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <label className="text-lg font-semibold text-gray-700">
          Select Month:
        </label>
        <div className="flex flex-wrap gap-2">
          {MONTHS.map((month) => (
            <button
              key={month.value}
              onClick={() => handleMonthChange(month.value)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                currentMonth === month.value
                  ? 'bg-blue-500 text-white shadow-md scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {month.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default MonthSelector
