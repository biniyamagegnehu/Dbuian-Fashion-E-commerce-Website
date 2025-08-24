import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = ({ 
  size = 'medium', 
  color = 'indigo', 
  className = '',
  text = 'Loading...' 
}) => {
  const sizeClasses = {
    small: 'h-6 w-6',
    medium: 'h-12 w-12',
    large: 'h-16 w-16',
    xl: 'h-24 w-24'
  };

  const colorClasses = {
    indigo: 'border-indigo-600',
    white: 'border-white',
    gray: 'border-gray-600',
    purple: 'border-purple-600',
    pink: 'border-pink-600'
  };

  const spinnerVariants = {
    initial: { rotate: 0 },
    animate: { 
      rotate: 360,
      transition: { 
        duration: 1, 
        repeat: Infinity, 
        ease: "linear" 
      }
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <motion.div
        className={`
          rounded-full border-4 border-t-4 border-t-transparent
          ${sizeClasses[size]} ${colorClasses[color]}
        `}
        variants={spinnerVariants}
        initial="initial"
        animate="animate"
      />
      {text && (
        <motion.p 
          className="mt-4 text-gray-600 font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
};

// PulseLoader variant - alternative loading style
export const PulseLoader = ({ 
  size = 'medium', 
  color = 'indigo', 
  className = '' 
}) => {
  const sizeClasses = {
    small: 'h-2 w-2',
    medium: 'h-3 w-3',
    large: 'h-4 w-4'
  };

  const colorClasses = {
    indigo: 'bg-indigo-600',
    white: 'bg-white',
    gray: 'bg-gray-600',
    purple: 'bg-purple-600',
    pink: 'bg-pink-600'
  };

  const dotVariants = {
    initial: { scale: 0.6, opacity: 0.6 },
    animate: (i) => ({
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.6,
        repeat: Infinity,
        repeatType: "reverse",
        delay: i * 0.2
      }
    })
  };

  return (
    <div className={`flex items-center justify-center space-x-2 ${className}`}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          custom={i}
          className={`rounded-full ${sizeClasses[size]} ${colorClasses[color]}`}
          variants={dotVariants}
          initial="initial"
          animate="animate"
        />
      ))}
    </div>
  );
};

// SkeletonLoader for content placeholders
export const SkeletonLoader = ({ 
  variant = 'text',
  width = 'full',
  height = '4',
  className = ''
}) => {
  const widthClasses = {
    full: 'w-full',
    half: 'w-1/2',
    quarter: 'w-1/4',
    third: 'w-1/3',
    auto: 'w-auto'
  };

  const heightClasses = {
    1: 'h-1',
    2: 'h-2',
    3: 'h-3',
    4: 'h-4',
    6: 'h-6',
    8: 'h-8',
    12: 'h-12',
    16: 'h-16',
    24: 'h-24',
    32: 'h-32'
  };

  const skeletonVariants = {
    initial: { opacity: 0.7 },
    animate: {
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  if (variant === 'circle') {
    return (
      <motion.div
        className={`rounded-full bg-gray-300 ${widthClasses[width]} ${heightClasses[height]} ${className}`}
        variants={skeletonVariants}
        initial="initial"
        animate="animate"
      />
    );
  }

  if (variant === 'rect') {
    return (
      <motion.div
        className={`rounded-lg bg-gray-300 ${widthClasses[width]} ${heightClasses[height]} ${className}`}
        variants={skeletonVariants}
        initial="initial"
        animate="animate"
      />
    );
  }

  // Default text variant
  return (
    <motion.div
      className={`rounded-md bg-gray-300 ${widthClasses[width]} ${heightClasses[height]} ${className}`}
      variants={skeletonVariants}
      initial="initial"
      animate="animate"
    />
  );
};

// PageLoader for full page loading states
export const PageLoader = ({ 
  spinnerSize = 'large',
  text = 'Loading content...',
  className = ''
}) => {
  return (
    <div className={`fixed inset-0 bg-white bg-opacity-90 flex flex-col items-center justify-center z-50 ${className}`}>
      <LoadingSpinner size={spinnerSize} text={text} />
    </div>
  );
};

export default LoadingSpinner;