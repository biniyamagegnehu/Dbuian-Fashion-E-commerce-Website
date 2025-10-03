import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import GlassCard from '../components/ui/GlassCard';
import AnimatedButton from '../components/ui/AnimatedButton';
import { ordersAPI } from '../services/api';

const Checkout = () => {
  const navigate = useNavigate();
  const { items, getCartTotal, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    blockNumber: '',
    roomDormNumber: ''
  });

  // Redirect if not authenticated or cart is empty
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=checkout');
      return;
    }
    
    if (items.length === 0) {
      navigate('/cart');
      return;
    }
  }, [isAuthenticated, items.length, navigate]);

  // Format price in Birr
  const formatPrice = (price) => {
    return `${price} Birr`;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      alert('Please log in to complete your order');
      navigate('/login?redirect=checkout');
      return;
    }

    // Validate form
    if (!formData.firstName || !formData.lastName || !formData.phoneNumber || !formData.blockNumber || !formData.roomDormNumber) {
      alert('Please fill in all required fields');
      return;
    }

    // Validate phone number format
    const phoneRegex = /^(\+251|0)[79]\d{8}$/;
    if (!phoneRegex.test(formData.phoneNumber.replace(/\s/g, ''))) {
      alert('Please enter a valid Ethiopian phone number (e.g., +251 9XX XXX XXX or 09XX XXX XXX)');
      return;
    }

    // Show confirmation modal
    setShowConfirmation(true);
  };

