import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const envPath = join(__dirname, '.env');
dotenv.config({ path: envPath });

import connectDB from './config/database.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import productRoutes from './routes/products.js';
import wishlistRoutes from './routes/wishlist.js';
import notificationRoutes from './routes/notifications.js';

const app = express();

// Connect to MongoDB
connectDB();

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

// Middleware
app.use(helmet());
app.use(limiter);

// CORS configuration for multiple environments
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001', 
  'http://localhost:3002',
  'http://localhost:5173', // Vite default port
  'https://campus-mart-frontend-chi.vercel.app', // Your deployed frontend
  process.env.FRONTEND_URL // Environment variable for flexibility
].filter(Boolean); // Remove undefined values

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/notifications', notificationRoutes);

// Root endpoint for deployment health checks
app.get('/', (req, res) => {
  res.status(200).json({ 
    message: 'CampusMart API is running!',
    version: '1.0.0',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      products: '/api/products',
      users: '/api/users',
      wishlist: '/api/wishlist',
      notifications: '/api/notifications'
    }
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    message: 'CampusMart API is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    database: 'connected' // You could add actual DB health check here
  });
});

// Catch-all for unmatched API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ 
    message: 'API endpoint not found',
    path: req.originalUrl,
    availableEndpoints: [
      '/api/health',
      '/api/auth/login',
      '/api/auth/register',
      '/api/products',
      '/api/users',
      '/api/wishlist',
      '/api/notifications'
    ]
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
  next(); // Call next to continue to other error handlers if needed
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5001;

// Graceful shutdown handler
const gracefulShutdown = (server) => {
  const shutdown = (signal) => {
    console.log(`\n👋 ${signal} received, shutting down gracefully...`);
    if (server) {
      server.close((err) => {
        if (err) {
          console.error('❌ Error during server shutdown:', err);
          process.exit(1);
        }
        console.log('✅ Server closed successfully');
        process.exit(0);
      });
      
      // Force close after 10 seconds
      setTimeout(() => {
        console.log('⚠️  Forcing server shutdown...');
        process.exit(1);
      }, 10000);
    } else {
      process.exit(0);
    }
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGUSR2', () => shutdown('SIGUSR2')); // Nodemon restart
};

// Start server with error handling
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL}`);
});

// Handle server errors
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use!`);
    console.log('💡 To fix this issue:');
    console.log('   1. Stop any running Node.js processes');
    console.log('   2. Use a different port in your .env file');
    console.log('   3. Or kill the process using the port');
    process.exit(1);
  } else {
    console.error('❌ Server error:', err);
    process.exit(1);
  }
});

// Setup graceful shutdown
gracefulShutdown(server);

// Socket.io setup for real-time notifications
import { Server } from 'socket.io';
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
  }
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined room`);
  });
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Make io accessible to other modules
app.set('io', io);

export default app;