import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ClockIcon,
  HeartIcon,
  EyeIcon,
  XCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'react-hot-toast';
import { getMatchHistory } from '../../services/wishlistAPI';

const MatchHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [filter, setFilter] = useState('all'); // all, read, unread

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const data = await getMatchHistory();
      setHistory(data.matchHistory || []);
    } catch (error) {
      console.error('Error fetching history:', error);
      toast.error('Failed to load match history');
    } finally {
      setLoading(false);
    }
  };

  const filteredHistory = history.filter(item => {
    if (filter === 'read') return item.isRead;
    if (filter === 'unread') return !item.isRead;
    return true;
  });

  const displayedHistory = expanded ? filteredHistory : filteredHistory.slice(0, 5);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Match History</h3>
        <div className="flex items-center justify-center py-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="h-6 w-6 border-2 border-purple-500 border-t-transparent rounded-full"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Match History
            {history.length > 0 && (
              <span className="ml-2 text-sm font-normal text-gray-500">
                ({filteredHistory.length} {filteredHistory.length === 1 ? 'match' : 'matches'})
              </span>
            )}
          </h3>
          <button
            onClick={fetchHistory}
            className="text-sm text-purple-600 hover:text-purple-700 font-medium"
          >
            Refresh
          </button>
        </div>

        {/* Filter Buttons */}
        {history.length > 0 && (
          <div className="flex space-x-2">
            {[
              { id: 'all', label: 'All', count: history.length },
              { id: 'unread', label: 'Unread', count: history.filter(h => !h.isRead).length },
              { id: 'read', label: 'Read', count: history.filter(h => h.isRead).length }
            ].map((filterOption) => (
              <button
                key={filterOption.id}
                onClick={() => setFilter(filterOption.id)}
                className={`
                  px-3 py-1 rounded-full text-xs font-medium transition-colors
                  ${filter === filterOption.id
                    ? 'bg-purple-100 text-purple-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }
                `}
              >
                {filterOption.label} ({filterOption.count})
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="p-6">
        {filteredHistory.length === 0 ? (
          <div className="text-center py-8">
            <XCircleIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              {filter === 'all' ? 'No matches yet' : `No ${filter} matches`}
            </h4>
            <p className="text-gray-600">
              {filter === 'all' 
                ? 'When products matching your wishlist are found, they\'ll appear here.'
                : `Try changing the filter to see ${filter === 'read' ? 'unread' : 'read'} matches.`
              }
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              <AnimatePresence>
                {displayedHistory.map((item, index) => (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className={`
                      p-4 rounded-lg border-l-4 transition-all
                      ${item.isRead 
                        ? 'bg-gray-50 border-l-gray-300' 
                        : 'bg-purple-50 border-l-purple-500'
                      }
                    `}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <HeartIcon className="h-4 w-4 text-purple-500" />
                          <span className="text-sm font-medium text-gray-900">
                            Wishlist Match
                          </span>
                          {!item.isRead && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              New
                            </span>
                          )}
                        </div>

                        <p className={`text-sm ${item.isRead ? 'text-gray-600' : 'text-gray-900'}`}>
                          {item.message}
                        </p>

                        {/* Product Info if available */}
                        {item.productId && (
                          <div className="mt-3 p-3 bg-white rounded-lg border">
                            <div className="flex items-center space-x-3">
                              {item.productId.images && item.productId.images.length > 0 && (
                                <img
                                  src={item.productId.images[0].url}
                                  alt={item.productId.title}
                                  className="w-12 h-12 rounded-lg object-cover"
                                />
                              )}
                              <div className="flex-1">
                                <h4 className="text-sm font-medium text-gray-900">
                                  {item.productId.title}
                                </h4>
                                <p className="text-sm font-semibold text-green-600">
                                  ₹{item.productId.price?.toLocaleString()}
                                </p>
                                {item.productId.seller && (
                                  <p className="text-xs text-gray-500">
                                    by {item.productId.seller.name}
                                  </p>
                                )}
                              </div>
                              <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                                <EyeIcon className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        )}

                        <div className="flex items-center space-x-1 mt-3 text-xs text-gray-400">
                          <ClockIcon className="h-3 w-3" />
                          <span>
                            {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Show More/Less Button */}
            {filteredHistory.length > 5 && (
              <div className="text-center mt-6">
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="inline-flex items-center space-x-2 px-4 py-2 text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors"
                >
                  <span>
                    {expanded ? 'Show Less' : `Show ${filteredHistory.length - 5} More`}
                  </span>
                  {expanded ? (
                    <ChevronUpIcon className="h-4 w-4" />
                  ) : (
                    <ChevronDownIcon className="h-4 w-4" />
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MatchHistory;