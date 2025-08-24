import React from 'react';

const ProductFilter = ({ filters, onChange, onClear }) => {
  const categories = ['Hoodies', 'T-Shirts', 'Pants', 'Accessories', 'Footwear'];
  const sizes = ['XS', 'S', 'M', 'L', 'XL'];
  const priceRanges = [
    { label: 'Under $25', value: '0-25' },
    { label: '$25 to $50', value: '25-50' },
    { label: '$50 to $100', value: '50-100' },
    { label: 'Over $100', value: '100-0' }
  ];

  const handleChange = (filterType, value) => {
    onChange({ [filterType]: value });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
        <button 
          onClick={onClear}
          className="text-sm text-indigo-600 hover:text-indigo-800"
        >
          Clear all
        </button>
      </div>

      {/* Category filter */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-700 mb-3">Category</h4>
        <div className="space-y-2">
          {categories.map(category => (
            <label key={category} className="flex items-center">
              <input
                type="radio"
                name="category"
                checked={filters.category === category}
                onChange={() => handleChange('category', category)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-gray-600">{category}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price range filter */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-700 mb-3">Price Range</h4>
        <div className="space-y-2">
          {priceRanges.map(range => (
            <label key={range.value} className="flex items-center">
              <input
                type="radio"
                name="priceRange"
                checked={filters.priceRange === range.value}
                onChange={() => handleChange('priceRange', range.value)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-gray-600">{range.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Size filter */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-700 mb-3">Size</h4>
        <div className="flex flex-wrap gap-2">
          {sizes.map(size => (
            <button
              key={size}
              onClick={() => handleChange('size', size)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filters.size === size
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductFilter;