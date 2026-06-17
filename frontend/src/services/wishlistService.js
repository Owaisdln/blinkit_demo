import api from './api';

// POST /api/wishlist/:productId
export const addToWishlist = (productId) =>
  api.post(`/wishlist/${productId}`);

// GET /api/wishlist
export const getWishlist = () => api.get('/wishlist');

// DELETE /api/wishlist/:productId
export const removeFromWishlist = (productId) =>
  api.delete(`/wishlist/${productId}`);
