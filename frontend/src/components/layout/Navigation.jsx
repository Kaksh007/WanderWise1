import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Disclosure } from '@headlessui/react'
import {
  Menu,
  X,
  Search,
  User,
  LogOut,
  Bookmark,
  MapPin,
  ChevronDown,
} from 'lucide-react'
import { useAuthStore } from '../../store/useAuthStore'
import CompactSearchBar from '../features/search/CompactSearchBar'
import { cn } from '../../utils/cn'
import Button from '../ui/Button'

function Navigation() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuthStore()
  const [isScrolled, setIsScrolled] = useState(false)

  // Track scroll for navbar styling
  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', () => {
      setIsScrolled(window.scrollY > 10)
    })
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const isActive = (path) => location.pathname === path

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/advanced-search', label: 'Advanced Search' },
  ]

  return (
    <nav
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md'
          : 'bg-white shadow-sm'
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2 text-2xl font-bold text-primary-600 hover:text-primary-700 transition-colors"
          >
            <MapPin className="h-7 w-7" />
            <span>WanderWise</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-6 md:flex-1 md:justify-center md:max-w-2xl md:mx-8">
            <CompactSearchBar />
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  'px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                  isActive(link.path)
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                )}
              >
                {link.label}
              </Link>
            ))}

            {user ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 rounded-lg hover:bg-gray-50 transition-colors">
                  <User className="h-5 w-5" />
                  <span>{user.name || user.email}</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <Link
                    to="/profile"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <Bookmark className="h-4 w-4 mr-2" />
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <Disclosure as="div" className="md:hidden">
            {({ open }) => (
              <>
                <Disclosure.Button className="inline-flex items-center justify-center rounded-lg p-2 text-gray-700 hover:bg-gray-100 hover:text-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500">
                  {open ? (
                    <X className="h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Menu className="h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
                <Disclosure.Panel className="absolute inset-x-0 top-16 bg-white border-b border-gray-200 shadow-lg md:hidden">
                  <div className="px-4 py-4 space-y-4">
                    <CompactSearchBar />
                    {navLinks.map((link) => (
                      <Link
                        key={link.path}
                        to={link.path}
                        className={cn(
                          'block px-3 py-2 text-base font-medium rounded-lg',
                          isActive(link.path)
                            ? 'text-primary-600 bg-primary-50'
                            : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                        )}
                      >
                        {link.label}
                      </Link>
                    ))}
                    <div className="pt-4 border-t border-gray-200">
                      {user ? (
                        <>
                          <Link
                            to="/profile"
                            className="flex items-center px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600 rounded-lg hover:bg-gray-50"
                          >
                            <User className="h-5 w-5 mr-2" />
                            Profile
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="flex items-center w-full px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <LogOut className="h-5 w-5 mr-2" />
                            Logout
                          </button>
                        </>
                      ) : (
                        <>
                          <Link
                            to="/login"
                            className="block w-full px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600 rounded-lg hover:bg-gray-50 mb-2"
                          >
                            Login
                          </Link>
                          <Link
                            to="/register"
                            className="block w-full px-3 py-2 text-base font-medium text-center bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                          >
                            Sign Up
                          </Link>
                        </>
                      )}
                    </div>
                  </div>
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        </div>
      </div>
    </nav>
  )
}

export default Navigation
