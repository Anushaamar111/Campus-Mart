import express from 'express';
import { body } from 'express-validator';
import {
  addToWishlist,
  removeFromWishlist,
  updateWishlistKeyword,
  getWishlist,
  clearWishlist,
  getWishlistMatches,
  getSuggestions,
  getMatchHistory,
  exportWishlist
} from '../controllers/wishlistController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Validation for adding wishlist keywords
const addWishlistValidation = [
  body('keyword')
    .trim()
    .notEmpty()
    .withMessage('Keyword is required')
    .isLength({ max: 50 })
    .withMessage('Keyword cannot exceed 50 characters'),
  body('category')
    .optional()
    .trim()
    .isLength({ max: 30 })
    .withMessage('Category cannot exceed 30 characters'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Priority must be low, medium, or high'),
  body('maxPrice')
    .optional()
    .isNumeric()
    .withMessage('Max price must be a number')
];

// Routes
router.get('/', auth, getWishlist);
router.get('/matches', auth, getWishlistMatches);
router.get('/suggestions', auth, getSuggestions);
router.get('/history', auth, getMatchHistory);
router.get('/export', auth, exportWishlist);
router.post('/add', auth, addWishlistValidation, addToWishlist);
router.put('/update/:keywordId', auth, updateWishlistKeyword);
router.delete('/remove/:keywordId', auth, removeFromWishlist);
router.delete('/clear', auth, clearWishlist);

export default router;