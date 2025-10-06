import React, { useState } from 'react'
import { FiChevronDown, FiX, FiSliders } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'

const FilterPanel = ({
  filters,
  updateFilters,
  clearFilters,
  categories,
  conditions,
  colleges = []
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [priceRange, setPriceRange] = useState({
    min: filters.minPrice || '',
    max: filters.maxPrice || ''
  })

  const handlePriceChange = (field, value) => {
    const newRange = { ...priceRange, [field]: value }
    setPriceRange(newRange)
    updateFilters({ 
      minPrice: newRange.min, 
      maxPrice: newRange.max 
    })
  }

  const getActiveFiltersCount = () => {
    return Object.values(filters).filter(value => value && value !== '').length
  }

  const hasActiveFilters = getActiveFiltersCount() > 0

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-md p-6 mb-8"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FiSliders className="text-primary-500" size={20} />
          <h3 className="text-lg font-semibold text-gray-900">
            Filters
            {hasActiveFilters && (
              <span className="ml-2 bg-primary-100 text-primary-600 text-sm px-2 py-1 rounded-full">
                {getActiveFiltersCount()}
              </span>
            )}
          </h3>
        </div>
        
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700 transition-colors"
          >
            <FiX size={16} />
            Clear All
          </button>
        )}
      </div>

      {/* Basic Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            value={filters.category || ''}
            onChange={(e) => updateFilters({ category: e.target.value })}
            className="input-field"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Condition */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Condition
          </label>
          <select
            value={filters.condition || ''}
            onChange={(e) => updateFilters({ condition: e.target.value })}
            className="input-field"
          >
            <option value="">All Conditions</option>
            {conditions.map(condition => (
              <option key={condition} value={condition}>
                {condition}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Min Price (₹)
          </label>
          <input
            type="number"
            value={priceRange.min}
            onChange={(e) => handlePriceChange('min', e.target.value)}
            placeholder="0"
            className="input-field"
            min="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Max Price (₹)
          </label>
          <input
            type="number"
            value={priceRange.max}
            onChange={(e) => handlePriceChange('max', e.target.value)}
            placeholder="No limit"
            className="input-field"
            min="0"
          />
        </div>
      </div>

      {/* Advanced Filters Toggle */}
      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="flex items-center gap-2 text-primary-600 hover:text-primary-700 text-sm font-medium mb-4"
      >
        <FiChevronDown 
          className={`transform transition-transform ${showAdvanced ? 'rotate-180' : ''}`}
          size={16}
        />
        Advanced Filters
      </button>

      {/* Advanced Filters */}
      <AnimatePresence>
        {showAdvanced && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={filters.location || ''}
                  onChange={(e) => updateFilters({ location: e.target.value })}
                  placeholder="Enter location"
                  className="input-field"
                />
              </div>

              {/* College Filter */}
              {colleges.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    College
                  </label>
                  <select
                    value={filters.college || ''}
                    onChange={(e) => updateFilters({ college: e.target.value })}
                    className="input-field"
                  >
                    <option value="">All Colleges</option>
                    {colleges.map(college => (
                      <option key={college} value={college}>
                        {college}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Date Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Listed In
                </label>
                <select
                  value={filters.dateRange || ''}
                  onChange={(e) => updateFilters({ dateRange: e.target.value })}
                  className="input-field"
                >
                  <option value="">Any Time</option>
                  <option value="1">Last 24 hours</option>
                  <option value="7">Last 7 days</option>
                  <option value="30">Last 30 days</option>
                  <option value="90">Last 3 months</option>
                </select>
              </div>

              {/* Availability */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Availability
                </label>
                <select
                  value={filters.availability || ''}
                  onChange={(e) => updateFilters({ availability: e.target.value })}
                  className="input-field"
                >
                  <option value="">All Items</option>
                  <option value="available">Available Only</option>
                  <option value="negotiable">Price Negotiable</option>
                </select>
              </div>

              {/* Seller Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Seller Rating
                </label>
                <select
                  value={filters.minRating || ''}
                  onChange={(e) => updateFilters({ minRating: e.target.value })}
                  className="input-field"
                >
                  <option value="">Any Rating</option>
                  <option value="4">4+ Stars</option>
                  <option value="3">3+ Stars</option>
                  <option value="2">2+ Stars</option>
                </select>
              </div>

              {/* Has Images Only */}
              <div className="flex items-center">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.hasImages || false}
                    onChange={(e) => updateFilters({ hasImages: e.target.checked })}
                    className="mr-2 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">Items with images only</span>
                </label>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Filter Tags */}
      {hasActiveFilters && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-3">Active filters:</p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(filters).map(([key, value]) => {
              if (!value || value === '') return null
              
              let displayValue = value
              if (key === 'minPrice') displayValue = `Min: ₹${value}`
              if (key === 'maxPrice') displayValue = `Max: ₹${value}`
              if (key === 'dateRange') {
                const labels = { '1': '24h', '7': '7d', '30': '30d', '90': '3m' }
                displayValue = labels[value] || value
              }
              
              return (
                <span
                  key={key}
                  className="inline-flex items-center gap-1 bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm"
                >
                  {displayValue}
                  <button
                    onClick={() => updateFilters({ [key]: '' })}
                    className="hover:text-primary-900"
                  >
                    <FiX size={14} />
                  </button>
                </span>
              )
            })}
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default FilterPanel