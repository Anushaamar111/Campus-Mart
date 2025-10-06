import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { FiArrowLeft, FiSave, FiX } from 'react-icons/fi'
import { productsAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import ImageUpload from '../components/ImageUpload'
import FormProgress from '../components/FormProgress'
import toast from 'react-hot-toast'

const CATEGORIES = [
  'Electronics',
  'Books & Study Materials',
  'Furniture',
  'Clothing & Accessories',
  'Sports & Fitness',
  'Musical Instruments',
  'Vehicles',
  'Home & Living',
  'Beauty & Personal Care',
  'Others'
]

const CONDITIONS = [
  'New',
  'Like New',
  'Good',
  'Fair',
  'Poor'
]



const EditProduct = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [currentStep, setCurrentStep] = useState(1)
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    condition: '',
    location: '',
    contactPhone: '',
    contactEmail: '',
    negotiable: false,
    tags: '',
    images: []
  })

  const [errors, setErrors] = useState({})
  const [imagesToDelete, setImagesToDelete] = useState([])

  const steps = [
    { title: 'Basic Info', description: 'Product details' },
    { title: 'Images', description: 'Upload photos' },
    { title: 'Contact', description: 'Contact information' }
  ]

  useEffect(() => {
    fetchProduct()
  }, [id])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      const response = await productsAPI.getById(id)
      const product = response.data.product

      // Check if user owns this product
      if (!user || user._id !== product.seller?._id) {
        setError('You are not authorized to edit this product')
        return
      }

      setFormData({
        title: product.title || '',
        description: product.description || '',
        price: product.price?.toString() || '',
        category: product.category || '',
        condition: product.condition || '',
        location: product.location || '',
        contactPhone: product.contactPhone || '',
        contactEmail: product.contactEmail || '',
        negotiable: product.negotiable || false,
        tags: product.tags?.join(', ') || '',
        images: product.images || []
      })
    } catch (error) {
      console.error('Error fetching product:', error)
      setError('Failed to load product details')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateStep = (step) => {
    const newErrors = {}

    if (step === 1) {
      if (!formData.title.trim()) newErrors.title = 'Title is required'
      if (!formData.description.trim()) newErrors.description = 'Description is required'
      if (!formData.price || formData.price <= 0) newErrors.price = 'Valid price is required'
      if (!formData.category) newErrors.category = 'Category is required'
      if (!formData.condition) newErrors.condition = 'Condition is required'
      if (!formData.location.trim()) newErrors.location = 'Location is required'
    }

    if (step === 3) {
      if (!formData.contactPhone.trim() && !formData.contactEmail.trim()) {
        newErrors.contact = 'At least one contact method is required'
      }
      if (formData.contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
        newErrors.contactEmail = 'Valid email is required'
      }
      if (formData.contactPhone && !/^[0-9]{10}$/.test(formData.contactPhone.replace(/\D/g, ''))) {
        newErrors.contactPhone = 'Valid 10-digit phone number is required'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length))
    }
  }

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateStep(currentStep)) return

    try {
      setSaving(true)
      
      const submitData = new FormData()
      
      // Add text fields
      Object.keys(formData).forEach(key => {
        if (key !== 'images') {
          if (key === 'tags') {
            const tagsArray = formData[key].split(',').map(tag => tag.trim()).filter(Boolean)
            tagsArray.forEach(tag => submitData.append('tags[]', tag))
          } else {
            submitData.append(key, formData[key])
          }
        }
      })

      // Add new image files
      formData.images.forEach((image, index) => {
        if (image.file) {
          submitData.append('images', image.file)
        }
      })

      // Add existing images to keep
      const existingImages = formData.images.filter(img => !img.file && !imagesToDelete.includes(img.id))
      existingImages.forEach(img => {
        submitData.append('existingImages[]', img.id || img.url)
      })

      // Add images to delete
      imagesToDelete.forEach(imageId => {
        submitData.append('imagesToDelete[]', imageId)
      })

      await productsAPI.update(id, submitData)
      toast.success('Product updated successfully!')
      navigate(`/products/${id}`)
    } catch (error) {
      console.error('Error updating product:', error)
      toast.error(error.response?.data?.message || 'Failed to update product')
    } finally {
      setSaving(false)
    }
  }

  const handleImageChange = (images) => {
    setFormData(prev => ({ ...prev, images }))
  }

  const handleImageDelete = (imageId) => {
    if (imageId) {
      setImagesToDelete(prev => [...prev, imageId])
    }
  }

  if (loading) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error} />

  return (
    <>
      <Helmet>
        <title>Edit Product - CampusMart</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
              >
                <FiArrowLeft className="mr-2" />
                Back
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
                <p className="text-gray-600 mt-1">Update your product listing</p>
              </div>
            </div>
            
            <button
              onClick={() => navigate(`/products/${id}`)}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <FiX className="mr-1" />
              Cancel
            </button>
          </div>

          {/* Progress Indicator */}
          <FormProgress 
            steps={steps} 
            currentStep={currentStep} 
            className="mb-8"
          />

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Step 1: Basic Information */}
              {currentStep === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Product Title *
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className={`input-field ${errors.title ? 'border-red-500' : ''}`}
                        placeholder="e.g., iPhone 12 Pro Max"
                      />
                      {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description *
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={4}
                        className={`input-field ${errors.description ? 'border-red-500' : ''}`}
                        placeholder="Describe your product in detail..."
                      />
                      {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price (₹) *
                      </label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        className={`input-field ${errors.price ? 'border-red-500' : ''}`}
                        placeholder="0"
                        min="0"
                      />
                      {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                      <div className="mt-2">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            name="negotiable"
                            checked={formData.negotiable}
                            onChange={handleInputChange}
                            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          />
                          <span className="ml-2 text-sm text-gray-600">Price is negotiable</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category *
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className={`input-field ${errors.category ? 'border-red-500' : ''}`}
                      >
                        <option value="">Select a category</option>
                        {CATEGORIES.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                      {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Condition *
                      </label>
                      <select
                        name="condition"
                        value={formData.condition}
                        onChange={handleInputChange}
                        className={`input-field ${errors.condition ? 'border-red-500' : ''}`}
                      >
                        <option value="">Select condition</option>
                        {CONDITIONS.map(condition => (
                          <option key={condition} value={condition}>{condition}</option>
                        ))}
                      </select>
                      {errors.condition && <p className="text-red-500 text-sm mt-1">{errors.condition}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Location *
                      </label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        className={`input-field ${errors.location ? 'border-red-500' : ''}`}
                        placeholder="e.g., Delhi, Mumbai"
                      />
                      {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tags (comma separated)
                      </label>
                      <input
                        type="text"
                        name="tags"
                        value={formData.tags}
                        onChange={handleInputChange}
                        className="input-field"
                        placeholder="e.g., electronics, smartphone, apple"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Images */}
              {currentStep === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <ImageUpload
                    images={formData.images}
                    onChange={handleImageChange}
                    onDelete={handleImageDelete}
                    maxImages={8}
                  />
                </motion.div>
              )}

              {/* Step 3: Contact Information */}
              {currentStep === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-blue-800 text-sm">
                      <strong>Privacy Note:</strong> Your contact information will only be visible to interested buyers.
                    </p>
                  </div>

                  {errors.contact && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-red-800 text-sm">{errors.contact}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="contactPhone"
                        value={formData.contactPhone}
                        onChange={handleInputChange}
                        className={`input-field ${errors.contactPhone ? 'border-red-500' : ''}`}
                        placeholder="+91 98765 43210"
                      />
                      {errors.contactPhone && <p className="text-red-500 text-sm mt-1">{errors.contactPhone}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="contactEmail"
                        value={formData.contactEmail}
                        onChange={handleInputChange}
                        className={`input-field ${errors.contactEmail ? 'border-red-500' : ''}`}
                        placeholder="your.email@example.com"
                      />
                      {errors.contactEmail && <p className="text-red-500 text-sm mt-1">{errors.contactEmail}</p>}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                <div>
                  {currentStep > 1 && (
                    <button
                      type="button"
                      onClick={prevStep}
                      className="btn-secondary"
                    >
                      Previous
                    </button>
                  )}
                </div>

                <div className="flex items-center space-x-4">
                  {currentStep < steps.length ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      className="btn-primary"
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={saving}
                      className="btn-primary flex items-center"
                    >
                      {saving ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Updating...
                        </>
                      ) : (
                        <>
                          <FiSave className="mr-2" />
                          Update Product
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </>
  )
}

export default EditProduct