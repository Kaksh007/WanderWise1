import { useState, useEffect, useRef } from 'react'
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
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const mobileDropdownRef = useRef(null)

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
    setIsMobileOpen(false)
    if (onMonthChange) {
      onMonthChange(month)
    }
  }

  useEffect(() => {
    if (!isMobileOpen) return

    const handlePointerDown = (e) => {
      const el = mobileDropdownRef.current
      if (!el) return
      if (!el.contains(e.target)) setIsMobileOpen(false)
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsMobileOpen(false)
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('touchstart', handlePointerDown, { passive: true })
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('touchstart', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isMobileOpen])

  const currentMonthLabel =
    MONTHS.find((m) => m.value === currentMonth)?.label ?? 'Select month'

  return (
    <Card className="mb-8" padding="md">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary-600" />
          <label className="text-lg font-semibold text-gray-900">
            Filter by Month:
          </label>
        </div>
        {/* Mobile: simple dropdown */}
        <div ref={mobileDropdownRef} className="relative w-full sm:hidden">
          <button
            type="button"
            aria-haspopup="listbox"
            aria-expanded={isMobileOpen}
            onClick={() => setIsMobileOpen((v) => !v)}
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-left text-sm text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <span className="flex items-center justify-between gap-3">
              <span className="truncate">{currentMonthLabel}</span>
              <span className="text-gray-500">▾</span>
            </span>
          </button>

          {isMobileOpen && (
            <div className="absolute left-0 right-0 top-full mt-2 z-50 max-h-[60vh] overflow-auto rounded-lg border border-gray-200 bg-white shadow-lg">
              <ul role="listbox" className="py-1">
                {MONTHS.map((month) => {
                  const isSelected = currentMonth === month.value
                  return (
                    <li key={month.value} role="option" aria-selected={isSelected}>
                      <button
                        type="button"
                        onClick={() => handleMonthChange(month.value)}
                        className={cn(
                          'w-full px-3 py-2 text-left text-sm',
                          isSelected
                            ? 'bg-primary-50 text-primary-700'
                            : 'text-gray-900 hover:bg-gray-50'
                        )}
                      >
                        {month.label}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}
        </div>

        {/* Desktop/tablet: buttons */}
        <div className="hidden sm:flex gap-2 overflow-x-auto scrollbar-hide whitespace-nowrap">
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
