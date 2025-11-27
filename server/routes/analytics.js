import express from 'express';
import Product from '../models/Product.js';
import Bid from '../models/Bid.js';
import { authenticate, verifyCampus } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate, verifyCampus);

/**
 * GET /api/analytics/seller-dashboard
 * Get analytics for seller's products
 */
router.get('/seller-dashboard', async (req, res) => {
  try {
    // Get all seller's products
    const products = await Product.find({
      seller: req.userId,
      college: req.collegeId
    });

    if (products.length === 0) {
      return res.json({
        success: true,
        analytics: {
          totalProducts: 0,
          totalViews: 0,
          totalBids: 0,
          totalPotentialEarnings: 0,
          conversionRate: 0,
          activeListings: 0,
          soldItems: 0,
          viewsOverTime: [],
          categoryBreakdown: [],
          topProducts: []
        }
      });
    }

    // Calculate aggregate metrics
    const totalViews = products.reduce((sum, p) => sum + p.views, 0);
    const totalBids = products.reduce((sum, p) => sum + p.bidCount, 0);
    const totalPotentialEarnings = products.reduce((sum, p) => sum + p.highestBid, 0);
    const activeListings = products.filter(p => p.status === 'active').length;
    const soldItems = products.filter(p => p.status === 'sold').length;
    
    const conversionRate = totalViews > 0 ? (totalBids / totalViews * 100).toFixed(2) : 0;

    // Views over time (last 7 days)
    const viewsOverTime = await Product.aggregate([
      {
        $match: {
          seller: req.userId,
          college: req.collegeId
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          views: { $sum: '$views' }
        }
      },
      {
        $sort: { _id: -1 }
      },
      {
        $limit: 7
      }
    ]);

    // Category breakdown
    const categoryBreakdown = await Product.aggregate([
      {
        $match: {
          seller: req.userId,
          college: req.collegeId
        }
      },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalViews: { $sum: '$views' },
          totalBids: { $sum: '$bidCount' }
        }
      }
    ]);

    // Top products by views
    const topProducts = products
      .sort((a, b) => b.views - a.views)
      .slice(0, 5)
      .map(p => ({
        id: p._id,
        title: p.title,
        views: p.views,
        bids: p.bidCount,
        highestBid: p.highestBid
      }));

    res.json({
      success: true,
      analytics: {
        totalProducts: products.length,
        totalViews,
        totalBids,
        totalPotentialEarnings: totalPotentialEarnings.toFixed(2),
        conversionRate,
        activeListings,
        soldItems,
        viewsOverTime: viewsOverTime.reverse(),
        categoryBreakdown,
        topProducts
      }
    });

  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch analytics.' 
    });
  }
});

/**
 * GET /api/analytics/product/:productId
 * Get detailed analytics for a specific product
 */
router.get('/product/:productId', async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.productId,
      seller: req.userId,
      college: req.collegeId
    });

    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found or you do not have permission to view analytics.' 
      });
    }

    // Get bid history
    const bids = await Bid.find({ product: req.params.productId })
      .populate('bidder', 'firstName lastName')
      .sort({ createdAt: -1 })
      .lean();

    const bidHistory = bids.map(b => ({
      amount: b.amount,
      bidder: `${b.bidder.firstName} ${b.bidder.lastName}`,
      timestamp: b.createdAt
    }));

    res.json({
      success: true,
      analytics: {
        views: product.views,
        bidCount: product.bidCount,
        highestBid: product.highestBid,
        basePrice: product.basePrice,
        priceIncrease: product.highestBid - product.basePrice,
        conversionRate: product.views > 0 ? (product.bidCount / product.views * 100).toFixed(2) : 0,
        bidHistory
      }
    });

  } catch (error) {
    console.error('Product analytics error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch product analytics.' 
    });
  }
});

export default router;
