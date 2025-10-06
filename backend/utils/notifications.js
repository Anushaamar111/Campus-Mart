// Notification creation utilities for backend
import User from '../models/User.js';

// Create notification for a user
export const createNotification = async (userId, notificationData) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      console.error('User not found for notification:', userId);
      return null;
    }

    const notification = {
      type: notificationData.type,
      message: notificationData.message,
      productId: notificationData.productId || null,
      isRead: false,
      createdAt: new Date()
    };

    user.notifications.unshift(notification); // Add to beginning
    
    // Keep only the last 50 notifications to prevent unlimited growth
    if (user.notifications.length > 50) {
      user.notifications = user.notifications.slice(0, 50);
    }

    await user.save();

    // Emit real-time notification if socket.io is available
    const io = global.io || null;
    if (io) {
      io.to(userId.toString()).emit('newNotification', {
        ...notification,
        _id: user.notifications[0]._id
      });
    }

    return user.notifications[0];
  } catch (error) {
    console.error('Error creating notification:', error);
    return null;
  }
};

// Create wishlist match notification
export const createWishlistMatchNotification = async (userId, product) => {
  return await createNotification(userId, {
    type: 'wishlist_match',
    message: `Great news! A product matching your wishlist is now available: "${product.title}" for ₹${product.price}`,
    productId: product._id
  });
};

// Create product sold notification
export const createProductSoldNotification = async (sellerId, product, buyer) => {
  return await createNotification(sellerId, {
    type: 'product_sold',
    message: `Congratulations! Your product "${product.title}" has been sold for ₹${product.price}`,
    productId: product._id
  });
};

// Create product interest notification
export const createProductInterestNotification = async (sellerId, product, interestedUser) => {
  return await createNotification(sellerId, {
    type: 'product_interest',
    message: `Someone is interested in your product "${product.title}". Check your messages for details!`,
    productId: product._id
  });
};

// Create system notification
export const createSystemNotification = async (userId, message) => {
  return await createNotification(userId, {
    type: 'system',
    message: message
  });
};

// Create bulk system notifications (for all users)
export const createBulkSystemNotification = async (message) => {
  try {
    const users = await User.find({}, '_id');
    const promises = users.map(user => 
      createSystemNotification(user._id, message)
    );
    
    await Promise.allSettled(promises);
    console.log(`System notification sent to ${users.length} users`);
  } catch (error) {
    console.error('Error creating bulk system notification:', error);
  }
};

// Check for wishlist matches when a new product is created
export const checkWishlistMatches = async (product) => {
  try {
    // Find users who have this product's keywords in their wishlist
    const keywords = [
      product.title.toLowerCase(),
      product.category.toLowerCase(),
      ...product.tags.map(tag => tag.toLowerCase())
    ];

    const users = await User.find({
      'wishlist.keywords': { 
        $in: keywords.map(keyword => new RegExp(keyword, 'i'))
      }
    });

    // Create notifications for matching users
    const promises = users.map(user => 
      createWishlistMatchNotification(user._id, product)
    );

    await Promise.allSettled(promises);
    
    if (users.length > 0) {
      console.log(`Wishlist match notifications sent to ${users.length} users for product: ${product.title}`);
    }
  } catch (error) {
    console.error('Error checking wishlist matches:', error);
  }
};