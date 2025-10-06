import React, { useState, useRef, useCallback } from 'react'
import { FiUpload, FiX, FiImage, FiAlertCircle } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'

const ImageUpload = ({ 
  images = [], 
  onImagesChange, 
  maxImages = 5, 
  maxSize = 5 * 1024 * 1024, // 5MB
  accept = "image/*",
  error = null 
}) => {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef(null)

  const validateFile = useCallback((file) => {
    if (!file.type.startsWith('image/')) {
      toast.error(`${file.name} is not a valid image file`)
      return false
    }
    if (file.size > maxSize) {
      toast.error(`${file.name} is too large. Maximum ${Math.round(maxSize / (1024 * 1024))}MB per image`)
      return false
    }
    return true
  }, [maxSize])

  const processFiles = useCallback((files) => {
    const fileArray = Array.from(files)
    
    if (images.length + fileArray.length > maxImages) {
      toast.error(`Maximum ${maxImages} images allowed`)
      return
    }

    const validFiles = fileArray.filter(validateFile)
    if (validFiles.length === 0) return

    const newImages = []
    let processed = 0

    validFiles.forEach((file) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        newImages.push({
          id: Date.now() + Math.random(),
          file,
          url: e.target.result,
          name: file.name,
          size: file.size
        })
        
        processed++
        if (processed === validFiles.length) {
          onImagesChange([...images, ...newImages])
        }
      }
      reader.readAsDataURL(file)
    })
  }, [images, maxImages, validateFile, onImagesChange])

  const handleFileSelect = (e) => {
    const files = e.target.files
    if (files && files.length > 0) {
      processFiles(files)
    }
    // Reset input value
    e.target.value = ''
  }

  const handleDragEnter = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.currentTarget.contains(e.relatedTarget)) return
    setIsDragging(false)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    
    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      processFiles(files)
    }
  }

  const removeImage = (indexToRemove) => {
    const updatedImages = images.filter((_, index) => index !== indexToRemove)
    onImagesChange(updatedImages)
  }

  const moveImage = (fromIndex, toIndex) => {
    const updatedImages = [...images]
    const [movedImage] = updatedImages.splice(fromIndex, 1)
    updatedImages.splice(toIndex, 0, movedImage)
    onImagesChange(updatedImages)
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="space-y-4">
      {/* Upload Zone */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200
          ${isDragging 
            ? 'border-primary-400 bg-primary-50' 
            : error 
              ? 'border-red-300 bg-red-50' 
              : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
          }
        `}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={accept}
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="space-y-4">
          <div className="flex justify-center">
            {isDragging ? (
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="p-3 bg-primary-100 rounded-full"
              >
                <FiUpload className="h-8 w-8 text-primary-600" />
              </motion.div>
            ) : (
              <FiImage className="h-12 w-12 text-gray-400" />
            )}
          </div>

          <div>
            <p className="text-sm font-medium text-gray-700">
              {isDragging ? 'Drop images here' : 'Upload product images'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Drag and drop or click to select • PNG, JPG, JPEG up to {Math.round(maxSize / (1024 * 1024))}MB each
            </p>
            <p className="text-xs text-gray-500">
              Maximum {maxImages} images • First image will be the main photo
            </p>
          </div>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="btn-secondary text-sm"
            disabled={images.length >= maxImages}
          >
            Choose Images
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-red-50 bg-opacity-90 rounded-lg">
            <div className="flex items-center text-red-600">
              <FiAlertCircle className="mr-2" />
              <span className="text-sm">{error}</span>
            </div>
          </div>
        )}
      </div>

      {/* Image count indicator */}
      {images.length > 0 && (
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>{images.length} of {maxImages} images uploaded</span>
          <span className="text-xs">Drag to reorder</span>
        </div>
      )}

      {/* Image Previews */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          <AnimatePresence>
            {images.map((image, index) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative group cursor-move"
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('text/plain', index.toString())
                }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault()
                  const fromIndex = parseInt(e.dataTransfer.getData('text/plain'))
                  if (fromIndex !== index) {
                    moveImage(fromIndex, index)
                  }
                }}
              >
                <div className="aspect-square relative rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                  <img
                    src={image.url}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity">
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    >
                      <FiX size={12} />
                    </button>
                  </div>

                  {/* Main image indicator */}
                  {index === 0 && (
                    <div className="absolute bottom-2 left-2 bg-primary-500 text-white text-xs px-2 py-1 rounded">
                      Main
                    </div>
                  )}

                  {/* File info */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white text-xs truncate">{image.name}</p>
                    <p className="text-white text-xs">{formatFileSize(image.size)}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Upload tips */}
      {images.length === 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-800 mb-2">📸 Photo Tips</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Use good lighting and take clear, focused photos</li>
            <li>• Show different angles and any defects honestly</li>
            <li>• Include size references or your item in use</li>
            <li>• Clean your item before photographing</li>
          </ul>
        </div>
      )}
    </div>
  )
}

export default ImageUpload