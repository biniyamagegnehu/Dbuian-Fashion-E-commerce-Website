import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { authAPI } from '../services/api';
import GlassCard from '../components/ui/GlassCard';
import AnimatedButton from '../components/ui/AnimatedButton';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validate = () => {
    if (formData.password.length < 6) {
      setMessage('Password must be at least 6 characters.');
      setStatus('error');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setMessage('Passwords do not match.');
      setStatus('error');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    if (!validate()) return;
    setStatus('loading');
    try {
      const response = await authAPI.resetPassword(token, {
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });
      setMessage(response.data.message || 'Password reset successful!');
      setStatus('success');
      // Redirect to login after 3 seconds
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setMessage(
        err.response?.data?.error ||
          'This reset link is invalid or has expired. Please request a new one.'
      );
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12 px-4 relative overflow-hidden">
      {/* Background orbs */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-amber-500/10 to-red-500/10"
            style={{
              width: Math.random() * 120 + 30,
              height: Math.random() * 120 + 30,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{ x: [0, 30, 0], y: [0, -30, 0] }}
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

          <h1 className="text-2xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-red-400 mb-2">
            Set New Password
          </h1>
          <p className="text-gray-400 text-sm text-center mb-8">
            Choose a strong new password for your Dbuian Fashion account.
          </p>

          {/* Success */}
          {status === 'success' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring' }}
              className="flex flex-col items-center gap-4 text-center"
            >
              <div className="w-16 h-16 bg-green-500/20 border border-green-500/30 rounded-full flex items-center justify-center text-3xl">
                ✅
              </div>
              <p className="text-green-400 font-semibold text-lg">{message}</p>
              <p className="text-gray-400 text-sm">
                Redirecting to login in a moment…
              </p>
              <Link
                to="/login"
                className="mt-4 inline-block px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold rounded-xl shadow-lg transition-all duration-300"
              >
                🔑 Go to Login
              </Link>
            </motion.div>
          )}

          {/* Form */}
          {status !== 'success' && (
            <form onSubmit={handleSubmit} className="space-y-5">
              {(status === 'error') && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-red-400/10 border border-red-400/20 text-red-400 p-4 rounded-xl text-sm text-center"
                >
                  ⚠️ {message}
                </motion.div>
              )}

              {/* New Password */}
              <div>
                <label htmlFor="reset-password" className="block text-sm font-medium text-gray-300 mb-2">
                  New Password <span className="text-red-400">*</span>
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 group-focus-within:text-amber-400 transition-colors duration-300">
                    🔒
                  </div>
                  <input
                    id="reset-password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-12 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent text-white placeholder-gray-500 transition-all duration-300 hover:bg-gray-800/70"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-amber-400 transition-colors duration-300"
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="reset-confirm-password" className="block text-sm font-medium text-gray-300 mb-2">
                  Confirm New Password <span className="text-red-400">*</span>
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 group-focus-within:text-amber-400 transition-colors duration-300">
                    🔒
                  </div>
                  <input
                    id="reset-confirm-password"
                    name="confirmPassword"
                    type={showConfirm ? 'text' : 'password'}
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full pl-10 pr-12 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent text-white placeholder-gray-500 transition-all duration-300 hover:bg-gray-800/70"
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-amber-400 transition-colors duration-300"
                  >
                    {showConfirm ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <AnimatedButton
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-red-500 hover:from-amber-600 hover:to-red-600 shadow-lg shadow-amber-500/25 transition-all duration-300"
                disabled={status === 'loading'}
              >
                {status === 'loading' ? (
                  <div className="flex items-center justify-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                    />
                    Resetting…
                  </div>
                ) : (
                  '🔑 Reset Password'
                )}
              </AnimatedButton>

              {status === 'error' && (
                <div className="text-center">
                  <Link
                    to="/forgot-password"
                    className="text-sm text-amber-400 hover:text-amber-300 transition-colors duration-300 hover:underline"
                  >
                    Request a new reset link
                  </Link>
                </div>
              )}

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

export default ResetPassword;
