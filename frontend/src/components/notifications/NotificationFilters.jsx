import React from 'react';
import { motion } from 'framer-motion';
import {
  BellIcon,
  HeartIcon,
  ShoppingCartIcon,
  ExclamationCircleIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';

const NotificationFilters = ({ 
  activeFilter, 
  onFilterChange, 
  unreadCount, 
  notificationCounts 
}) => {
  const filters = [
    {
      id: 'all',
      label: 'All',
      icon: AdjustmentsHorizontalIcon,
      count: notificationCounts.all || 0,
      color: 'text-gray-600'
    },
    {
      id: 'unread',
      label: 'Unread',
      icon: BellIcon,
      count: unreadCount || 0,
      color: 'text-blue-600'
    },
    {
      id: 'wishlist_match',
      label: 'Wishlist',
      icon: HeartIcon,
      count: notificationCounts.wishlist_match || 0,
      color: 'text-red-600'
    },
    {
      id: 'product_sold',
      label: 'Sales',
      icon: ShoppingCartIcon,
      count: notificationCounts.product_sold || 0,
      color: 'text-green-600'
    },
    {
      id: 'system',
      label: 'System',
      icon: ExclamationCircleIcon,
      count: notificationCounts.system || 0,
      color: 'text-orange-600'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
      <h3 className="text-sm font-medium text-gray-900 mb-3">Filter Notifications</h3>
      
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => {
          const IconComponent = filter.icon;
          const isActive = activeFilter === filter.id;
          
          return (
            <motion.button
              key={filter.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onFilterChange(filter.id)}
              className={`
                relative flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium
                transition-all duration-200
                ${isActive 
                  ? 'bg-blue-50 text-blue-700 border-2 border-blue-200' 
                  : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
                }
              `}
            >
              <IconComponent className={`h-4 w-4 ${isActive ? 'text-blue-600' : filter.color}`} />
              <span>{filter.label}</span>
              
              {filter.count > 0 && (
                <span className={`
                  inline-flex items-center justify-center w-5 h-5 text-xs font-bold rounded-full
                  ${isActive 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-400 text-white'
                  }
                `}>
                  {filter.count > 99 ? '99+' : filter.count}
                </span>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default NotificationFilters;