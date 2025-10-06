import React from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useQuery } from 'react-query'
import { FiArrowRight, FiShoppingBag, FiUsers, FiStar, FiTrendingUp } from 'react-icons/fi'
import { productsAPI } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'

const Home = () => {
  // Fetch recent products for homepage
  const { data: recentProducts, isLoading } = useQuery(
    'recentProducts',
    () => productsAPI.getAll({ limit: 8, sort: 'newest' }),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  )

  const features = [
    {
      icon: <FiShoppingBag className="w-8 h-8 text-primary-500" />,
      title: 'Buy & Sell Easily',
      description: 'Find great deals on textbooks, electronics, and more from fellow students.'
    },
    {
      icon: <FiUsers className="w-8 h-8 text-primary-500" />,
      title: 'Student Community',
      description: 'Connect with students from your college and nearby campuses.'
    },
    {
      icon: <FiStar className="w-8 h-8 text-primary-500" />,
      title: 'Smart Wishlist',
      description: 'Get notified when items matching your wishlist are posted.'
    },
    {
      icon: <FiTrendingUp className="w-8 h-8 text-primary-500" />,
      title: 'Best Prices',
      description: 'Save money by buying from seniors and selling to juniors.'
    }
  ]

  const categories = [
    { name: 'Books', emoji: '📚' },
    { name: 'Electronics', emoji: '💻' },
    { name: 'Hostel Essentials', emoji: '🏠' },
    { name: 'Sports Equipment', emoji: '⚽' },
    { name: 'Stationery', emoji: '✏️' },
    { name: 'Clothing', emoji: '👕' }
  ]

  return (
    <>
      <Helmet>
        <title>CampusMart - College Student Marketplace</title>
        <meta name="description" content="Buy and sell used items with fellow college students. Find textbooks, electronics, hostel essentials and more at affordable prices." />
      </Helmet>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Your Campus
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-secondary-500">
                {' '}Marketplace
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Connect with fellow students to buy and sell used items at unbeatable prices. 
              From textbooks to electronics, find everything you need for college life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/products"
                className="btn-primary text-lg px-8 py-3 inline-flex items-center justify-center"
              >
                Browse Products
                <FiArrowRight className="ml-2" size={20} />
              </Link>
              <Link
                to="/register"
                className="btn-secondary text-lg px-8 py-3 inline-flex items-center justify-center"
              >
                Join CampusMart
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose CampusMart?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We make it easy for students to connect, trade, and save money on college essentials.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow duration-300">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Shop by Category
            </h2>
            <p className="text-xl text-gray-600">
              Find exactly what you're looking for
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category, index) => (
              <Link
                key={index}
                to={`/products?category=${encodeURIComponent(category.name)}`}
                className="bg-white rounded-lg p-6 text-center hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                <div className="text-4xl mb-3">{category.emoji}</div>
                <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
                <p className="text-sm text-gray-500">{category.count} items</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Products Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Recently Listed
              </h2>
              <p className="text-xl text-gray-600">
                Fresh deals from your fellow students
              </p>
            </div>
            <Link
              to="/products"
              className="btn-secondary hidden md:inline-flex items-center"
            >
              View All
              <FiArrowRight className="ml-2" size={16} />
            </Link>
          </div>

          {isLoading ? (
            <LoadingSpinner message="Loading recent products..." />
          ) : recentProducts?.data?.products?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recentProducts.data.products.map((product) => (
                <div key={product._id} className="product-card">
                  <div className="aspect-w-4 aspect-h-3 bg-gray-200 rounded-t-lg overflow-hidden">
                    {product.images?.[0] ? (
                      <img
                        src={product.images[0].url}
                        alt={product.title}
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                        <span className="text-gray-500 text-sm">No Image</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {product.title}
                    </h3>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl font-bold text-primary-600">
                        ₹{product.price}
                      </span>
                      <span className="badge-info">
                        {product.condition}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      {product.category} • {product.location}
                    </p>
                    <Link
                      to={`/products/${product._id}`}
                      className="w-full btn-primary text-center py-2"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No products available at the moment.</p>
              <Link to="/create-product" className="btn-primary mt-4">
                Be the first to list!
              </Link>
            </div>
          )}

          <div className="text-center mt-8 md:hidden">
            <Link
              to="/products"
              className="btn-secondary inline-flex items-center"
            >
              View All Products
              <FiArrowRight className="ml-2" size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-500 to-secondary-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Start Trading?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of students who are already saving money and decluttering their dorms.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-white text-primary-600 font-medium px-8 py-3 rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              Sign Up Free
            </Link>
            <Link
              to="/create-product"
              className="border-2 border-white text-white font-medium px-8 py-3 rounded-lg hover:bg-white hover:text-primary-600 transition-all duration-300"
            >
              List Your First Item
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

export default Home