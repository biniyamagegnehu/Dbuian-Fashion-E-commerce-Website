import { useState, useEffect } from 'react';
import { Plus, Search, Filter, Package, Edit, Trash2, Eye, X, Upload, Save, Image } from 'lucide-react';
import { productsAPI, uploadAPI } from '../services/api';
import { getImageUrl } from '../services/api';


const Products = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedGender, setSelectedGender] = useState('all');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    gender: '',
    size: [],
    stock: '',
    description: '',
    material: 'Cotton',
    care: 'Machine wash cold',
    featured: false,
    trending: false,
    colors: [],
    images: []
  });

  const categories = [
    'T-Shirts',
    'Hoodies & Sweatshirts',
    'Jackets & Coats',
    'Pants & Trousers',
    'Jeans',
    'Dresses',
    'Skirts',
    'Footwear'
  ];

  const genders = ['Men', 'Women', 'Unisex'];
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45'];
  const colors = ['Black', 'White', 'Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Pink', 'Gray', 'Brown', 'Orange', 'Navy'];

  // Color mapping for categories and genders
  const categoryColors = {
    'T-Shirts': 'from-blue-500 to-cyan-400',
    'Hoodies & Sweatshirts': 'from-purple-500 to-pink-400',
    'Jackets & Coats': 'from-orange-500 to-red-400',
    'Pants & Trousers': 'from-green-500 to-emerald-400',
    'Jeans': 'from-indigo-500 to-blue-400',
    'Dresses': 'from-pink-500 to-rose-400',
    'Skirts': 'from-yellow-500 to-orange-400',
    'Footwear': 'from-gray-500 to-blue-400'
  };

  const genderColors = {
    'Men': 'from-blue-500 to-cyan-400',
    'Women': 'from-pink-500 to-purple-400',
    'Unisex': 'from-green-500 to-teal-400'
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, selectedCategory, selectedGender, priceRange]);

  const fetchProducts = async () => {
    try {
      const response = await productsAPI.getAll();
      setProducts(response.data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const filterProducts = () => {
    let filtered = products;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product =>
        product.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Gender filter
    if (selectedGender !== 'all') {
      filtered = filtered.filter(product =>
        product.gender.toLowerCase() === selectedGender.toLowerCase()
      );
    }

    // Price range filter
    if (priceRange.min) {
      filtered = filtered.filter(product => product.price >= Number(priceRange.min));
    }
    if (priceRange.max) {
      filtered = filtered.filter(product => product.price <= Number(priceRange.max));
    }

    setFilteredProducts(filtered);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSizeChange = (size) => {
    setFormData(prev => ({
      ...prev,
      size: prev.size.includes(size)
        ? prev.size.filter(s => s !== size)
        : [...prev.size, size]
    }));
  };

  const handleColorChange = (color) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.includes(color)
        ? prev.colors.filter(c => c !== color)
        : [...prev.colors, color]
    }));
  };

  // Working image upload function
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);

    try {
      // Simple single file upload
      const formData = new FormData();
      formData.append('image', files[0]);
      
      console.log('Uploading image:', files[0].name);
      
      const response = await uploadAPI.uploadImage(formData);
      console.log('Upload response:', response.data);
      
      if (response.data.success) {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, response.data.data.image]
        }));
        console.log('Image added successfully');
      } else {
        throw new Error(response.data.message || 'Upload failed');
      }

      // Clear the file input
      e.target.value = '';

    } catch (error) {
      console.error('Upload error:', error);
      alert(`Upload failed: ${error.response?.data?.message || error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      category: '',
      gender: '',
      size: [],
      stock: '',
      description: '',
      material: 'Cotton',
      care: 'Machine wash cold',
      featured: false,
      trending: false,
      colors: [],
      images: []
    });
    setEditingProduct(null);
  };

  // Edit product functionality
  const openEditModal = (product) => {
    setFormData({
      name: product.name,
      price: product.price,
      category: product.category,
      gender: product.gender,
      size: product.size || [],
      stock: product.stock,
      description: product.description,
      material: product.material || 'Cotton',
      care: product.care || 'Machine wash cold',
      featured: product.featured || false,
      trending: product.trending || false,
      colors: product.colors || [],
      images: product.images || []
    });
    setEditingProduct(product);
    setShowAddProduct(true);
  };

  // Delete product functionality
  const handleDelete = async (productId) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      await productsAPI.delete(productId);
      await fetchProducts();
      alert('Product deleted successfully!');
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (formData.size.length === 0) {
      alert('Please select at least one size');
      return;
    }

    setLoading(true);

    try {
      const productData = {
        name: formData.name,
        price: Number(formData.price),
        category: formData.category,
        gender: formData.gender,
        size: formData.size,
        stock: Number(formData.stock),
        description: formData.description,
        material: formData.material,
        care: formData.care,
        featured: formData.featured,
        trending: formData.trending,
        colors: formData.colors,
        images: formData.images
      };

      console.log('Submitting product data:', productData);

      if (editingProduct) {
        // Update existing product
        await productsAPI.update(editingProduct._id, productData);
      } else {
        // Create new product
        await productsAPI.create(productData);
      }

      // Reset form
      resetForm();
      setShowAddProduct(false);
      await fetchProducts();
      
      alert(`Product ${editingProduct ? 'updated' : 'added'} successfully!`);
    } catch (error) {
      console.error('Error saving product:', error);
      console.error('Error details:', error.response);
      
      let errorMessage = `Failed to ${editingProduct ? 'update' : 'add'} product. Please try again.`;
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

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

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedGender('all');
    setPriceRange({ min: '', max: '' });
  };

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
          <button 
            onClick={() => { setShowAddProduct(true); resetForm(); }}
            className="btn-primary flex items-center space-x-2"
          >
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
          onClick={() => { setShowAddProduct(true); resetForm(); }}
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
        <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 space-y-4 lg:space-y-0">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search products by name, description, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 text-white placeholder-gray-400"
            />
          </div>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className={`px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 text-white transition-all duration-200 ${
              selectedCategory !== 'all' 
                ? 'bg-gradient-to-r ' + (categoryColors[selectedCategory] || 'from-cyan-500 to-blue-500') + ' border-transparent'
                : 'focus:ring-cyan-400'
            }`}
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <select
            value={selectedGender}
            onChange={(e) => setSelectedGender(e.target.value)}
            className={`px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 text-white transition-all duration-200 ${
              selectedGender !== 'all' 
                ? 'bg-gradient-to-r ' + (genderColors[selectedGender] || 'from-cyan-500 to-blue-500') + ' border-transparent'
                : 'focus:ring-cyan-400'
            }`}
          >
            <option value="all">All Genders</option>
            {genders.map(gender => (
              <option key={gender} value={gender}>
                {gender}
              </option>
            ))}
          </select>

          <div className="flex space-x-2">
            <input
              type="number"
              placeholder="Min Price"
              value={priceRange.min}
              onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
              className="w-24 px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 text-white"
            />
            <input
              type="number"
              placeholder="Max Price"
              value={priceRange.max}
              onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
              className="w-24 px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 text-white"
            />
          </div>

          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-white/5 border border-white/10 text-gray-300 rounded-lg hover:bg-white/10 transition-colors"
          >
            Clear
          </button>
        </div>

        {/* Active Filters Display */}
        <div className="flex flex-wrap gap-2 mt-4">
          {selectedCategory !== 'all' && (
            <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-sm">
              Category: {selectedCategory}
            </span>
          )}
          {selectedGender !== 'all' && (
            <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
              Gender: {selectedGender}
            </span>
          )}
          {priceRange.min && (
            <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
              Min: ETB {priceRange.min}
            </span>
          )}
          {priceRange.max && (
            <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm">
              Max: ETB {priceRange.max}
            </span>
          )}
          {searchTerm && (
            <span className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-sm">
              Search: "{searchTerm}"
            </span>
          )}
        </div>
      </div>

      {/* Products List with Edit/Delete */}
      <div className="glass-card p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-white">
            Products ({filteredProducts.length} of {products.length})
          </h3>
        </div>
        
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map(product => (
              <div key={product._id} className="glass-card p-4 hover:transform hover:scale-105 transition-all duration-300 group">
                <div className="relative">
                  <div className="w-full h-48 bg-white/5 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
{product.images && product.images.length > 0 ? (
  <img 
    src={getImageUrl(product.images[0].url)} 
    alt={product.name}
    className="w-full h-full object-cover rounded-lg group-hover:scale-110 transition-transform duration-300"
  />
) : (
  <Package className="w-12 h-12 text-gray-500" />
)}

                  </div>
                  
                  {/* Edit and Delete Buttons */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-1">
                    <button
                      onClick={() => openEditModal(product)}
                      className="p-2 bg-blue-500/80 text-white rounded-lg hover:bg-blue-600 transition-colors"
                      title="Edit Product"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="p-2 bg-red-500/80 text-white rounded-lg hover:bg-red-600 transition-colors"
                      title="Delete Product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h4 className="font-semibold text-white mb-2">{product.name}</h4>
                <p className="text-cyan-400 font-bold mb-2">ETB {product.price}</p>
                <div className="flex justify-between items-center text-sm text-gray-400">
                  <span>Stock: {product.stock}</span>
                  <span>{product.category}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Products Found</h3>
            <p className="text-gray-400 mb-6">
              {products.length === 0 
                ? "Get started by adding your first product to the catalog."
                : "No products match your current filters. Try adjusting your search criteria."
              }
            </p>
            <button 
              onClick={() => { setShowAddProduct(true); resetForm(); }}
              className="btn-primary flex items-center space-x-2 mx-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add Your First Product</span>
            </button>
          </div>
        )}
      </div>

      {/* Add/Edit Product Modal */}
      {(showAddProduct || editingProduct) && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="glass-card p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button
                onClick={() => { setShowAddProduct(false); resetForm(); }}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Image Upload Section */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Product Images {formData.images.length > 0 && `(${formData.images.length} uploaded)`}
                </label>
                
                {/* Uploaded Images Preview */}
{formData.images.map((image, index) => (
  <div key={index} className="relative group">
    <img
      src={getImageUrl(image.url)}
      alt={`Product ${index + 1}`}
      className="w-full h-24 object-cover rounded-lg border border-white/10"
    />
        <button
      type="button"
      onClick={() => removeImage(index)}
      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
      title="Remove image"
    >
      <X className="w-3 h-3" />
    </button>
  </div>
))}

                {/* Upload Area */}
                <label className="block">
                  <div className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors duration-200 group ${
                    uploading 
                      ? 'border-cyan-400 bg-cyan-400/10' 
                      : 'border-white/20 hover:border-cyan-400'
                  }`}>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={uploading}
                    />
                    <Upload className={`w-12 h-12 mx-auto mb-3 ${
                      uploading ? 'text-cyan-400 animate-pulse' : 'text-gray-400 group-hover:text-cyan-400'
                    }`} />
                    <div className={uploading ? 'text-cyan-400' : 'text-gray-400 group-hover:text-cyan-400'}>
                      {uploading ? (
                        <p className="font-medium">Uploading images...</p>
                      ) : (
                        <>
                          <p className="font-medium">Click to upload or drag and drop</p>
                          <p className="text-sm mt-1">PNG, JPG, JPEG up to 5MB each</p>
                        </>
                      )}
                    </div>
                  </div>
                </label>
              </div>

              {/* Rest of the form remains exactly the same */}
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 text-white"
                    placeholder="Enter product name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Price (ETB) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 text-white"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-white/5 border rounded-lg focus:outline-none focus:ring-2 text-white transition-all duration-200 ${
                      formData.category 
                        ? 'bg-gradient-to-r ' + (categoryColors[formData.category] || 'from-cyan-500 to-blue-500') + ' border-transparent'
                        : 'border-white/10 focus:ring-cyan-400'
                    }`}
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Gender *
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-white/5 border rounded-lg focus:outline-none focus:ring-2 text-white transition-all duration-200 ${
                      formData.gender 
                        ? 'bg-gradient-to-r ' + (genderColors[formData.gender] || 'from-cyan-500 to-blue-500') + ' border-transparent'
                        : 'border-white/10 focus:ring-cyan-400'
                    }`}
                    required
                  >
                    <option value="">Select Gender</option>
                    {genders.map(gender => (
                      <option key={gender} value={gender}>
                        {gender}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Sizes */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Available Sizes *
                </label>
                <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                  {sizes.map(size => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => handleSizeChange(size)}
                      className={`p-2 rounded-lg border transition-all duration-200 ${
                        formData.size.includes(size)
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-400'
                          : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                {formData.size.length === 0 && (
                  <p className="text-red-400 text-sm mt-2">Please select at least one size</p>
                )}
              </div>

              {/* Colors */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Available Colors
                </label>
                <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                  {colors.map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => handleColorChange(color)}
                      className={`p-2 rounded-lg border transition-all duration-200 ${
                        formData.colors.includes(color)
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-400'
                          : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stock and Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 text-white"
                    placeholder="0"
                    min="0"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Material
                  </label>
                  <input
                    type="text"
                    name="material"
                    value={formData.material}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 text-white"
                    placeholder="Cotton"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 text-white resize-none"
                  placeholder="Enter product description..."
                  required
                />
              </div>

              {/* Care Instructions */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Care Instructions
                </label>
                <input
                  type="text"
                  name="care"
                  value={formData.care}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 text-white"
                  placeholder="Machine wash cold"
                />
              </div>

              {/* Flags */}
              <div className="flex space-x-6">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-cyan-400 bg-white/5 border-white/10 rounded focus:ring-cyan-400"
                  />
                  <span className="text-gray-300">Featured Product</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="trending"
                    checked={formData.trending}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-cyan-400 bg-white/5 border-white/10 rounded focus:ring-cyan-400"
                  />
                  <span className="text-gray-300">Trending Product</span>
                </label>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => { setShowAddProduct(false); resetForm(); }}
                  className="px-6 py-3 bg-white/5 border border-white/10 text-gray-300 rounded-lg hover:bg-white/10 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || formData.size.length === 0}
                  className="bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg shadow-cyan-500/25 flex items-center space-x-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>{editingProduct ? 'Updating...' : 'Adding...'}</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      <span>{editingProduct ? 'Update Product' : 'Add Product'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;