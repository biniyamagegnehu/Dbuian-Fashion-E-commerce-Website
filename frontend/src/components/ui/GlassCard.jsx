import React from 'react';
import { motion } from 'framer-motion';

const GlassCard = ({ children, className = '', ...props }) => {
  return (
    <motion.div
      className={`bg-white/20 backdrop-blur-lg rounded-2xl border border-white/30 shadow-lg ${className}`}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;