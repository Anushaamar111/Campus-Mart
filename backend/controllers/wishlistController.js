import User from '../models/User.js';
import Product from '../models/Product.js';

// Add keyword to wishlist
const addToWishlist = async (req, res) => {
  try {
    const { keyword, category = 'Uncategorized', priority = 'medium', maxPrice, isActive = true } = req.body;
    
    if (!keyword || keyword.trim() === '') {
      return res.status(400).json({ message: 'Keyword is required' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const normalizedKeyword = keyword.toLowerCase().trim();
    
    // Check if keyword already exists
    const existingKeyword = user.wishlist.find(item => item.keyword === normalizedKeyword);
    if (existingKeyword) {
      return res.status(400).json({ message: 'Keyword already in wishlist' });
    }

    const newKeyword = {
      keyword: normalizedKeyword,
      category: category.trim(),
      priority,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      isActive,
      createdAt: new Date()
    };

    user.wishlist.push(newKeyword);
    await user.save();

    res.json({
      message: 'Keyword added to wishlist',
      keyword: newKeyword,
      wishlist: user.wishlist
    });
  } catch (error) {
    console.error('Add to wishlist error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update wishlist keyword
const updateWishlistKeyword = async (req, res) => {
  try {
    const { keywordId } = req.params;
    const updates = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const keywordIndex = user.wishlist.findIndex(item => item._id.toString() === keywordId);
    if (keywordIndex === -1) {
      return res.status(404).json({ message: 'Keyword not found' });
    }

    // Update the keyword with provided fields
    Object.keys(updates).forEach(key => {
      if (key === 'keyword' && updates[key]) {
        user.wishlist[keywordIndex][key] = updates[key].toLowerCase().trim();
      } else if (updates[key] !== undefined) {
        user.wishlist[keywordIndex][key] = updates[key];
      }
    });

    await user.save();

    res.json({
      message: 'Keyword updated',
      keyword: user.wishlist[keywordIndex]
    });
  } catch (error) {
    console.error('Update wishlist keyword error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Remove keyword from wishlist
const removeFromWishlist = async (req, res) => {
  try {
    const { keywordId } = req.params;
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const initialLength = user.wishlist.length;
    user.wishlist = user.wishlist.filter(item => item._id.toString() !== keywordId);
    
    if (user.wishlist.length === initialLength) {
      return res.status(404).json({ message: 'Keyword not found' });
    }

    await user.save();

    res.json({
      message: 'Keyword removed from wishlist',
      wishlist: user.wishlist
    });
  } catch (error) {
    console.error('Remove from wishlist error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user's wishlist
const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('wishlist');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ wishlist: user.wishlist });
  } catch (error) {
    console.error('Get wishlist error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Clear entire wishlist
const clearWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.wishlist = [];
    await user.save();

    res.json({
      message: 'Wishlist cleared',
      wishlist: []
    });
  } catch (error) {
    console.error('Clear wishlist error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get wishlist matches (products that match user's wishlist)
const getWishlistMatches = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('wishlist');
    
    if (!user || !user.wishlist.length) {
      return res.json({ matches: [] });
    }

    // Find products that match wishlist keywords
    const matches = await Product.find({
      $and: [
        { isAvailable: true },
        { seller: { $ne: req.user.id } }, // Exclude user's own products
        {
          $or: [
            { title: { $in: user.wishlist.map(keyword => new RegExp(keyword, 'i')) } },
            { category: { $in: user.wishlist.map(keyword => new RegExp(keyword, 'i')) } },
            { tags: { $in: user.wishlist.map(keyword => new RegExp(keyword, 'i')) } }
          ]
        }
      ]
    })
    .populate('seller', 'name college')
    .sort({ createdAt: -1 })
    .limit(20);

    res.json({ matches });
  } catch (error) {
    console.error('Get wishlist matches error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get smart suggestions for wishlist keywords
const getSuggestions = async (req, res) => {
  try {
    // Get popular categories and tags from existing products
    const categories = await Product.distinct('category');
    const tags = await Product.aggregate([
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 20 }
    ]);

    const suggestions = {
      categories: categories.slice(0, 10),
      popularTags: tags.map(tag => tag._id),
      recommended: [
        'laptop', 'textbook', 'phone', 'tablet', 'headphones',
        'calculator', 'bicycle', 'furniture', 'gaming', 'camera'
      ]
    };

    res.json({ suggestions });
  } catch (error) {
    console.error('Get suggestions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get wishlist match history from notifications
const getMatchHistory = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('notifications')
      .populate('notifications.productId', 'title price images seller')
      .populate('notifications.productId.seller', 'name college');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Filter notifications to only wishlist matches
    const matchHistory = user.notifications
      .filter(notification => notification.type === 'wishlist_match')
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 50); // Last 50 matches

    res.json({ matchHistory });
  } catch (error) {
    console.error('Get match history error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Export wishlist in multiple formats
const exportWishlist = async (req, res) => {
  try {
    const { format = 'json', keywords = true, categories = true, priorities = true, maxPrices = true, timestamps = true, inactiveItems = false } = req.query;
    
    const user = await User.findById(req.user.id).select('wishlist name email');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Filter wishlist based on options
    let filteredWishlist = user.wishlist;
    if (!inactiveItems) {
      filteredWishlist = filteredWishlist.filter(item => item.isActive);
    }

    const timestamp = new Date().toISOString().split('T')[0];
    
    if (format === 'json') {
      const exportData = {
        user: {
          name: user.name,
          email: user.email
        },
        wishlist: filteredWishlist.map(item => {
          const exportItem = {};
          if (keywords) exportItem.keyword = item.keyword;
          if (categories) exportItem.category = item.category;
          if (priorities) exportItem.priority = item.priority;
          if (maxPrices && item.maxPrice) exportItem.maxPrice = item.maxPrice;
          if (timestamps) exportItem.createdAt = item.createdAt;
          exportItem.isActive = item.isActive;
          return exportItem;
        }),
        exportDate: new Date().toISOString(),
        totalItems: filteredWishlist.length
      };

      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="wishlist_${timestamp}.json"`);
      res.send(JSON.stringify(exportData, null, 2));
    } 
    else if (format === 'csv') {
      let csvContent = '';
      const headers = [];
      
      if (keywords) headers.push('Keyword');
      if (categories) headers.push('Category');
      if (priorities) headers.push('Priority');
      if (maxPrices) headers.push('Max Price');
      if (timestamps) headers.push('Created At');
      headers.push('Active');
      
      csvContent += headers.join(',') + '\n';
      
      filteredWishlist.forEach(item => {
        const row = [];
        if (keywords) row.push(`"${item.keyword}"`);
        if (categories) row.push(`"${item.category}"`);
        if (priorities) row.push(`"${item.priority}"`);
        if (maxPrices) row.push(item.maxPrice || '');
        if (timestamps) row.push(`"${item.createdAt.toISOString()}"`);
        row.push(item.isActive);
        csvContent += row.join(',') + '\n';
      });

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="wishlist_${timestamp}.csv"`);
      res.send(csvContent);
    } 
    else if (format === 'txt') {
      let txtContent = `My Wishlist - Exported on ${new Date().toLocaleDateString()}\n`;
      txtContent += `Total Items: ${filteredWishlist.length}\n\n`;
      
      const categorized = {};
      filteredWishlist.forEach(item => {
        if (!categorized[item.category]) {
          categorized[item.category] = [];
        }
        categorized[item.category].push(item);
      });
      
      Object.keys(categorized).forEach(category => {
        txtContent += `\n--- ${category} ---\n`;
        categorized[category].forEach(item => {
          txtContent += `• ${item.keyword}`;
          if (priorities) txtContent += ` (${item.priority})`;
          if (maxPrices && item.maxPrice) txtContent += ` - Max: ₹${item.maxPrice}`;
          if (!item.isActive) txtContent += ` [INACTIVE]`;
          txtContent += '\n';
        });
      });

      res.setHeader('Content-Type', 'text/plain');
      res.setHeader('Content-Disposition', `attachment; filename="wishlist_${timestamp}.txt"`);
      res.send(txtContent);
    } 
    else {
      return res.status(400).json({ message: 'Unsupported format. Use json, csv, or txt.' });
    }
  } catch (error) {
    console.error('Export wishlist error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export {
  addToWishlist,
  updateWishlistKeyword,
  removeFromWishlist,
  getWishlist,
  clearWishlist,
  getWishlistMatches,
  getSuggestions,
  getMatchHistory,
  exportWishlist
};