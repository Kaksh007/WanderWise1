import { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import ErrorBoundary from './components/ErrorBoundary'
import Navigation from './components/Navigation'
import LoadingSpinner from './components/LoadingSpinner'
import ProtectedRoute from './components/ProtectedRoute'

// Code splitting with React.lazy
const LandingPage = lazy(() => import('./pages/LandingPage'))
const ResultsPage = lazy(() => import('./pages/ResultsPage'))
const DestinationPage = lazy(() => import('./pages/DestinationPage'))
const ProfilePage = lazy(() => import('./pages/ProfilePage'))
const LoginPage = lazy(() => import('./pages/LoginPage'))
const RegisterPage = lazy(() => import('./pages/RegisterPage'))
const AdvancedSearchPage = lazy(() => import('./pages/AdvancedSearchPage'))

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/results" element={<ResultsPage />} />
              <Route path="/destination/:id" element={<DestinationPage />} />
              <Route path="/advanced-search" element={<AdvancedSearchPage />} />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Routes>
          </Suspense>
          <Toaster position="top-right" />
        </div>
      </Router>
    </ErrorBoundary>
  )
}

export default App

