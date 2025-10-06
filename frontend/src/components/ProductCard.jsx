import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiMapPin, FiCalendar, FiUser } from 'react-icons/fi'
import { motion } from 'framer-motion'
import { formatDistance } from 'date-fns'
import WishlistButton from './WishlistButton'
import ShareButton from './ShareButton'

const ProductCard = ({ product, viewMode = 'grid', onWishlistToggle }) => {



  const getConditionColor = (condition) => {
    const colors = {
      'New': 'bg-green-100 text-green-800',
      'Like New': 'bg-blue-100 text-blue-800',
      'Good': 'bg-yellow-100 text-yellow-800',
      'Fair': 'bg-orange-100 text-orange-800',
      'Poor': 'bg-red-100 text-red-800'
    }
    return colors[condition] || 'bg-gray-100 text-gray-800'
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    hover: { y: -5, transition: { duration: 0.2 } }
  }

  if (viewMode === 'list') {
    return (
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6"
      >
        <Link to={`/products/${product._id}`} className="flex gap-6">
          {/* Image */}
          <div className="w-32 h-32 flex-shrink-0 relative">
            {product.images?.[0] ? (
              <img
                src={product.images[0].url}
                alt={product.title}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center">
                <span className="text-gray-500 text-xs">No Image</span>
              </div>
            )}
            {product.featured && (
              <span className="absolute top-2 left-2 bg-primary-500 text-white text-xs px-2 py-1 rounded">
                Featured
              </span>
            )}
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-gray-900 text-lg line-clamp-2">
                {product.title}
              </h3>
              <div className="flex items-center gap-2 ml-4">
                <WishlistButton productId={product._id} />
                <ShareButton product={product} />
              </div>
            </div>

            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {product.description}
            </p>

            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold text-primary-600">
                  ₹{product.price.toLocaleString()}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-sm text-gray-500 line-through">
                    ₹{product.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConditionColor(product.condition)}`}>
                {product.condition}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <FiMapPin size={14} />
                  {product.location}
                </span>
                <span className="flex items-center gap-1">
                  <FiUser size={14} />
                  {product.seller?.name}
                </span>
              </div>
              <span className="flex items-center gap-1">
                <FiCalendar size={14} />
                {formatDistance(new Date(product.createdAt), new Date(), { addSuffix: true })}
              </span>
            </div>
          </div>
        </Link>
      </motion.div>
    )
  }

  // Grid view
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
    >
      <Link to={`/products/${product._id}`} className="block">
        {/* Image */}
        <div className="relative aspect-w-4 aspect-h-3">
          {product.images?.[0] ? (
            <img
              src={product.images[0].url}
              alt={product.title}
              className="w-full h-48 object-cover"
            />
          ) : (
            <div className="w-full h-48 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
              <span className="text-gray-500 text-sm">No Image</span>
            </div>
          )}
          
          {/* Overlay buttons */}
          <div className="absolute top-3 right-3 flex gap-2">
            <WishlistButton productId={product._id} />
            <ShareButton product={product} />
          </div>

          {/* Badges */}
          <div className="absolute top-3 left-3">
            {product.featured && (
              <span className="bg-primary-500 text-white text-xs px-2 py-1 rounded mb-2 block">
                Featured
              </span>
            )}
            <span className={`px-2 py-1 rounded text-xs font-medium ${getConditionColor(product.condition)}`}>
              {product.condition}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
            {product.title}
          </h3>

          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-primary-600">
                ₹{product.price.toLocaleString()}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm text-gray-500 line-through">
                  ₹{product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
            <span className="flex items-center gap-1">
              <FiMapPin size={14} />
              {product.location}
            </span>
            <span>
              {formatDistance(new Date(product.createdAt), new Date(), { addSuffix: true })}
            </span>
          </div>

          <div className="text-sm text-gray-600 mb-3">
            <span className="font-medium">{product.category}</span> • by {product.seller?.name}
          </div>

          <button className="w-full btn-primary py-2">
            View Details
          </button>
        </div>
      </Link>
    </motion.div>
  )
}

export default ProductCard