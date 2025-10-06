import React, { useState, useEffect } from 'react'
import { FiHeart } from 'react-icons/fi'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { api } from '../services/api'
import toast from 'react-hot-toast'

const WishlistButton = ({ productId, className = '' }) => {
  const { user } = useAuth()
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [loading, setLoading] = useState(false)

  // For now, we'll use a simple localStorage-based wishlist
  // until we implement a proper product wishlist API
  useEffect(() => {
    if (user) {
      checkWishlistStatus()
    }
  }, [user, productId])

  const checkWishlistStatus = () => {
    try {
      const wishlist = JSON.parse(localStorage.getItem('userWishlist') || '[]')
      setIsWishlisted(wishlist.includes(productId))
    } catch (error) {
      console.error('Error checking wishlist status:', error)
    }
  }

  const toggleWishlist = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!user) {
      toast.error('Please login to add to wishlist')
      return
    }

    setLoading(true)
    try {
      const wishlist = JSON.parse(localStorage.getItem('userWishlist') || '[]')
      
      if (isWishlisted) {
        const updatedWishlist = wishlist.filter(id => id !== productId)
        localStorage.setItem('userWishlist', JSON.stringify(updatedWishlist))
        setIsWishlisted(false)
        toast.success('Removed from wishlist')
      } else {
        wishlist.push(productId)
        localStorage.setItem('userWishlist', JSON.stringify(wishlist))
        setIsWishlisted(true)
        toast.success('Added to wishlist')
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error)
      toast.error('Failed to update wishlist')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={toggleWishlist}
      disabled={loading}
      className={`p-2 rounded-full transition-colors ${
        isWishlisted 
          ? 'bg-red-500 text-white' 
          : 'bg-white text-gray-400 hover:text-red-500'
      } shadow-md hover:shadow-lg disabled:opacity-50 ${className}`}
    >
      <FiHeart 
        size={16} 
        fill={isWishlisted ? 'currentColor' : 'none'}
        className={loading ? 'animate-pulse' : ''}
      />
    </motion.button>
  )
}

export default WishlistButton