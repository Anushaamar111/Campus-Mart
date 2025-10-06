import React, { useState, useRef, useEffect } from 'react'
import { FiSearch, FiX, FiClock, FiTrendingUp } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'

const SearchBar = ({ 
  onSearch, 
  initialValue = '', 
  placeholder = "Search products...", 
  showSuggestions = true 
}) => {
  const [query, setQuery] = useState(initialValue)
  const [showDropdown, setShowDropdown] = useState(false)
  const [recentSearches, setRecentSearches] = useState([])
  const [trendingSearches] = useState([
    'iPhone', 'MacBook', 'Textbooks', 'Cycle', 'Hostel Furniture',
    'Study Table', 'Headphones', 'Calculator', 'Laboratory Equipment'
  ])
  const searchRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    // Load recent searches from localStorage
    const saved = localStorage.getItem('campusmart_recent_searches')
    if (saved) {
      setRecentSearches(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (query.trim()) {
      performSearch(query.trim())
    }
  }

  const performSearch = (searchQuery) => {
    // Add to recent searches
    const updatedRecent = [
      searchQuery,
      ...recentSearches.filter(s => s !== searchQuery)
    ].slice(0, 5)
    
    setRecentSearches(updatedRecent)
    localStorage.setItem('campusmart_recent_searches', JSON.stringify(updatedRecent))
    
    // Perform search
    onSearch(searchQuery)
    setShowDropdown(false)
    inputRef.current?.blur()
  }

  const clearSearch = () => {
    setQuery('')
    onSearch('')
    inputRef.current?.focus()
  }

  const clearRecentSearches = () => {
    setRecentSearches([])
    localStorage.removeItem('campusmart_recent_searches')
  }

  const handleInputChange = (e) => {
    setQuery(e.target.value)
    setShowDropdown(true)
  }

  const handleInputFocus = () => {
    setShowDropdown(true)
  }

  const suggestionVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 }
  }

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <FiSearch 
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" 
            size={20} 
          />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            placeholder={placeholder}
            className="w-full pl-12 pr-12 py-4 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent shadow-sm"
          />
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FiX size={20} />
            </button>
          )}
        </div>
        
        <button
          type="submit"
          className="absolute right-2 top-2 bottom-2 px-6 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium"
        >
          Search
        </button>
      </form>

      {/* Search Suggestions */}
      <AnimatePresence>
        {showSuggestions && showDropdown && (
          <motion.div
            variants={suggestionVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-lg mt-2 z-50 max-h-96 overflow-y-auto"
          >
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <FiClock size={16} />
                    Recent Searches
                  </h3>
                  <button
                    onClick={clearRecentSearches}
                    className="text-xs text-gray-500 hover:text-gray-700"
                  >
                    Clear
                  </button>
                </div>
                <div className="space-y-1">
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setQuery(search)
                        performSearch(search)
                      }}
                      className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Trending Searches */}
            <div className="p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                <FiTrendingUp size={16} />
                Trending Searches
              </h3>
              <div className="grid grid-cols-2 gap-1">
                {trendingSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setQuery(search)
                      performSearch(search)
                    }}
                    className="text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="p-4 border-t border-gray-100 bg-gray-50">
              <div className="flex flex-wrap gap-2">
                <span className="text-xs text-gray-500">Quick filters:</span>
                {['New', 'Under ₹500', 'Books', 'Electronics'].map((filter, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      const searchTerm = filter.startsWith('Under') ? '' : filter
                      setQuery(searchTerm)
                      performSearch(searchTerm)
                    }}
                    className="px-2 py-1 text-xs bg-white border border-gray-200 rounded-full hover:border-primary-300 hover:text-primary-600 transition-colors"
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default SearchBar