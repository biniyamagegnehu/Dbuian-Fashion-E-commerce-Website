import { useState } from 'react';
import { Users as UsersIcon, UserPlus, Shield, Mail, Search, Filter } from 'lucide-react';

const UsersManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const StatCard = ({ title, value, description, color, icon: Icon }) => (
    <div className="glass-card p-6 hover:transform hover:scale-105 transition-all duration-300 cursor-pointer group">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm font-medium mb-2">{title}</p>
          <p className="text-3xl font-bold text-white mb-1">{value}</p>
          <p className="text-gray-400 text-sm">{description}</p>
        </div>
        <div className={`w-14 h-14 ${color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );

  const QuickAction = ({ icon, title, description, color }) => (
    <div className="glass-card p-6 text-left hover:transform hover:scale-105 transition-all duration-300 group cursor-pointer">
      <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
        {icon}
      </div>
      <h4 className="font-semibold text-white mb-2 text-lg">{title}</h4>
      <p className="text-gray-400">{description}</p>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Users Management
          </h1>
          <p className="text-gray-400 mt-2">Manage user accounts and permissions</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button className="btn-primary flex items-center space-x-2">
            <UserPlus className="w-4 h-4" />
            <span>Add New User</span>
          </button>
        </div>
      </div>

      {/* User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value="1,247"
          description="All registered users"
          color="bg-blue-500/20 border border-blue-500/30"
          icon={UsersIcon}
        />
        <StatCard
          title="Active Today"
          value="89"
          description="Users active in last 24h"
          color="bg-green-500/20 border border-green-500/30"
          icon={UserPlus}
        />
        <StatCard
          title="Admins"
          value="3"
          description="Administrative users"
          color="bg-purple-500/20 border border-purple-500/30"
          icon={Shield}
        />
        <StatCard
          title="New This Month"
          value="127"
          description="Recent registrations"
          color="bg-cyan-500/20 border border-cyan-500/30"
          icon={Mail}
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <QuickAction
          icon={<UserPlus className="w-6 h-6 text-green-400" />}
          title="Add User"
          description="Create new user accounts manually"
          color="bg-green-500/20 border border-green-500/30"
        />
        <QuickAction
          icon={<Shield className="w-6 h-6 text-blue-400" />}
          title="Permissions"
          description="Manage user roles and access levels"
          color="bg-blue-500/20 border border-blue-500/30"
        />
        <QuickAction
          icon={<Mail className="w-6 h-6 text-purple-400" />}
          title="Bulk Actions"
          description="Send emails or update multiple users"
          color="bg-purple-500/20 border border-purple-500/30"
        />
      </div>

      {/* Search and Filters */}
      <div className="glass-card p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-4 sm:space-y-0">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search users by name, email, or student ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 text-white placeholder-gray-400"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 text-white"
          >
            <option value="all">All Roles</option>
            <option value="customer">Customers</option>
            <option value="admin">Admins</option>
          </select>
          <button className="btn-secondary flex items-center space-x-2">
            <Filter className="w-4 h-4" />
            <span>More Filters</span>
          </button>
        </div>
      </div>

      {/* Users Content */}
      <div className="glass-card p-8">
        <div className="text-center py-12">
          <UsersIcon className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">User Management System</h3>
          <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
            Our advanced user management system is coming soon. You'll be able to manage user profiles, 
            track activity, set permissions, and analyze user behavior patterns.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="glass-card p-4 text-center">
              <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                <UsersIcon className="w-5 h-5 text-cyan-400" />
              </div>
              <p className="text-white text-sm font-medium">Profile Management</p>
            </div>
            <div className="glass-card p-4 text-center">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Shield className="w-5 h-5 text-green-400" />
              </div>
              <p className="text-white text-sm font-medium">Role Control</p>
            </div>
            <div className="glass-card p-4 text-center">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Mail className="w-5 h-5 text-blue-400" />
              </div>
              <p className="text-white text-sm font-medium">Communication</p>
            </div>
            <div className="glass-card p-4 text-center">
              <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Filter className="w-5 h-5 text-purple-400" />
              </div>
              <p className="text-white text-sm font-medium">Advanced Filters</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersManagement;