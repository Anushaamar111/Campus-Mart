import express from 'express';
import { body } from 'express-validator';
import {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  markAsSold,
  markAsAvailable,
  expressInterest,
  getMyProducts
} from '../controllers/productController.js';
import auth from '../middleware/auth.js';
import { upload, handleMulterError } from '../middleware/upload.js';

const router = express.Router();

// Validation rules for product creation
const productValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Product title is required')
    .isLength({ max: 100 })
    .withMessage('Title cannot exceed 100 characters'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Product description is required')
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),
  body('price')
    .isNumeric()
    .withMessage('Price must be a number')
    .custom(value => {
      if (value < 0) {
        throw new Error('Price cannot be negative');
      }
      return true;
    }),
  body('category')
    .isIn([
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
    ])
    .withMessage('Please select a valid category'),
  body('condition')
    .isIn(['New', 'Like New', 'Good', 'Fair', 'Poor'])
    .withMessage('Please select a valid condition'),
  body('location')
    .trim()
    .notEmpty()
    .withMessage('Location is required'),
  body('college')
    .optional()
    .trim(),
  body('contactPhone')
    .optional()
    .trim(),
  body('contactEmail')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address'),
  body('negotiable')
    .optional()
    .custom(value => {
      return value === 'true' || value === 'false' || value === true || value === false || value === undefined;
    })
    .withMessage('Negotiable must be true, false, or undefined')
];

// Public routes
router.get('/', getProducts);
router.get('/:id', auth, getProduct);

// Protected routes
router.post(
  '/',
  auth,
  upload.array('images', 5),
  handleMulterError,
  productValidation,
  createProduct
);

router.put(
  '/:id',
  auth,
  upload.array('images', 5),
  handleMulterError,
  updateProduct
);

router.delete('/:id', auth, deleteProduct);
router.patch('/:id/sold', auth, markAsSold);
router.patch('/:id/available', auth, markAsAvailable);
router.post('/:id/interest', auth, expressInterest);
router.get('/user/my-products', auth, getMyProducts);

export default router;