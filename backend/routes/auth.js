import express from 'express';
import { body } from 'express-validator';
import { register, login, getMe, updateProfile } from '../controllers/authController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Validation rules
const registerValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ max: 50 })
    .withMessage('Name cannot exceed 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('college')
    .trim()
    .notEmpty()
    .withMessage('College name is required'),
  body('year')
    .isIn(['1st Year', '2nd Year', '3rd Year', '4th Year', 'Graduate'])
    .withMessage('Please select a valid academic year'),
  body('phone')
    .optional()
    .matches(/^\d{10}$/)
    .withMessage('Please enter a valid 10-digit phone number')
];

const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Routes
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/me', auth, getMe);
router.put('/profile', auth, updateProfile);

export default router;