import { validationResult } from 'express-validator';
import Product from '../models/Product.js';
import User from '../models/User.js';
import { uploadMultipleImages, deleteImage } from '../utils/cloudinary.js';
import { sendWishlistNotification } from '../utils/email.js';
import { checkWishlistMatches } from '../utils/notifications.js';

// Create a new product
const createProduct = async (req, res) => {
  try {
    console.log('=== Product Creation Request ===');
    console.log('Request body:', req.body);
    console.log('Files:', req.files ? req.files.length + ' files' : 'No files');
    console.log('User:', req.user ? req.user._id : 'No user');
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error('Validation errors:', errors.array());
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { 
      title, 
      description, 
      price, 
      originalPrice, 
      category, 
      condition, 
      location, 
      tags, 
      college, 
      contactPhone, 
      contactEmail,
      negotiable 
    } = req.body;

    // Upload images to Cloudinary
    let images = [];
    if (req.files && req.files.length > 0) {
      try {
        images = await uploadMultipleImages(req.files, 'campusmart/products');
      } catch (error) {
        console.error('Image upload error:', error);
        return res.status(400).json({ message: 'Image upload failed', error: error.message });
      }
    }

    // Create product
    const product = new Product({
      title,
      description,
      price: parseFloat(price),
      originalPrice: originalPrice ? parseFloat(originalPrice) : null,
      category,
      condition,
      location,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      college: college || undefined,
      contactPhone: contactPhone || undefined,
      contactEmail: contactEmail || undefined,
      negotiable: negotiable === 'true' || negotiable === true,
      images,
      seller: req.user.id
    });

    await product.save();

    // Populate seller information
    await product.populate('seller', 'name email college year');

    // Check for wishlist matches and send notifications
    checkWishlistMatches(product);

    res.status(201).json({
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all products with filters and pagination
const getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = { isAvailable: true };
    
    if (req.query.category) {
      filter.category = req.query.category;
    }
    
    if (req.query.minPrice || req.query.maxPrice) {
      filter.price = {};
      if (req.query.minPrice) filter.price.$gte = parseFloat(req.query.minPrice);
      if (req.query.maxPrice) filter.price.$lte = parseFloat(req.query.maxPrice);
    }
    
    if (req.query.condition) {
      filter.condition = req.query.condition;
    }
    
    if (req.query.location) {
      filter.location = new RegExp(req.query.location, 'i');
    }

    // Search functionality
    if (req.query.search) {
      filter.$text = { $search: req.query.search };
    }

    // Sort options
    let sort = { createdAt: -1 }; // Default: newest first
    if (req.query.sort === 'price_low') sort = { price: 1 };
    if (req.query.sort === 'price_high') sort = { price: -1 };
    if (req.query.sort === 'popular') sort = { views: -1 };

    const products = await Product.find(filter)
      .populate('seller', 'name college year')
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    res.json({
      products,
      pagination: {
        currentPage: page,
        totalPages,
        totalProducts: total,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single product by ID
const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('seller', 'name email college year phone')
      .populate('interestedUsers.user', 'name email');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Increment view count (but not for the seller)
    if (req.user && req.user.id !== product.seller._id.toString()) {
      product.views += 1;
      await product.save();
    }

    res.json({ product });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update product
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if user is the seller
    if (product.seller.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { title, description, price, originalPrice, category, condition, location, tags, isAvailable } = req.body;

    // Update fields
    if (title) product.title = title;
    if (description) product.description = description;
    if (price) product.price = parseFloat(price);
    if (originalPrice !== undefined) product.originalPrice = originalPrice ? parseFloat(originalPrice) : null;
    if (category) product.category = category;
    if (condition) product.condition = condition;
    if (location) product.location = location;
    if (tags) product.tags = tags.split(',').map(tag => tag.trim());
    if (typeof isAvailable === 'boolean') product.isAvailable = isAvailable;

    // Handle new images if provided
    if (req.files && req.files.length > 0) {
      try {
        const newImages = await uploadMultipleImages(req.files, 'campusmart/products');
        product.images = [...product.images, ...newImages];
      } catch (error) {
        return res.status(400).json({ message: 'Image upload failed', error: error.message });
      }
    }

    await product.save();
    await product.populate('seller', 'name email college year');

    res.json({
      message: 'Product updated successfully',
      product
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete product
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if user is the seller
    if (product.seller.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Delete images from Cloudinary
    if (product.images && product.images.length > 0) {
      try {
        await Promise.all(
          product.images.map(image => deleteImage(image.publicId))
        );
      } catch (error) {
        console.error('Image deletion error:', error);
      }
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Mark product as sold
const markAsSold = async (req, res) => {
  try {
    const { buyerId } = req.body;
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if user is the seller
    if (product.seller.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    product.isAvailable = false;
    product.soldAt = new Date();
    if (buyerId) product.soldTo = buyerId;

    await product.save();

    res.json({
      message: 'Product marked as sold',
      product
    });
  } catch (error) {
    console.error('Mark as sold error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Mark product as available
const markAsAvailable = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if user is the seller
    if (product.seller.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    product.isAvailable = true;
    product.soldAt = null;
    product.soldTo = null;

    await product.save();

    res.json({
      message: 'Product marked as available',
      product
    });
  } catch (error) {
    console.error('Mark as available error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Express interest in a product
const expressInterest = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if user is not the seller
    if (product.seller.toString() === req.user.id) {
      return res.status(400).json({ message: 'Cannot express interest in your own product' });
    }

    // Check if already interested
    const alreadyInterested = product.interestedUsers.some(
      interested => interested.user.toString() === req.user.id
    );

    if (alreadyInterested) {
      return res.status(400).json({ message: 'Interest already expressed' });
    }

    product.interestedUsers.push({ user: req.user.id });
    await product.save();

    res.json({ message: 'Interest expressed successfully' });
  } catch (error) {
    console.error('Express interest error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user's products (seller's listings)
const getMyProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = { seller: req.user.id };
    
    // Filter by availability if specified
    if (req.query.available !== undefined) {
      filter.isAvailable = req.query.available === 'true';
    }

    const products = await Product.find(filter)
      .populate('interestedUsers.user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    res.json({
      products,
      pagination: {
        currentPage: page,
        totalPages,
        totalProducts: total,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get my products error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  markAsSold,
  markAsAvailable,
  expressInterest,
  getMyProducts
};