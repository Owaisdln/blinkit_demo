import api from './api';

// POST /api/address — body: { fullName, phone, houseNo, area, city, state, pincode }
export const addAddress = (data) => api.post('/address', data);

// GET /api/address
export const getAddresses = () => api.get('/address');

// PUT /api/address/:id
export const updateAddress = (id, data) => api.put(`/address/${id}`, data);

// DELETE /api/address/:id
export const deleteAddress = (id) => api.delete(`/address/${id}`);
