import api from './api';

// GET /api/products?category=
export const getProducts = (category) =>
  api.get('/products', { params: category ? { category } : {} });

// GET /api/products/categories
export const getCategories = () => api.get('/products/categories');

// GET /api/products/search?q=
export const searchProducts = (q) =>
  api.get('/products/search', { params: { q } });

// GET /api/products/:id
export const getProduct = (id) => api.get(`/products/${id}`);

// POST /api/products
export const createProduct = (data) => api.post('/products', data);
