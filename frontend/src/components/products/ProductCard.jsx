import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import GlassCard from '../ui/GlassCard';

const ProductCard = ({ product }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -8 }}
      className="h-full"
    >
      <GlassCard className="h-full overflow-hidden group">
        <Link to={`/product/${product.id}`}>
          <div className="relative overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          
          <div className="p-4">
            <h3 className="font-semibold text-lg text-gray-800 mb-1 truncate">
              {product.name}
            </h3>
            <p className="text-gray-600 text-sm mb-2 line-clamp-2">
              {product.description}
            </p>
            <div className="flex items-center justify-between mt-3">
              <span className="text-xl font-bold text-indigo-600">
                ${product.price}
              </span>
              <div className="flex space-x-1">
                {product.colors.slice(0, 3).map((color, index) => (
                  <span
                    key={index}
                    className="w-4 h-4 rounded-full border border-gray-300"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>
        </Link>
      </GlassCard>
    </motion.div>
  );
};

export default ProductCard;