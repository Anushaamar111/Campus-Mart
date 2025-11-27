import express from 'express';
import User from '../models/User.js';
import Product from '../models/Product.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);

/**
 * GET /api/user/profile
 * Get current user's profile
 */
router.get('/profile', async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .populate('college', 'name domain themeColor gpsCenter safeZones')
      .populate('savedItems');

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found.' 
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        college: user.college,
        isVerified: user.isVerified,
        savedItems: user.savedItems,
        avatar: user.avatar
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch profile.' 
    });
  }
});

/**
 * PUT /api/user/profile
 * Update user profile
 */
router.put('/profile', async (req, res) => {
  try {
    const { firstName, lastName, avatar } = req.body;

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found.' 
      });
    }

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (avatar) user.avatar = avatar;

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully.',
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar
      }
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update profile.' 
    });
  }
});

/**
 * POST /api/user/saved/:productId
 * Toggle save/unsave product
 */
router.post('/saved/:productId', async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const productId = req.params.productId;

    // Verify product exists in same college
    const product = await Product.findOne({
      _id: productId,
      college: req.collegeId
    });

    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found.' 
      });
    }

    const isSaved = user.savedItems.includes(productId);

    if (isSaved) {
      user.savedItems = user.savedItems.filter(id => id.toString() !== productId);
    } else {
      user.savedItems.push(productId);
    }

    await user.save();

    res.json({
      success: true,
      message: isSaved ? 'Product removed from saved items.' : 'Product saved successfully.',
      savedItems: user.savedItems
    });

  } catch (error) {
    console.error('Toggle saved error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update saved items.' 
    });
  }
});

/**
 * GET /api/user/saved
 * Get user's saved products
 */
router.get('/saved', async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .populate({
        path: 'savedItems',
        populate: { path: 'seller', select: 'firstName lastName' }
      });

    res.json({
      success: true,
      savedItems: user.savedItems
    });

  } catch (error) {
    console.error('Get saved items error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch saved items.' 
    });
  }
});

export default router;
