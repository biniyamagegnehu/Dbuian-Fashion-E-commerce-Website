import { useState } from 'react';
import { ShoppingCart, Filter, Clock, CheckCircle, Truck, Package, Search } from 'lucide-react';

const Orders = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const statusOptions = [
    { value: 'all', label: 'All Orders', icon: Package, color: 'gray' },
    { value: 'pending', label: 'Pending', icon: Clock, color: 'orange' },
    { value: 'processing', label: 'Processing', icon: Package, color: 'blue' },
    { value: 'shipped', label: 'Shipped', icon: Truck, color: 'purple' },
    { value: 'delivered', label: 'Delivered', icon: CheckCircle, color: 'green' }
  ];

  const StatCard = ({ title, value, color, icon: Icon }) => (
    <div className="glass-card p-6 hover:transform hover:scale-105 transition-all duration-300 cursor-pointer group">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm font-medium mb-2">{title}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
        </div>
        <div className={`w-14 h-14 ${color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Orders Management
          </h1>
          <p className="text-gray-400 mt-2">Manage customer orders and track fulfillment</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button className="btn-primary flex items-center space-x-2">
            <Filter className="w-4 h-4" />
            <span>Export Orders</span>
          </button>
        </div>
      </div>

      {/* Order Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Orders"
          value="1,247"
          color="bg-blue-500/20 border border-blue-500/30"
          icon={ShoppingCart}
        />
        <StatCard
          title="Pending"
          value="23"
          color="bg-orange-500/20 border border-orange-500/30"
          icon={Clock}
        />
        <StatCard
          title="Processing"
          value="15"
          color="bg-purple-500/20 border border-purple-500/30"
          icon={Package}
        />
        <StatCard
          title="Delivered"
          value="1,209"
          color="bg-green-500/20 border border-green-500/30"
          icon={CheckCircle}
        />
      </div>

      {/* Search and Filters */}
      <div className="glass-card p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-6 space-y-4 lg:space-y-0">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders by ID, customer name, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 text-white placeholder-gray-400"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            {statusOptions.map((status) => {
              const Icon = status.icon;
              return (
                <button
                  key={status.value}
                  onClick={() => setStatusFilter(status.value)}
                  className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200 ${
                    statusFilter === status.value
                      ? 'bg-cyan-500/20 border border-cyan-500/30 text-cyan-400'
                      : 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{status.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Orders Content */}
      <div className="glass-card p-8">
        <div className="text-center py-12">
          <ShoppingCart className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Advanced Orders System</h3>
          <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
            Our comprehensive order management system is under development. You'll be able to process orders, 
            update statuses, manage returns, and track shipments all in one place.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="glass-card p-4 text-center">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
              <h4 className="font-semibold text-white mb-2">Order Processing</h4>
              <p className="text-gray-400 text-sm">Streamlined order fulfillment workflow</p>
            </div>
            
            <div className="glass-card p-4 text-center">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Truck className="w-6 h-6 text-blue-400" />
              </div>
              <h4 className="font-semibold text-white mb-2">Shipment Tracking</h4>
              <p className="text-gray-400 text-sm">Real-time delivery status updates</p>
            </div>
            
            <div className="glass-card p-4 text-center">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Filter className="w-6 h-6 text-purple-400" />
              </div>
              <h4 className="font-semibold text-white mb-2">Smart Analytics</h4>
              <p className="text-gray-400 text-sm">Order patterns and customer insights</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;