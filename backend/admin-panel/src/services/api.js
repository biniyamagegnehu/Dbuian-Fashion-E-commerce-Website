// src/services/api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (credentials) => api.post('/admin/auth/login', credentials),
  getMe: () => api.get('/admin/auth/me'),
};

export const usersAPI = {
  getStats: () => api.get('/users/stats'),
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
};

export const ordersAPI = {
  getAll: () => api.get('/orders'),
  getById: (id) => api.get(`/orders/${id}`),
  updateStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
  delete: (id) => api.delete(`/orders/${id}`),
};

export const productsAPI = {
  getAll: () => api.get('/products'),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
  updateStock: (id, stock) => api.put(`/products/${id}/stock`, { stock }),
};

export const uploadAPI = {
  uploadImage: (formData) => api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  deleteImage: (publicId) => api.delete(`/upload/${publicId}`),
};

export const reviewsAPI = {
  getAll: () => api.get('/reviews'),
  getByProduct: (productId) => api.get(`/reviews/product/${productId}`),
  delete: (id) => api.delete(`/reviews/${id}`),
};

// Helper function to get full image URL
export const getImageUrl = (imageUrl) => {
  if (!imageUrl) return '';
  
  // If it's already a full URL, return as is
  if (imageUrl.startsWith('http')) {
    return imageUrl;
  }
  
  // If it's a base64 data URL, return as is
  if (imageUrl.startsWith('data:')) {
    return imageUrl;
  }
  
  // If it's a mock image path, construct the full URL
  if (imageUrl.startsWith('/api/mock-images/')) {
    return `http://localhost:5000${imageUrl}`;
  }
  
  // Return the original URL for other cases
  return imageUrl;
};

export default api;