import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { 
  FiMapPin, 
  FiDollarSign, 
  FiTag, 
  FiFileText,
  FiUser,
  FiPhone,
  FiMail
} from 'react-icons/fi'
import { productsAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import ImageUpload from '../components/ImageUpload'
import toast from 'react-hot-toast'

const CreateProduct = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const fileInputRef = useRef(null)

  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState([])
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    condition: '',
    price: '',
    location: '',
    contactPhone: '',
    contactEmail: user?.email || '',
    tags: '',
    negotiable: false,
    featured: false
  })

  const [errors, setErrors] = useState({})

  const categories = [
    'Books & Textbooks',
    'Electronics',
    'Furniture',
    'Clothing & Accessories',
    'Sports & Fitness',
    'Musical Instruments',
    'Laboratory Equipment',
    'Stationery & Supplies',
    'Hostel Essentials',
    'Vehicles & Parts',
    'Services',
    'Other'
  ]

  const conditions = [
    { value: 'New', label: 'New - Never used', color: 'text-green-600' },
    { value: 'Like New', label: 'Like New - Barely used', color: 'text-blue-600' },
    { value: 'Good', label: 'Good - Some signs of use', color: 'text-yellow-600' },
    { value: 'Fair', label: 'Fair - Noticeable wear', color: 'text-orange-600' },
    { value: 'Poor', label: 'Poor - Heavy wear', color: 'text-red-600' }
  ]



  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleImagesChange = (newImages) => {
    setImages(newImages)
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Product title is required'
    } else if (formData.title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters long'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Product description is required'
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters long'
    }

    if (!formData.category) {
      newErrors.category = 'Please select a category'
    }

    if (!formData.condition) {
      newErrors.condition = 'Please select item condition'
    }

    if (!formData.price) {
      newErrors.price = 'Price is required'
    } else if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Please enter a valid price'
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required'
    }

    if (!formData.contactPhone.trim()) {
      newErrors.contactPhone = 'Contact phone is required'
    } else if (!/^\d{10}$/.test(formData.contactPhone.replace(/\D/g, ''))) {
      newErrors.contactPhone = 'Please enter a valid 10-digit phone number'
    }

    if (!formData.contactEmail.trim()) {
      newErrors.contactEmail = 'Contact email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.contactEmail)) {
      newErrors.contactEmail = 'Please enter a valid email address'
    }

    if (images.length === 0) {
      newErrors.images = 'At least one image is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form')
      return
    }

    setLoading(true)

    try {
      const submitData = new FormData()
      
      // Add form fields (excluding images which will be handled separately)
      Object.keys(formData).forEach(key => {
        if (key !== 'images') {
          submitData.append(key, formData[key])
        }
      })
      
      // Add images
      images.forEach((imageObj, index) => {
        if (imageObj.file) {
          submitData.append('images', imageObj.file)
        }
      })

      // Debug logging
      console.log('Submitting form data:')
      for (let [key, value] of submitData.entries()) {
        if (key === 'images') {
          console.log(`${key}:`, value.name, value.type, value.size)
        } else {
          console.log(`${key}:`, value)
        }
      }

      const response = await productsAPI.create(submitData)
      
      toast.success('Product listed successfully!')
      navigate(`/products/${response.data.product._id}`)
      
    } catch (error) {
      console.error('Error creating product:', error)
      toast.error(error.response?.data?.message || 'Failed to create product listing')
    } finally {
      setLoading(false)
    }
  }

  const pageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Please Log In</h2>
          <p className="text-gray-600 mb-6">You need to be logged in to create a product listing.</p>
          <button 
            onClick={() => navigate('/login')}
            className="btn-primary"
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>Create Product Listing - CampusMart</title>
        <meta name="description" content="List your items for sale on CampusMart college marketplace" />
      </Helmet>

      <motion.div
        variants={pageVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="min-h-screen bg-gray-50 py-8"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Create Product Listing
            </h1>
            <p className="text-gray-600">
              Sell your items to fellow students in your college community
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              {/* Product Images */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Product Images *
                </label>
                <ImageUpload
                  images={images}
                  onImagesChange={handleImagesChange}
                  maxImages={5}
                  error={errors.images}
                />
              </div>

              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Product Title */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FiTag className="inline mr-2" />
                    Product Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g., iPhone 13, MacBook Pro, Engineering Textbook"
                    className={`input-field ${errors.title ? 'border-red-300' : ''}`}
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                  )}
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className={`input-field ${errors.category ? 'border-red-300' : ''}`}
                  >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="mt-1 text-sm text-red-600">{errors.category}</p>
                  )}
                </div>

                {/* Condition */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Condition *
                  </label>
                  <select
                    name="condition"
                    value={formData.condition}
                    onChange={handleInputChange}
                    className={`input-field ${errors.condition ? 'border-red-300' : ''}`}
                  >
                    <option value="">Select Condition</option>
                    {conditions.map(condition => (
                      <option key={condition.value} value={condition.value}>
                        {condition.label}
                      </option>
                    ))}
                  </select>
                  {errors.condition && (
                    <p className="mt-1 text-sm text-red-600">{errors.condition}</p>
                  )}
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FiDollarSign className="inline mr-2" />
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="0"
                    min="0"
                    step="0.01"
                    className={`input-field ${errors.price ? 'border-red-300' : ''}`}
                  />
                  {errors.price && (
                    <p className="mt-1 text-sm text-red-600">{errors.price}</p>
                  )}
                </div>

                {/* Negotiable */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="negotiable"
                    checked={formData.negotiable}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-900">
                    Price is negotiable
                  </label>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FiFileText className="inline mr-2" />
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Describe your item in detail. Include specifications, usage history, reason for selling, etc."
                  className={`input-field ${errors.description ? 'border-red-300' : ''}`}
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                )}
              </div>

              {/* Location Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FiMapPin className="inline mr-2" />
                    Location *
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="e.g., Campus Area, Hostel Block A, City Name"
                    className={`input-field ${errors.location ? 'border-red-300' : ''}`}
                  />
                  {errors.location && (
                    <p className="mt-1 text-sm text-red-600">{errors.location}</p>
                  )}
                </div>

              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FiPhone className="inline mr-2" />
                    Contact Phone *
                  </label>
                  <input
                    type="tel"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleInputChange}
                    placeholder="10-digit mobile number"
                    className={`input-field ${errors.contactPhone ? 'border-red-300' : ''}`}
                  />
                  {errors.contactPhone && (
                    <p className="mt-1 text-sm text-red-600">{errors.contactPhone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FiMail className="inline mr-2" />
                    Contact Email *
                  </label>
                  <input
                    type="email"
                    name="contactEmail"
                    value={formData.contactEmail}
                    onChange={handleInputChange}
                    placeholder="your.email@example.com"
                    className={`input-field ${errors.contactEmail ? 'border-red-300' : ''}`}
                  />
                  {errors.contactEmail && (
                    <p className="mt-1 text-sm text-red-600">{errors.contactEmail}</p>
                  )}
                </div>
              </div>

              {/* Tags */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags (Optional)
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  placeholder="e.g., urgent, brand new, warranty, limited edition (separate with commas)"
                  className="input-field"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Add tags to help buyers find your item. Separate multiple tags with commas.
                </p>
              </div>

              {/* Submit Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating Listing...
                    </div>
                  ) : (
                    'Create Listing'
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={() => navigate('/products')}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      </motion.div>
    </>
  )
}

export default CreateProduct