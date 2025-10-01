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
};

export const ordersAPI = {
  getAll: () => api.get('/orders'),
};

export const productsAPI = {
  getAll: () => api.get('/products'),
};

export default api;