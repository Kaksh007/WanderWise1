function ErrorMessage({ message }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-800 font-semibold">{message || 'An error occurred'}</p>
      </div>
    </div>
  )
}

export default ErrorMessage

