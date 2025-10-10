// src/services/api.js
import axios from 'axios';

// Determine the correct API URL
const getAPIBaseURL = () => {
  // For production (Vercel)
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  // For development
  return 'http://localhost:5000';
};

const API_BASE_URL = getAPIBaseURL();

console.log('🔧 API Base URL:', API_BASE_URL); // Debug log

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  withCredentials: false, // Set to false for deployed apps
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Add content type if not set
    if (!config.headers['Content-Type']) {
      config.headers['Content-Type'] = 'application/json';
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', {
      message: error.message,
      status: error.response?.status,
      url: error.config?.url,
      data: error.response?.data
    });
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Don't redirect automatically in production, let components handle it
      console.log('Authentication failed');
    }
    
    if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
      console.error('Network error - check if backend is running');
    }
    
    return Promise.reject(error);
  }
);

// Health check function
export const testConnection = async () => {
  try {
    console.log('Testing connection to:', API_BASE_URL);
    const response = await api.get('/api/health');
    console.log('✅ Backend connection successful');
    return response.data;
  } catch (error) {
    console.error('❌ Backend connection failed:', error.message);
    throw error;
  }
};

// Products API - Simplified
export const productsAPI = {
  getAll: async (params = {}) => {
    try {
      console.log('Fetching products from:', `${API_BASE_URL}/api/products`);
      
      const response = await api.get('/api/products', { params });
      
      // Handle different response structures
      let products = [];
      if (response.data.products) {
        products = response.data.products;
      } else if (Array.isArray(response.data)) {
        products = response.data;
      } else {
        products = [response.data];
      }
      
      return {
        data: {
          products,
          count: response.data.count || products.length,
          total: response.data.total || products.length,
          success: true
        }
      };
    } catch (error) {
      console.error('Error fetching products:', error);
      // Return empty data instead of throwing to prevent UI crashes
      return {
        data: {
          products: [],
          count: 0,
          total: 0,
          success: false,
          error: error.message
        }
      };
    }
  },
  
  getById: async (id) => {
    try {
      const response = await api.get(`/api/products/${id}`);
      return {
        data: {
          product: response.data.product || response.data,
          success: true
        }
      };
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  },
  
  create: (productData) => api.post('/api/products', productData),
  update: (id, productData) => api.put(`/api/products/${id}`, productData),
  delete: (id) => api.delete(`/api/products/${id}`),
  
  getFeatured: async () => {
    try {
      const response = await api.get('/api/products/featured');
      return {
        data: {
          products: response.data.products || response.data,
          count: response.data.count,
          success: true
        }
      };
    } catch (error) {
      console.error('Error fetching featured products:', error);
      return { data: { products: [], count: 0, success: false } };
    }
  },
  
  getTrending: async () => {
    try {
      const response = await api.get('/api/products/trending');
      return {
        data: {
          products: response.data.products || response.data,
          count: response.data.count,
          success: true
        }
      };
    } catch (error) {
      console.error('Error fetching trending products:', error);
      return { data: { products: [], count: 0, success: false } };
    }
  },
  
  getByCategory: (category) => api.get(`/api/products/category/${category}`),
  updateStock: (id, stock) => api.put(`/api/products/${id}/stock`, { stock }),
};

// Orders API
export const ordersAPI = {
  getAll: (params = {}) => api.get('/api/orders', { params }),
  getById: (id) => api.get(`/api/orders/${id}`),
  create: (orderData) => api.post('/api/orders', orderData),
  updateStatus: (id, status) => api.put(`/api/orders/${id}/status`, { status }),
  getUserOrders: () => api.get('/api/orders/myorders'),
  delete: (id) => api.delete(`/api/orders/${id}`),
};

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/api/auth/login', credentials),
  register: (userData) => api.post('/api/auth/register', userData),
  getMe: () => api.get('/api/auth/me'),
  updateDetails: (userData) => api.put('/api/auth/updatedetails', userData),
  updatePassword: (passwordData) => api.put('/api/auth/updatepassword', passwordData),
};

// Admin Auth API
export const adminAuthAPI = {
  login: (credentials) => api.post('/api/admin/auth/login', credentials),
  getMe: () => api.get('/api/admin/auth/me'),
};

// Upload API
export const uploadAPI = {
  uploadImage: (formData) => api.post('/api/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 60000
  }),
  uploadMultiple: (formData) => api.post('/api/upload/multiple', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 60000
  }),
  deleteImage: (publicId) => api.delete(`/api/upload/${publicId}`),
};

// Helper function to get full image URL
export const getImageUrl = (imagePath) => {
  if (!imagePath) {
    return '/images/placeholder.jpg';
  }
  
  console.log('Processing image path:', imagePath);
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // If it's a Cloudinary URL, return as is
  if (imagePath.includes('cloudinary.com')) {
    return imagePath;
  }
  
  // Handle mock images
  if (imagePath.startsWith('/api/mock-images/')) {
    return `${API_BASE_URL}${imagePath}`;
  }
  
  if (imagePath.includes('mock_')) {
    return `${API_BASE_URL}/api/mock-images/${imagePath}`;
  }
  
  // Handle uploads
  if (imagePath.startsWith('/uploads/')) {
    return `${API_BASE_URL}${imagePath}`;
  }
  
  // Default case
  return `${API_BASE_URL}/uploads/${imagePath}`;
};

// Health check
export const healthCheck = () => api.get('/api/health');

export default api;