import React from 'react'
import { motion } from 'framer-motion'
import { FiCheck, FiEye, FiShare2, FiEdit3 } from 'react-icons/fi'
import { Link } from 'react-router-dom'

const ProductListingSuccess = ({ product, onClose }) => {
  const shareProduct = () => {
    const url = `${window.location.origin}/products/${product._id}`
    const text = `Check out my ${product.title} for ₹${product.price} on CampusMart!`
    
    if (navigator.share) {
      navigator.share({
        title: product.title,
        text: text,
        url: url
      })
    } else {
      navigator.clipboard.writeText(`${text} ${url}`)
      toast.success('Link copied to clipboard!')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center"
      >
        {/* Success Icon */}
        <div className="mx-auto flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
          <FiCheck className="w-8 h-8 text-green-600" />
        </div>

        {/* Success Message */}
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Listing Created Successfully! 🎉
        </h2>
        <p className="text-gray-600 mb-6">
          Your product has been listed and is now visible to other students.
        </p>

        {/* Product Preview */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-4">
            {product.images?.[0] && (
              <img 
                src={product.images[0].url} 
                alt={product.title}
                className="w-16 h-16 object-cover rounded-lg"
              />
            )}
            <div className="flex-1 text-left">
              <h3 className="font-semibold text-gray-900 truncate">
                {product.title}
              </h3>
              <p className="text-green-600 font-bold">₹{product.price}</p>
              <p className="text-sm text-gray-500">{product.category}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link
            to={`/products/${product._id}`}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            <FiEye size={16} />
            View Your Listing
          </Link>
          
          <div className="flex gap-2">
            <button
              onClick={shareProduct}
              className="btn-secondary flex-1 flex items-center justify-center gap-2"
            >
              <FiShare2 size={16} />
              Share
            </button>
            
            <Link
              to={`/products/${product._id}/edit`}
              className="btn-secondary flex-1 flex items-center justify-center gap-2"
            >
              <FiEdit3 size={16} />
              Edit
            </Link>
          </div>
          
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-sm"
          >
            Close
          </button>
        </div>

        {/* Next Steps */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="font-medium text-gray-900 mb-2">What's Next?</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Your listing is now visible to potential buyers</li>
            <li>• You'll get notifications when someone shows interest</li>
            <li>• Keep your phone ready for buyer inquiries</li>
            <li>• You can edit or delete your listing anytime</li>
          </ul>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default ProductListingSuccess