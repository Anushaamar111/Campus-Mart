import express from 'express';
import User from '../models/User.js';
import Product from '../models/Product.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get user profile by ID
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -notifications')
      .populate('wishlist');
    
    if (!user || !user.isActive) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user stats
const getUserStats = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get current month stats
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
    
    // Get previous month stats for comparison
    const startOfLastMonth = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1);
    const endOfLastMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 0);

    // Current month stats
    const totalProducts = await Product.countDocuments({ seller: userId });
    const activeProducts = await Product.countDocuments({ 
      seller: userId, 
      status: 'available' 
    });
    const soldProducts = await Product.countDocuments({ 
      seller: userId, 
      status: 'sold' 
    });
    
    // Calculate total views
    const viewsResult = await Product.aggregate([
      { $match: { seller: userId } },
      { $group: { _id: null, total: { $sum: "$views" } } }
    ]);
    const totalViews = viewsResult.length > 0 ? viewsResult[0].total : 0;

    // Calculate total earnings (assuming sold products have earnings)
    const earningsResult = await Product.aggregate([
      { $match: { seller: userId, status: 'sold' } },
      { $group: { _id: null, total: { $sum: "$price" } } }
    ]);
    const totalEarnings = earningsResult.length > 0 ? earningsResult[0].total : 0;

    // Last month stats for comparison
    const lastMonthProducts = await Product.countDocuments({ 
      seller: userId,
      createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth }
    });
    const thisMonthProducts = await Product.countDocuments({ 
      seller: userId,
      createdAt: { $gte: startOfMonth, $lte: endOfMonth }
    });

    // Calculate percentage changes
    const productsChange = lastMonthProducts > 0 
      ? Math.round(((thisMonthProducts - lastMonthProducts) / lastMonthProducts) * 100)
      : thisMonthProducts > 0 ? 100 : 0;

    const stats = {
      totalProducts,
      activeProducts,
      soldProducts,
      totalViews,
      totalEarnings,
      productsChange,
      activeChange: 0, // Could be calculated similarly
      viewsChange: 0,  // Could be calculated similarly  
      earningsChange: 0 // Could be calculated similarly
    };

    res.json({ stats });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Routes
router.get('/:id', auth, getUserProfile);
router.get('/stats/dashboard', auth, getUserStats);

export default router;