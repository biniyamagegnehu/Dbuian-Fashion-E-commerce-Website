// Mock data for products
import productsData from '../data/products.json';

// Simulate a database with localStorage
const STORAGE_KEYS = {
  PRODUCTS: 'dbuian_products',
  ORDERS: 'dbuian_orders',
  USERS: 'dbuian_users',
  CART: 'dbuian_cart',
  WISHLIST: 'dbuian_wishlist'
};

// Initialize mock data if not exists
export const initializeMockData = () => {
  console.log('Initializing mock data...');
  
  try {
    // Always set the products from products.json to ensure fresh data
    if (productsData && productsData.products) {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(productsData.products));
      console.log('Products loaded:', productsData.products.length);
    } else {
      console.error('Products data is invalid:', productsData);
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify([]));
    }
    
    // Initialize orders if not exists
    if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
      const sampleOrders = [
        {
          id: '1',
          userId: '2',
          items: [
            {
              id: '1',
              name: 'Neo University Hoodie - Men\'s',
              price: 1250,
              image: '/images/hoodie-1.jpg',
              size: 'M',
              quantity: 1
            }
          ],
          total: 1250,
          status: 'delivered',
          createdAt: '2024-01-15',
          shippingAddress: {
            firstName: 'John',
            lastName: 'Doe',
            email: 'customer@dbuian.com',
            address: '123 University Ave',
            city: 'Addis Ababa',
            zipCode: '1000',
            phone: '+251911223344'
          }
        }
      ];
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(sampleOrders));
    }
    
    // Initialize users if not exists
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      const sampleUsers = [
        {
          id: '2',
          name: 'Customer User',
          email: 'customer@dbuian.com',
          password: 'customer123',
          role: 'customer',
          university: 'Dbuian University',
          studentId: '12345678',
          createdAt: '2024-01-01'
        },
        {
          id: '3',
          name: 'Student User',
          email: 'student@dbuian.com',
          password: 'student123',
          role: 'customer',
          university: 'Dbuian University',
          studentId: '87654321',
          createdAt: '2024-01-02'
        }
      ];
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(sampleUsers));
    }
    
    // Initialize cart if not exists
    if (!localStorage.getItem(STORAGE_KEYS.CART)) {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify([]));
    }
    
    // Initialize wishlist if not exists
    if (!localStorage.getItem(STORAGE_KEYS.WISHLIST)) {
      localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify([]));
    }
    
    console.log('Mock data initialization completed successfully');
  } catch (error) {
    console.error('Error initializing mock data:', error);
  }
};

// Products functions
export const getProducts = () => {
  try {
    const products = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]');
    console.log('Retrieved products from localStorage:', products.length);
    return products;
  } catch (error) {
    console.error('Error getting products:', error);
    return [];
  }
};

export const getProductById = (id) => {
  try {
    const products = getProducts();
    const product = products.find(product => product.id === id);
    console.log('Finding product by ID:', id, product ? 'Found' : 'Not found');
    return product || null;
  } catch (error) {
    console.error('Error getting product by ID:', error);
    return null;
  }
};

export const getProductsByCategory = (category) => {
  try {
    const products = getProducts();
    const filteredProducts = products.filter(product => product.category === category);
    console.log(`Found ${filteredProducts.length} products in category: ${category}`);
    return filteredProducts;
  } catch (error) {
    console.error('Error getting products by category:', error);
    return [];
  }
};

export const getProductsByGender = (gender) => {
  try {
    const products = getProducts();
    const filteredProducts = products.filter(product => product.gender === gender);
    console.log(`Found ${filteredProducts.length} products for gender: ${gender}`);
    return filteredProducts;
  } catch (error) {
    console.error('Error getting products by gender:', error);
    return [];
  }
};

export const searchProducts = (query) => {
  try {
    const products = getProducts();
    const searchTerm = query.toLowerCase();
    const results = products.filter(product => 
      product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm) ||
      product.gender.toLowerCase().includes(searchTerm)
    );
    console.log(`Search for "${query}" returned ${results.length} results`);
    return results;
  } catch (error) {
    console.error('Error searching products:', error);
    return [];
  }
};

