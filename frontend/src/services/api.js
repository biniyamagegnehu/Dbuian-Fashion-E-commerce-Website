// src/services/api.js
import axios from 'axios';

// Backend URL - use your working Render URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

console.log('🚀 API Base URL:', API_BASE_URL);

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add content type for non-form data
    if (!config.headers['Content-Type'] && !(config.data instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json';
    }
    
    console.log(`➡️ ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`✅ ${response.status} ${response.config.url}`, response.data);
    return response;
  },
  (error) => {
    console.error('❌ Response Error:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message,
      data: error.response?.data
    });
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    
    return Promise.reject(error);
  }
);

// Test backend connection
export const testBackendConnection = async () => {
  try {
    console.log('🧪 Testing backend connection...');
    const response = await api.get('/api/health');
    console.log('✅ Backend connection successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Backend connection failed:', error);
    throw error;
  }
};

// Products API - Updated to match your working backend
export const productsAPI = {
  getAll: async (params = {}) => {
    try {
      console.log('📦 Fetching products with params:', params);
      
      const response = await api.get('/api/products', { params });
      console.log('✅ Products response:', response.data);
      
      // Your backend returns { products: [], count, total, etc. }
      return {
        data: response.data // Directly return backend response
      };
    } catch (error) {
      console.error('❌ Error fetching products:', error);
      // Return empty data structure that matches your component expectations
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
      console.error('❌ Error fetching product:', error);
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
        data: response.data // Direct backend response
      };
    } catch (error) {
      console.error('❌ Error fetching featured products:', error);
      return {
        data: {
          products: [],
          count: 0,
          success: false
        }
      };
    }
  },

  getTrending: async () => {
    try {
      const response = await api.get('/api/products/trending');
      return {
        data: response.data // Direct backend response
      };
    } catch (error) {
      console.error('❌ Error fetching trending products:', error);
      return {
        data: {
          products: [],
          count: 0,
          success: false
        }
      };
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
  googleAuth: (credential) => api.post('/api/auth/google', { credential }),
  getMe: () => api.get('/api/auth/me'),
  updateDetails: (userData) => api.put('/api/auth/updatedetails', userData),
  updatePassword: (passwordData) => api.put('/api/auth/updatepassword', passwordData),
};

// Admin Auth API
export const adminAuthAPI = {
  login: (credentials) => api.post('/api/admin/auth/login', credentials),
  getMe: () => api.get('/api/admin/auth/me'),
};

// Admin Dashboard API
export const adminDashboardAPI = {
  getNotifications: () => api.get('/api/admin/notifications'),
};

// Users API
export const usersAPI = {
  getAll: (params = {}) => api.get('/api/users', { params }),
  getById: (id) => api.get(`/api/users/${id}`),
  create: (userData) => api.post('/api/users', userData),
  update: (id, userData) => api.put(`/api/users/${id}`, userData),
  delete: (id) => api.delete(`/api/users/${id}`),
  getStats: () => api.get('/api/users/stats'),
};

// Reviews API
export const reviewsAPI = {
  getAll: (params = {}) => api.get('/api/reviews', { params }),
  getByProduct: (productId) => api.get(`/api/reviews/product/${productId}`),
  create: (reviewData) => api.post('/api/reviews', reviewData),
  update: (id, reviewData) => api.put(`/api/reviews/${id}`, reviewData),
  delete: (id) => api.delete(`/api/reviews/${id}`),
  getMyReviews: () => api.get('/api/reviews/my-reviews'),
  respond: (id, adminResponse) => api.put(`/api/reviews/${id}/respond`, { adminResponse }),
};

// Upload API
export const uploadAPI = {
  uploadImage: (formData) => api.post('/api/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 60000
  }),
  uploadMultiple: (formData) => api.post('/api/upload/multiple', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 120000
  }),
  deleteImage: (publicId) => api.delete(`/api/upload/${publicId}`),
};

// src/services/api.js - ENHANCED getImageUrl
export const getImageUrl = (imagePath) => {
  if (!imagePath) {
    console.log('🖼️ Main Website: No image path provided');
    return '/images/placeholder.jpg';
  }

  console.log('🖼️ Main Website Processing:', imagePath, 'Type:', typeof imagePath);

  // Handle object format
  if (typeof imagePath === 'object' && imagePath !== null) {
    console.log('🖼️ Main Website: Image is object with keys:', Object.keys(imagePath));
    
    // Priority order for object URLs
    if (imagePath.secure_url) {
      console.log('🖼️ Main Website: Using secure_url:', imagePath.secure_url);
      return imagePath.secure_url;
    }
    if (imagePath.url) {
      console.log('🖼️ Main Website: Using url:', imagePath.url);
      // Recursively process the URL string
      return getImageUrl(imagePath.url);
    }
    
    console.log('🖼️ Main Website: Unknown object format, using placeholder');
    return '/images/placeholder.jpg';
  }

  // Handle string paths
  if (typeof imagePath === 'string') {
    // Already a full URL
    if (imagePath.startsWith('http')) {
      console.log('🖼️ Main Website: Already full URL:', imagePath);
      return imagePath;
    }

    // Cloudinary URL
    if (imagePath.includes('cloudinary.com')) {
      console.log('🖼️ Main Website: Cloudinary URL:', imagePath);
      return imagePath;
    }

    // Mock images - handle different formats
    if (imagePath.includes('mock_') || imagePath.startsWith('/api/mock-images/')) {
      let cleanPath = imagePath;
      
      if (imagePath.startsWith('/api/mock-images/')) {
        // Keep as is
      } else if (imagePath.startsWith('api/mock-images/')) {
        cleanPath = '/' + cleanPath;
      } else if (imagePath.includes('mock_')) {
        cleanPath = `/api/mock-images/${cleanPath}`;
      }
      
      const fullUrl = `${API_BASE_URL}${cleanPath}`;
      console.log('🖼️ Main Website: Constructed mock URL:', fullUrl);
      return fullUrl;
    }

    // Uploads
    if (imagePath.startsWith('/uploads/') || imagePath.startsWith('uploads/')) {
      const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
      const fullUrl = `${API_BASE_URL}${cleanPath}`;
      console.log('🖼️ Main Website: Constructed upload URL:', fullUrl);
      return fullUrl;
    }

    // If it's just a filename with extension, assume it's a mock image
    if (imagePath.match(/\.(jpg|jpeg|png|webp|gif)$/i)) {
      const fullUrl = `${API_BASE_URL}/api/mock-images/${imagePath}`;
      console.log('🖼️ Main Website: Constructed filename URL:', fullUrl);
      return fullUrl;
    }
  }

  // Unknown format
  console.log('🖼️ Main Website: Unknown image format, using placeholder');
  return '/images/placeholder.jpg';
};

// Health check
export const healthCheck = () => api.get('/api/health');

// Initialize connection test
testBackendConnection().then(() => {
  console.log('🎉 Frontend-backend connection established!');
}).catch(() => {
  console.log('⚠️ Connection test failed on startup');
});

export default api;