import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HeartIcon, 
  ClockIcon,
  UserIcon,
  MapPinIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'react-hot-toast';
import { getWishlistMatches } from '../../services/wishlistAPI';

const WishlistMatches = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likedProducts, setLikedProducts] = useState(new Set());

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const data = await getWishlistMatches();
      setMatches(data.matches || []);
    } catch (error) {
      console.error('Error fetching matches:', error);
      toast.error('Failed to load wishlist matches');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = (productId) => {
    setLikedProducts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
        toast.success('Removed from favorites');
      } else {
        newSet.add(productId);
        toast.success('Added to favorites');
      }
      return newSet;
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Wishlist Matches</h3>
        <div className="flex items-center justify-center py-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Wishlist Matches
            {matches.length > 0 && (
              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {matches.length} {matches.length === 1 ? 'match' : 'matches'}
              </span>
            )}
          </h3>
          <button
            onClick={fetchMatches}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="p-6">
        {matches.length === 0 ? (
          <div className="text-center py-8">
            <XCircleIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No matches found</h4>
            <p className="text-gray-600">
              Add more keywords to your wishlist or check back later for new products!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatePresence>
              {matches.map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex space-x-4">
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={product.images[0].url}
                          alt={product.title}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                          <span className="text-gray-400 text-xs">No Image</span>
                        </div>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <h4 className="text-sm font-semibold text-gray-900 truncate">
                          {product.title}
                        </h4>
                        <button
                          onClick={() => handleLike(product._id)}
                          className="ml-2 p-1 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          {likedProducts.has(product._id) ? (
                            <HeartSolidIcon className="h-4 w-4 text-red-500" />
                          ) : (
                            <HeartIcon className="h-4 w-4" />
                          )}
                        </button>
                      </div>

                      <p className="text-lg font-bold text-green-600 mt-1">
                        ₹{product.price.toLocaleString()}
                      </p>

                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <UserIcon className="h-3 w-3" />
                          <span>{product.seller?.name}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPinIcon className="h-3 w-3" />
                          <span>{product.seller?.college}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-1 mt-1 text-xs text-gray-400">
                        <ClockIcon className="h-3 w-3" />
                        <span>
                          {formatDistanceToNow(new Date(product.createdAt), { addSuffix: true })}
                        </span>
                      </div>

                      <div className="mt-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {product.category}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistMatches;