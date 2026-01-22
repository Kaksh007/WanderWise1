import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'
import CompactSearchBar from './CompactSearchBar'

function Navigation() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row justify-between items-center py-4 gap-4">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            WanderWise
          </Link>
          
          {/* Compact Search Bar - Hidden on mobile, shown on larger screens */}
          <div className="hidden md:block flex-1 max-w-md mx-4">
            <CompactSearchBar />
          </div>

          <div className="flex gap-4 items-center flex-wrap justify-center">
            <Link
              to="/advanced-search"
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              Advanced Search
            </Link>
            {user ? (
              <>
                <Link
                  to="/profile"
                  className="text-gray-700 hover:text-blue-600 font-medium"
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600 font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navigation
