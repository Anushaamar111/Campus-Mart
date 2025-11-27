import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import College from '../models/College.js';
import { generateToken } from '../utils/jwt.js';
import { extractDomain, isEduEmail, generateVerificationCode } from '../utils/helpers.js';

const router = express.Router();

/**
 * POST /api/auth/register
 * Register a new user with automatic college assignment
 */
router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    // Validate required fields
    if (!email || !password || !firstName) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email, password, and first name are required.' 
      });
    }

    // Validate .edu email
    if (!isEduEmail(email)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Only .edu email addresses are allowed.' 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'An account with this email already exists.' 
      });
    }

    // CRITICAL: Extract domain and find/create college
    const domain = extractDomain(email);
    if (!domain) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid email format.' 
      });
    }

    let college = await College.findOne({ domain });

    if (!college) {
      // Create new college entry
      const collegeName = domain
        .replace('.edu', '')
        .split('.')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ') + ' University';

      college = await College.create({
        name: collegeName,
        domain,
        // Default coordinates (can be updated later)
        gpsCenter: { lat: 0, lng: 0 },
        safeZones: []
      });

      console.log(`✨ New college created: ${collegeName} (${domain})`);
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate verification code
    const verificationCode = generateVerificationCode();

    // Create user
    const user = await User.create({
      email: email.toLowerCase(),
      password: hashedPassword,
      firstName,
      lastName: lastName || '',
      college: college._id,
      verificationCode,
      isVerified: false // Set to true for development, false for production
    });

    // Generate JWT with collegeId
    const token = generateToken(user._id, college._id);

    // Return user data (without password)
    res.status(201).json({
      success: true,
      message: 'Registration successful.',
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        college: {
          id: college._id,
          name: college.name,
          domain: college.domain,
          themeColor: college.themeColor
        },
        isVerified: user.isVerified
      }
    });

    // TODO: Send verification email with code
    // sendVerificationEmail(user.email, verificationCode);

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Registration failed. Please try again.' 
    });
  }
});

/**
 * POST /api/auth/login
 * Login existing user
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email and password are required.' 
      });
    }

    // Find user and include password field
    const user = await User.findOne({ email: email.toLowerCase() })
      .select('+password')
      .populate('college', 'name domain themeColor');

    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password.' 
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password.' 
      });
    }

    // Generate JWT with collegeId
    const token = generateToken(user._id, user.college._id);

    res.json({
      success: true,
      message: 'Login successful.',
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        college: {
          id: user.college._id,
          name: user.college.name,
          domain: user.college.domain,
          themeColor: user.college.themeColor
        },
        isVerified: user.isVerified,
        savedItems: user.savedItems
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Login failed. Please try again.' 
    });
  }
});

/**
 * POST /api/auth/verify-email
 * Verify email with code
 */
router.post('/verify-email', async (req, res) => {
  try {
    const { email, code } = req.body;

    const user = await User.findOne({ 
      email: email.toLowerCase() 
    }).select('+verificationCode');

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found.' 
      });
    }

    if (user.isVerified) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email already verified.' 
      });
    }

    if (user.verificationCode !== code) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid verification code.' 
      });
    }

    user.isVerified = true;
    user.verificationCode = undefined;
    await user.save();

    res.json({
      success: true,
      message: 'Email verified successfully.'
    });

  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Verification failed.' 
    });
  }
});

export default router;
