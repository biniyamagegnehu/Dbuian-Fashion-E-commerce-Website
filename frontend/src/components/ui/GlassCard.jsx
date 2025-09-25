import React from 'react';
import { motion } from 'framer-motion';

const GlassCard = ({ 
  children, 
  className = '', 
  variant = 'default',
  hoverEffect = true,
  ...props 
}) => {
  const baseClasses = 'backdrop-blur-xl rounded-xl border shadow-xl';
  
  const variants = {
    default: 'bg-white/10 border-white/20 shadow-white/5',
    elevated: 'bg-white/15 border-white/30 shadow-white/10',
    accent: 'bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border-cyan-400/30 shadow-cyan-400/10',
    dark: 'bg-gray-900/30 border-gray-700/50 shadow-black/20',
    success: 'bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-400/30 shadow-green-400/10',
    warning: 'bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-400/30 shadow-orange-400/10'
  };

  const hoverAnimations = hoverEffect ? {
    whileHover: { 
      y: -4, 
      scale: 1.02,
      transition: { duration: 0.3, ease: "easeOut" }
    },
    whileTap: { 
      scale: 0.98,
      transition: { duration: 0.1 }
    }
  } : {};

  return (
    <motion.div
      className={`${baseClasses} ${variants[variant]} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={hoverEffect ? { 
        y: -4, 
        scale: 1.02,
        borderColor: 'rgba(34, 211, 238, 0.4)',
        boxShadow: '0 20px 40px rgba(34, 211, 238, 0.1)',
        transition: { duration: 0.3, ease: "easeOut" }
      } : {}}
      whileTap={hoverEffect ? { 
        scale: 0.98,
        transition: { duration: 0.1 }
      } : {}}
      transition={{ duration: 0.4, ease: "easeOut" }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Enhanced GlassCard with additional features
export const GlassCardEnhanced = ({ 
  children, 
  className = '',
  glow = false,
  borderGlow = false,
  intensity = 'normal',
  ...props 
}) => {
  const intensityClasses = {
    subtle: 'bg-white/5 border-white/10',
    normal: 'bg-white/10 border-white/20',
    strong: 'bg-white/15 border-white/30'
  };

  const glowEffect = glow ? 'before:absolute before:inset-0 before:bg-gradient-to-r before:from-cyan-500/10 before:to-purple-500/10 before:rounded-xl before:blur-md before:-z-10' : '';
  const borderGlowEffect = borderGlow ? 'hover:shadow-cyan-400/20 hover:border-cyan-400/40' : '';

  return (
    <motion.div
      className={`
        relative backdrop-blur-xl rounded-xl border shadow-lg
        ${intensityClasses[intensity]} 
        ${glowEffect}
        ${borderGlowEffect}
        ${className}
      `}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ 
        y: -6, 
        scale: 1.02,
        borderColor: 'rgba(34, 211, 238, 0.3)',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
        transition: { duration: 0.4, ease: "easeOut" }
      }}
      whileTap={{ 
        scale: 0.98,
        transition: { duration: 0.1 }
      }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      {...props}
    >
      {children}
      
      {/* Subtle corner accents */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-cyan-400/30 rounded-tl-xl"></div>
      <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-purple-400/30 rounded-tr-xl"></div>
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-cyan-400/30 rounded-bl-xl"></div>
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-purple-400/30 rounded-br-xl"></div>
    </motion.div>
  );
};

// Specialized card variants
export const ProductCardGlass = ({ children, className, ...props }) => (
  <GlassCard
    variant="accent"
    className={`hover:shadow-cyan-400/15 ${className}`}
    {...props}
  >
    {children}
  </GlassCard>
);

export const FilterCardGlass = ({ children, className, ...props }) => (
  <GlassCard
    variant="dark"
    className={`hover:shadow-white/5 ${className}`}
    {...props}
  >
    {children}
  </GlassCard>
);

export const HeroCardGlass = ({ children, className, ...props }) => (
  <GlassCardEnhanced
    glow={true}
    borderGlow={true}
    intensity="strong"
    className={className}
    {...props}
  >
    {children}
  </GlassCardEnhanced>
);

export default GlassCard;