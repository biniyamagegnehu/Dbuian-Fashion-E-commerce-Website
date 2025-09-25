import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import GlassCard from '../ui/GlassCard';

const ProductCard = ({ product, layout = 'grid' }) => {
  if (layout === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        whileHover={{ x: 5 }}
        className="w-full"
      >
        <GlassCard className="backdrop-blur-xl border border-white/10 hover:border-cyan-500/30 transition-all duration-300">
          <Link to={`/product/${product.id}`}>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="md:w-1/4">
                <div className="relative overflow-hidden rounded-xl">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 md:h-32 object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>
              
              <div className="md:w-3/4 flex flex-col justify-between py-2">
                <div>
                  <h3 className="font-semibold text-lg text-white mb-1">
                    {product.name}
                  </h3>
                  <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                    {product.description}
                  </p>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                    ${product.price}
                  </span>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-cyan-300/80 bg-cyan-400/10 px-2 py-1 rounded-full">
                      {product.category}
                    </span>
                    <div className="flex space-x-1">
                      {product.colors.slice(0, 3).map((color, index) => (
                        <span
                          key={index}
                          className="w-3 h-3 rounded-full border border-white/20 shadow-sm"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </GlassCard>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className="h-full"
    >
      <GlassCard className="h-full overflow-hidden group backdrop-blur-xl border border-white/10 hover:border-cyan-500/30 transition-all duration-300">
        <Link to={`/product/${product.id}`}>
          <div className="relative overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Category badge */}
            <div className="absolute top-3 left-3">
              <span className="px-3 py-1 bg-black/40 text-cyan-300 text-xs rounded-full backdrop-blur-md border border-cyan-400/20">
                {product.category}
              </span>
            </div>
            
            {/* Featured badge */}
            {product.featured && (
              <div className="absolute top-3 right-3">
                <span className="px-2 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs rounded-full backdrop-blur-md border border-purple-400/20">
                  Featured
                </span>
              </div>
            )}
            
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          
          <div className="p-5">
            <div className="mb-3">
              <h3 className="font-semibold text-lg text-white mb-2 line-clamp-1">
                {product.name}
              </h3>
              <p className="text-gray-300 text-sm line-clamp-2 leading-relaxed">
                {product.description}
              </p>
            </div>
            
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                ${product.price}
              </span>
              
              <div className="flex items-center space-x-2">
                <div className="flex -space-x-1">
                  {product.colors.slice(0, 4).map((color, index) => (
                    <span
                      key={index}
                      className="w-4 h-4 rounded-full border-2 border-gray-800 shadow-sm"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                {product.colors.length > 4 && (
                  <span className="text-xs text-cyan-300/70 bg-cyan-400/10 px-1 rounded">
                    +{product.colors.length - 4}
                  </span>
                )}
              </div>
            </div>
            
            {/* Additional info */}
            <div className="flex items-center justify-between pt-3 border-t border-white/10">
              <div className="flex items-center space-x-3">
                <span className="text-xs text-cyan-300/70 bg-cyan-400/10 px-2 py-1 rounded-full">
                  {product.size.length} sizes
                </span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  product.stock > 10 
                    ? 'bg-green-400/10 text-green-300' 
                    : product.stock > 0 
                    ? 'bg-yellow-400/10 text-yellow-300'
                    : 'bg-red-400/10 text-red-300'
                }`}>
                  {product.stock} in stock
                </span>
              </div>
              
              {product.trending && (
                <span className="text-xs bg-gradient-to-r from-orange-400 to-red-400 text-white px-2 py-1 rounded-full">
                  Trending
                </span>
              )}
            </div>
          </div>
        </Link>
      </GlassCard>
    </motion.div>
  );
};

export default ProductCard;