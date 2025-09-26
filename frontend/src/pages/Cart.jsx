import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import GlassCard from '../components/ui/GlassCard';
import AnimatedButton from '../components/ui/AnimatedButton';

const Cart = () => {
  const { items, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();

  // Format price in Birr
  const formatPrice = (price) => {
    return `${price} Birr`;
  };

  const handleQuantityChange = (id, size, newQuantity) => {
    if (newQuantity < 1) return;
    updateQuantity(id, size, newQuantity);
  };

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
                  onClick={clearCart}
                  className="text-sm text-red-400 hover:text-red-300 transition-colors"
                >
                  Clear cart
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
                              className="px-3 py-1 text-gray-400 hover:text-white hover:bg-gray-700/50 transition-colors"
                              disabled={item.quantity <= 1}
                            >
                              -
                            </button>
                            <span className="px-3 py-1 text-gray-300">{item.quantity}</span>
                            <button
                              onClick={() => handleQuantityChange(item.id, item.size, item.quantity + 1)}
                              className="px-3 py-1 text-gray-400 hover:text-white hover:bg-gray-700/50 transition-colors"
                            >
                              +
                            </button>
                          </div>
                          
                          <button
                            onClick={() => removeFromCart(item.id, item.size)}
                            className="ml-4 text-red-400 hover:text-red-300 transition-colors"
                          >
                            Remove
                          </button>
                        </div>
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