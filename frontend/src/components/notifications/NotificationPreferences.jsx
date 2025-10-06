import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CogIcon,
  BellIcon,
  HeartIcon,
  ShoppingCartIcon,
  ExclamationCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

const NotificationPreferences = ({ isOpen, onClose }) => {
  const [preferences, setPreferences] = useState({
    wishlistMatches: true,
    productSold: true,
    productInterest: true,
    systemUpdates: true,
    emailNotifications: false,
    pushNotifications: true,
    marketingEmails: false
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = (key) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement API call to save preferences
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      toast.success('Notification preferences saved!');
      onClose();
    } catch (error) {
      toast.error('Failed to save preferences');
    } finally {
      setIsLoading(false);
    }
  };

  const preferenceCategories = [
    {
      title: 'App Notifications',
      description: 'Choose which notifications you want to receive in the app',
      items: [
        {
          key: 'wishlistMatches',
          label: 'Wishlist Matches',
          description: 'When items matching your wishlist become available',
          icon: HeartIcon,
          color: 'text-red-500'
        },
        {
          key: 'productSold',
          label: 'Product Sales',
          description: 'When your products are sold',
          icon: ShoppingCartIcon,
          color: 'text-green-500'
        },
        {
          key: 'productInterest',
          label: 'Product Interest',
          description: 'When someone shows interest in your products',
          icon: BellIcon,
          color: 'text-blue-500'
        },
        {
          key: 'systemUpdates',
          label: 'System Updates',
          description: 'Important updates and announcements',
          icon: ExclamationCircleIcon,
          color: 'text-orange-500'
        }
      ]
    },
    {
      title: 'Delivery Methods',
      description: 'How you want to receive notifications',
      items: [
        {
          key: 'pushNotifications',
          label: 'Push Notifications',
          description: 'Browser push notifications',
          icon: BellIcon,
          color: 'text-purple-500'
        },
        {
          key: 'emailNotifications',
          label: 'Email Notifications',
          description: 'Important notifications via email',
          icon: BellIcon,
          color: 'text-indigo-500'
        }
      ]
    },
    {
      title: 'Marketing',
      description: 'Optional promotional content',
      items: [
        {
          key: 'marketingEmails',
          label: 'Marketing Emails',
          description: 'Product recommendations and promotions',
          icon: BellIcon,
          color: 'text-pink-500'
        }
      ]
    }
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        />

        {/* Modal */}
        <div className="flex min-h-full items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-white rounded-xl shadow-xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <CogIcon className="h-6 w-6 text-gray-600" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Notification Preferences
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 max-h-96 overflow-y-auto">
              <div className="space-y-8">
                {preferenceCategories.map((category, categoryIndex) => (
                  <div key={categoryIndex}>
                    <div className="mb-4">
                      <h3 className="text-lg font-medium text-gray-900 mb-1">
                        {category.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {category.description}
                      </p>
                    </div>

                    <div className="space-y-4">
                      {category.items.map((item) => {
                        const IconComponent = item.icon;
                        const isEnabled = preferences[item.key];

                        return (
                          <div
                            key={item.key}
                            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                          >
                            <div className="flex items-start space-x-3">
                              <IconComponent className={`h-5 w-5 mt-0.5 ${item.color}`} />
                              <div>
                                <h4 className="text-sm font-medium text-gray-900">
                                  {item.label}
                                </h4>
                                <p className="text-xs text-gray-600">
                                  {item.description}
                                </p>
                              </div>
                            </div>

                            <button
                              onClick={() => handleToggle(item.key)}
                              className={`
                                relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                                ${isEnabled ? 'bg-blue-600' : 'bg-gray-300'}
                              `}
                            >
                              <span
                                className={`
                                  inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                                  ${isEnabled ? 'translate-x-6' : 'translate-x-1'}
                                `}
                              />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? 'Saving...' : 'Save Preferences'}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};

export default NotificationPreferences;