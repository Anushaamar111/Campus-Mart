import React from 'react'
import { Link } from 'react-router-dom'
import { FiGithub, FiTwitter, FiMail, FiHeart } from 'react-icons/fi'

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CM</span>
              </div>
              <span className="text-xl font-bold">CampusMart</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Your campus marketplace connecting students to buy and sell used items at affordable prices. 
              Built by students, for students.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Browse Products
                </Link>
              </li>
              <li>
                <Link to="/create-product" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Sell Item
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/products?category=Books" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Books
                </Link>
              </li>
              <li>
                <Link to="/products?category=Electronics" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Electronics
                </Link>
              </li>
              <li>
                <Link to="/products?category=Hostel Essentials" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Hostel Essentials
                </Link>
              </li>
              <li>
                <Link to="/products?category=Sports Equipment" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Sports Equipment
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer