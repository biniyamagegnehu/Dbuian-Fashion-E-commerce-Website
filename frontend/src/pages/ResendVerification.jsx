import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { authAPI } from '../services/api';
import GlassCard from '../components/ui/GlassCard';
import AnimatedButton from '../components/ui/AnimatedButton';

const ResendVerification = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    setMessage('');
    try {
      const response = await authAPI.resendVerification(email);
      setMessage(response.data.message || 'Verification email sent!');
      setStatus('success');
    } catch (err) {
      setMessage(
        err.response?.data?.error ||
          'Something went wrong. Please try again.'
      );
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12 px-4 relative overflow-hidden">
      {/* Background orbs */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-cyan-500/10 to-purple-500/10"
            style={{
              width: Math.random() * 100 + 40,
              height: Math.random() * 100 + 40,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{ x: [0, 25, 0], y: [0, -25, 0] }}
            transition={{ duration: 18 + i * 2, repeat: Infinity, repeatType: 'reverse' }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
        className="max-w-md w-full relative z-10"
      >
        <GlassCard className="p-8 backdrop-blur-xl border border-white/20">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-cyan-400/20">
              <span className="text-white font-bold text-2xl">D</span>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 mb-2">
            Resend Verification Email
          </h1>
          <p className="text-gray-400 text-sm text-center mb-8">
            Enter your email address and we'll send you a new verification link.
          </p>

          {/* Success message */}
          {status === 'success' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-green-400/10 border border-green-400/20 text-green-400 p-4 rounded-xl mb-6 text-sm text-center"
            >
              ✅ {message}
            </motion.div>
          )}

          {/* Error message */}
          {status === 'error' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-400/10 border border-red-400/20 text-red-400 p-4 rounded-xl mb-6 text-sm text-center"
            >
              ⚠️ {message}
            </motion.div>
          )}

          {status !== 'success' && (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="resend-email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                    📧
                  </div>
                  <input
                    id="resend-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent text-white placeholder-gray-500 transition-all duration-300"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <AnimatedButton
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 shadow-lg shadow-cyan-500/25 transition-all duration-300"
                disabled={status === 'loading'}
              >
                {status === 'loading' ? (
                  <div className="flex items-center justify-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                    />
                    Sending…
                  </div>
                ) : (
                  '📧 Send Verification Email'
                )}
              </AnimatedButton>
            </form>
          )}

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors duration-300 hover:underline"
            >
              ← Back to Login
            </Link>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
};

export default ResendVerification;
