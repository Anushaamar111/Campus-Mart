import User from '../models/User.js';

// Get user notifications
const getNotifications = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('notifications')
      .populate('notifications.productId', 'title price images');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Sort notifications by creation date (newest first)
    const notifications = user.notifications.sort((a, b) => b.createdAt - a.createdAt);

    res.json({ notifications });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Mark notification as read
const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const notification = user.notifications.id(notificationId);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    notification.isRead = true;
    await user.save();

    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    console.error('Mark notification as read error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Mark all notifications as read
const markAllAsRead = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.notifications.forEach(notification => {
      notification.isRead = true;
    });
    
    await user.save();

    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Mark all notifications as read error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete notification
const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.notifications.id(notificationId).remove();
    await user.save();

    res.json({ message: 'Notification deleted' });
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Clear all notifications
const clearAllNotifications = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.notifications = [];
    await user.save();

    res.json({ message: 'All notifications cleared' });
  } catch (error) {
    console.error('Clear all notifications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get unread notification count
const getUnreadCount = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('notifications');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const unreadCount = user.notifications.filter(notification => !notification.isRead).length;

    res.json({ unreadCount });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications,
  getUnreadCount
};