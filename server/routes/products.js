import express from 'express';
import Product from '../models/Product.js';
import { authenticate, verifyCampus } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication and campus verification
router.use(authenticate, verifyCampus);

/**
 * GET /api/products
 * Get all products from the same campus
 * CRITICAL: Uses campusFilter from verifyCampus middleware
 */
router.get('/', async (req, res) => {
  try {
    const { category, search, status = 'active', sortBy = 'createdAt', order = 'desc' } = req.query;

    // Build query with MANDATORY campus filter
    const query = { ...req.campusFilter };

    // Additional filters
    if (category && category !== 'All') {
      query.category = category;
    }

    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = order === 'asc' ? 1 : -1;

    const products = await Product.find(query)
      .populate('seller', 'firstName lastName email')
      .sort(sortOptions)
      .lean();

    res.json({
      success: true,
      count: products.length,
      products
    });

  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch products.' 
    });
  }
});

/**
 * GET /api/products/:id
 * Get single product details (with view tracking)
 */
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      ...req.campusFilter  // CRITICAL: Campus filter
    })
    .populate('seller', 'firstName lastName email')
    .populate('highestBidder', 'firstName lastName');

    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found or not available in your campus.' 
      });
    }

    // Increment view count (but not for the seller)
    if (product.seller._id.toString() !== req.userId) {
      product.views += 1;
      await product.save();
    }

    res.json({
      success: true,
      product
    });

  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch product.' 
    });
  }
});

/**
 * POST /api/products
 * Create a new product listing
 */
router.post('/', async (req, res) => {
  try {
    const { title, description, category, condition, basePrice, images } = req.body;

    if (!title || !basePrice) {
      return res.status(400).json({ 
        success: false, 
        message: 'Title and base price are required.' 
      });
    }

    const product = await Product.create({
      seller: req.userId,
      college: req.collegeId,  // CRITICAL: Automatic college assignment
      title,
      description,
      category,
      condition,
      basePrice,
      images: images || [],
      status: 'active'
    });

    const populatedProduct = await Product.findById(product._id)
      .populate('seller', 'firstName lastName email');

    res.status(201).json({
      success: true,
      message: 'Product created successfully.',
      product: populatedProduct
    });

  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create product.' 
    });
  }
});

/**
 * PUT /api/products/:id
 * Update product (seller only)
 */
router.put('/:id', async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      seller: req.userId,  // Only seller can update
      ...req.campusFilter
    });

    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found or you do not have permission to edit it.' 
      });
    }

    // Update allowed fields
    const allowedUpdates = ['title', 'description', 'category', 'condition', 'basePrice', 'images', 'status'];
    const updates = req.body;

    allowedUpdates.forEach(field => {
      if (updates[field] !== undefined) {
        product[field] = updates[field];
      }
    });

    await product.save();

    const updatedProduct = await Product.findById(product._id)
      .populate('seller', 'firstName lastName email');

    res.json({
      success: true,
      message: 'Product updated successfully.',
      product: updatedProduct
    });

  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update product.' 
    });
  }
});

/**
 * DELETE /api/products/:id
 * Delete product (seller only)
 */
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({
      _id: req.params.id,
      seller: req.userId,
      ...req.campusFilter
    });

    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found or you do not have permission to delete it.' 
      });
    }

    res.json({
      success: true,
      message: 'Product deleted successfully.'
    });

  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete product.' 
    });
  }
});

/**
 * GET /api/products/seller/my-listings
 * Get current user's product listings
 */
router.get('/seller/my-listings', async (req, res) => {
  try {
    const products = await Product.find({
      seller: req.userId,
      college: req.collegeId
    })
    .sort({ createdAt: -1 })
    .lean();

    res.json({
      success: true,
      count: products.length,
      products
    });

  } catch (error) {
    console.error('Get my listings error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch your listings.' 
    });
  }
});

export default router;
