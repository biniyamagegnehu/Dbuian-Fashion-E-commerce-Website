import { 
  getProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct,
  getOrders,
  createOrder,
  getUsers,
  createUser
} from './mockData';

// These functions will be replaced with real API calls later

// Products API
export const fetchProducts = async (filters = {}) => {
  // Simulate API delay
  return new Promise((resolve) => {
    setTimeout(() => {
      let products = getProducts();
      
      // Apply filters
      if (filters.category) {
        products = products.filter(product => product.category === filters.category);
      }
      
      if (filters.priceRange) {
        const [min, max] = filters.priceRange.split('-').map(Number);
        if (max === 0) {
          products = products.filter(product => product.price >= min);
        } else {
          products = products.filter(product => product.price >= min && product.price <= max);
        }
      }
      
      if (filters.size) {
        products = products.filter(product => product.size.includes(filters.size));
      }
      
      // Apply sorting
      switch (filters.sort) {
        case 'price-low':
          products.sort((a, b) => a.price - b.price);
          break;
        case 'price-high':
          products.sort((a, b) => b.price - a.price);
          break;
        case 'newest':
          products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          break;
        case 'name':
          products.sort((a, b) => a.name.localeCompare(b.name));
          break;
        default:
          break;
      }
      
      resolve(products);
    }, 500);
  });
};

export const fetchProduct = async (id) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(getProductById(id));
    }, 300);
  });
};

export const addProduct = async (productData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(createProduct(productData));
    }, 500);
  });
};

export const editProduct = async (id, productData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(updateProduct(id, productData));
    }, 500);
  });
};

export const removeProduct = async (id) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(deleteProduct(id));
    }, 500);
  });
};

// Orders API
export const fetchOrders = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(getOrders());
    }, 500);
  });
};

export const placeOrder = async (orderData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(createOrder(orderData));
    }, 1000);
  });
};

// Users API
export const fetchUsers = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(getUsers());
    }, 500);
  });
};

export const registerUser = async (userData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(createUser(userData));
    }, 500);
  });
};

// Placeholder for future API integration
export const api = {
  products: {
    list: fetchProducts,
    get: fetchProduct,
    create: addProduct,
    update: editProduct,
    delete: removeProduct,
  },
  orders: {
    list: fetchOrders,
    create: placeOrder,
  },
  users: {
    list: fetchUsers,
    create: registerUser,
  },
};