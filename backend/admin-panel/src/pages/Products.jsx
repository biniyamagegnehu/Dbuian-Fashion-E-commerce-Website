import { useState } from 'react';
import { Plus, Search, Filter, Package, Edit, Trash2, Eye } from 'lucide-react';

const Products = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    'All Categories',
    'T-Shirts',
    'Hoodies & Sweatshirts',
    'Jackets & Coats',
    'Pants & Trousers',
    'Jeans',
    'Dresses',
    'Skirts',
    'Footwear'
  ];

  const QuickAction = ({ icon, title, description, onClick, color }) => (
    <button 
      onClick={onClick}
      className="glass-card p-6 text-left hover:transform hover:scale-105 transition-all duration-300 group cursor-pointer w-full"
    >
      <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
        {icon}
      </div>
      <h4 className="font-semibold text-white mb-2 text-lg">{title}</h4>
      <p className="text-gray-400">{description}</p>
    </button>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Products Management
          </h1>
          <p className="text-gray-400 mt-2">Manage your product catalog and inventory</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button className="btn-primary flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <QuickAction
          icon={<Plus className="w-6 h-6 text-green-400" />}
          title="Add Product"
          description="Create new product listing with images and details"
          color="bg-green-500/20 border border-green-500/30"
        />
        <QuickAction
          icon={<Package className="w-6 h-6 text-blue-400" />}
          title="Inventory"
          description="Manage stock levels and product availability"
          color="bg-blue-500/20 border border-blue-500/30"
        />
        <QuickAction
          icon={<Filter className="w-6 h-6 text-purple-400" />}
          title="Categories"
          description="Organize products by categories and tags"
          color="bg-purple-500/20 border border-purple-500/30"
        />
      </div>

      {/* Search and Filter */}
      <div className="glass-card p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-4 sm:space-y-0">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search products by name, category, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 text-white placeholder-gray-400"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 text-white"
          >
            {categories.map(category => (
              <option key={category} value={category.toLowerCase()}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Grid */}
      <div className="glass-card p-6">
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Product Management Coming Soon</h3>
          <p className="text-gray-400 mb-6">
            We're working on a comprehensive product management system with advanced features.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-3">
            <button className="btn-primary flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Add Sample Products</span>
            </button>
            <button className="btn-secondary flex items-center space-x-2">
              <Eye className="w-4 h-4" />
              <span>View Demo</span>
            </button>
          </div>
        </div>
      </div>

      {/* Features Preview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card p-4 text-center">
          <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Edit className="w-5 h-5 text-cyan-400" />
          </div>
          <h4 className="font-semibold text-white mb-1">Bulk Editing</h4>
          <p className="text-gray-400 text-sm">Edit multiple products at once</p>
        </div>
        
        <div className="glass-card p-4 text-center">
          <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Package className="w-5 h-5 text-green-400" />
          </div>
          <h4 className="font-semibold text-white mb-1">Inventory Tracking</h4>
          <p className="text-gray-400 text-sm">Real-time stock management</p>
        </div>
        
        <div className="glass-card p-4 text-center">
          <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Eye className="w-5 h-5 text-blue-400" />
          </div>
          <h4 className="font-semibold text-white mb-1">Live Preview</h4>
          <p className="text-gray-400 text-sm">See how products appear to customers</p>
        </div>
        
        <div className="glass-card p-4 text-center">
          <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Filter className="w-5 h-5 text-purple-400" />
          </div>
          <h4 className="font-semibold text-white mb-1">Advanced Filters</h4>
          <p className="text-gray-400 text-sm">Smart filtering and search</p>
        </div>
      </div>
    </div>
  );
};

export default Products;