import React from 'react'
import { motion } from 'framer-motion'
import { FiAlertCircle, FiRefreshCw } from 'react-icons/fi'

const ErrorMessage = ({ 
  message = 'Something went wrong', 
  onRetry,
  className = '' 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col items-center justify-center py-12 px-4 ${className}`}
    >
      <div className="text-center max-w-md">
        <FiAlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Oops! Something went wrong
        </h3>
        <p className="text-gray-600 mb-6">
          {message}
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="btn-primary flex items-center gap-2"
          >
            <FiRefreshCw size={16} />
            Try Again
          </button>
        )}
      </div>
    </motion.div>
  )
}

export default ErrorMessage