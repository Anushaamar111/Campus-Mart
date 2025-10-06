import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { 
  ArrowLeftIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  UserIcon,
  CalendarIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { formatDistanceToNow } from 'date-fns';

import { productsAPI } from '../services/api';

const InterestedUsers = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [interestedUsers, setInterestedUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProductAndUsers();
  }, [productId]);

  const fetchProductAndUsers = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getById(productId);
      const productData = response.data.product;
      setProduct(productData);
      setInterestedUsers(productData.interestedUsers || []);
    } catch (error) {
      console.error('Error fetching product data:', error);
      toast.error('Failed to load interested users');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Interested Users - CampusMart</title>
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

  if (!product) {
    return (
      <>
        <Helmet>
          <title>Product Not Found - CampusMart</title>
        </Helmet>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
            <Link
              to="/my-products"
              className="text-purple-600 hover:text-purple-700 font-medium"
            >
              Back to My Products
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Interested Users - {product.title} - CampusMart</title>
      </Helmet>
      
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Link
              to="/my-products"
              className="inline-flex items-center space-x-2 text-purple-600 hover:text-purple-700 font-medium mb-4"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              <span>Back to My Products</span>
            </Link>
            
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-start space-x-4">
                <div className="w-20 h-20 flex-shrink-0">
                  {product.images?.[0] ? (
                    <img
                      src={product.images[0].url}
                      alt={product.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                      <UserIcon className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Interested Users for "{product.title}"
                  </h1>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span className="font-semibold text-purple-600">
                      ₹{product.price.toLocaleString()}
                    </span>
                    <span>•</span>
                    <span>{product.category}</span>
                    <span>•</span>
                    <span className={product.isSold ? 'text-red-600' : 'text-green-600'}>
                      {product.isSold ? 'Sold' : 'Available'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Interested Users List */}
          {interestedUsers.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <UserIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No interested users yet
              </h3>
              <p className="text-gray-600">
                When users express interest in this product, they'll appear here.
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {interestedUsers.length} Interested {interestedUsers.length === 1 ? 'User' : 'Users'}
              </h2>
              
              {interestedUsers.map((user, index) => (
                <motion.div
                  key={user._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                        <UserIcon className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {user.name}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                          {user.email && (
                            <div className="flex items-center space-x-1">
                              <EnvelopeIcon className="h-4 w-4" />
                              <span>{user.email}</span>
                            </div>
                          )}
                          {user.phone && (
                            <div className="flex items-center space-x-1">
                              <PhoneIcon className="h-4 w-4" />
                              <span>{user.phone}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="flex items-center space-x-1 text-sm text-gray-500">
                        <ClockIcon className="h-4 w-4" />
                        <span>
                          {formatDistanceToNow(new Date(user.interestedAt || user.createdAt), { 
                            addSuffix: true 
                          })}
                        </span>
                      </div>
                      
                      <div className="flex space-x-2 mt-3">
                        {user.email && (
                          <a
                            href={`mailto:${user.email}`}
                            className="inline-flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
                          >
                            <EnvelopeIcon className="h-4 w-4" />
                            <span>Email</span>
                          </a>
                        )}
                        {user.phone && (
                          <a
                            href={`tel:${user.phone}`}
                            className="inline-flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium"
                          >
                            <PhoneIcon className="h-4 w-4" />
                            <span>Call</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
};

export default InterestedUsers;