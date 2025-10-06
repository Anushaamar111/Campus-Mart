import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FiMenu, FiX, FiUser, FiShoppingBag, FiHeart, FiBell, FiLogOut, FiPlus } from 'react-icons/fi'
import { useQuery } from 'react-query'
import { notificationsAPI } from '../services/api'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // Get unread notifications count
  const { data: unreadData } = useQuery(
    'unreadNotifications',
    notificationsAPI.getUnreadCount,
    {
      enabled: !!user,
      refetchInterval: 30000, // Refetch every 30 seconds
    }
  )

  const unreadCount = unreadData?.data?.unreadCount || 0

  const isActive = (path) => location.pathname === path

  const handleLogout = () => {
    logout()
    navigate('/')
    setIsProfileDropdownOpen(false)
  }

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">CM</span>
            </div>
            <span className="text-xl font-bold text-gray-800">CampusMart</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors duration-200 ${
                isActive('/') ? 'text-primary-600' : 'text-gray-700 hover:text-primary-600'
              }`}
            >
              Home
            </Link>
            <Link
              to="/products"
              className={`text-sm font-medium transition-colors duration-200 ${
                isActive('/products') ? 'text-primary-600' : 'text-gray-700 hover:text-primary-600'
              }`}
            >
              Browse Products
            </Link>

            {user ? (
              <>
                <Link
                  to="/create-product"
                  className="btn-primary flex items-center space-x-2"
                >
                  <FiPlus size={16} />
                  <span>Sell Item</span>
                </Link>

                {/* Notifications */}
                <Link
                  to="/notifications"
                  className="relative p-2 text-gray-700 hover:text-primary-600 transition-colors duration-200"
                >
                  <FiBell size={20} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors duration-200"
                  >
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <FiUser size={16} className="text-primary-600" />
                    </div>
                    <span className="text-sm font-medium">{user.name}</span>
                  </button>

                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                      <Link
                        to="/profile"
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <FiUser className="mr-3" size={16} />
                        Profile
                      </Link>
                      <Link
                        to="/my-products"
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <FiShoppingBag className="mr-3" size={16} />
                        My Products
                      </Link>
                      <Link
                        to="/wishlist"
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <FiHeart className="mr-3" size={16} />
                        Wishlist
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <FiLogOut className="mr-3" size={16} />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn-primary"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-primary-600 transition-colors duration-200"
            >
              {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className={`block px-3 py-2 text-base font-medium transition-colors duration-200 ${
                  isActive('/') ? 'text-primary-600' : 'text-gray-700 hover:text-primary-600'
                }`}
              >
                Home
              </Link>
              <Link
                to="/products"
                onClick={() => setIsMenuOpen(false)}
                className={`block px-3 py-2 text-base font-medium transition-colors duration-200 ${
                  isActive('/products') ? 'text-primary-600' : 'text-gray-700 hover:text-primary-600'
                }`}
              >
                Browse Products
              </Link>

              {user ? (
                <>
                  <Link
                    to="/create-product"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-3 py-2 text-base font-medium text-primary-600"
                  >
                    Sell Item
                  </Link>
                  <Link
                    to="/notifications"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600"
                  >
                    <FiBell className="mr-2" size={16} />
                    Notifications
                    {unreadCount > 0 && (
                      <span className="ml-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600"
                  >
                    Profile
                  </Link>
                  <Link
                    to="/my-products"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600"
                  >
                    My Products
                  </Link>
                  <Link
                    to="/wishlist"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600"
                  >
                    Wishlist
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-3 py-2 text-base font-medium text-primary-600"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar