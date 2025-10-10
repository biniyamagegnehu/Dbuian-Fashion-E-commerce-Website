// src/services/api.js
import axios from 'axios';

// Determine the correct API URL for both development and production
const getAPIBaseURL = () => {
  // For production (Vercel)
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  // For development
  return 'http://localhost:5000';
};

const API_BASE_URL = getAPIBaseURL();

console.log('🔧 API Configuration:', {
  baseURL: API_BASE_URL,
  environment: process.env.NODE_ENV,
  hasCustomURL: !!process.env.REACT_APP_API_URL
});

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  withCredentials: false, // Important for cross-domain deployment
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add content type if not set (especially for non-form-data requests)
    if (!config.headers['Content-Type'] && !(config.data instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json';
    }
    
    console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`, {
      params: config.params,
      hasData: !!config.data,
      hasAuth: !!token
    });
    
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url} - Status: ${response.status}`);
    return response;
  },
  (error) => {
    const errorDetails = {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      url: error.config?.url,
      method: error.config?.method,
      data: error.response?.data
    };
    
    console.error('❌ API Error:', errorDetails);
    
    // Handle specific error cases
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      console.log('🔐 Authentication failed - redirecting to login');
      // Don't redirect automatically in production, let components handle it
    }
    
    if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
      console.error('🌐 Network error - backend might be down or CORS issue');
    }
    
    if (error.response?.status === 404) {
      console.error('🔍 Endpoint not found - check route configuration');
    }
    
    // Return a consistent error structure
    return Promise.reject({
      message: error.response?.data?.message || error.message || 'Network error occurred',
      status: error.response?.status,
      data: error.response?.data,
      code: error.code
    });
  }
);

// Test connection function
export const testConnection = async () => {
  try {
    console.log('🧪 Testing backend connection to:', API_BASE_URL);
    const response = await api.get('/api/health');
    console.log('✅ Backend connection successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Backend connection failed:', error.message);
    throw error;
  }
};

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/api/auth/login', credentials),
  register: (userData) => api.post('/api/auth/register', userData),
  getMe: () => api.get('/api/auth/me'),
  updateDetails: (userData) => api.put('/api/auth/updatedetails', userData),
  updatePassword: (passwordData) => api.put('/api/auth/updatepassword', passwordData),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return Promise.resolve();
  }
};

// Admin Auth API
export const adminAuthAPI = {
  login: (credentials) => api.post('/api/admin/auth/login', credentials),
  getMe: () => api.get('/api/admin/auth/me'),
  logout: () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    return Promise.resolve();
  }
};

// Products API - Enhanced with better error handling
export const productsAPI = {
  getAll: async (params = {}) => {
    try {
      console.log('📦 Fetching products with params:', params);
      
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
      
      // Remove undefined or empty parameters
      Object.keys(backendParams).forEach(key => {
        if (backendParams[key] === undefined || backendParams[key] === '' || backendParams[key] === null) {
          delete backendParams[key];
        }
      });
      
      const response = await api.get('/api/products', { params: backendParams });
      
      // Handle different backend response structures
      let products = [];
      let count = 0;
      let total = 0;
      
      if (response.data.products) {
        products = response.data.products;
        count = response.data.count || products.length;
        total = response.data.total || products.length;
      } else if (Array.isArray(response.data)) {
        products = response.data;
        count = products.length;
        total = products.length;
      } else {
        products = [response.data];
        count = 1;
        total = 1;
      }
      
      console.log(`📦 Loaded ${products.length} products`);
      
      return {
        data: {
          products,
          count,
          total,
          success: true
        }
      };
    } catch (error) {
      console.error('❌ Error fetching products:', error);
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
      console.log(`📦 Fetching product ${id}`);
      const response = await api.get(`/api/products/${id}`);
      
      return {
        data: {
          product: response.data.product || response.data,
          success: true
        }
      };
    } catch (error) {
      console.error(`❌ Error fetching product ${id}:`, error);
      throw error;
    }
  },
  
  create: (productData) => {
    console.log('📦 Creating new product');
    return api.post('/api/products', productData);
  },
  
  update: (id, productData) => {
    console.log(`📦 Updating product ${id}`);
    return api.put(`/api/products/${id}`, productData);
  },
  
  delete: (id) => {
    console.log(`📦 Deleting product ${id}`);
    return api.delete(`/api/products/${id}`);
  },
  
  getFeatured: async () => {
    try {
      console.log('⭐ Fetching featured products');
      const response = await api.get('/api/products/featured');
      
      return {
        data: {
          products: response.data.products || response.data,
          count: response.data.count,
          success: true
        }
      };
    } catch (error) {
      console.error('❌ Error fetching featured products:', error);
      return { 
        data: { 
          products: [], 
          count: 0, 
          success: false,
          error: error.message
        } 
      };
    }
  },
  
  getTrending: async () => {
    try {
      console.log('🔥 Fetching trending products');
      const response = await api.get('/api/products/trending');
      
      return {
        data: {
          products: response.data.products || response.data,
          count: response.data.count,
          success: true
        }
      };
    } catch (error) {
      console.error('❌ Error fetching trending products:', error);
      return { 
        data: { 
          products: [], 
          count: 0, 
          success: false,
          error: error.message
        } 
      };
    }
  },
  
  getByCategory: (category) => {
    console.log(`📂 Fetching products by category: ${category}`);
    return api.get(`/api/products/category/${category}`);
  },
  
  updateStock: (id, stock) => {
    console.log(`📊 Updating stock for product ${id} to ${stock}`);
    return api.put(`/api/products/${id}/stock`, { stock });
  },
};

