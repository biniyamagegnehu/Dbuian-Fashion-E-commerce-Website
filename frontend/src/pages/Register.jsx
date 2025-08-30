import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import GlassCard from '../components/ui/GlassCard';
import AnimatedButton from '../components/ui/AnimatedButton';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    university: '',
    studentId: ''
  });
  const [error, setError] = useState('');
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      await register(formData);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 z-0">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-cyan-500/5 to-purple-500/5"
            style={{
              width: Math.random() * 100 + 50,
              height: Math.random() * 100 + 50,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
            }}
            transition={{
              duration: Math.random() * 20 + 20,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="max-w-md w-full relative z-10"
      >
        <GlassCard className="p-8 backdrop-blur-xl">
          <div className="text-center mb-8">
            <motion.div 
              className="flex justify-center mb-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-2xl">D</span>
              </div>
            </motion.div>
            <motion.h2 
              className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 mb-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Join Dbuian Fashion
            </motion.h2>
            <motion.p 
              className="text-gray-400"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Or{' '}
              <Link to="/login" className="font-medium text-cyan-400 hover:text-cyan-300 transition-colors">
                sign in to your existing account
              </Link>
            </motion.p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <motion.div 
                className="bg-red-400/10 border border-red-400/20 text-red-400 p-3 rounded-lg text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {error}
              </motion.div>
            )}

            {[
              { id: 'name', label: 'Full Name', type: 'text', placeholder: 'John Doe', icon: '👤' },
              { id: 'email', label: 'University Email', type: 'email', placeholder: 'you@university.edu', icon: '📧' },
              { id: 'university', label: 'University', type: 'text', placeholder: 'Your University Name', icon: '🎓' },
              { id: 'studentId', label: 'Student ID', type: 'text', placeholder: '12345678', icon: '🔢' },
              { id: 'password', label: 'Password', type: 'password', placeholder: '••••••••', icon: '🔒' },
              { id: 'confirmPassword', label: 'Confirm Password', type: 'password', placeholder: '••••••••', icon: '🔒' },
            ].map((field, index) => (
              <motion.div
                key={field.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
              >
                <label htmlFor={field.id} className="block text-sm font-medium text-gray-300 mb-2">
                  {field.label}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">{field.icon}</span>
                  </div>
                  <input
                    id={field.id}
                    name={field.id}
                    type={field.type}
                    required
                    value={formData[field.id]}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 text-white placeholder-gray-500"
                    placeholder={field.placeholder}
                    autoComplete={field.type === 'password' ? 'new-password' : 'off'}
                  />
                </div>
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.1 }}
              className="flex items-center"
            >
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 text-cyan-400 focus:ring-cyan-400 border-gray-600 rounded bg-gray-800/50"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-400">
                I agree to the{' '}
                <a href="#" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                  Terms and Conditions
                </a>
              </label>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.2 }}
            >
              <AnimatedButton
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating account...
                  </div>
                ) : (
                  'Create account'
                )}
              </AnimatedButton>
            </motion.div>
          </form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.3 }}
            className="mt-6 pt-4 border-t border-gray-700"
          >
            <p className="text-xs text-gray-500 text-center">
              By creating an account, you agree to our privacy policy and terms of service.
              Your university email will be verified before you can make purchases.
            </p>
          </motion.div>
        </GlassCard>
      </motion.div>
    </div>
  );
};

export default Register;