import express from 'express';
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications,
  getUnreadCount
} from '../controllers/notificationController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Routes
router.get('/', auth, getNotifications);
router.get('/unread-count', auth, getUnreadCount);
router.patch('/:notificationId/read', auth, markAsRead);
router.patch('/mark-all-read', auth, markAllAsRead);
router.delete('/:notificationId', auth, deleteNotification);
router.delete('/', auth, clearAllNotifications);

export default router;