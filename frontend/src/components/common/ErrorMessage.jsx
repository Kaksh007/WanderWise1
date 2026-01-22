import { AlertCircle } from 'lucide-react'
import Card from '../ui/Card'

function ErrorMessage({ message, className = '' }) {
  return (
    <Card className={`border-error bg-red-50 ${className}`}>
      <div className="flex items-center space-x-3">
        <AlertCircle className="h-5 w-5 text-error flex-shrink-0" />
        <p className="text-error">{message}</p>
      </div>
    </Card>
  )
}

export default ErrorMessage
