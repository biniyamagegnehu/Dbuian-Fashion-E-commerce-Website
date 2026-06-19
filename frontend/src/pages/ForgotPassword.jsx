import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { authAPI } from '../services/api';
import GlassCard from '../components/ui/GlassCard';
import AnimatedButton from '../components/ui/AnimatedButton';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'sent'
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    setErrorMsg('');
    try {
      await authAPI.forgotPassword(email);
      // Always show sent — regardless of whether account exists (security)
      setStatus('sent');
    } catch (err) {
      setErrorMsg(
        err.response?.data?.error || 'Something went wrong. Please try again.'
      );
      setStatus('idle');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12 px-4 relative overflow-hidden">
      {/* Background orbs */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-amber-500/10 to-purple-500/10"
            style={{
              width: Math.random() * 120 + 30,
              height: Math.random() * 120 + 30,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{ x: [0, 30, 0], y: [0, -30, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 20 + i * 3, repeat: Infinity, repeatType: 'reverse' }}
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
          <motion.div
            className="flex justify-center mb-6"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.6, delay: 0.2, type: 'spring' }}
          >
            <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-cyan-400/20">
              <span className="text-white font-bold text-3xl">D</span>
            </div>
          </motion.div>

          <h1 className="text-2xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 mb-2">
            Forgot Password
          </h1>
          <p className="text-gray-400 text-sm text-center mb-8">
            Enter your email address and we'll send you a secure link to reset your password.
          </p>

          {/* Sent confirmation */}
          {status === 'sent' ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring' }}
              className="flex flex-col items-center gap-4 text-center"
            >
              <div className="w-16 h-16 bg-green-500/20 border border-green-500/30 rounded-full flex items-center justify-center text-3xl">
                📬
              </div>
              <p className="text-green-400 font-semibold text-lg">Check your inbox!</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                If an account exists with <strong className="text-gray-200">{email}</strong>,
                a password reset link has been sent. The link expires in{' '}
                <strong className="text-amber-400">15 minutes</strong>.
              </p>
              <p className="text-gray-500 text-xs">
                Didn't receive an email? Check your spam folder.
              </p>
              <Link
                to="/login"
                className="mt-4 inline-block px-8 py-3 border border-gray-600 hover:border-cyan-400/50 text-gray-300 hover:text-white font-semibold rounded-xl transition-all duration-300"
              >
                ← Back to Login
              </Link>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {errorMsg && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-red-400/10 border border-red-400/20 text-red-400 p-4 rounded-xl text-sm text-center"
                >
                  ⚠️ {errorMsg}
                </motion.div>
              )}

              <div>
                <label htmlFor="forgot-email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 group-focus-within:text-cyan-400 transition-colors duration-300">
                    📧
                  </div>
                  <input
                    id="forgot-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent text-white placeholder-gray-500 transition-all duration-300 hover:bg-gray-800/70"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <AnimatedButton
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-lg shadow-amber-500/25 transition-all duration-300"
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
                  '🔑 Send Reset Link'
                )}
              </AnimatedButton>

              <div className="text-center">
                <Link
                  to="/login"
                  className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors duration-300 hover:underline"
                >
                  ← Back to Login
                </Link>
              </div>
            </form>
          )}
        </GlassCard>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
