import { Link } from 'react-router-dom'
import { MapPin, Mail, Github, Linkedin } from 'lucide-react'
import Container from './Container'
import './Footer.css'

function Footer() {
  return (
    <footer className="site-footer text-gray-300">
      <Container className="footer-content-wrap">
        <div className="footer-inner py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <MapPin className="h-6 w-6 text-primary-400" />
                <span className="text-xl font-bold text-white">WanderWise</span>
              </div>
              <p className="text-sm text-gray-400">
                Your AI-powered travel companion for discovering the perfect
                destinations.
              </p>
              <div className="flex space-x-4">
                <a
                  href="https://www.linkedin.com/in/kaksh007/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-primary-400 transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
                <a
                  href="https://github.com/Kaksh007"
                  className="text-gray-400 hover:text-primary-400 transition-colors"
                  aria-label="GitHub"
                >
                  <Github className="h-5 w-5" />
                </a>
                <a
                  href="mailto:kakshpatel2003@gmail.com"
                  className="text-gray-400 hover:text-primary-400 transition-colors"
                  aria-label="Email"
                >
                  <Mail className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-white font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    to="/"
                    className="hover:text-primary-400 transition-colors"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/advanced-search"
                    className="hover:text-primary-400 transition-colors"
                  >
                    Advanced Search
                  </Link>
                </li>
                <li>
                  <Link
                    to="/results"
                    className="hover:text-primary-400 transition-colors"
                  >
                    Browse Destinations
                  </Link>
                </li>
              </ul>
            </div>

            {/* About */}
            <div>
              <h3 className="text-white font-semibold mb-4">About</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="#"
                    className="hover:text-primary-400 transition-colors"
                  >
                    How It Works
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-primary-400 transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-primary-400 transition-colors"
                  >
                    Pricing
                  </a>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-white font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="#"
                    className="hover:text-primary-400 transition-colors"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-primary-400 transition-colors"
                  >
                    Contact Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-primary-400 transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-primary-400 transition-colors"
                  >
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
            <p className="text-center md:text-left">
              &copy; {new Date().getFullYear()} WanderWise. Built by{' '}
              <span className="font-semibold text-white">Kaksh</span>.
            </p>
            <a
              href="https://github.com/Kaksh007"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-primary-400 transition-colors"
              aria-label="View on GitHub"
            >
              <Github className="h-5 w-5" />
              <span className="hidden sm:inline">GitHub</span>
            </a>
          </div>
        </div>
      </Container>
    </footer>
  )
}

export default Footer
