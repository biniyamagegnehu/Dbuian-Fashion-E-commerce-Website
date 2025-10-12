// src/services/api.js - ADMIN PANEL (FIXED)
import axios from 'axios';

// ✅ CORRECT: Remove the extra /api at the end
const API_BASE_URL = 'https://dbuianfashion.onrender.com';

console.log('🚀 Admin Panel API Base URL:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  console.log(`➡️ ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
  return config;
});

// Response interceptor for better error handling
api.interceptors.response.use(
  (response) => {
    console.log(`✅ ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message,
      data: error.response?.data
    });
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post('/api/admin/auth/login', credentials), // ✅ Correct path
  getMe: () => api.get('/api/admin/auth/me'), // ✅ Correct path
};

export const usersAPI = {
  getStats: () => api.get('/api/users/stats'),
  getAll: () => api.get('/api/users'),
  getById: (id) => api.get(`/api/users/${id}`),
  update: (id, data) => api.put(`/api/users/${id}`, data),
  delete: (id) => api.delete(`/api/users/${id}`),
};

export const ordersAPI = {
  getAll: () => api.get('/api/orders'),
  getById: (id) => api.get(`/api/orders/${id}`),
  updateStatus: (id, status) => api.put(`/api/orders/${id}/status`, { status }),
  delete: (id) => api.delete(`/api/orders/${id}`),
};

export const productsAPI = {
  getAll: () => api.get('/api/products'),
  getById: (id) => api.get(`/api/products/${id}`),
  create: (data) => api.post('/api/products', data),
  update: (id, data) => api.put(`/api/products/${id}`, data),
  delete: (id) => api.delete(`/api/products/${id}`),
  updateStock: (id, stock) => api.put(`/api/products/${id}/stock`, { stock }),
};

export const uploadAPI = {
  uploadImage: (formData) => api.post('/api/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  deleteImage: (publicId) => api.delete(`/api/upload/${publicId}`),
};

export const reviewsAPI = {
  getAll: () => api.get('/api/reviews'),
  getByProduct: (productId) => api.get(`/api/reviews/product/${productId}`),
  create: (data) => api.post('/api/reviews', data),
  update: (id, data) => api.put(`/api/reviews/${id}`, data),
  delete: (id) => api.delete(`/api/reviews/${id}`),
};

// ✅ ENHANCED getImageUrl function for Admin Panel
export const getImageUrl = (imagePath) => {
  if (!imagePath) {
    console.log('🖼️ Admin Panel: No image path provided');
    return '/placeholder-image.jpg';
  }

  console.log('🖼️ Admin Panel Processing:', imagePath, 'Type:', typeof imagePath);

  // Handle object format
  if (typeof imagePath === 'object' && imagePath !== null) {
    console.log('🖼️ Admin Panel: Image is object with keys:', Object.keys(imagePath));
    
    // Priority order for object URLs
    if (imagePath.secure_url) {
      console.log('🖼️ Admin Panel: Using secure_url:', imagePath.secure_url);
      return imagePath.secure_url;
    }
    if (imagePath.url) {
      console.log('🖼️ Admin Panel: Using url:', imagePath.url);
      // Recursively process the URL string
      return getImageUrl(imagePath.url);
    }
    
    console.log('🖼️ Admin Panel: Unknown object format, using placeholder');
    return '/placeholder-image.jpg';
  }

  // Handle string paths
  if (typeof imagePath === 'string') {
    // Already a full URL
    if (imagePath.startsWith('http')) {
      console.log('🖼️ Admin Panel: Already full URL:', imagePath);
      return imagePath;
    }

    // Cloudinary URL
    if (imagePath.includes('cloudinary.com')) {
      console.log('🖼️ Admin Panel: Cloudinary URL:', imagePath);
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
      
      const fullUrl = `https://dbuianfashion.onrender.com${cleanPath}`;
      console.log('🖼️ Admin Panel: Constructed mock URL:', fullUrl);
      return fullUrl;
    }

    // Uploads
    if (imagePath.startsWith('/uploads/') || imagePath.startsWith('uploads/')) {
      const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
      const fullUrl = `https://dbuianfashion.onrender.com${cleanPath}`;
      console.log('🖼️ Admin Panel: Constructed upload URL:', fullUrl);
      return fullUrl;
    }

    // If it's just a filename with extension, assume it's a mock image
    if (imagePath.match(/\.(jpg|jpeg|png|webp|gif)$/i)) {
      const fullUrl = `https://dbuianfashion.onrender.com/api/mock-images/${imagePath}`;
      console.log('🖼️ Admin Panel: Constructed filename URL:', fullUrl);
      return fullUrl;
    }
  }

  // Unknown format
  console.log('🖼️ Admin Panel: Unknown image format, using placeholder');
  return '/placeholder-image.jpg';
};

export default api;