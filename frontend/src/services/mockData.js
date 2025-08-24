// Mock data for products
import productsData from '../data/products.json';

// Simulate a database with localStorage
const STORAGE_KEYS = {
  PRODUCTS: 'dbuian_products',
  ORDERS: 'dbuian_orders',
  USERS: 'dbuian_users'
};

// Initialize mock data if not exists
export const initializeMockData = () => {
  if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(productsData.products));
  }
  
  if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify([]));
  }
  
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([]));
  }
};

// Products functions
export const getProducts = () => {
  const products = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]');
  return products;
};

export const getProductById = (id) => {
  const products = getProducts();
  return products.find(product => product.id === id);
};

export const createProduct = (productData) => {
  const products = getProducts();
  const newProduct = {
    id: Date.now().toString(),
    ...productData,
    createdAt: new Date().toISOString()
  };
  products.push(newProduct);
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  return newProduct;
};

export const updateProduct = (id, productData) => {
  const products = getProducts();
  const index = products.findIndex(product => product.id === id);
  if (index === -1) return null;
  
  products[index] = { ...products[index], ...productData, updatedAt: new Date().toISOString() };
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  return products[index];
};

export const deleteProduct = (id) => {
  const products = getProducts();
  const filteredProducts = products.filter(product => product.id !== id);
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(filteredProducts));
  return true;
};

// Orders functions
export const getOrders = () => {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]');
};

export const createOrder = (orderData) => {
  const orders = getOrders();
  const newOrder = {
    id: Date.now().toString(),
    ...orderData,
    createdAt: new Date().toISOString(),
    status: 'pending'
  };
  orders.push(newOrder);
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  return newOrder;
};

// Users functions
export const getUsers = () => {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
};

export const createUser = (userData) => {
  const users = getUsers();
  const newUser = {
    id: Date.now().toString(),
    ...userData,
    createdAt: new Date().toISOString(),
    role: 'customer'
  };
  users.push(newUser);
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  return newUser;
};

// Initialize mock data when this module is imported
initializeMockData();