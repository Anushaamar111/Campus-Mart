// Demo notifications for testing the UI
import mongoose from 'mongoose';
import User from '../models/User.js';

export const addDemoNotifications = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      console.error('User not found');
      return;
    }

    // Clear existing notifications for demo
    user.notifications = [];

    // Add demo notifications
    const demoNotifications = [
      {
        type: 'wishlist_match',
        message: 'Great news! A MacBook Air M2 matching your wishlist is now available for ₹85,000',
        isRead: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 30) // 30 minutes ago
      },
      {
        type: 'product_sold',
        message: 'Congratulations! Your iPhone 13 Pro has been sold for ₹45,000',
        isRead: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2) // 2 hours ago
      },
      {
        type: 'product_interest',
        message: 'Someone is interested in your iPad Pro 11". Check your messages for details!',
        isRead: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6) // 6 hours ago
      },
      {
        type: 'system',
        message: 'Welcome to CampusMart! 🎉 Your account has been verified and you can now start buying and selling products.',
        isRead: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24) // 1 day ago
      },
      {
        type: 'wishlist_match',
        message: 'New match! AirPods Pro are available for ₹18,500 - exactly what you\'re looking for!',
        isRead: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2) // 2 days ago
      },
      {
        type: 'system',
        message: 'New feature alert! 📱 You can now set up wishlist notifications to get notified when items you want become available.',
        isRead: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3) // 3 days ago
      },
      {
        type: 'product_interest',
        message: 'Multiple users are interested in your Samsung Galaxy S23! Consider responding quickly.',
        isRead: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4) // 4 days ago
      },
      {
        type: 'product_sold',
        message: 'Your textbook "Engineering Mathematics" has found a new owner for ₹800',
        isRead: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5) // 5 days ago
      }
    ];

    user.notifications = demoNotifications;
    await user.save();

    console.log(`Added ${demoNotifications.length} demo notifications for user ${userId}`);
    return demoNotifications;
  } catch (error) {
    console.error('Error adding demo notifications:', error);
    return null;
  }
};