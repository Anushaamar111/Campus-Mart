import React, { useState, useEffect } from 'react'
import { useQuery } from 'react-query'
import { Link, useSearchParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { FiFilter, FiGrid, FiList, FiRefreshCw } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import { productsAPI } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'
import ProductCard from '../components/ProductCard'
import FilterPanel from '../components/FilterPanel'
import SearchBar from '../components/SearchBar'


const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [viewMode, setViewMode] = useState('grid')
  const [showFilters, setShowFilters] = useState(false)
 

  // Get query parameters
  const page = parseInt(searchParams.get('page')) || 1
  const search = searchParams.get('search') || ''
  const category = searchParams.get('category') || ''
  const condition = searchParams.get('condition') || ''
  const minPrice = searchParams.get('minPrice') || ''
  const maxPrice = searchParams.get('maxPrice') || ''
  const sort = searchParams.get('sort') || 'newest'
  const location = searchParams.get('location') || ''
  const college = searchParams.get('college') || ''
  const dateRange = searchParams.get('dateRange') || ''
  const availability = searchParams.get('availability') || ''
  const minRating = searchParams.get('minRating') || ''
  const hasImages = searchParams.get('hasImages') === 'true'

  // Combine all filters for easy passing
  const filters = {
    search, category, condition, minPrice, maxPrice, 
    location, college, dateRange, availability, minRating, hasImages
  }

  // Fetch products
  const { data, isLoading, error, refetch } = useQuery(
    ['products', { page, ...filters, sort }],
    () => productsAPI.getAll({
      page,
      ...filters,
      sort,
      limit: viewMode === 'grid' ? 12 : 8
    }),
    {
      keepPreviousData: true,
      staleTime: 2 * 60 * 1000, // 2 minutes
      refetchOnWindowFocus: false,
    }
  )

  const products = data?.data?.products || []
  const pagination = data?.data?.pagination || {}

  const categories = [
    'Books',
    'Electronics',
    'Hostel Essentials',
    'Stationery',
    'Sports Equipment',
    'Clothing',
    'Furniture',
    'Laboratory Equipment',
    'Musical Instruments',
    'Other'
  ]

  const conditions = ['New', 'Like New', 'Good', 'Fair', 'Poor']

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'price_low', label: 'Price: Low to High' },
    { value: 'price_high', label: 'Price: High to Low' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'distance', label: 'Nearest First' }
  ]

  const updateSearchParams = (updates) => {
    const newParams = new URLSearchParams(searchParams)
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value)
      } else {
        newParams.delete(key)
      }
    })
    // Reset to page 1 when filters change
    if (Object.keys(updates).some(key => key !== 'page')) {
      newParams.set('page', '1')
    }
    setSearchParams(newParams)
  }

  const clearFilters = () => {
    setSearchParams({})
  }

  const handleSearch = (searchQuery) => {
    updateSearchParams({ search: searchQuery })
  }

  const handleWishlistToggle = (productId, isAdded) => {
    // Optionally refetch or update local state
    // Could implement optimistic updates here
  }

  // Load view mode preference
  useEffect(() => {
    const savedViewMode = localStorage.getItem('campusmart_view_mode')
    if (savedViewMode && ['grid', 'list'].includes(savedViewMode)) {
      setViewMode(savedViewMode)
    }
  }, [])

  // Save view mode preference
  useEffect(() => {
    localStorage.setItem('campusmart_view_mode', viewMode)
  }, [viewMode])

  if (error) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Error Loading Products</h2>
        <p className="text-gray-600 mb-8">Something went wrong. Please try again later.</p>
        <button 
          onClick={() => window.location.reload()} 
          className="btn-primary"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>Browse Products - CampusMart</title>
        <meta name="description" content="Browse and search products from fellow college students. Find textbooks, electronics, hostel essentials and more." />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Browse Products</h1>
              <p className="text-gray-600">Discover amazing deals from fellow students</p>
            </div>
            
            <div className="flex items-center gap-3 mt-4 lg:mt-0">
              <button
                onClick={() => refetch()}
                className="btn-secondary flex items-center gap-2"
                disabled={isLoading}
              >
                <FiRefreshCw className={isLoading ? 'animate-spin' : ''} size={16} />
                Refresh
              </button>
              
              <Link to="/create-product" className="btn-primary">
                List Your Item
              </Link>
            </div>
          </div>
          
          {/* Enhanced Search Bar */}
          <div className="mb-6">
            <SearchBar
              onSearch={handleSearch}
              initialValue={search}
              placeholder="Search for books, electronics, furniture..."
            />
          </div>

          {/* Controls Bar */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  showFilters 
                    ? 'bg-primary-500 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <FiFilter size={16} />
                Filters
              </button>
            
              {Object.values(filters).some(v => v) && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  Clear all filters
                </button>
              )}
            </div>

            <div className="flex items-center gap-4">
              {/* Sort Dropdown */}
              <select
                value={sort}
                onChange={(e) => updateSearchParams({ sort: e.target.value })}
                className="input-field py-2 min-w-[180px]"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              {/* View Mode Toggle */}
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-3 transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-primary-500 text-white' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                  title="Grid View"
                >
                  <FiGrid size={16} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-3 transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-primary-500 text-white' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                  title="List View"
                >
                  <FiList size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <FilterPanel
              filters={filters}
              updateFilters={updateSearchParams}
              clearFilters={clearFilters}
              categories={categories}
              conditions={conditions}
              colleges={colleges}
            />
          )}
        </AnimatePresence>

        {/* Products Section */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <LoadingSpinner />
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Loading products...</h3>
              <p className="text-gray-600">Finding the best deals for you</p>
            </div>
          </div>
        ) : products.length > 0 ? (
          <>
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 bg-white p-4 rounded-lg shadow-sm">
              <div>
                <p className="text-lg font-medium text-gray-900">
                  {pagination.totalProducts} product{pagination.totalProducts !== 1 ? 's' : ''} found
                  {search && (
                    <span className="text-primary-600"> for "{search}"</span>
                  )}
                </p>
                <p className="text-sm text-gray-600">
                  Showing {((page - 1) * (viewMode === 'grid' ? 12 : 8)) + 1} - {Math.min(page * (viewMode === 'grid' ? 12 : 8), pagination.totalProducts)} of {pagination.totalProducts}
                </p>
              </div>
              
              {products.length > 1 && (
                <div className="mt-3 sm:mt-0">
                  <p className="text-sm text-gray-600">
                    Page {page} of {pagination.totalPages}
                  </p>
                </div>
              )}
            </div>

            {/* Products Grid/List */}
            <motion.div
              layout
              className={
                viewMode === 'grid' 
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
                  : 'space-y-6'
              }
            >
              <AnimatePresence>
                {products.map((product, index) => (
                  <motion.div
                    key={product._id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ 
                      opacity: 1, 
                      y: 0,
                      transition: { delay: index * 0.05 }
                    }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <ProductCard
                      product={product}
                      viewMode={viewMode}
                      onWishlistToggle={handleWishlistToggle}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center items-center mt-12 space-x-2">
                <button
                  onClick={() => updateSearchParams({ page: page - 1 })}
                  disabled={!pagination.hasPrev}
                  className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                {/* Page Numbers */}
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  const pageNum = Math.max(1, Math.min(
                    pagination.totalPages - 4,
                    Math.max(1, page - 2)
                  )) + i;
                  
                  if (pageNum <= pagination.totalPages) {
                    return (
                      <button
                        key={pageNum}
                        onClick={() => updateSearchParams({ page: pageNum })}
                        className={`px-3 py-2 rounded-lg ${
                          pageNum === page
                            ? 'bg-primary-500 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  }
                  return null;
                })}

                <button
                  onClick={() => updateSearchParams({ page: page + 1 })}
                  disabled={!pagination.hasNext}
                  className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">No Products Found</h2>
            <p className="text-gray-600 mb-8">
              {search || category || condition || minPrice || maxPrice 
                ? 'Try adjusting your search filters.'
                : 'Be the first to list a product!'
              }
            </p>
            {search || category || condition || minPrice || maxPrice ? (
              <button onClick={clearFilters} className="btn-secondary mr-4">
                Clear Filters
              </button>
            ) : null}
            <Link to="/create-product" className="btn-primary">
              List Your Item
            </Link>
          </div>
        )}
      </div>


    </>
  )
}

export default Products