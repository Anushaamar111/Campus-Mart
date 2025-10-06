import React, { useState, useEffect, useContext } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import {
  BellIcon,
  CheckIcon,
  TrashIcon,
  CogIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

import { AuthContext } from '../context/AuthContext';
import NotificationItem from '../components/notifications/NotificationItem';
import NotificationFilters from '../components/notifications/NotificationFilters';
import NotificationPreferences from '../components/notifications/NotificationPreferences';
import {
  getNotifications,
  getUnreadCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  clearAllNotifications
} from '../services/notificationsAPI';

const Notifications = () => {
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [activeFilter, setActiveFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [notificationCounts, setNotificationCounts] = useState({});

  // Load notifications on component mount
  useEffect(() => {
    if (user) {
      fetchNotifications();
      fetchUnreadCount();
    }
  }, [user]);

  // Filter notifications when filter changes
  useEffect(() => {
    filterNotifications();
  }, [notifications, activeFilter]);

  // Calculate notification counts
  useEffect(() => {
    calculateNotificationCounts();
  }, [notifications]);

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const data = await getNotifications();
      setNotifications(data.notifications || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error('Failed to load notifications');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const data = await getUnreadCount();
      setUnreadCount(data.unreadCount || 0);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const calculateNotificationCounts = () => {
    const counts = {
      all: notifications.length,
      unread: notifications.filter(n => !n.isRead).length,
      wishlist_match: notifications.filter(n => n.type === 'wishlist_match').length,
      product_sold: notifications.filter(n => n.type === 'product_sold').length,
      product_interest: notifications.filter(n => n.type === 'product_interest').length,
      system: notifications.filter(n => n.type === 'system').length
    };
    setNotificationCounts(counts);
  };

  const filterNotifications = () => {
    let filtered = [...notifications];

    switch (activeFilter) {
      case 'unread':
        filtered = filtered.filter(notification => !notification.isRead);
        break;
      case 'wishlist_match':
      case 'product_sold':
      case 'product_interest':
      case 'system':
        filtered = filtered.filter(notification => notification.type === activeFilter);
        break;
      default:
        // 'all' - no filtering needed
        break;
    }

    setFilteredNotifications(filtered);
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markNotificationAsRead(notificationId);
      
      // Update notifications in state
      setNotifications(prev => 
        prev.map(notification => 
          notification._id === notificationId 
            ? { ...notification, isRead: true }
            : notification
        )
      );
      
      // Update unread count
      setUnreadCount(prev => Math.max(0, prev - 1));
      
      toast.success('Marked as read');
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error('Failed to mark as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      
      // Update all notifications in state
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, isRead: true }))
      );
      
      setUnreadCount(0);
      toast.success('All notifications marked as read');
    } catch (error) {
      console.error('Error marking all as read:', error);
      toast.error('Failed to mark all as read');
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      await deleteNotification(notificationId);
      
      // Remove notification from state
      const notification = notifications.find(n => n._id === notificationId);
      setNotifications(prev => prev.filter(n => n._id !== notificationId));
      
      // Update unread count if deleted notification was unread
      if (notification && !notification.isRead) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      
      toast.success('Notification deleted');
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast.error('Failed to delete notification');
    }
  };

  const handleClearAll = async () => {
    if (window.confirm('Are you sure you want to clear all notifications? This action cannot be undone.')) {
      try {
        await clearAllNotifications();
        setNotifications([]);
        setUnreadCount(0);
        toast.success('All notifications cleared');
      } catch (error) {
        console.error('Error clearing notifications:', error);
        toast.error('Failed to clear notifications');
      }
    }
  };



  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-20">
          <BellIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Sign in to view notifications</h2>
          <p className="text-gray-600">You need to be logged in to access your notifications.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Notifications - CampusMart</title>
      </Helmet>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
              <BellIcon className="h-8 w-8 text-blue-600" />
              <span>Notifications</span>
              {unreadCount > 0 && (
                <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                  {unreadCount}
                </span>
              )}
            </h1>
            <p className="text-gray-600 mt-2">Stay updated with wishlist matches and important updates.</p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsPreferencesOpen(true)}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <CogIcon className="h-4 w-4" />
              <span>Preferences</span>
            </button>

            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <CheckIcon className="h-4 w-4" />
                <span>Mark All Read</span>
              </button>
            )}

            {notifications.length > 0 && (
              <button
                onClick={handleClearAll}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
              >
                <TrashIcon className="h-4 w-4" />
                <span>Clear All</span>
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <NotificationFilters
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          unreadCount={unreadCount}
          notificationCounts={notificationCounts}
        />

        {/* Notifications List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-12">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="mx-auto h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"
              />
              <p className="text-gray-600 mt-4">Loading notifications...</p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="text-center py-12">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                {activeFilter === 'all' ? (
                  <BellIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                ) : (
                  <XCircleIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                )}
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {activeFilter === 'all' 
                    ? 'No notifications yet' 
                    : `No ${activeFilter.replace('_', ' ')} notifications`
                  }
                </h3>
                <p className="text-gray-600">
                  {activeFilter === 'all' 
                    ? 'We\'ll notify you when something important happens!' 
                    : 'Try selecting a different filter to see more notifications.'
                  }
                </p>
              </motion.div>
            </div>
          ) : (
            <AnimatePresence>
              {filteredNotifications.map((notification) => (
                <NotificationItem
                  key={notification._id}
                  notification={notification}
                  onMarkAsRead={handleMarkAsRead}
                  onDelete={handleDeleteNotification}
                />
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* Preferences Modal */}
        <NotificationPreferences
          isOpen={isPreferencesOpen}
          onClose={() => setIsPreferencesOpen(false)}
        />
      </div>
    </>
  );
};

export default Notifications;