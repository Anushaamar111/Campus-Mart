import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { 
  FiArrowLeft, 
  FiHeart, 
  FiShare2, 
  FiMapPin, 
  FiCalendar, 
  FiUser,
  FiPhone,
  FiMail,
  FiMessageCircle,
  FiFlag,
  FiEdit3,
  FiTrash2,
  FiEye,
  FiTag
} from 'react-icons/fi'
import { productsAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import WishlistButton from '../components/WishlistButton'
import ShareButton from '../components/ShareButton'
import toast from 'react-hot-toast'
import { formatDistanceToNow } from 'date-fns'

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [showContactInfo, setShowContactInfo] = useState(false)
  const [relatedProducts, setRelatedProducts] = useState([])

  useEffect(() => {
    fetchProduct()
  }, [id])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      const response = await productsAPI.getById(id)
      setProduct(response.data.product)
      
      // Fetch related products
      if (response.data.product.category) {
        fetchRelatedProducts(response.data.product.category, id)
      }
    } catch (error) {
      console.error('Error fetching product:', error)
      setError('Failed to load product details')
    } finally {
      setLoading(false)
    }
  }

  const fetchRelatedProducts = async (category, excludeId) => {
    try {
      const response = await productsAPI.getAll({ 
        category, 
        limit: 4 
      })
      const filtered = response.data.products.filter(p => p._id !== excludeId)
      setRelatedProducts(filtered)
    } catch (error) {
      console.error('Error fetching related products:', error)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this listing?')) {
      return
    }

    try {
      await productsAPI.delete(id)
      toast.success('Product listing deleted successfully')
      navigate('/products')
    } catch (error) {
      console.error('Error deleting product:', error)
      toast.error('Failed to delete product listing')
    }
  }

  const handleInterest = async () => {
    if (!user) {
      toast.error('Please login to show interest')
      navigate('/login')
      return
    }

    try {
      await productsAPI.expressInterest(id)
      toast.success('Interest expressed! Seller will be notified.')
      setShowContactInfo(true)
    } catch (error) {
      console.error('Error expressing interest:', error)
      toast.error('Failed to express interest')
    }
  }

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

  if (loading) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error} />
  if (!product) return <ErrorMessage message="Product not found" />

  const isOwner = user && user._id === product.seller?._id
  const imageUrl = product.images?.[selectedImageIndex]?.url || '/placeholder-image.jpg'

  return (
    <>
      <Helmet>
        <title>{product.title} - CampusMart</title>
        <meta name="description" content={product.description} />
        <meta property="og:title" content={product.title} />
        <meta property="og:description" content={product.description} />
        <meta property="og:image" content={imageUrl} />
      </Helmet>

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
          >
            <FiArrowLeft className="mr-2" />
            Back to Products
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="aspect-square bg-white rounded-lg shadow-md overflow-hidden">
                <img
                  src={imageUrl}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Thumbnail Images */}
              {product.images && product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                        selectedImageIndex === index
                          ? 'border-primary-500'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={image.url}
                        alt={`${product.title} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Information */}
            <div className="space-y-6">
              {/* Header */}
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {product.title}
                    </h1>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <FiEye className="mr-1" />
                        {product.views || 0} views
                      </span>
                      <span className="flex items-center">
                        <FiCalendar className="mr-1" />
                        {formatDistanceToNow(new Date(product.createdAt))} ago
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <WishlistButton productId={product._id} />
                    <ShareButton product={product} />
                    {isOwner && (
                      <>
                        <Link
                          to={`/products/${product._id}/edit`}
                          className="p-2 text-gray-400 hover:text-blue-500 rounded-lg hover:bg-gray-100"
                        >
                          <FiEdit3 size={20} />
                        </Link>
                        <button
                          onClick={handleDelete}
                          className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-gray-100"
                        >
                          <FiTrash2 size={20} />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Price and Condition */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-baseline space-x-2">
                    <span className="text-3xl font-bold text-green-600">
                      ₹{product.price}
                    </span>
                    {product.negotiable && (
                      <span className="text-sm text-gray-500">(Negotiable)</span>
                    )}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getConditionColor(product.condition)}`}>
                    {product.condition}
                  </span>
                </div>

                {/* Category and Tags */}
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                    <FiTag className="mr-1" size={12} />
                    {product.category}
                  </span>
                  {product.tags && product.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{product.description}</p>
              </div>

              {/* Location */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Location</h3>
                <div className="flex items-center text-gray-600">
                  <FiMapPin className="mr-2" />
                  <span>{product.location}</span>
                  {product.college && (
                    <span className="ml-2 text-sm text-gray-500">• {product.college}</span>
                  )}
                </div>
              </div>

              {/* Seller Information */}
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Seller Information</h3>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <FiUser className="text-primary-600" size={20} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {product.seller?.name || 'Anonymous Seller'}
                    </p>
                    <p className="text-sm text-gray-500">
                      Member since {formatDistanceToNow(new Date(product.seller?.createdAt || product.createdAt))} ago
                    </p>
                  </div>
                </div>

                {/* Contact Information */}
                {showContactInfo || isOwner ? (
                  <div className="space-y-2">
                    {product.contactPhone && (
                      <div className="flex items-center text-gray-600">
                        <FiPhone className="mr-3" />
                        <a 
                          href={`tel:${product.contactPhone}`}
                          className="hover:text-primary-600"
                        >
                          {product.contactPhone}
                        </a>
                      </div>
                    )}
                    {product.contactEmail && (
                      <div className="flex items-center text-gray-600">
                        <FiMail className="mr-3" />
                        <a 
                          href={`mailto:${product.contactEmail}`}
                          className="hover:text-primary-600"
                        >
                          {product.contactEmail}
                        </a>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {!isOwner && (
                      <>
                        <button
                          onClick={handleInterest}
                          className="btn-primary w-full flex items-center justify-center gap-2"
                        >
                          <FiMessageCircle size={16} />
                          Show Interest
                        </button>
                        <p className="text-xs text-gray-500 text-center">
                          Contact details will be revealed after showing interest
                        </p>
                      </>
                    )}
                  </div>
                )}

                {!isOwner && (
                  <button className="mt-4 text-sm text-red-600 hover:text-red-700 flex items-center">
                    <FiFlag size={14} className="mr-1" />
                    Report this listing
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map(relatedProduct => (
                  <Link
                    key={relatedProduct._id}
                    to={`/products/${relatedProduct._id}`}
                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
                  >
                    <div className="aspect-square">
                      <img
                        src={relatedProduct.images?.[0]?.url || '/placeholder-image.jpg'}
                        alt={relatedProduct.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {relatedProduct.title}
                      </h3>
                      <p className="text-green-600 font-bold">₹{relatedProduct.price}</p>
                      <p className="text-sm text-gray-500">{relatedProduct.condition}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default ProductDetail