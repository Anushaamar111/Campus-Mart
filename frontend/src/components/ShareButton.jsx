import React, { useState } from 'react'
import { FiShare2, FiCopy, FiX } from 'react-icons/fi'
import { FiMessageCircle } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'

const ShareButton = ({ product, className = '' }) => {
  const [showShareMenu, setShowShareMenu] = useState(false)
  
  const productUrl = `${window.location.origin}/products/${product._id}`
  const shareText = `Check out this ${product.title} for ₹${product.price} on CampusMart!`

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(productUrl)
      toast.success('Link copied to clipboard!')
      setShowShareMenu(false)
    } catch (error) {
      console.error('Failed to copy:', error)
      toast.error('Failed to copy link')
    }
  }

  const shareViaWhatsApp = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${productUrl}`)}`
    window.open(whatsappUrl, '_blank')
    setShowShareMenu(false)
  }

  const shareViaSMS = () => {
    const smsUrl = `sms:?body=${encodeURIComponent(`${shareText} ${productUrl}`)}`
    window.open(smsUrl, '_blank')
    setShowShareMenu(false)
  }

  const shareViaEmail = () => {
    const emailUrl = `mailto:?subject=${encodeURIComponent(`Check out this item on CampusMart`)}&body=${encodeURIComponent(`${shareText}\n\n${productUrl}`)}`
    window.open(emailUrl, '_blank')
    setShowShareMenu(false)
  }

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.title,
          text: shareText,
          url: productUrl,
        })
        setShowShareMenu(false)
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Error sharing:', error)
        }
      }
    }
  }

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setShowShareMenu(!showShareMenu)
        }}
        className={`p-2 rounded-full bg-white text-gray-400 hover:text-primary-500 shadow-md hover:shadow-lg transition-colors ${className}`}
      >
        <FiShare2 size={16} />
      </motion.button>

      <AnimatePresence>
        {showShareMenu && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowShareMenu(false)}
            />
            
            {/* Share Menu */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50"
            >
              <div className="p-2">
                <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100">
                  <h3 className="font-medium text-gray-900 text-sm">Share Product</h3>
                  <button
                    onClick={() => setShowShareMenu(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <FiX size={14} />
                  </button>
                </div>
                
                <div className="py-2">
                  {/* Native Share (if supported) */}
                  {navigator.share && (
                    <button
                      onClick={handleNativeShare}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
                    >
                      <FiShare2 size={16} />
                      Share
                    </button>
                  )}
                  
                  <button
                    onClick={copyToClipboard}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
                  >
                    <FiCopy size={16} />
                    Copy Link
                  </button>
                  
                  <button
                    onClick={shareViaWhatsApp}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
                  >
                    <FiMessageCircle size={16} />
                    WhatsApp
                  </button>
                  
                  <button
                    onClick={shareViaSMS}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
                  >
                    <FiMessageCircle size={16} />
                    SMS
                  </button>
                  
                  <button
                    onClick={shareViaEmail}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
                  >
                    <FiMessageCircle size={16} />
                    Email
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ShareButton