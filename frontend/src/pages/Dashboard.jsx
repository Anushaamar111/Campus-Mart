import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { 
  FiPlus, 
  FiEdit3, 
  FiTrash2, 
  FiEye, 
  FiHeart,
  FiMessageSquare,
  FiDollarSign,
  FiTrendingUp,
  FiGrid,
  FiList,
  FiSearch,
  FiFilter,
  FiRefreshCw,
  FiExternalLink,
  FiSettings,
  FiBarChart3
} from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import { productsAPI, userAPI } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import ProductCard from '../components/ProductCard'
import StatsCard from '../components/StatsCard'
import toast from 'react-hot-toast'
import { formatDistanceToNow } from 'date-fns'

const Dashboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState([])
  const [stats, setStats] = useState({})
  const [viewMode, setViewMode] = useState('grid')
  const [filter, setFilter] = useState('all') // all, active, sold, draft
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('newest')

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    fetchUserData()
  }, [user, navigate])

  const fetchUserData = async () => {
    try {
      setLoading(true)
      const [productsResponse, statsResponse] = await Promise.all([
        productsAPI.getUserProducts(),
        userAPI.getStats()
      ])
      
      setProducts(productsResponse.data.products || [])
      setStats(statsResponse.data.stats || {})
    } catch (error) {
      console.error('Error fetching user data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return
    }

    try {
      await productsAPI.delete(productId)
      setProducts(prev => prev.filter(p => p._id !== productId))
      toast.success('Product deleted successfully')
      
      // Refresh stats
      const statsResponse = await userAPI.getStats()
      setStats(statsResponse.data.stats || {})
    } catch (error) {
      console.error('Error deleting product:', error)
      toast.error('Failed to delete product')
    }
  }

  const handleMarkAsSold = async (productId) => {
    try {
      await productsAPI.markAsSold(productId)
      setProducts(prev => prev.map(p => 
        p._id === productId ? { ...p, status: 'sold' } : p
      ))
      toast.success('Product marked as sold')
      
      // Refresh stats
      const statsResponse = await userAPI.getStats()
      setStats(statsResponse.data.stats || {})
    } catch (error) {
      console.error('Error marking as sold:', error)
      toast.error('Failed to mark as sold')
    }
  }

  const handleMarkAsAvailable = async (productId) => {
    try {
      await productsAPI.markAsAvailable(productId)
      setProducts(prev => prev.map(p => 
        p._id === productId ? { ...p, status: 'available' } : p
      ))
      toast.success('Product marked as available')
      
      // Refresh stats
      const statsResponse = await userAPI.getStats()
      setStats(statsResponse.data.stats || {})
    } catch (error) {
      console.error('Error marking as available:', error)
      toast.error('Failed to mark as available')
    }
  }

  // Filter and sort products
  const filteredProducts = products
    .filter(product => {
      if (filter === 'active') return product.status === 'available'
      if (filter === 'sold') return product.status === 'sold'
      if (filter === 'draft') return product.status === 'draft'
      return true
    })
    .filter(product => 
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt)
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt)
        case 'price_high':
          return b.price - a.price
        case 'price_low':
          return a.price - b.price
        case 'views':
          return (b.views || 0) - (a.views || 0)
        default:
          return 0
      }
    })

  if (loading) return <LoadingSpinner />

  return (
    <>
      <Helmet>
        <title>My Dashboard - CampusMart</title>
        <meta name="description" content="Manage your products, view analytics and track your sales on CampusMart" />
      </Helmet>

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Dashboard</h1>
              <p className="text-gray-600">Manage your products and track your performance</p>
            </div>
            
            <div className="flex items-center gap-3 mt-4 lg:mt-0">
              <button
                onClick={fetchUserData}
                className="btn-secondary flex items-center gap-2"
                disabled={loading}
              >
                <FiRefreshCw className={loading ? 'animate-spin' : ''} size={16} />
                Refresh
              </button>
              
              <Link to="/create-product" className="btn-primary flex items-center gap-2">
                <FiPlus size={16} />
                List New Item
              </Link>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard
              title="Total Products"
              value={stats.totalProducts || 0}
              icon={FiGrid}
              color="blue"
              change={stats.productsChange}
            />
            <StatsCard
              title="Active Listings"
              value={stats.activeProducts || 0}
              icon={FiTrendingUp}
              color="green"
              change={stats.activeChange}
            />
            <StatsCard
              title="Total Views"
              value={stats.totalViews || 0}
              icon={FiEye}
              color="purple"
              change={stats.viewsChange}
            />
            <StatsCard
              title="Total Earnings"
              value={`₹${stats.totalEarnings || 0}`}
              icon={FiDollarSign}
              color="yellow"
              change={stats.earningsChange}
            />
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link
                to="/create-product"
                className="flex flex-col items-center p-4 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors"
              >
                <FiPlus className="text-primary-600 mb-2" size={24} />
                <span className="text-sm font-medium text-primary-600">Add Product</span>
              </Link>
              
              <Link
                to="/products"
                className="flex flex-col items-center p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
              >
                <FiExternalLink className="text-green-600 mb-2" size={24} />
                <span className="text-sm font-medium text-green-600">Browse Products</span>
              </Link>
              
              <Link
                to="/wishlist"
                className="flex flex-col items-center p-4 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
              >
                <FiHeart className="text-red-600 mb-2" size={24} />
                <span className="text-sm font-medium text-red-600">My Wishlist</span>
              </Link>
              
              <Link
                to="/profile/settings"
                className="flex flex-col items-center p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiSettings className="text-gray-600 mb-2" size={24} />
                <span className="text-sm font-medium text-gray-600">Settings</span>
              </Link>
            </div>
          </div>

          {/* Products Management */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <h2 className="text-lg font-semibold text-gray-900">My Products</h2>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  {/* Search */}
                  <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  {/* Filter */}
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="all">All Products</option>
                    <option value="active">Active</option>
                    <option value="sold">Sold</option>
                    <option value="draft">Draft</option>
                  </select>

                  {/* Sort */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="price_high">Price: High to Low</option>
                    <option value="price_low">Price: Low to High</option>
                    <option value="views">Most Viewed</option>
                  </select>

                  {/* View Mode */}
                  <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 transition-colors ${
                        viewMode === 'grid' 
                          ? 'bg-primary-500 text-white' 
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <FiGrid size={16} />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 transition-colors ${
                        viewMode === 'list' 
                          ? 'bg-primary-500 text-white' 
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <FiList size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Products List */}
            <div className="p-6">
              {filteredProducts.length > 0 ? (
                <div className={
                  viewMode === 'grid' 
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' 
                    : 'space-y-4'
                }>
                  {filteredProducts.map(product => (
                    <motion.div
                      key={product._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={
                        viewMode === 'list' 
                          ? 'flex bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors'
                          : 'bg-gray-50 rounded-lg overflow-hidden hover:shadow-md transition-shadow'
                      }
                    >
                      {viewMode === 'list' && (
                        <div className="flex-shrink-0 w-20 h-20 mr-4">
                          <img
                            src={product.images?.[0]?.url || '/placeholder-image.jpg'}
                            alt={product.title}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>
                      )}

                      <div className={viewMode === 'list' ? 'flex-1' : 'p-4'}>
                        {viewMode === 'grid' && (
                          <div className="aspect-square mb-4">
                            <img
                              src={product.images?.[0]?.url || '/placeholder-image.jpg'}
                              alt={product.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}

                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 truncate">
                              {product.title}
                            </h3>
                            <p className="text-green-600 font-bold">₹{product.price}</p>
                          </div>
                          
                          <div className="flex items-center space-x-1 ml-2">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              product.status === 'available' 
                                ? 'bg-green-100 text-green-800'
                                : product.status === 'sold'
                                ? 'bg-gray-100 text-gray-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {product.status}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center text-sm text-gray-500 mb-3">
                          <FiEye className="mr-1" size={14} />
                          <span className="mr-4">{product.views || 0} views</span>
                          <span>{formatDistanceToNow(new Date(product.createdAt))} ago</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Link
                              to={`/products/${product._id}`}
                              className="text-primary-600 hover:text-primary-700"
                              title="View Product"
                            >
                              <FiEye size={16} />
                            </Link>
                            
                            <Link
                              to={`/products/${product._id}/edit`}
                              className="text-blue-600 hover:text-blue-700"
                              title="Edit Product"
                            >
                              <FiEdit3 size={16} />
                            </Link>
                            
                            <button
                              onClick={() => handleDeleteProduct(product._id)}
                              className="text-red-600 hover:text-red-700"
                              title="Delete Product"
                            >
                              <FiTrash2 size={16} />
                            </button>
                          </div>

                          <div className="flex items-center space-x-2">
                            {product.status === 'available' ? (
                              <button
                                onClick={() => handleMarkAsSold(product._id)}
                                className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full transition-colors"
                              >
                                Mark as Sold
                              </button>
                            ) : product.status === 'sold' ? (
                              <button
                                onClick={() => handleMarkAsAvailable(product._id)}
                                className="text-xs bg-green-100 hover:bg-green-200 text-green-700 px-3 py-1 rounded-full transition-colors"
                              >
                                Mark Available
                              </button>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FiGrid className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {searchTerm || filter !== 'all' ? 'No products found' : 'No products yet'}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {searchTerm || filter !== 'all' 
                      ? 'Try adjusting your search or filter criteria.'
                      : 'Start by listing your first product for sale.'
                    }
                  </p>
                  <Link to="/create-product" className="btn-primary">
                    List Your First Item
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Dashboard