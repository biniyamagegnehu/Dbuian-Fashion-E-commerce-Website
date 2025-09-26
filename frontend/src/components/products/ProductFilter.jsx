import React from 'react';
import { motion } from 'framer-motion';

const ProductFilter = ({ filters, onChange, onClear }) => {
  // Filter options - using actual data from products
  const genders = ['Men', 'Women', 'Unisex'];
  const categories = [
    'T-Shirts', 'Hoodies & Sweatshirts', 'Jackets & Coats', 
    'Pants & Trousers', 'Jeans', 'Dresses', 'Skirts', 'Footwear'
  ];
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const priceRanges = [
    { label: 'Under 500 Birr', value: '0-500' },
    { label: '500 Birr – 1500 Birr', value: '500-1500' },
    { label: '1500 Birr – 3000 Birr', value: '1500-3000' },
    { label: 'Above 3000 Birr', value: '3000-0' }
  ];

  const handleChange = (filterType, value) => {
    onChange({ [filterType]: value });
  };

  const hasActiveFilters = filters.gender || filters.category || filters.size || filters.priceRange || filters.sort !== 'newest';

  return (
    <div className="space-y-6">
      {/* Gender filter */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h4 className="font-semibold text-white mb-3 flex items-center">
          <span className="w-1 h-4 bg-gradient-to-b from-blue-400 to-indigo-400 rounded-full mr-2"></span>
          By Gender
        </h4>
        <div className="space-y-1">
          {genders.map((gender, index) => (
            <motion.label
              key={gender}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className={`flex items-center p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                filters.gender === gender
                  ? 'bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border border-blue-400/30'
                  : 'bg-white/5 hover:bg-white/10 border border-transparent'
              }`}
            >
              <input
                type="radio"
                name="gender"
                checked={filters.gender === gender}
                onChange={() => handleChange('gender', gender)}
                className="h-4 w-4 text-blue-400 focus:ring-blue-400 border-gray-600 rounded bg-gray-800/50"
              />
              <span className={`ml-3 font-medium ${
                filters.gender === gender ? 'text-blue-300' : 'text-gray-300'
              }`}>
                {gender}
              </span>
            </motion.label>
          ))}
        </div>
      </motion.div>

      {/* Category filter */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <h4 className="font-semibold text-white mb-3 flex items-center">
          <span className="w-1 h-4 bg-gradient-to-b from-purple-400 to-pink-400 rounded-full mr-2"></span>
          By Category
        </h4>
        <div className="space-y-1">
          {categories.map((category, index) => (
            <motion.label
              key={category}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 + index * 0.03 }}
              className={`flex items-center p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                filters.category === category
                  ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30'
                  : 'bg-white/5 hover:bg-white/10 border border-transparent'
              }`}
            >
              <input
                type="radio"
                name="category"
                checked={filters.category === category}
                onChange={() => handleChange('category', category)}
                className="h-4 w-4 text-purple-400 focus:ring-purple-400 border-gray-600 rounded bg-gray-800/50"
              />
              <span className={`ml-3 font-medium text-sm ${
                filters.category === category ? 'text-purple-300' : 'text-gray-300'
              }`}>
                {category}
              </span>
            </motion.label>
          ))}
        </div>
      </motion.div>

      {/* Size filter */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <h4 className="font-semibold text-white mb-3 flex items-center">
          <span className="w-1 h-4 bg-gradient-to-b from-green-400 to-emerald-400 rounded-full mr-2"></span>
          By Size
        </h4>
        <div className="grid grid-cols-3 gap-2">
          {sizes.map((size, index) => (
            <motion.button
              key={size}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.2 + index * 0.03 }}
              onClick={() => handleChange('size', size)}
              className={`p-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                filters.size === size
                  ? 'bg-gradient-to-r from-green-400 to-emerald-400 text-gray-900 shadow-lg shadow-green-400/25'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white border border-white/10'
              }`}
            >
              {size}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Price Range filter */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <h4 className="font-semibold text-white mb-3 flex items-center">
          <span className="w-1 h-4 bg-gradient-to-b from-orange-400 to-red-400 rounded-full mr-2"></span>
          By Price Range
        </h4>
        <div className="space-y-1">
          {priceRanges.map((range, index) => (
            <motion.label
              key={range.value}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.3 + index * 0.05 }}
              className={`flex items-center p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                filters.priceRange === range.value
                  ? 'bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-400/30'
                  : 'bg-white/5 hover:bg-white/10 border border-transparent'
              }`}
            >
              <input
                type="radio"
                name="priceRange"
                checked={filters.priceRange === range.value}
                onChange={() => handleChange('priceRange', range.value)}
                className="h-4 w-4 text-orange-400 focus:ring-orange-400 border-gray-600 rounded bg-gray-800/50"
              />
              <span className={`ml-3 font-medium ${
                filters.priceRange === range.value ? 'text-orange-300' : 'text-gray-300'
              }`}>
                {range.label}
              </span>
            </motion.label>
          ))}
        </div>
      </motion.div>

      {/* Sort filter */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <h4 className="font-semibold text-white mb-3 flex items-center">
          <span className="w-1 h-4 bg-gradient-to-b from-cyan-400 to-blue-400 rounded-full mr-2"></span>
          Sort By
        </h4>
        <select
          value={filters.sort}
          onChange={(e) => handleChange('sort', e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-400 text-white placeholder-gray-400 appearance-none bg-gradient-to-r from-white/5 to-white/10"
        >
          <option value="newest" className="bg-gray-800 text-white">Newest First</option>
          <option value="price-low" className="bg-gray-800 text-white">Price: Low to High</option>
          <option value="price-high" className="bg-gray-800 text-white">Price: High to Low</option>
          <option value="name" className="bg-gray-800 text-white">Name A-Z</option>
        </select>
      </motion.div>

      {/* Active filters display */}
      {hasActiveFilters && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="p-4 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-xl border border-cyan-400/20"
        >
          <h4 className="font-semibold text-cyan-300 mb-2 text-sm">Active Filters:</h4>
          <div className="flex flex-wrap gap-2">
            {filters.gender && (
              <span className="px-3 py-1 bg-blue-400/20 text-blue-300 text-xs rounded-full border border-blue-400/30">
                👤 {filters.gender}
              </span>
            )}
            {filters.category && (
              <span className="px-3 py-1 bg-purple-400/20 text-purple-300 text-xs rounded-full border border-purple-400/30">
                👕 {filters.category}
              </span>
            )}
            {filters.size && (
              <span className="px-3 py-1 bg-green-400/20 text-green-300 text-xs rounded-full border border-green-400/30">
                📏 {filters.size}
              </span>
            )}
            {filters.priceRange && (
              <span className="px-3 py-1 bg-orange-400/20 text-orange-300 text-xs rounded-full border border-orange-400/30">
                💰 {priceRanges.find(r => r.value === filters.priceRange)?.label}
              </span>
            )}
            {filters.sort !== 'newest' && (
              <span className="px-3 py-1 bg-cyan-400/20 text-cyan-300 text-xs rounded-full border border-cyan-400/30">
                🔄 {filters.sort.replace('-', ' ')}
              </span>
            )}
          </div>
        </motion.div>
      )}

      {/* Clear filters button */}
      {hasActiveFilters && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClear}
          className="w-full py-3 bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-300 rounded-xl hover:from-red-500/30 hover:to-pink-500/30 transition-all duration-200 border border-red-400/20 hover:border-red-400/40 font-semibold"
        >
          🗑️ Clear All Filters
        </motion.button>
      )}
    </div>
  );
};

export default ProductFilter;