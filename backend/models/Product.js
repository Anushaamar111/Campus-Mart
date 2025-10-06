import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Product title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  originalPrice: {
    type: Number,
    min: [0, 'Original price cannot be negative']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'Books & Textbooks',
      'Electronics',
      'Furniture',
      'Clothing & Accessories',
      'Sports & Fitness',
      'Musical Instruments',
      'Laboratory Equipment',
      'Stationery & Supplies',
      'Hostel Essentials',
      'Vehicles & Parts',
      'Services',
      'Other'
    ]
  },
  condition: {
    type: String,
    required: [true, 'Product condition is required'],
    enum: ['New', 'Like New', 'Good', 'Fair', 'Poor']
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    publicId: {
      type: String,
      required: true
    }
  }],
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  tags: [{
    type: String,
    lowercase: true,
    trim: true
  }],
  contactPhone: {
    type: String,
    trim: true
  },
  contactEmail: {
    type: String,
    trim: true
  },
  negotiable: {
    type: Boolean,
    default: false
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  views: {
    type: Number,
    default: 0
  },
  interestedUsers: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    contactedAt: {
      type: Date,
      default: Date.now
    }
  }],
  soldAt: {
    type: Date,
    default: null
  },
  soldTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  }
}, {
  timestamps: true
});

// Index for search functionality
productSchema.index({ title: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1, isAvailable: 1 });
productSchema.index({ seller: 1 });
productSchema.index({ createdAt: -1 });

// Virtual for calculating discount percentage
productSchema.virtual('discountPercentage').get(function() {
  if (this.originalPrice && this.originalPrice > this.price) {
    return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  }
  return 0;
});

// Virtual for status based on isAvailable
productSchema.virtual('status').get(function() {
  if (this.isAvailable) {
    return 'available';
  } else if (this.soldAt) {
    return 'sold';
  } else {
    return 'draft';
  }
});

// Ensure virtual fields are serialized
productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

export default mongoose.model('Product', productSchema);