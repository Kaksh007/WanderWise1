import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { authService } from '../services/authService'
import { useAuthStore } from '../store/useAuthStore'
import LoadingSpinner from '../components/common/LoadingSpinner'

function GoogleCallbackPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { setUser } = useAuthStore()

  useEffect(() => {
    const run = async () => {
      const params = new URLSearchParams(location.search)
      const code = params.get('code')
      const error = params.get('error')

      if (error) {
        toast.error('Google sign-in was cancelled or failed.')
        navigate('/login')
        return
      }

      if (!code) {
        toast.error('Missing authorization code from Google.')
        navigate('/login')
        return
      }

      try {
        const data = await authService.loginWithGoogle({ code })
        setUser(data.user, data.token)
        toast.success('Signed in with Google!')
        navigate('/profile')
      } catch (err) {
        toast.error(err || 'Google sign-in failed.')
        navigate('/login')
      }
    }

    run()
  }, [location.search, navigate, setUser])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-purple-50 py-12">
      <div className="flex flex-col items-center space-y-4">
        <LoadingSpinner />
        <p className="text-gray-600">Completing Google sign-in...</p>
      </div>
    </div>
  )
}

export default GoogleCallbackPage

