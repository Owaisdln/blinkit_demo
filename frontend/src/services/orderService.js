import api from './api';

// POST /api/orders — body: { items: [{ product, quantity }] }
export const placeOrder = (items) => api.post('/orders', { items });

// GET /api/orders
export const getMyOrders = () => api.get('/orders');

// GET /api/orders/:id
export const getSingleOrder = (id) => api.get(`/orders/${id}`);

// POST /api/orders/:id/cancel
export const cancelOrder = (id) => api.post(`/orders/${id}/cancel`);
