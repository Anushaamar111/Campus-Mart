import { verifyToken } from '../utils/jwt.js';
import User from '../models/User.js';

/**
 * Authentication Middleware
 * Verifies JWT and attaches user info to request
 */
export const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access denied. No token provided.' 
      });
    }

    const decoded = verifyToken(token);
    
    if (!decoded) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid or expired token.' 
      });
    }

    // Attach user info to request
    req.userId = decoded.userId;
    req.collegeId = decoded.collegeId;
    req.userRole = decoded.role;

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Authentication failed.' 
    });
  }
};

/**
 * CRITICAL: Silo Middleware
 * Ensures all database queries are filtered by the user's college
 * This prevents cross-campus data leakage
 */
export const verifyCampus = (req, res, next) => {
  if (!req.collegeId) {
    return res.status(403).json({ 
      success: false, 
      message: 'Campus verification failed. Invalid college ID.' 
    });
  }

  // Attach collegeId to query params for easy filtering
  req.campusFilter = { college: req.collegeId };
  
  next();
};

/**
 * Optional: Verify email before certain actions
 */
export const requireVerification = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    
    if (!user || !user.isVerified) {
      return res.status(403).json({ 
        success: false, 
        message: 'Email verification required.' 
      });
    }
    
    next();
  } catch (error) {
    console.error('Verification check error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Verification check failed.' 
    });
  }
};
