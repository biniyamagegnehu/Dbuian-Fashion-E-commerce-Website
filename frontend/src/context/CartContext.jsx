import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';

const CartContext = createContext();

// API configuration
const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance with auth interceptor
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
      
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      };
      
    case 'SET_CART_ITEMS':
      return {
        ...state,
        items: action.payload,
        loading: false,
        error: null
      };
      
    case 'ADD_TO_CART_LOCAL':
      const existingItem = state.items.find(
        item => item.id === action.payload.id && item.size === action.payload.size
      );
      
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id && item.size === action.payload.size
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          )
        };
      }
      return {
        ...state,
        items: [...state.items, action.payload]
      };
      
    case 'REMOVE_FROM_CART_LOCAL':
      return {
        ...state,
        items: state.items.filter(
          item => !(item.id === action.payload.id && item.size === action.payload.size)
        )
      };
      
    case 'UPDATE_QUANTITY_LOCAL':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id && item.size === action.payload.size
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      };
      
    case 'CLEAR_CART_LOCAL':
      return {
        ...state,
        items: []
      };
      
    default:
      return state;
  }
};

const initialState = {
  items: [],
  loading: false,
  error: null
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Fetch cart from backend on component mount and when auth changes
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchCartFromBackend();
    }
  }, []);

  // Fetch cart from backend
  const fetchCartFromBackend = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const token = localStorage.getItem('token');
      if (!token) {
        dispatch({ type: 'SET_CART_ITEMS', payload: [] });
        return;
      }

      console.log('🔄 Fetching cart from backend...');
      const response = await api.get('/cart');
      console.log('✅ Cart response:', response.data);
      
      if (response.data.success && response.data.cart) {
        const backendItems = response.data.cart.items.map(item => ({
          id: item.product?._id || item.product, // Product ID
          cartItemId: item._id, // Cart item ID for backend operations
          name: item.product?.name || 'Product',
          price: item.price || item.product?.price || 0,
          image: item.product?.images?.[0]?.url || '/images/default-product.jpg',
          size: item.size,
          quantity: item.quantity,
          stock: item.product?.stock || 0,
          product: item.product // Keep full product object for reference
        }));
        
        dispatch({ type: 'SET_CART_ITEMS', payload: backendItems });
      } else {
        dispatch({ type: 'SET_CART_ITEMS', payload: [] });
      }
    } catch (error) {
      console.error('❌ Error fetching cart from backend:', error);
      if (error.response?.status === 401) {
        // Token expired or invalid
        localStorage.removeItem('token');
        dispatch({ type: 'SET_CART_ITEMS', payload: [] });
      } else if (error.response?.status === 404) {
        console.log('📝 Cart endpoint not found, using local cart only');
        dispatch({ type: 'SET_ERROR', payload: 'Cart service unavailable' });
      } else {
        dispatch({ 
          type: 'SET_ERROR', 
          payload: 'Failed to load cart from server' 
        });
      }
    }
  };

  // Add item to cart (with backend sync)
  const addToCart = async (product, size, quantity = 1) => {
    try {
      const token = localStorage.getItem('token');
      
      if (token) {
        console.log('🔄 Adding to cart via backend...');
        console.log('📦 Product data:', { 
          productId: product.id || product._id, 
          size, 
          quantity,
          productName: product.name 
        });
        
        // Try backend first
        try {
          const response = await api.post('/cart/items', {
            productId: product.id || product._id,
            size,
            quantity
          });
          console.log('✅ Backend cart updated:', response.data);
          
          // Fetch updated cart from backend
          await fetchCartFromBackend();
          return { success: true, message: 'Item added to cart' };
        } catch (backendError) {
          console.error('❌ Backend cart error:', backendError.response?.data || backendError.message);
          
          // Check if it's a stock error or other validation error
          if (backendError.response?.data?.message) {
            return { 
              success: false, 
              message: backendError.response.data.message 
            };
          }
          
          console.log('⚠️ Backend cart unavailable, using local storage');
          // Fall through to local storage
        }
      }
      
      // Local storage fallback
      console.log('📱 Using local cart storage');
      const newItem = {
        id: product.id || product._id,
        name: product.name,
        price: product.price,
        image: product.images?.[0]?.url || '/images/default-product.jpg',
        size,
        quantity,
        stock: product.stock
      };
      
      dispatch({
        type: 'ADD_TO_CART_LOCAL',
        payload: newItem
      });
      
      return { success: true, message: 'Item added to cart' };
      
    } catch (error) {
      console.error('❌ Error adding to cart:', error);
      
      // Local storage fallback on any error
      const newItem = {
        id: product.id || product._id,
        name: product.name,
        price: product.price,
        image: product.images?.[0]?.url || '/images/default-product.jpg',
        size,
        quantity,
        stock: product.stock
      };
      
      dispatch({
        type: 'ADD_TO_CART_LOCAL',
        payload: newItem
      });
      
      return { success: true, message: 'Item added to cart (offline)' };
    }
  };

  // Remove item from cart
  const removeFromCart = async (id, size) => {
    try {
      const token = localStorage.getItem('token');
      
      if (token) {
        // Try backend first
        try {
          // Find the cart item ID for backend operation
          const item = state.items.find(item => item.id === id && item.size === size);
          if (item && item.cartItemId) {
            console.log('🔄 Removing from backend cart:', item.cartItemId);
            await api.delete(`/cart/items/${item.cartItemId}`);
            await fetchCartFromBackend();
            return { success: true };
          } else {
            console.log('⚠️ Cart item ID not found, using local removal');
          }
        } catch (backendError) {
          console.error('❌ Backend removal error:', backendError.response?.data || backendError.message);
          console.log('Backend unavailable, using local removal');
        }
      }
      
      // Local storage fallback
      dispatch({
        type: 'REMOVE_FROM_CART_LOCAL',
        payload: { id, size }
      });
      return { success: true };
      
    } catch (error) {
      console.error('Error removing from cart:', error);
      
      // Local storage fallback
      dispatch({
        type: 'REMOVE_FROM_CART_LOCAL',
        payload: { id, size }
      });
      return { success: true };
    }
  };

  // Update item quantity
  const updateQuantity = async (id, size, quantity) => {
    try {
      const token = localStorage.getItem('token');
      
      if (token) {
        // Try backend first
        try {
          const item = state.items.find(item => item.id === id && item.size === size);
          if (item && item.cartItemId) {
            console.log('🔄 Updating quantity in backend:', { cartItemId: item.cartItemId, quantity });
            await api.put(`/cart/items/${item.cartItemId}`, { quantity });
            await fetchCartFromBackend();
            return { success: true };
          } else {
            console.log('⚠️ Cart item ID not found, using local update');
          }
        } catch (backendError) {
          console.error('❌ Backend update error:', backendError.response?.data || backendError.message);
          
          // Check if it's a stock error
          if (backendError.response?.data?.message) {
            return { 
              success: false, 
              message: backendError.response.data.message 
            };
          }
          
          console.log('Backend unavailable, using local update');
        }
      }
      
      // Local storage fallback
      dispatch({
        type: 'UPDATE_QUANTITY_LOCAL',
        payload: { id, size, quantity }
      });
      return { success: true };
      
    } catch (error) {
      console.error('Error updating quantity:', error);
      
      // Local storage fallback
      dispatch({
        type: 'UPDATE_QUANTITY_LOCAL',
        payload: { id, size, quantity }
      });
      return { success: true };
    }
  };

  // Clear cart
  const clearCart = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (token) {
        // Try backend first
        try {
          console.log('🔄 Clearing backend cart');
          await api.delete('/cart');
          console.log('✅ Backend cart cleared');
        } catch (backendError) {
          console.error('❌ Backend clear error:', backendError.response?.data || backendError.message);
          console.log('Backend unavailable, clearing local only');
        }
      }
      
      // Always clear local state
      dispatch({ type: 'CLEAR_CART_LOCAL' });
      return { success: true };
      
    } catch (error) {
      console.error('Error clearing cart:', error);
      
      // Still clear local state
      dispatch({ type: 'CLEAR_CART_LOCAL' });
      return { success: true };
    }
  };

  // Sync local cart to backend (when user logs in)
  const syncCartToBackend = async () => {
    try {
      if (state.items.length === 0) {
        return { success: true, message: 'Cart is empty' };
      }

      console.log('🔄 Syncing local cart to backend...');
      
      // Clear backend cart first
      try {
        await api.delete('/cart');
      } catch (error) {
        console.log('Could not clear backend cart, continuing...');
      }

      // Add all items to backend cart
      const syncPromises = state.items.map(item =>
        api.post('/cart/items', {
          productId: item.id,
          size: item.size,
          quantity: item.quantity
        })
      );
      
      await Promise.all(syncPromises);
      await fetchCartFromBackend();
      
      console.log('✅ Cart synced to backend successfully');
      return { success: true, message: 'Cart synced to server' };
    } catch (error) {
      console.error('❌ Error syncing cart to backend:', error);
      const message = error.response?.data?.message || 'Failed to sync cart';
      return { success: false, message };
    }
  };

  // Get cart total
  const getCartTotal = () => {
    return state.items.reduce(
      (total, item) => total + (item.price * item.quantity),
      0
    );
  };

  // Get cart items count
  const getCartItemsCount = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  };

  // Check if item is in cart
  const isInCart = (productId, size) => {
    return state.items.some(item => item.id === productId && item.size === size);
  };

  // Get item from cart
  const getCartItem = (productId, size) => {
    return state.items.find(item => item.id === productId && item.size === size);
  };

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        loading: state.loading,
        error: state.error,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartItemsCount,
        isInCart,
        getCartItem,
        refreshCart: fetchCartFromBackend,
        syncCartToBackend
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};