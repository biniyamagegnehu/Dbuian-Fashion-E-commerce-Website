// src/services/api.js
import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL:  'http://localhost:5000/api',
  timeout: 30000, // Increased timeout
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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
    // Handle backend response structure
    if (response.data && response.data.success !== undefined) {
      return {
        ...response,
        data: response.data.data || response.data // Normalize response
      };
    }
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    // Return a consistent error structure
    return Promise.reject({
      message: error.response?.data?.message || 'Network error occurred',
      status: error.response?.status,
      data: error.response?.data
    });
  }
);

// Auth API - Updated to match backend
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
  updateDetails: (userData) => api.put('/auth/updatedetails', userData),
  updatePassword: (passwordData) => api.put('/auth/updatepassword', passwordData),
};

// Admin Auth API
export const adminAuthAPI = {
  login: (credentials) => api.post('/admin/auth/login', credentials),
  getMe: () => api.get('/admin/auth/me'),
};

// Products API - Updated to handle backend response structure
export const productsAPI = {
  getAll: async (params = {}) => {
    try {
      // Convert frontend filter names to backend expected names
      const backendParams = {
        ...params,
        priceMin: params.priceRange?.min,
        priceMax: params.priceRange?.max,
        search: params.search,
        category: params.category === 'all' ? '' : params.category,
        gender: params.gender === 'all' ? '' : params.gender,
        size: params.size === 'all' ? '' : params.size,
        sort: params.sort || 'newest',
        page: params.page || 1,
        limit: params.limit || 12
      };
      
      // Remove undefined parameters
      Object.keys(backendParams).forEach(key => {
        if (backendParams[key] === undefined || backendParams[key] === '') {
          delete backendParams[key];
        }
      });
      
      const response = await api.get('/products', { params: backendParams });
      
      // Handle backend response structure
      return {
        data: {
          products: response.data.products || response.data,
          count: response.data.count,
          total: response.data.total,
          success: true
        }
      };
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },
  
  getById: async (id) => {
    try {
      const response = await api.get(`/products/${id}`);
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
  
  create: (productData) => api.post('/products', productData),
  update: (id, productData) => api.put(`/products/${id}`, productData),
  delete: (id) => api.delete(`/products/${id}`),
  
  getFeatured: async () => {
    try {
      const response = await api.get('/products/featured');
      return {
        data: {
          products: response.data.products || response.data,
          count: response.data.count,
          success: true
        }
      };
    } catch (error) {
      console.error('Error fetching featured products:', error);
      throw error;
    }
  },
  
  getTrending: async () => {
    try {
      const response = await api.get('/products/trending');
      return {
        data: {
          products: response.data.products || response.data,
          count: response.data.count,
          success: true
        }
      };
    } catch (error) {
      console.error('Error fetching trending products:', error);
      throw error;
    }
  },
  
  getByCategory: (category) => api.get(`/products/category/${category}`),
  updateStock: (id, stock) => api.put(`/products/${id}/stock`, { stock }),
};

// Orders API - Updated
export const ordersAPI = {
  getAll: (params = {}) => api.get('/orders', { params }),
  getById: (id) => api.get(`/orders/${id}`),
  create: (orderData) => api.post('/orders', orderData),
  updateStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
  getUserOrders: () => api.get('/orders/myorders'),
  delete: (id) => api.delete(`/orders/${id}`),
};

// Users API
export const usersAPI = {
  getAll: (params = {}) => api.get('/users', { params }),
  getById: (id) => api.get(`/users/${id}`),
  update: (id, userData) => api.put(`/users/${id}`, userData),
  delete: (id) => api.delete(`/users/${id}`),
  getStats: () => api.get('/users/stats'),
};

// Reviews API
export const reviewsAPI = {
  getAll: (params = {}) => api.get('/reviews', { params }),
  getByProduct: (productId) => api.get(`/reviews/product/${productId}`),
  create: (reviewData) => api.post('/reviews', reviewData),
  update: (id, reviewData) => api.put(`/reviews/${id}`, reviewData),
  delete: (id) => api.delete(`/reviews/${id}`),
  getMyReviews: () => api.get('/reviews/my-reviews'),
};

// Upload API
export const uploadAPI = {
  uploadImage: (formData) => api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  uploadMultiple: (formData) => api.post('/upload/multiple', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  deleteImage: (publicId) => api.delete(`/upload/${publicId}`),
};

// Helper function to get full image URL
export const getImageUrl = (imagePath) => {
  if (!imagePath) return '/images/placeholder.jpg';
  
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  if (imagePath.startsWith('/api/mock-images/')) {
    return `http://localhost:5000${imagePath}`;
  }
  
  if (imagePath.startsWith('/uploads/')) {
    return `http://localhost:5000${imagePath}`;
  }
  
  // Handle Cloudinary URLs and other cases
  return imagePath;
};

// Health check
export const healthCheck = () => api.get('/health');

// Test endpoint
export const testAPI = () => api.get('/test');

export default api;