import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { authAPI } from '../services/api';
import GlassCard from '../components/ui/GlassCard';

const VerifyEmail = () => {
  const { token } = useParams();
  const [status, setStatus] = useState('loading'); // 'loading' | 'success' | 'error'
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verify = async () => {
      try {
        const response = await authAPI.verifyEmail(token);
        setMessage(response.data.message || 'Email verified successfully!');
        setStatus('success');
      } catch (err) {
        setMessage(
          err.response?.data?.error ||
            'This verification link is invalid or has expired.'
        );
        setStatus('error');
      }
    };

    if (token) {
      verify();
    } else {
      setStatus('error');
      setMessage('No verification token found in the link.');
    }
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12 px-4 relative overflow-hidden">
      {/* Background orbs */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-cyan-500/10 to-purple-500/10"
            style={{
              width: Math.random() * 120 + 40,
              height: Math.random() * 120 + 40,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{ x: [0, 30, 0], y: [0, -30, 0], scale: [1, 1.15, 1] }}
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
        <GlassCard className="p-8 backdrop-blur-xl border border-white/20 text-center">
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

          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 mb-6">
            Email Verification
          </h1>

          {/* Loading */}
          {status === 'loading' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center gap-4"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-12 h-12 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full"
              />
              <p className="text-gray-400">Verifying your email address…</p>
            </motion.div>
          )}

          {/* Success */}
          {status === 'success' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring' }}
              className="flex flex-col items-center gap-4"
            >
              <div className="w-16 h-16 bg-green-500/20 border border-green-500/30 rounded-full flex items-center justify-center text-3xl">
                ✅
              </div>
              <p className="text-green-400 font-semibold text-lg">{message}</p>
              <p className="text-gray-400 text-sm">
                Your account is now active. You can log in below.
              </p>
              <Link
                to="/login"
                className="mt-4 inline-block px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold rounded-xl shadow-lg shadow-cyan-500/25 transition-all duration-300 hover:shadow-cyan-500/40"
              >
                🔑 Go to Login
              </Link>
            </motion.div>
          )}

          {/* Error */}
          {status === 'error' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring' }}
              className="flex flex-col items-center gap-4"
            >
              <div className="w-16 h-16 bg-red-500/20 border border-red-500/30 rounded-full flex items-center justify-center text-3xl">
                ❌
              </div>
              <p className="text-red-400 font-semibold text-lg">{message}</p>
              <p className="text-gray-400 text-sm">
                The link may have expired (links are valid for 24 hours).
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mt-4 w-full">
                <Link
                  to="/resend-verification"
                  className="flex-1 text-center px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold rounded-xl shadow-lg transition-all duration-300"
                >
                  📧 Resend Link
                </Link>
                <Link
                  to="/login"
                  className="flex-1 text-center px-6 py-3 border border-gray-600 hover:border-cyan-400/50 text-gray-300 hover:text-white font-semibold rounded-xl transition-all duration-300"
                >
                  Back to Login
                </Link>
              </div>
            </motion.div>
          )}
        </GlassCard>
      </motion.div>
    </div>
  );
};

export default VerifyEmail;
