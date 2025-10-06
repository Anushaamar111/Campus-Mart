import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  UsersIcon,
  CurrencyRupeeIcon,
  CalendarIcon,
  TagIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';

import { productsAPI } from '../services/api';

const MyProducts = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');
  const [stats, setStats] = useState({
    total: 0,
    available: 0,
    sold: 0,
    totalEarnings: 0
  });

  const statusOptions = [
    { value: 'all', label: 'All Products', icon: TagIcon },
    { value: 'available', label: 'Available', icon: CheckCircleIcon },
    { value: 'sold', label: 'Sold', icon: XCircleIcon }
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'price_high', label: 'Price: High to Low' },
    { value: 'price_low', label: 'Price: Low to High' },
    { value: 'title_asc', label: 'Title: A to Z' },
    { value: 'title_desc', label: 'Title: Z to A' }
  ];

  useEffect(() => {
    fetchMyProducts();
  }, []);

  useEffect(() => {
    filterAndSortProducts();
  }, [products, searchTerm, statusFilter, categoryFilter, sortBy]);

  const fetchMyProducts = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getMyProducts();
      const userProducts = response.data.products || [];
      setProducts(userProducts);
      calculateStats(userProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load your products');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (productList) => {
    const stats = {
      total: productList.length,
      available: productList.filter(p => !p.isSold).length,
      sold: productList.filter(p => p.isSold).length,
      totalEarnings: productList.filter(p => p.isSold).reduce((sum, p) => sum + p.price, 0)
    };
    setStats(stats);
  };

  const filterAndSortProducts = () => {
    let filtered = [...products];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter === 'available') {
      filtered = filtered.filter(product => !product.isSold);
    } else if (statusFilter === 'sold') {
      filtered = filtered.filter(product => product.isSold);
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(product => product.category === categoryFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'price_high':
          return b.price - a.price;
        case 'price_low':
          return a.price - b.price;
        case 'title_asc':
          return a.title.localeCompare(b.title);
        case 'title_desc':
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return;
    }

    try {
      await productsAPI.delete(productId);
      setProducts(products.filter(p => p._id !== productId));
      toast.success('Product deleted successfully');
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

  const handleToggleStatus = async (productId, currentStatus) => {
    try {
      if (currentStatus) {
        await productsAPI.markAsAvailable(productId);
        toast.success('Product marked as available');
      } else {
        await productsAPI.markAsSold(productId);
        toast.success('Product marked as sold');
      }
      
      // Refresh products
      fetchMyProducts();
    } catch (error) {
      console.error('Error updating product status:', error);
      toast.error('Failed to update product status');
    }
  };

  const getConditionColor = (condition) => {
    const colors = {
      'New': 'bg-green-100 text-green-800',
      'Like New': 'bg-blue-100 text-blue-800',
      'Good': 'bg-yellow-100 text-yellow-800',
      'Fair': 'bg-orange-100 text-orange-800',
      'Poor': 'bg-red-100 text-red-800'
    };
    return colors[condition] || 'bg-gray-100 text-gray-800';
  };

  const uniqueCategories = [...new Set(products.map(p => p.category))];

  if (loading) {
    return (
      <>
        <Helmet>
          <title>My Products - CampusMart</title>
        </Helmet>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="h-8 w-8 border-2 border-purple-500 border-t-transparent rounded-full"
          />
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>My Products - CampusMart</title>
      </Helmet>
      
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">My Products</h1>
                <p className="text-gray-600 mt-2">
                  Manage all your product listings in one place
                </p>
              </div>
              <Link
                to="/create-product"
                className="inline-flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
              >
                <PlusIcon className="h-5 w-5" />
                <span>Add Product</span>
              </Link>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          >
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center">
                <TagIcon className="h-8 w-8 text-purple-500" />
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Total Products</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center">
                <CheckCircleIcon className="h-8 w-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Available</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.available}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center">
                <XCircleIcon className="h-8 w-8 text-red-500" />
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Sold</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.sold}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center">
                <CurrencyRupeeIcon className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Total Earnings</p>
                  <p className="text-2xl font-bold text-gray-900">₹{stats.totalEarnings.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Filters and Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-sm border p-6 mb-8"
          >
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search your products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              {/* Category Filter */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                {uniqueCategories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </motion.div>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center py-12"
            >
              <PhotoIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm || statusFilter !== 'all' || categoryFilter !== 'all' 
                  ? 'No products match your filters' 
                  : 'No products yet'
                }
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || statusFilter !== 'all' || categoryFilter !== 'all'
                  ? 'Try adjusting your filters to see more products.'
                  : 'Start selling by adding your first product!'
                }
              </p>
              {(!searchTerm && statusFilter === 'all' && categoryFilter === 'all') && (
                <Link
                  to="/create-product"
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                >
                  <PlusIcon className="h-5 w-5" />
                  <span>Add Your First Product</span>
                </Link>
              )}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence>
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow"
                  >
                    {/* Product Image */}
                    <div className="relative">
                      <div className="aspect-w-16 aspect-h-12 rounded-t-lg overflow-hidden">
                        {product.images?.[0] ? (
                          <img
                            src={product.images[0].url}
                            alt={product.title}
                            className="w-full h-48 object-cover"
                          />
                        ) : (
                          <div className="w-full h-48 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                            <PhotoIcon className="h-12 w-12 text-gray-400" />
                          </div>
                        )}
                      </div>
                      
                      {/* Status Badge */}
                      <div className="absolute top-3 left-3">
                        <span className={`
                          px-2 py-1 rounded-full text-xs font-medium
                          ${product.isSold 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-green-100 text-green-800'
                          }
                        `}>
                          {product.isSold ? 'Sold' : 'Available'}
                        </span>
                      </div>

                      {/* Quick Actions */}
                      <div className="absolute top-3 right-3 flex space-x-1">
                        <Link
                          to={`/products/${product._id}`}
                          className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all"
                          title="View Product"
                        >
                          <EyeIcon className="h-4 w-4 text-gray-700" />
                        </Link>
                        <Link
                          to={`/edit-product/${product._id}`}
                          className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all"
                          title="Edit Product"
                        >
                          <PencilIcon className="h-4 w-4 text-blue-600" />
                        </Link>
                        <button
                          onClick={() => handleDeleteProduct(product._id)}
                          className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all"
                          title="Delete Product"
                        >
                          <TrashIcon className="h-4 w-4 text-red-600" />
                        </button>
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 truncate flex-1">
                          {product.title}
                        </h3>
                        <p className="text-xl font-bold text-purple-600 ml-2">
                          ₹{product.price.toLocaleString()}
                        </p>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {product.description}
                      </p>
                      
                      <div className="flex items-center justify-between mb-3">
                        <span className={`
                          px-2 py-1 rounded-full text-xs font-medium
                          ${getConditionColor(product.condition)}
                        `}>
                          {product.condition}
                        </span>
                        <span className="text-xs text-gray-500">
                          {product.category}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                        <div className="flex items-center space-x-1">
                          <CalendarIcon className="h-3 w-3" />
                          <span>
                            {formatDistanceToNow(new Date(product.createdAt), { addSuffix: true })}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <UsersIcon className="h-3 w-3" />
                          <span>{product.interestedUsers?.length || 0} interested</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleToggleStatus(product._id, product.isSold)}
                          className={`
                            flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                            ${product.isSold
                              ? 'bg-green-100 text-green-700 hover:bg-green-200'
                              : 'bg-red-100 text-red-700 hover:bg-red-200'
                            }
                          `}
                        >
                          Mark as {product.isSold ? 'Available' : 'Sold'}
                        </button>
                        
                        {product.interestedUsers?.length > 0 && (
                          <Link
                            to={`/products/${product._id}/interested-users`}
                            className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors"
                          >
                            View Interest
                          </Link>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
};

export default MyProducts;