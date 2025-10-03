import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import GlassCard from '../components/ui/GlassCard';
import AnimatedButton from '../components/ui/AnimatedButton';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const Cart = () => {
  const { 
    items, 
    removeFromCart, 
    updateQuantity, 
    getCartTotal, 
    clearCart,
    loading,
    error 
  } = useCart();
  
  const [updatingItems, setUpdatingItems] = useState({});
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  // Show notification
  const showNotification = (message, type = 'error') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
  };

  // Format price in Birr
  const formatPrice = (price) => {
    return `${price.toFixed(2)} Birr`;
  };

  const handleQuantityChange = async (id, size, newQuantity) => {
    if (newQuantity < 1) return;
    
    setUpdatingItems(prev => ({ ...prev, [`${id}-${size}`]: true }));
    
    const result = await updateQuantity(id, size, newQuantity);
    
    setUpdatingItems(prev => ({ ...prev, [`${id}-${size}`]: false }));
    
    if (!result.success) {
      showNotification(result.message, 'error');
    }
  };

  const handleRemoveItem = async (id, size) => {
    setUpdatingItems(prev => ({ ...prev, [`${id}-${size}`]: true }));
    
    const result = await removeFromCart(id, size);
    
    setUpdatingItems(prev => ({ ...prev, [`${id}-${size}`]: false }));
    
    if (!result.success) {
      showNotification(result.message, 'error');
    }
  };

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      const result = await clearCart();
      if (!result.success) {
        showNotification(result.message, 'error');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center min-h-[50vh]">
            <LoadingSpinner size="lg" />
          </div>
        </div>
      </div>
    );
  }

  if (error && items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pt-20">
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto text-center"
          >
            <GlassCard className="p-8 backdrop-blur-xl">
              <div className="w-24 h-24 bg-gradient-to-r from-red-400/10 to-orange-400/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-300 mb-4">Error Loading Cart</h2>
              <p className="text-gray-400 mb-6">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                Try Again
              </button>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pt-20">
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto text-center"
          >
            <GlassCard className="p-8 backdrop-blur-xl">
              <div className="w-24 h-24 bg-gradient-to-r from-cyan-400/10 to-purple-400/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-300 mb-4">Your cart is empty</h2>
              <p className="text-gray-400 mb-6">Looks like you haven't added anything to your cart yet.</p>
              <Link to="/products">
                <AnimatedButton className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600">
                  Continue Shopping
                </AnimatedButton>
              </Link>
            </GlassCard>
          </motion.div>
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
      {/* Notification */}
      <AnimatePresence>
        {notification.show && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-4 right-4 z-50 p-4 rounded-lg backdrop-blur-xl border ${
              notification.type === 'error' 
                ? 'bg-red-500/10 border-red-400/20 text-red-300' 
                : 'bg-green-500/10 border-green-400/20 text-green-300'
            }`}
          >
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4 py-8">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 mb-8"
        >
          Shopping Cart
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart items */}
          <div className="lg:col-span-2">
            <GlassCard className="p-6 backdrop-blur-xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-300">
                  Your Items ({items.reduce((total, item) => total + item.quantity, 0)})
                </h2>
                <button
                  onClick={handleClearCart}
                  className="text-sm text-red-400 hover:text-red-300 transition-colors disabled:opacity-50"
                  disabled={updatingItems['clear']}
                >
                  {updatingItems['clear'] ? 'Clearing...' : 'Clear cart'}
                </button>
              </div>

              <div className="divide-y divide-gray-700">
                <AnimatePresence>
                  {items.map((item, index) => (
                    <motion.div
                      key={`${item.id}-${item.size}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="py-6 flex flex-col sm:flex-row items-start sm:items-center"
                    >
                      <motion.div whileHover={{ scale: 1.05 }} className="flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                      </motion.div>
                      
                      <div className="sm:ml-6 flex-1">
                        <h3 className="text-lg font-medium text-gray-300">{item.name}</h3>
                        <p className="text-gray-400">Size: {item.size}</p>
                        <p className="text-lg font-semibold text-cyan-400 mt-1">{formatPrice(item.price)}</p>
                        
                        <div className="flex items-center mt-4">
                          <div className="flex items-center border border-gray-600 rounded-lg bg-gray-800/50">
                            <button
                              onClick={() => handleQuantityChange(item.id, item.size, item.quantity - 1)}
                              className="px-3 py-1 text-gray-400 hover:text-white hover:bg-gray-700/50 transition-colors disabled:opacity-50"
                              disabled={item.quantity <= 1 || updatingItems[`${item.id}-${item.size}`]}
                            >
                              -
                            </button>
                            <span className="px-3 py-1 text-gray-300 min-w-[40px] text-center">
                              {updatingItems[`${item.id}-${item.size}`] ? (
                                <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
                              ) : (
                                item.quantity
                              )}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(item.id, item.size, item.quantity + 1)}
                              className="px-3 py-1 text-gray-400 hover:text-white hover:bg-gray-700/50 transition-colors disabled:opacity-50"
                              disabled={item.quantity >= item.stock || updatingItems[`${item.id}-${item.size}`]}
                            >
                              +
                            </button>
                          </div>
                          
                          <button
                            onClick={() => handleRemoveItem(item.id, item.size)}
                            className="ml-4 text-red-400 hover:text-red-300 transition-colors disabled:opacity-50"
                            disabled={updatingItems[`${item.id}-${item.size}`]}
                          >
                            {updatingItems[`${item.id}-${item.size}`] ? 'Removing...' : 'Remove'}
                          </button>
                        </div>
                        
                        {item.quantity >= item.stock && (
                          <p className="text-sm text-red-400 mt-2">Maximum available quantity reached</p>
                        )}
                      </div>
                      
                      <div className="sm:ml-6 mt-4 sm:mt-0">
                        <p className="text-lg font-semibold text-gray-300">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </GlassCard>
          </div>

          {/* Order summary */}
          <div>
            <GlassCard className="p-6 backdrop-blur-xl sticky top-28">
              <h2 className="text-xl font-semibold text-gray-300 mb-6">Order Summary</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Subtotal</span>
                  <span className="text-gray-300">{formatPrice(subtotal)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400">Shipping</span>
                  <span className="text-gray-300">{formatPrice(shipping)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400">Tax (15%)</span>
                  <span className="text-gray-300">{formatPrice(tax)}</span>
                </div>
                
                <div className="border-t border-gray-700 pt-4 flex justify-between text-lg font-semibold">
                  <span className="text-gray-300">Total</span>
                  <span className="text-cyan-400">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>
              
              <div className="mt-8 space-y-4">
                <Link to="/checkout">
                  <AnimatedButton className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600">
                    Proceed to Checkout
                  </AnimatedButton>
                </Link>
                
                <Link to="/products">
                  <AnimatedButton variant="outline" className="w-full py-3 border-gray-600 text-gray-300 hover:border-cyan-400 hover:text-cyan-400">
                    Continue Shopping
                  </AnimatedButton>
                </Link>
              </div>
              
              <p className="text-sm text-gray-500 mt-6 text-center">
                Free returns within 30 days for university students
              </p>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;