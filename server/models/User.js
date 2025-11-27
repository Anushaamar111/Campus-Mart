import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: { 
    type: String, 
    unique: true, 
    required: true,
    lowercase: true,
    trim: true
  },
  password: { 
    type: String, 
    required: true,
    select: false 
  },
  firstName: { 
    type: String,
    required: true,
    trim: true
  },
  lastName: { 
    type: String,
    trim: true
  },
  college: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'College', 
    required: true,
    index: true
  },
  isVerified: { 
    type: Boolean, 
    default: false 
  },
  verificationCode: {
    type: String,
    select: false
  },
  savedItems: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product' 
  }],
  avatar: {
    type: String,
    default: ''
  }
}, { 
  timestamps: true 
});

// Index for faster college-based queries
UserSchema.index({ college: 1, email: 1 });

export default mongoose.model('User', UserSchema);
