// Sample notification data for testing
import { 
  createWishlistMatchNotification,
  createProductSoldNotification,
  createProductInterestNotification,
  createSystemNotification
} from './notifications.js';

export const createSampleNotifications = async (userId) => {
  try {
    // Sample product data (you can replace with actual product IDs)
    const sampleProduct = {
      _id: '507f1f77bcf86cd799439011', // Sample ObjectId
      title: 'iPhone 13 Pro',
      price: 45000
    };

    // Create different types of notifications
    await createWishlistMatchNotification(userId, {
      _id: '507f1f77bcf86cd799439012',
      title: 'MacBook Air M2',
      price: 85000
    });

    await createProductSoldNotification(userId, {
      _id: '507f1f77bcf86cd799439013',
      title: 'iPad Pro 11"',
      price: 35000
    });

    await createProductInterestNotification(userId, {
      _id: '507f1f77bcf86cd799439014',
      title: 'AirPods Pro',
      price: 15000
    });

    await createSystemNotification(userId, 
      'Welcome to CampusMart! 🎉 Your account has been verified and you can now start buying and selling products.'
    );

    await createSystemNotification(userId,
      'New feature alert! 📱 You can now set up wishlist notifications to get notified when items you want become available.'
    );

    console.log(`Sample notifications created for user ${userId}`);
  } catch (error) {
    console.error('Error creating sample notifications:', error);
  }
};