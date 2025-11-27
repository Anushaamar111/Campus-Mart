import mongoose from 'mongoose';

// Connection pool for serverless
let cachedConnection = null;

const connectDB = async () => {
  try {
    // Return cached connection in serverless environment
    if (cachedConnection && mongoose.connection.readyState === 1) {
      console.log('♻️  Using cached MongoDB connection');
      return cachedConnection;
    }

    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/campus-connect';
    
    if (!process.env.MONGODB_URI) {
      console.warn('⚠️  MONGODB_URI not found in environment variables. Using local MongoDB.');
    }
    
    // Optimized settings for serverless
    const options = {
      maxPoolSize: 10,
      minPoolSize: 1,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    const conn = await mongoose.connect(mongoURI, options);
    cachedConnection = conn;
    
    console.log(`📊 MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    
    // Don't exit in serverless
    if (process.env.NODE_ENV !== 'production') {
      process.exit(1);
    }
    throw error;
  }
};

export default connectDB;
