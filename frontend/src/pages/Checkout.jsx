import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import GlassCard from '../components/ui/GlassCard';
import AnimatedButton from '../components/ui/AnimatedButton';

const Checkout = () => {
  const navigate = useNavigate();
  const { items, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    email: user?.email || '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    zipCode: '',
    phone: ''
  });

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
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      clearCart();
      navigate('/order-success');
    }, 2000);
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
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

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left column - Shipping information */}
            <div>
              <GlassCard className="p-6 mb-6 backdrop-blur-xl">
                <h2 className="text-xl font-semibold text-gray-300 mb-6">Shipping Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-400 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 text-white placeholder-gray-500"
                      placeholder="First Name"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-400 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 text-white placeholder-gray-500"
                      placeholder="Last Name"
                    />
                  </div>
                </div>
                
                <div className="mt-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 text-white placeholder-gray-500"
                    placeholder="your@email.com"
                  />
                </div>
                
                <div className="mt-4">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-400 mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 text-white placeholder-gray-500"
                    placeholder="Street Address"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-400 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 text-white placeholder-gray-500"
                      placeholder="City"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="zipCode" className="block text-sm font-medium text-gray-400 mb-2">
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      id="zipCode"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 text-white placeholder-gray-500"
                      placeholder="ZIP Code"
                    />
                  </div>
                </div>
                
                <div className="mt-4">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-400 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 text-white placeholder-gray-500"
                    placeholder="Phone Number"
                  />
                </div>
              </GlassCard>

              <GlassCard className="p-6 backdrop-blur-xl">
                <h2 className="text-xl font-semibold text-gray-300 mb-6">Payment Method</h2>
                
                <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="cod"
                      name="paymentMethod"
                      value="cod"
                      defaultChecked
                      className="h-4 w-4 text-cyan-400 focus:ring-cyan-400"
                    />
                    <label htmlFor="cod" className="ml-3 block text-sm font-medium text-gray-300">
                      Cash on Delivery (COD)
                    </label>
                  </div>
                  
                  <p className="text-sm text-gray-400 mt-2 ml-7">
                    Pay with cash when your order is delivered.
                  </p>
                </div>
                
                <div className="mt-4 text-sm text-gray-400">
                  <p>Note: Other payment methods will be available when the backend is implemented.</p>
                </div>
              </GlassCard>
            </div>

            {/* Right column - Order summary */}
            <div>
              <GlassCard className="p-6 backdrop-blur-xl sticky top-28">
                <h2 className="text-xl font-semibold text-gray-300 mb-6">Order Summary</h2>
                
                <div className="space-y-4">
                  {items.map(item => (
                    <div key={`${item.id}-${item.size}`} className="flex justify-between">
                      <div>
                        <p className="text-gray-300">{item.name} ({item.size})</p>
                        <p className="text-sm text-gray-400">Qty: {item.quantity}</p>
                      </div>
                      <span className="text-gray-300">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                
                <div className="border-t border-gray-700 mt-6 pt-6 space-y-2">
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
                  
                  <div className="flex justify-between text-lg font-semibold pt-2">
                    <span className="text-gray-300">Total</span>
                    <span className="text-cyan-400">{formatPrice(total)}</span>
                  </div>
                </div>
                
                <div className="mt-8">
                  <AnimatedButton
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Processing...
                      </div>
                    ) : (
                      `Place Order - ${formatPrice(total)}`
                    )}
                  </AnimatedButton>
                </div>
                
                <p className="text-sm text-gray-500 mt-4 text-center">
                  By completing your purchase you agree to our Terms of Service.
                </p>
              </GlassCard>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;