const handleConfirmOrder = async () => {
  setIsProcessing(true);
  setShowConfirmation(false);

  try {
    console.log('🔄 === STARTING ORDER CREATION ===');
    
    // Check authentication
    const token = localStorage.getItem('token');
    console.log('🔐 Auth token exists:', !!token);
    console.log('👤 User authenticated:', isAuthenticated);
    console.log('👤 User data:', user);

    // Check cart items
    console.log('🛒 Cart items:', items);
    console.log('🛒 Cart items count:', items.length);

    // DEBUG: Log the structure of each item
    console.log('🔍 Detailed item structure:');
    items.forEach((item, index) => {
      console.log(`Item ${index}:`, {
        id: item.id,
        _id: item._id,
        cartItemId: item.cartItemId,
        productId: item.productId,
        name: item.name,
        hasProductObject: !!item.product,
        productObject: item.product
      });
    });

    // Extract product IDs correctly - handle both frontend and backend structures
    const validItems = items.map(item => {
      let productId;
      
      // Method 1: If item has a product object (from backend cart)
      if (item.product && item.product._id) {
        productId = item.product._id;
        console.log(`📦 Using product._id: ${productId} for ${item.name}`);
      }
      // Method 2: If item has direct product ID
      else if (item.id) {
        productId = item.id;
        console.log(`📦 Using item.id: ${productId} for ${item.name}`);
      }
      // Method 3: If item has _id (direct product reference)
      else if (item._id) {
        productId = item._id;
        console.log(`📦 Using item._id: ${productId} for ${item.name}`);
      }
      // Method 4: Check for cartItemId (this is the cart item ID, not product ID)
      else if (item.cartItemId) {
        console.log(`⚠️ cartItemId found: ${item.cartItemId} - this is cart item ID, not product ID`);
        // We need to fetch the actual product ID from the cart
      }

      console.log(`✅ Final productId for "${item.name}": ${productId}`);

      if (!productId) {
        console.error(`❌ No valid product ID found for item:`, item);
        return null;
      }

      return {
        product: productId,
        size: item.size,
        quantity: item.quantity
      };
    }).filter(item => item !== null); // Remove null items

    console.log('✅ Valid items for order:', validItems);

    if (validItems.length === 0) {
      // If no valid items, try alternative approach - fetch fresh cart from backend
      console.log('🔄 Trying alternative approach - fetching fresh cart data...');
      try {
        const cartResponse = await fetch('http://localhost:5000/api/cart', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (cartResponse.ok) {
          const cartData = await cartResponse.json();
          console.log('🛒 Fresh cart data from backend:', cartData);
          
          if (cartData.cart && cartData.cart.items && cartData.cart.items.length > 0) {
            const backendItems = cartData.cart.items.map(item => ({
              product: item.product._id,
              size: item.size,
              quantity: item.quantity
            }));
            
            console.log('✅ Items from backend cart:', backendItems);
            validItems.push(...backendItems);
          }
        }
      } catch (fetchError) {
        console.error('❌ Failed to fetch cart from backend:', fetchError);
      }
    }

    // Final validation
    if (validItems.length === 0) {
      const errorMsg = 'No valid products in cart. Please add products to cart and try again.';
      console.error('❌', errorMsg);
      throw new Error(errorMsg);
    }

    // Prepare order data
    const orderData = {
      items: validItems,
      shippingInfo: {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        phoneNumber: formData.phoneNumber.trim(),
        blockNumber: formData.blockNumber.trim(),
        roomDormNumber: formData.roomDormNumber.trim()
      },
      paymentMethod: 'cash_on_delivery'
    };

    console.log('📦 Final order data to send:', JSON.stringify(orderData, null, 2));

    // Test the API endpoint first
    console.log('🌐 Testing API connectivity...');
    try {
      const healthCheck = await fetch('http://localhost:5000/api/health');
      console.log('🏥 Backend health check:', healthCheck.status, healthCheck.statusText);
    } catch (healthError) {
      console.error('💀 Backend is not reachable:', healthError);
      throw new Error('Cannot connect to server. Please make sure the backend is running on http://localhost:5000');
    }

    // Send order to backend
    console.log('🚀 Sending order to backend...');
    const response = await ordersAPI.create(orderData);
    console.log('✅ Order created successfully!', response);
    console.log('📋 Response data:', response.data);

    const order = response.data.order || response.data;
    console.log('🎉 Order details:', order);

    // Clear cart
    clearCart();
    console.log('🛒 Cart cleared');
    
    // Navigate to order success page
    console.log('📍 Navigating to order success page...');
    navigate('/order-success', { 
      state: { 
        orderId: order.orderId || order._id,
        orderDetails: order
      } 
    });

  } catch (error) {
    console.error('❌ === ORDER CREATION FAILED ===');
    console.error('❌ Error name:', error.name);
    console.error('❌ Error message:', error.message);
    console.error('❌ Error stack:', error.stack);
    
    if (error.response) {
      console.error('📊 Server responded with error:');
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
      
      let errorMessage = error.response.data?.message || `Server error (${error.response.status})`;
      
      if (error.response.status === 401) {
        errorMessage = 'Your session has expired. Please log in again.';
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      } else if (error.response.status === 400) {
        if (errorMessage.includes('stock')) {
          errorMessage = 'Some items are out of stock. Please update your cart.';
          navigate('/cart');
        } else if (errorMessage.includes('product')) {
          errorMessage = 'Invalid product in cart. Please update your cart.';
          navigate('/cart');
        }
      }
      
      alert(`Order Failed: ${errorMessage}`);
      
    } else if (error.request) {
      console.error('🌐 No response received:', error.request);
      alert('Network Error: Cannot connect to the server. Please check:\n1. Backend server is running on http://localhost:5000\n2. Your internet connection\n3. CORS settings');
      
    } else {
      console.error('💥 Request setup error:', error.message);
      alert(`Error: ${error.message}`);
    }
  } finally {
    setIsProcessing(false);
    console.log('🔚 Order process completed');
  }
};

  const handleCancelOrder = () => {
    setShowConfirmation(false);
  };

  // Show loading state while checking authentication
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
              <p className="text-gray-400">Redirecting to login...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-96">
            <div className="text-center">
              <p className="text-gray-400">Your cart is empty</p>
              <Link to="/products" className="text-cyan-400 hover:text-cyan-300 mt-2 inline-block">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const subtotal = getCartTotal();
  const shipping = 50; // 50 Birr shipping
  const tax = subtotal * 0.15; // 15% tax
  const total = subtotal + shipping + tax;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pt-20">
      <div className="container mx-auto px-4 py-8">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 mb-8"
        >
          Checkout
        </motion.h1>

        {/* User Info Banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-6"
        >
          <GlassCard className="p-4 backdrop-blur-xl border border-green-400/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <p className="text-white font-semibold">Welcome, {user?.name || 'User'}!</p>
                  <p className="text-gray-400 text-sm">You're logged in and ready to complete your order</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-gray-400 text-sm">Ordering as</p>
                <p className="text-cyan-400 font-medium">{user?.email}</p>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left column - Shipping information */}
            <div>
              <GlassCard className="p-6 backdrop-blur-xl">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-300">Delivery Information</h2>
                  <div className="flex items-center text-green-400 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Logged In
                  </div>
                </div>
                
                <p className="text-gray-400 text-sm mb-6">
                  Please provide your campus delivery details. We'll deliver directly to your dormitory.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-400 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 text-white placeholder-gray-500 transition-all duration-300"
                      placeholder="Your first name"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-400 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 text-white placeholder-gray-500 transition-all duration-300"
                      placeholder="Your last name"
                    />
                  </div>
                </div>
                
                <div className="mt-4">
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-400 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 text-white placeholder-gray-500 transition-all duration-300"
                    placeholder="+251 9XX XXX XXX or 09XX XXX XXX"
                  />
                  <p className="text-xs text-gray-500 mt-1">We'll contact you for delivery updates</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label htmlFor="blockNumber" className="block text-sm font-medium text-gray-400 mb-2">
                      Block Number *
                    </label>
                    <input
                      type="text"
                      id="blockNumber"
                      name="blockNumber"
                      value={formData.blockNumber}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 text-white placeholder-gray-500 transition-all duration-300"
                      placeholder="e.g., Block A, Block 5"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="roomDormNumber" className="block text-sm font-medium text-gray-400 mb-2">
                      Room/Dorm Number *
                    </label>
                    <input
                      type="text"
                      id="roomDormNumber"
                      name="roomDormNumber"
                      value={formData.roomDormNumber}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 text-white placeholder-gray-500 transition-all duration-300"
                      placeholder="e.g., Room 101, Dorm 2B"
                    />
                  </div>
                </div>

                {/* Delivery Information Note */}
                <div className="mt-6 p-4 bg-cyan-400/10 border border-cyan-400/20 rounded-lg">
                  <h3 className="text-cyan-400 font-semibold mb-2 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                    </svg>
                    Campus Delivery Information
                  </h3>
                  <p className="text-cyan-300 text-sm">
                    We deliver directly to your campus location. Please ensure your block and room numbers are accurate for smooth delivery.
                  </p>
                </div>

                {/* Contact Information */}
                <div className="mt-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                  <h3 className="text-gray-300 font-semibold mb-2">Your Account Information</h3>
                  <p className="text-gray-400 text-sm">
                    Email: <span className="text-cyan-400">{user?.email || 'Not provided'}</span>
                  </p>
                  <p className="text-gray-400 text-sm mt-1">
                    Need help? Contact us at <span className="text-cyan-400">support@dbuianfashion.com</span>
                  </p>
                </div>
              </GlassCard>
            </div>

            {/* Right column - Order summary */}
            <div>
              <GlassCard className="p-6 backdrop-blur-xl sticky top-28">
                <h2 className="text-xl font-semibold text-gray-300 mb-6">Order Summary</h2>
                
                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                  {items.map(item => (
                    <div key={`${item._id || item.id}-${item.size}`} className="flex justify-between items-start pb-4 border-b border-gray-700/50">
                      <div className="flex items-start space-x-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div>
                          <p className="text-gray-300 font-medium">{item.name}</p>
                          <p className="text-sm text-gray-400">Size: {item.size}</p>
                          <p className="text-sm text-gray-400">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <span className="text-gray-300 font-semibold">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                
                <div className="border-t border-gray-700 mt-6 pt-6 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Subtotal</span>
                    <span className="text-gray-300">{formatPrice(subtotal)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-400">Campus Delivery</span>
                    <span className="text-gray-300">{formatPrice(shipping)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-400">Tax (15%)</span>
                    <span className="text-gray-300">{formatPrice(tax)}</span>
                  </div>
                  
                  <div className="flex justify-between text-lg font-semibold pt-3 border-t border-gray-700">
                    <span className="text-gray-300">Total Amount</span>
                    <span className="text-cyan-400">{formatPrice(total)}</span>
                  </div>
                </div>

                {/* Delivery Timeline */}
                <div className="mt-6 p-4 bg-green-400/10 border border-green-400/20 rounded-lg">
                  <h3 className="text-green-400 font-semibold mb-2 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    Estimated Delivery
                  </h3>
                  <p className="text-green-300 text-sm">
                    Within 1 hour on campus
                  </p>
                </div>
                
                <div className="mt-8">
                  <AnimatedButton
                    type="submit"
                    className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-lg shadow-green-500/25"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Processing Your Order...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Confirm Order - {formatPrice(total)}
                      </div>
                    )}
                  </AnimatedButton>
                </div>
                
                <p className="text-sm text-gray-500 mt-4 text-center">
                  By completing your order, you agree to our Terms of Service and Privacy Policy.
                </p>

                {/* Security Notice */}
                <div className="mt-4 p-3 bg-blue-400/10 border border-blue-400/20 rounded-lg">
                  <div className="flex items-center text-blue-400 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Secure checkout • Logged in as {user?.name}
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>
        </form>

        {/* Order Confirmation Modal */}
        <AnimatePresence>
          {showConfirmation && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", damping: 25 }}
                className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-cyan-400/20 p-6 max-w-md w-full mx-auto"
              >
                <div className="text-center">
                  {/* Icon */}
                  <div className="w-20 h-20 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Confirm Your Order
                  </h3>

                  {/* Message */}
                  <p className="text-gray-300 mb-6">
                    Are you sure you want to place this order? This action cannot be undone.
                  </p>

                  {/* Order Summary */}
                  <div className="bg-gray-700/50 rounded-lg p-4 mb-6 text-left">
                    <h4 className="text-cyan-400 font-semibold mb-3">Order Details:</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Items:</span>
                        <span className="text-white">{items.length} products</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Delivery to:</span>
                        <span className="text-white">Block {formData.blockNumber}, Room {formData.roomDormNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Total Amount:</span>
                        <span className="text-cyan-400 font-semibold">{formatPrice(total)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={handleCancelOrder}
                      className="flex-1 px-4 py-3 bg-gray-700 text-gray-300 rounded-xl hover:bg-gray-600 transition-colors font-medium"
                      disabled={isProcessing}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleConfirmOrder}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all font-medium shadow-lg shadow-green-500/25"
                      disabled={isProcessing}
                    >
                      {isProcessing ? 'Processing...' : 'Yes, Place Order'}
                    </button>
                  </div>

                  {/* Note */}
                  <p className="text-xs text-gray-500 mt-4">
                    {isProcessing ? 'Creating your order...' : 'You\'ll be redirected to the order success page after confirmation'}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Checkout;