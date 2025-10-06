import { api } from './api';

// Get user's wishlist
export const getWishlist = async () => {
  try {
    const response = await api.get('/wishlist');
    return response.data;
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    throw error;
  }
};

// Add keyword to wishlist
export const addWishlistKeyword = async (keywordData) => {
  try {
    const response = await api.post('/wishlist/add', keywordData);
    return response.data.keyword;
  } catch (error) {
    console.error('Error adding keyword:', error);
    throw error;
  }
};

// Remove keyword from wishlist
export const removeWishlistKeyword = async (keywordId) => {
  try {
    const response = await api.delete(`/wishlist/remove/${keywordId}`);
    return response.data;
  } catch (error) {
    console.error('Error removing keyword:', error);
    throw error;
  }
};

// Update wishlist keyword
export const updateWishlistKeyword = async (keywordId, updates) => {
  try {
    const response = await api.put(`/wishlist/update/${keywordId}`, updates);
    return response.data.keyword;
  } catch (error) {
    console.error('Error updating keyword:', error);
    throw error;
  }
};

// Clear entire wishlist
export const clearWishlist = async () => {
  try {
    const response = await api.delete('/wishlist/clear');
    return response.data;
  } catch (error) {
    console.error('Error clearing wishlist:', error);
    throw error;
  }
};

// Get products matching wishlist
export const getWishlistMatches = async () => {
  try {
    const response = await api.get('/wishlist/matches');
    return response.data;
  } catch (error) {
    console.error('Error fetching matches:', error);
    throw error;
  }
};

// Get smart suggestions for wishlist keywords
export const getSuggestions = async () => {
  try {
    const response = await api.get('/wishlist/suggestions');
    return response.data;
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    throw error;
  }
};

// Get wishlist match history from notifications
export const getMatchHistory = async () => {
  try {
    const response = await api.get('/wishlist/history');
    return response.data;
  } catch (error) {
    console.error('Error fetching history:', error);
    throw error;
  }
};

// Export wishlist with format and options
export const exportWishlist = async (format = 'json', options = {}) => {
  try {
    const response = await api.get('/wishlist/export', {
      params: { format, ...options },
      responseType: 'blob'
    });
    return response;
  } catch (error) {
    console.error('Error exporting wishlist:', error);
    throw error;
  }
};

// Add keyword from suggestion (convenience function)
export const addKeywordFromSuggestion = async (keyword, category = 'Uncategorized') => {
  return addWishlistKeyword({
    keyword,
    category,
    priority: 'medium',
    isActive: true
  });
};

// Legacy functions for backward compatibility
export const addToWishlist = addWishlistKeyword;
export const removeFromWishlist = (keyword) => {
  // This would need keyword ID, but kept for compatibility
  console.warn('removeFromWishlist is deprecated, use removeWishlistKeyword instead');
  throw new Error('Use removeWishlistKeyword with keyword ID');
};