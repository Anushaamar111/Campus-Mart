import { api } from './api';

// Get all notifications
export const getNotifications = async () => {
  const response = await api.get('/notifications');
  return response.data;
};

// Get unread notifications count
export const getUnreadCount = async () => {
  const response = await api.get('/notifications/unread-count');
  return response.data;
};

// Mark notification as read
export const markNotificationAsRead = async (notificationId) => {
  const response = await api.patch(`/notifications/${notificationId}/read`);
  return response.data;
};

// Mark all notifications as read
export const markAllNotificationsAsRead = async () => {
  const response = await api.patch('/notifications/mark-all-read');
  return response.data;
};

// Delete notification
export const deleteNotification = async (notificationId) => {
  const response = await api.delete(`/notifications/${notificationId}`);
  return response.data;
};

// Clear all notifications
export const clearAllNotifications = async () => {
  const response = await api.delete('/notifications');
  return response.data;
};