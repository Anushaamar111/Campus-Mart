import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // For development, we'll use a fallback local database if Atlas fails
    let mongoUri = process.env.MONGODB_URI;
    
    // MongoDB connection options optimized for Windows SSL compatibility
    const connectionOptions = {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      minPoolSize: 5,
      connectTimeoutMS: 10000,
      family: 4, // Use IPv4, skip trying IPv6
    };
    
    const conn = await mongoose.connect(mongoUri, connectionOptions);
    
    console.log(`🍃 MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    
    // In development, provide multiple fallback options
    if (process.env.NODE_ENV === 'development') {
      console.log('🔄 Attempting fallback connections...');
      
      // Try Atlas with different SSL settings
      try {
        console.log('🔄 Trying Atlas with relaxed SSL...');
        const atlasUriSimple = mongoUri.replace('?retryWrites=true&w=majority&tls=true&tlsAllowInvalidCertificates=true', '?ssl=false');
        const atlasConn = await mongoose.connect(atlasUriSimple, {
          serverSelectionTimeoutMS: 5000,
          family: 4,
        });
        console.log(`🍃 MongoDB Atlas Connected (relaxed SSL): ${atlasConn.connection.host}`);
        return;
      } catch {
        console.log('⚠️ Atlas relaxed SSL also failed');
      }
      
      // Try local MongoDB
      try {
        console.log('🔄 Trying local MongoDB...');
        const localConn = await mongoose.connect('mongodb://127.0.0.1:27017/campusmart', {
          serverSelectionTimeoutMS: 3000,
        });
        console.log(`🍃 Local MongoDB Connected: ${localConn.connection.host}`);
        return;
      } catch {
        console.log('⚠️ Local MongoDB not available');
      }
      
      // Continue without database for development
      console.log('💡 Continuing without database connection for development...');
      console.log('💡 The app will work but data won\'t persist');
      console.log('💡 To fix: Install MongoDB locally or resolve Atlas SSL issues');
      
    } else {
      // In production, fail hard if database is unavailable
      console.error('💥 Database connection required in production');
      process.exit(1);
    }
  }
};

export default connectDB;