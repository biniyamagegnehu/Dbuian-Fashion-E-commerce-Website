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
      
      if (filters.gender) {
        products = products.filter(product => product.gender === filters.gender);
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
      
      // Apply search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        products = products.filter(product => 
          product.name.toLowerCase().includes(searchTerm) ||
          product.description.toLowerCase().includes(searchTerm) ||
          product.category.toLowerCase().includes(searchTerm) ||
          product.gender.toLowerCase().includes(searchTerm)
        );
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

// Authentication API (mock)
export const loginUser = async (email, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Mock authentication
      if ((email === 'customer@dbuian.com' && password === 'customer123') || 
          (email === 'student@dbuian.com' && password === 'student123')) {
        const user = { 
          id: '2', 
          name: 'Customer User', 
          email: email,
          role: 'customer',
          university: 'Dbuian University'
        };
        resolve(user);
      } else {
        reject(new Error('Invalid credentials'));
      }
    }, 1000);
  });
};

export const logoutUser = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true });
    }, 300);
  });
};

// Cart API (mock)
export const addToCart = async (cartItem) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // In a real app, this would update the user's cart on the server
      resolve({ success: true, item: cartItem });
    }, 300);
  });
};

export const removeFromCart = async (productId, size) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, productId, size });
    }, 300);
  });
};

export const updateCartItem = async (productId, size, quantity) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, productId, size, quantity });
    }, 300);
  });
};

export const clearCart = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true });
    }, 300);
  });
};

// Checkout API (mock)
export const processPayment = async (paymentData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ 
        success: true, 
        transactionId: 'TXN_' + Math.random().toString(36).substr(2, 9),
        orderId: 'ORD_' + Math.random().toString(36).substr(2, 9)
      });
    }, 2000);
  });
};

export const createShipping = async (shippingData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ 
        success: true, 
        trackingNumber: 'TRK_' + Math.random().toString(36).substr(2, 12),
        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      });
    }, 1000);
  });
};

// Analytics API (mock)
export const trackProductView = async (productId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // In a real app, this would send analytics data to the server
      resolve({ success: true });
    }, 100);
  });
};

export const trackSearch = async (searchTerm, resultsCount) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true });
    }, 100);
  });
};

// Wishlist API (mock)
export const addToWishlist = async (productId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, productId });
    }, 300);
  });
};

export const removeFromWishlist = async (productId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, productId });
    }, 300);
  });
};

export const getWishlist = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const products = getProducts();
      // Return a few random products as mock wishlist items
      const wishlistItems = products.slice(0, 3).map(product => ({
        ...product,
        addedAt: new Date().toISOString()
      }));
      resolve(wishlistItems);
    }, 500);
  });
};

// Reviews API (mock)
export const fetchProductReviews = async (productId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockReviews = [
        {
          id: 1,
          productId,
          userId: 'user1',
          userName: 'Alex Johnson',
          rating: 5,
          comment: 'Excellent quality and perfect fit! Highly recommended.',
          createdAt: '2024-01-15'
        },
        {
          id: 2,
          productId,
          userId: 'user2',
          userName: 'Sarah Miller',
          rating: 4,
          comment: 'Great product, but the sizing runs a bit small.',
          createdAt: '2024-01-10'
        }
      ];
      resolve(mockReviews);
    }, 500);
  });
};

export const submitReview = async (reviewData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ 
        success: true, 
        review: {
          id: Math.random().toString(36).substr(2, 9),
          ...reviewData,
          createdAt: new Date().toISOString()
        }
      });
    }, 500);
  });
};

// Newsletter API (mock)
export const subscribeToNewsletter = async (email) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ 
        success: true, 
        message: 'Successfully subscribed to newsletter',
        email 
      });
    }, 500);
  });
};

// Contact API (mock)
export const submitContactForm = async (contactData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ 
        success: true, 
        message: 'Thank you for your message. We will get back to you soon.',
        ticketId: 'TKT_' + Math.random().toString(36).substr(2, 9)
      });
    }, 500);
  });
};

// Unified API object for easy imports
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
  auth: {
    login: loginUser,
    logout: logoutUser,
    register: registerUser,
  },
  cart: {
    add: addToCart,
    remove: removeFromCart,
    update: updateCartItem,
    clear: clearCart,
  },
  checkout: {
    payment: processPayment,
    shipping: createShipping,
  },
  analytics: {
    trackProductView,
    trackSearch,
  },
  wishlist: {
    add: addToWishlist,
    remove: removeFromWishlist,
    get: getWishlist,
  },
  reviews: {
    list: fetchProductReviews,
    submit: submitReview,
  },
  newsletter: {
    subscribe: subscribeToNewsletter,
  },
  contact: {
    submit: submitContactForm,
  },
};

export default api;