import api from './api';

// POST /api/reviews/:productId — body: { rating, comment }
export const addReview = (productId, data) =>
  api.post(`/reviews/${productId}`, data);

// GET /api/reviews/:productId
export const getProductReviews = (productId) =>
  api.get(`/reviews/${productId}`);
