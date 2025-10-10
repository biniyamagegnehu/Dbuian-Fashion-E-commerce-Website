// src/services/api.js
import axios from 'axios';

// Use the deployed backend URL in production
const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api';


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
  getAll: () => api.get('/reviews'), // ✅ CHANGED: Use main reviews endpoint for admin
  getByProduct: (productId) => api.get(`/reviews/product/${productId}`),
  create: (data) => api.post('/reviews', data),
  update: (id, data) => api.put(`/reviews/${id}`, data),
  delete: (id) => api.delete(`/reviews/${id}`),
};

// Helper function to get full image URL
export const getImageUrl = (imagePath) => {
  if (!imagePath) return '/placeholder-image.jpg';
  
  console.log('Original image path:', imagePath);
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // If it's a Cloudinary URL, return as is
  if (imagePath.includes('cloudinary.com')) {
    return imagePath;
  }
  
  // Handle mock images - they should point to backend (port 5000), not frontend (port 5173)
  if (imagePath.includes('mock-images') || imagePath.startsWith('/api/mock-images')) {
    // Ensure we're pointing to the backend server
    const cleanPath = imagePath.startsWith('/') ? imagePath : `/api/mock-images/${imagePath}`;
    const fullUrl = `${API_BASE_URL}${cleanPath}`;
    console.log('Mock image full URL:', fullUrl);
    return fullUrl;
  }
  
  // Default case - point to backend
  return `${API_BASE_URL}/uploads/${imagePath}`;
};

export default api;