// Orders API
export const ordersAPI = {
  getAll: (params = {}) => {
    console.log('📋 Fetching orders with params:', params);
    return api.get('/api/orders', { params });
  },
  
  getById: (id) => {
    console.log(`📋 Fetching order ${id}`);
    return api.get(`/api/orders/${id}`);
  },
  
  create: (orderData) => {
    console.log('📋 Creating new order');
    return api.post('/api/orders', orderData);
  },
  
  updateStatus: (id, status) => {
    console.log(`📋 Updating order ${id} status to ${status}`);
    return api.put(`/api/orders/${id}/status`, { status });
  },
  
  getUserOrders: () => {
    console.log('📋 Fetching user orders');
    return api.get('/api/orders/myorders');
  },
  
  delete: (id) => {
    console.log(`📋 Deleting order ${id}`);
    return api.delete(`/api/orders/${id}`);
  },
};

// Users API
export const usersAPI = {
  getAll: (params = {}) => api.get('/api/users', { params }),
  getById: (id) => api.get(`/api/users/${id}`),
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
};

// Upload API
export const uploadAPI = {
  uploadImage: (formData) => {
    console.log('🖼️ Uploading image');
    return api.post('/api/upload', formData, {
      headers: { 
        'Content-Type': 'multipart/form-data' 
      },
      timeout: 60000 // Longer timeout for file uploads
    });
  },
  
  uploadMultiple: (formData) => {
    console.log('🖼️ Uploading multiple images');
    return api.post('/api/upload/multiple', formData, {
      headers: { 
        'Content-Type': 'multipart/form-data' 
      },
      timeout: 120000 // Even longer timeout for multiple files
    });
  },
  
  deleteImage: (publicId) => {
    console.log(`🖼️ Deleting image: ${publicId}`);
    return api.delete(`/api/upload/${publicId}`);
  },
};

// Helper function to get full image URL
export const getImageUrl = (imagePath) => {
  if (!imagePath) {
    console.log('🖼️ No image path provided, using placeholder');
    return '/images/placeholder.jpg';
  }
  
  console.log('🖼️ Processing image path:', imagePath);
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // If it's a Cloudinary URL, return as is
  if (imagePath.includes('cloudinary.com')) {
    return imagePath;
  }
  
  // Handle mock images from backend
  if (imagePath.startsWith('/api/mock-images/')) {
    const url = `${API_BASE_URL}${imagePath}`;
    console.log('🖼️ Mock image URL:', url);
    return url;
  }
  
  // Handle uploaded images
  if (imagePath.startsWith('/uploads/')) {
    const url = `${API_BASE_URL}${imagePath}`;
    console.log('🖼️ Upload image URL:', url);
    return url;
  }
  
  // Handle mock image filenames
  if (imagePath.includes('mock_')) {
    const url = `${API_BASE_URL}/api/mock-images/${imagePath}`;
    console.log('🖼️ Mock filename URL:', url);
    return url;
  }
  
  // Default case - assume it's in uploads
  const url = `${API_BASE_URL}/uploads/${imagePath}`;
  console.log('🖼️ Default image URL:', url);
  return url;
};

// Health check
export const healthCheck = () => {
  console.log('❤️ Performing health check');
  return api.get('/api/health');
};

// Initialize connection test on import
console.log('🚀 API Service initialized');
testConnection().catch(() => {
  console.log('⚠️ Initial connection test failed - this might be normal during cold starts');
});

export default api;