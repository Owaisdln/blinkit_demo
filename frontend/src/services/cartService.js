import api from './api';

// POST /api/cart/add — body: { productId, quantity }
export const addToCart = (productId, quantity) =>
  api.post('/cart/add', { productId, quantity });

// GET /api/cart
export const getCart = () => api.get('/cart');

// DELETE /api/cart/remove/:id — :id is the cart item _id
export const removeCartItem = (cartItemId) =>
  api.delete(`/cart/remove/${cartItemId}`);
