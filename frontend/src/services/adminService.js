import api from './api';

// GET /api/admin/dashboard
export const getDashboard = () => api.get('/admin/dashboard');

// PUT /api/admin/orders/:id/status — body: { status }
export const updateOrderStatus = (id, status) =>
  api.put(`/admin/orders/${id}/status`, { status });