export const createProduct = (productData) => {
  try {
    const products = getProducts();
    const newProduct = {
      id: Date.now().toString(),
      ...productData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    products.push(newProduct);
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    console.log('Created new product:', newProduct);
    return newProduct;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

export const updateProduct = (id, productData) => {
  try {
    const products = getProducts();
    const index = products.findIndex(product => product.id === id);
    if (index === -1) {
      console.log('Product not found for update:', id);
      return null;
    }
    
    products[index] = { 
      ...products[index], 
      ...productData, 
      updatedAt: new Date().toISOString() 
    };
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    console.log('Updated product:', products[index]);
    return products[index];
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

export const deleteProduct = (id) => {
  try {
    const products = getProducts();
    const filteredProducts = products.filter(product => product.id !== id);
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(filteredProducts));
    console.log('Deleted product with ID:', id);
    return true;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

// Orders functions
export const getOrders = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]');
  } catch (error) {
    console.error('Error getting orders:', error);
    return [];
  }
};

export const getOrderById = (id) => {
  try {
    const orders = getOrders();
    return orders.find(order => order.id === id) || null;
  } catch (error) {
    console.error('Error getting order by ID:', error);
    return null;
  }
};

export const getOrdersByUserId = (userId) => {
  try {
    const orders = getOrders();
    return orders.filter(order => order.userId === userId);
  } catch (error) {
    console.error('Error getting orders by user ID:', error);
    return [];
  }
};

export const createOrder = (orderData) => {
  try {
    const orders = getOrders();
    const newOrder = {
      id: Date.now().toString(),
      ...orderData,
      createdAt: new Date().toISOString(),
      status: 'pending'
    };
    orders.push(newOrder);
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    console.log('Created new order:', newOrder);
    return newOrder;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

export const updateOrderStatus = (id, status) => {
  try {
    const orders = getOrders();
    const order = orders.find(order => order.id === id);
    if (!order) {
      console.log('Order not found for status update:', id);
      return null;
    }
    
    order.status = status;
    order.updatedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    console.log('Updated order status:', order);
    return order;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

// Users functions
export const getUsers = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
  } catch (error) {
    console.error('Error getting users:', error);
    return [];
  }
};

export const getUserById = (id) => {
  try {
    const users = getUsers();
    return users.find(user => user.id === id) || null;
  } catch (error) {
    console.error('Error getting user by ID:', error);
    return null;
  }
};

export const getUserByEmail = (email) => {
  try {
    const users = getUsers();
    return users.find(user => user.email === email) || null;
  } catch (error) {
    console.error('Error getting user by email:', error);
    return null;
  }
};

export const createUser = (userData) => {
  try {
    const users = getUsers();
    
    // Check if user already exists
    const existingUser = users.find(user => user.email === userData.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }
    
    const newUser = {
      id: Date.now().toString(),
      ...userData,
      role: 'customer',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    users.push(newUser);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    console.log('Created new user:', newUser);
    return newUser;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const updateUser = (id, userData) => {
  try {
    const users = getUsers();
    const index = users.findIndex(user => user.id === id);
    if (index === -1) {
      console.log('User not found for update:', id);
      return null;
    }
    
    users[index] = { 
      ...users[index], 
      ...userData, 
      updatedAt: new Date().toISOString() 
    };
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    console.log('Updated user:', users[index]);
    return users[index];
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

// Cart functions
export const getCart = (userId) => {
  try {
    const cart = JSON.parse(localStorage.getItem(STORAGE_KEYS.CART) || '[]');
    return cart.filter(item => item.userId === userId);
  } catch (error) {
    console.error('Error getting cart:', error);
    return [];
  }
};

export const addToCart = (userId, productId, size, quantity = 1) => {
  try {
    const cart = JSON.parse(localStorage.getItem(STORAGE_KEYS.CART) || '[]');
    const existingItem = cart.find(item => 
      item.userId === userId && item.productId === productId && item.size === size
    );
    
    if (existingItem) {
      existingItem.quantity += quantity;
      existingItem.updatedAt = new Date().toISOString();
    } else {
      cart.push({
        id: Date.now().toString(),
        userId,
        productId,
        size,
        quantity,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
    
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    console.log('Added to cart:', { userId, productId, size, quantity });
    return cart.filter(item => item.userId === userId);
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
};

export const removeFromCart = (userId, productId, size) => {
  try {
    const cart = JSON.parse(localStorage.getItem(STORAGE_KEYS.CART) || '[]');
    const filteredCart = cart.filter(item => 
      !(item.userId === userId && item.productId === productId && item.size === size)
    );
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(filteredCart));
    console.log('Removed from cart:', { userId, productId, size });
    return filteredCart.filter(item => item.userId === userId);
  } catch (error) {
    console.error('Error removing from cart:', error);
    throw error;
  }
};

export const updateCartItem = (userId, productId, size, quantity) => {
  try {
    const cart = JSON.parse(localStorage.getItem(STORAGE_KEYS.CART) || '[]');
    const item = cart.find(item => 
      item.userId === userId && item.productId === productId && item.size === size
    );
    
    if (item) {
      item.quantity = quantity;
      item.updatedAt = new Date().toISOString();
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    }
    
    console.log('Updated cart item:', { userId, productId, size, quantity });
    return cart.filter(item => item.userId === userId);
  } catch (error) {
    console.error('Error updating cart item:', error);
    throw error;
  }
};

export const clearCart = (userId) => {
  try {
    const cart = JSON.parse(localStorage.getItem(STORAGE_KEYS.CART) || '[]');
    const filteredCart = cart.filter(item => item.userId !== userId);
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(filteredCart));
    console.log('Cleared cart for user:', userId);
    return [];
  } catch (error) {
    console.error('Error clearing cart:', error);
    throw error;
  }
};

// Wishlist functions
export const getWishlist = (userId) => {
  try {
    const wishlist = JSON.parse(localStorage.getItem(STORAGE_KEYS.WISHLIST) || '[]');
    return wishlist.filter(item => item.userId === userId);
  } catch (error) {
    console.error('Error getting wishlist:', error);
    return [];
  }
};

export const addToWishlist = (userId, productId) => {
  try {
    const wishlist = JSON.parse(localStorage.getItem(STORAGE_KEYS.WISHLIST) || '[]');
    
    // Check if already in wishlist
    const existingItem = wishlist.find(item => 
      item.userId === userId && item.productId === productId
    );
    
    if (!existingItem) {
      wishlist.push({
        id: Date.now().toString(),
        userId,
        productId,
        createdAt: new Date().toISOString()
      });
      localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(wishlist));
    }
    
    console.log('Added to wishlist:', { userId, productId });
    return wishlist.filter(item => item.userId === userId);
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    throw error;
  }
};

export const removeFromWishlist = (userId, productId) => {
  try {
    const wishlist = JSON.parse(localStorage.getItem(STORAGE_KEYS.WISHLIST) || '[]');
    const filteredWishlist = wishlist.filter(item => 
      !(item.userId === userId && item.productId === productId)
    );
    localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(filteredWishlist));
    console.log('Removed from wishlist:', { userId, productId });
    return filteredWishlist.filter(item => item.userId === userId);
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    throw error;
  }
};

// Analytics functions
export const trackProductView = (productId) => {
  try {
    console.log('Product viewed:', productId);
    // In a real app, this would send data to analytics service
    return { success: true };
  } catch (error) {
    console.error('Error tracking product view:', error);
    return { success: false };
  }
};

export const trackSearch = (searchTerm, resultsCount) => {
  try {
    console.log('Search performed:', { searchTerm, resultsCount });
    // In a real app, this would send data to analytics service
    return { success: true };
  } catch (error) {
    console.error('Error tracking search:', error);
    return { success: false };
  }
};

// Initialize mock data when this module is imported
initializeMockData();

export default {
  // Products
  getProducts,
  getProductById,
  getProductsByCategory,
  getProductsByGender,
  searchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  
  // Orders
  getOrders,
  getOrderById,
  getOrdersByUserId,
  createOrder,
  updateOrderStatus,
  
  // Users
  getUsers,
  getUserById,
  getUserByEmail,
  createUser,
  updateUser,
  
  // Cart
  getCart,
  addToCart,
  removeFromCart,
  updateCartItem,
  clearCart,
  
  // Wishlist
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  
  // Analytics
  trackProductView,
  trackSearch
};