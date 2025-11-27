import mongoose from 'mongoose';

const BidSchema = new mongoose.Schema({
  product: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product',
    required: true,
    index: true
  },
  bidder: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true,
    index: true
  },
  amount: { 
    type: Number, 
    required: true,
    min: 0
  },
  status: { 
    type: String, 
    enum: ['pending', 'accepted', 'rejected'], 
    default: 'pending'
  },
  message: {
    type: String,
    trim: true
  }
}, { 
  timestamps: true 
});

// Compound index for efficient queries
BidSchema.index({ product: 1, amount: -1 });
BidSchema.index({ bidder: 1, createdAt: -1 });

export default mongoose.model('Bid', BidSchema);
