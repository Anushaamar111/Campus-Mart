import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';
import {
  BellIcon,
  HeartIcon,
  ShoppingCartIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

const NotificationItem = ({ 
  notification, 
  onMarkAsRead, 
  onDelete 
}) => {
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'wishlist_match':
        return <HeartIcon className="h-5 w-5 text-red-500" />;
      case 'product_sold':
        return <ShoppingCartIcon className="h-5 w-5 text-green-500" />;
      case 'product_interest':
        return <BellIcon className="h-5 w-5 text-blue-500" />;
      case 'system':
        return <ExclamationCircleIcon className="h-5 w-5 text-orange-500" />;
      default:
        return <BellIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'wishlist_match':
        return 'border-l-red-500';
      case 'product_sold':
        return 'border-l-green-500';
      case 'product_interest':
        return 'border-l-blue-500';
      case 'system':
        return 'border-l-orange-500';
      default:
        return 'border-l-gray-300';
    }
  };

  const handleMarkAsRead = () => {
    if (!notification.isRead) {
      onMarkAsRead(notification._id);
    }
  };

  const handleDelete = () => {
    onDelete(notification._id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`
        relative bg-white rounded-lg shadow-sm border-l-4 
        ${getNotificationColor(notification.type)}
        ${notification.isRead ? 'opacity-75' : 'shadow-md'}
        hover:shadow-lg transition-all duration-200
      `}
    >
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            {/* Icon */}
            <div className="flex-shrink-0 mt-1">
              {getNotificationIcon(notification.type)}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <h4 className={`
                  text-sm font-medium 
                  ${notification.isRead ? 'text-gray-600' : 'text-gray-900'}
                `}>
                  {notification.type === 'wishlist_match' && '💖 Wishlist Match!'}
                  {notification.type === 'product_sold' && '🎉 Product Sold!'}
                  {notification.type === 'product_interest' && '👀 Someone\'s Interested!'}
                  {notification.type === 'system' && '📢 System Update'}
                  {!['wishlist_match', 'product_sold', 'product_interest', 'system'].includes(notification.type) && '🔔 Notification'}
                </h4>
                {!notification.isRead && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                )}
              </div>

              <p className={`
                text-sm 
                ${notification.isRead ? 'text-gray-500' : 'text-gray-700'}
                leading-relaxed
              `}>
                {notification.message}
              </p>

              {/* Product info if available */}
              {notification.productId && (
                <div className="mt-2 flex items-center space-x-2">
                  {notification.productId.images?.[0] && (
                    <img
                      src={notification.productId.images[0].url}
                      alt={notification.productId.title}
                      className="w-8 h-8 rounded object-cover"
                    />
                  )}
                  <span className="text-xs text-gray-600 font-medium">
                    {notification.productId.title}
                  </span>
                  <span className="text-xs text-green-600 font-semibold">
                    ₹{notification.productId.price}
                  </span>
                </div>
              )}

              <div className="mt-2 text-xs text-gray-400">
                {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2 ml-4">
            {!notification.isRead && (
              <button
                onClick={handleMarkAsRead}
                className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                title="Mark as read"
              >
                <CheckCircleIcon className="h-4 w-4" />
              </button>
            )}
            <button
              onClick={handleDelete}
              className="p-1 text-gray-400 hover:text-red-600 transition-colors"
              title="Delete notification"
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default NotificationItem;