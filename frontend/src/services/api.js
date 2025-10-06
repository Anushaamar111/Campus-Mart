import axios from 'axios'
import Cookies from 'js-cookie'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api'

export const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      Cookies.remove('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
}

// Products API
export const productsAPI = {
  getAll: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  create: (formData) => api.post('/products', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id, formData) => api.put(`/products/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id) => api.delete(`/products/${id}`),
  markAsSold: (id, buyerId) => api.patch(`/products/${id}/sold`, { buyerId }),
  markAsAvailable: (id) => api.patch(`/products/${id}/available`),
  expressInterest: (id) => api.post(`/products/${id}/interest`),
  getMyProducts: (params) => api.get('/products/user/my-products', { params }),
  getUserProducts: (params) => api.get('/products/user/my-products', { params }),
}

// Wishlist API
export const wishlistAPI = {
  get: () => api.get('/wishlist'),
  add: (keyword) => api.post('/wishlist/add', { keyword }),
  remove: (keyword) => api.delete('/wishlist/remove', { data: { keyword } }),
  clear: () => api.delete('/wishlist/clear'),
}

// Notifications API
export const notificationsAPI = {
  getAll: () => api.get('/notifications'),
  markAsRead: (id) => api.patch(`/notifications/${id}/read`),
  markAllAsRead: () => api.patch('/notifications/mark-all-read'),
  delete: (id) => api.delete(`/notifications/${id}`),
  clearAll: () => api.delete('/notifications'),
  getUnreadCount: () => api.get('/notifications/unread-count'),
}

// Users API
export const usersAPI = {
  getProfile: (id) => api.get(`/users/${id}`),
}

// User API (for user-specific operations)
export const userAPI = {
  getStats: () => api.get('/users/stats/dashboard'),
}

// Default export for convenience
export default api;