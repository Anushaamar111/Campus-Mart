import mongoose from 'mongoose';

const CollegeSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  domain: { 
    type: String, 
    unique: true, 
    required: true,
    lowercase: true,
    trim: true
  },
  gpsCenter: {
    lat: { type: Number },
    lng: { type: Number }
  },
  themeColor: { 
    type: String, 
    default: '#5A4FCF' 
  },
  safeZones: [{
    name: String,
    lat: Number,
    lng: Number
  }]
}, { 
  timestamps: true 
});

// Index for faster domain lookups
CollegeSchema.index({ domain: 1 });

export default mongoose.model('College', CollegeSchema);
