import express from 'express';
import Bid from '../models/Bid.js';
import Product from '../models/Product.js';
import { authenticate, verifyCampus } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate, verifyCampus);

/**
 * POST /api/bids
 * Place a bid on a product
 */
router.post('/', async (req, res) => {
  try {
    const { productId, amount, message } = req.body;

    if (!productId || !amount) {
      return res.status(400).json({ 
        success: false, 
        message: 'Product ID and bid amount are required.' 
      });
    }

    // Find product with campus filter
    const product = await Product.findOne({
      _id: productId,
      ...req.campusFilter,
      status: 'active'
    });

    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found or not available for bidding.' 
      });
    }

    // Check if user is the seller
    if (product.seller.toString() === req.userId) {
      return res.status(400).json({ 
        success: false, 
        message: 'You cannot bid on your own product.' 
      });
    }

    // Validate bid amount
    const minimumBid = product.highestBid > 0 ? product.highestBid : product.basePrice;
    
    if (amount <= minimumBid) {
      return res.status(400).json({ 
        success: false, 
        message: `Bid must be higher than $${minimumBid.toFixed(2)}` 
      });
    }

    // Create bid
    const bid = await Bid.create({
      product: productId,
      bidder: req.userId,
      amount,
      message: message || '',
      status: 'pending'
    });

    // Update product
    product.highestBid = amount;
    product.highestBidder = req.userId;
    product.bidCount += 1;
    await product.save();

    const populatedBid = await Bid.findById(bid._id)
      .populate('bidder', 'firstName lastName email');

    // Emit socket event for real-time update
    const io = req.app.get('io');
    io.to(`product_${productId}`).emit('bid_update', {
      productId,
      highestBid: amount,
      bidCount: product.bidCount,
      bidder: {
        firstName: populatedBid.bidder.firstName,
        lastName: populatedBid.bidder.lastName
      }
    });

    res.status(201).json({
      success: true,
      message: 'Bid placed successfully.',
      bid: populatedBid
    });

  } catch (error) {
    console.error('Place bid error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to place bid.' 
    });
  }
});

/**
 * GET /api/bids/product/:productId
 * Get all bids for a product (seller only)
 */
router.get('/product/:productId', async (req, res) => {
  try {
    // Verify user is the seller
    const product = await Product.findOne({
      _id: req.params.productId,
      seller: req.userId,
      ...req.campusFilter
    });

    if (!product) {
      return res.status(403).json({ 
        success: false, 
        message: 'You do not have permission to view these bids.' 
      });
    }

    const bids = await Bid.find({ product: req.params.productId })
      .populate('bidder', 'firstName lastName email')
      .sort({ amount: -1 })
      .lean();

    res.json({
      success: true,
      count: bids.length,
      bids
    });

  } catch (error) {
    console.error('Get product bids error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch bids.' 
    });
  }
});

/**
 * GET /api/bids/my-bids
 * Get current user's bids
 */
router.get('/my-bids', async (req, res) => {
  try {
    const bids = await Bid.find({ bidder: req.userId })
      .populate('product')
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      count: bids.length,
      bids
    });

  } catch (error) {
    console.error('Get my bids error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch your bids.' 
    });
  }
});

/**
 * POST /api/bids/:bidId/accept
 * Accept a bid (seller only)
 */
router.post('/:bidId/accept', async (req, res) => {
  try {
    const bid = await Bid.findById(req.params.bidId)
      .populate('product')
      .populate('bidder', 'firstName lastName email');

    if (!bid) {
      return res.status(404).json({ 
        success: false, 
        message: 'Bid not found.' 
      });
    }

    // Verify user is the seller
    if (bid.product.seller.toString() !== req.userId) {
      return res.status(403).json({ 
        success: false, 
        message: 'You do not have permission to accept this bid.' 
      });
    }

    // Update bid status
    bid.status = 'accepted';
    await bid.save();

    // Update product
    bid.product.status = 'bidding_locked';
    bid.product.acceptedBid = bid._id;
    await bid.product.save();

    // Reject all other bids
    await Bid.updateMany(
      { 
        product: bid.product._id, 
        _id: { $ne: bid._id },
        status: 'pending'
      },
      { status: 'rejected' }
    );

    // Emit socket event
    const io = req.app.get('io');
    io.to(`product_${bid.product._id}`).emit('bid_accepted', {
      productId: bid.product._id,
      status: 'bidding_locked'
    });

    res.json({
      success: true,
      message: 'Bid accepted successfully.',
      bid
    });

  } catch (error) {
    console.error('Accept bid error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to accept bid.' 
    });
  }
});

export default router;
