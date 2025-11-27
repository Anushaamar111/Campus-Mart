import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  seller: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true,
    index: true
  },
  college: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'College', 
    required: true,
    index: true  // CRITICAL for silo filtering
  },
  title: { 
    type: String, 
    required: true,
    trim: true
  },
  description: { 
    type: String,
    trim: true
  },
  category: {
    type: String,
    enum: ['Electronics', 'Books', 'Furniture', 'Clothing', 'Sports', 'Other'],
    default: 'Other'
  },
  condition: {
    type: String,
    enum: ['New', 'Like New', 'Good', 'Fair', 'Poor'],
    default: 'Good'
  },
  basePrice: { 
    type: Number,
    required: true,
    min: 0
  },
  images: [String],
  status: { 
    type: String, 
    enum: ['active', 'sold', 'bidding_locked'], 
    default: 'active'
  },
  // Analytics Data
  views: { 
    type: Number, 
    default: 0 
  },
  bidCount: { 
    type: Number, 
    default: 0 
  },
  highestBid: { 
    type: Number, 
    default: 0 
  },
  highestBidder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  acceptedBid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bid'
  }
}, { 
  timestamps: true 
});

// Compound index for efficient college-based filtering
ProductSchema.index({ college: 1, status: 1, createdAt: -1 });
ProductSchema.index({ seller: 1, createdAt: -1 });

export default mongoose.model('Product', ProductSchema);
