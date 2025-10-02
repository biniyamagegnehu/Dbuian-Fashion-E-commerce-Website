import { useState, useEffect } from 'react';
import { Users as UsersIcon, UserPlus, Shield, Mail, Search, Filter, Edit, Trash2, Download } from 'lucide-react';
import { usersAPI } from '../services/api';
import LoadingSpinner from '../components/UI/LoadingSpinner';

const UsersManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    customers: 0,
    admins: 0,
    active: 0
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
    calculateStats();
  }, [users, searchTerm, roleFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await usersAPI.getAll();
      setUsers(response.data.users || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.studentId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phoneNumber?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user =>
        user.role?.toLowerCase() === roleFilter.toLowerCase()
      );
    }

    setFilteredUsers(filtered);
  };

  const calculateStats = () => {
    const stats = {
      total: users.length,
      customers: users.filter(user => user.role === 'customer').length,
      admins: users.filter(user => user.role === 'admin').length,
      active: users.filter(user => user.isActive !== false).length
    };
    setStats(stats);
  };

  const updateUserRole = async (userId, newRole) => {
    try {
      await usersAPI.update(userId, { role: newRole });
      await fetchUsers(); // Refresh users
    } catch (error) {
      console.error('Error updating user role:', error);
      alert('Failed to update user role');
    }
  };

  const deleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      await usersAPI.delete(userId);
      await fetchUsers(); // Refresh users
      alert('User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user');
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'customer': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusColor = (isActive) => {
    return isActive !== false 
      ? 'bg-green-500/20 text-green-400 border-green-500/30'
      : 'bg-red-500/20 text-red-400 border-red-500/30';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

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

  const QuickAction = ({ icon, title, description, color, onClick }) => (
    <div 
      onClick={onClick}
      className="glass-card p-6 text-left hover:transform hover:scale-105 transition-all duration-300 group cursor-pointer"
    >
      <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
        {icon}
      </div>
      <h4 className="font-semibold text-white mb-2 text-lg">{title}</h4>
      <p className="text-gray-400">{description}</p>
    </div>
  );

  const exportUsers = () => {
    // Simple CSV export functionality
    const headers = ['Name', 'Email', 'Student ID', 'Phone', 'Role', 'Status', 'Joined Date'];
    const csvData = filteredUsers.map(user => [
      user.name || 'N/A',
      user.email || 'N/A',
      user.studentId || 'N/A',
      user.phoneNumber || 'N/A',
      user.role || 'customer',
      user.isActive !== false ? 'Active' : 'Inactive',
      formatDate(user.createdAt || user.joinedDate)
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const addNewUser = () => {
    // Placeholder for add user functionality
    alert('Add user functionality will be implemented here');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" text="Loading users..." />
      </div>
    );
  }

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
          <button 
            onClick={exportUsers}
            className="btn-primary flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Export Users</span>
          </button>
        </div>
      </div>

      {/* User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats.total}
          description="All registered users"
          color="bg-blue-500/20 border border-blue-500/30"
          icon={UsersIcon}
        />
        <StatCard
          title="Active Users"
          value={stats.active}
          description="Currently active accounts"
          color="bg-green-500/20 border border-green-500/30"
          icon={UserPlus}
        />
        <StatCard
          title="Admins"
          value={stats.admins}
          description="Administrative users"
          color="bg-purple-500/20 border border-purple-500/30"
          icon={Shield}
        />
        <StatCard
          title="Customers"
          value={stats.customers}
          description="Regular customers"
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
          onClick={addNewUser}
        />
        <QuickAction
          icon={<Shield className="w-6 h-6 text-blue-400" />}
          title="Permissions"
          description="Manage user roles and access levels"
          color="bg-blue-500/20 border border-blue-500/30"
          onClick={() => alert('Permissions management coming soon')}
        />
        <QuickAction
          icon={<Mail className="w-6 h-6 text-purple-400" />}
          title="Bulk Actions"
          description="Send emails or update multiple users"
          color="bg-purple-500/20 border border-purple-500/30"
          onClick={() => alert('Bulk actions coming soon')}
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
          <button 
            onClick={() => { setSearchTerm(''); setRoleFilter('all'); }}
            className="btn-secondary flex items-center space-x-2"
          >
            <Filter className="w-4 h-4" />
            <span>Clear Filters</span>
          </button>
        </div>

        {/* Active Filters Display */}
        <div className="flex flex-wrap gap-2 mt-4">
          {roleFilter !== 'all' && (
            <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-sm">
              Role: {roleFilter}
            </span>
          )}
          {searchTerm && (
            <span className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-sm">
              Search: "{searchTerm}"
            </span>
          )}
          <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
            Showing {filteredUsers.length} of {users.length} users
          </span>
        </div>
      </div>

      {/* Users Table */}
      <div className="glass-card p-6">
        <div className="overflow-x-auto">
          {filteredUsers.length > 0 ? (
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-4 px-4 text-gray-400 font-medium">User</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-medium">Contact</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-medium">Student ID</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-medium">Role</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-medium">Status</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-medium">Joined</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">
                            {user.name?.charAt(0)?.toUpperCase() || 'U'}
                          </span>
                        </div>
                        <div>
                          <div className="text-white font-medium">{user.name || 'N/A'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-white">{user.email || 'N/A'}</div>
                      <div className="text-gray-400 text-sm">{user.phoneNumber || 'No phone'}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-white font-mono">{user.studentId || 'N/A'}</div>
                    </td>
                    <td className="py-4 px-4">
                      <select
                        value={user.role || 'customer'}
                        onChange={(e) => updateUserRole(user._id, e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
                      >
                        <option value="customer">Customer</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="py-4 px-4">
                      <div className={`inline-flex items-center px-3 py-1 rounded-full border ${getStatusColor(user.isActive)}`}>
                        <span className="text-sm font-medium">
                          {user.isActive !== false ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-gray-400 text-sm">
                        {formatDate(user.createdAt || user.joinedDate)}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => alert(`Edit user: ${user.name}`)}
                          className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                          title="Edit User"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteUser(user._id)}
                          className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                          title="Delete User"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-12">
              <UsersIcon className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Users Found</h3>
              <p className="text-gray-400 mb-6">
                {users.length === 0 
                  ? "No users have registered yet."
                  : "No users match your current filters. Try adjusting your search criteria."
                }
              </p>
              <button 
                onClick={addNewUser}
                className="btn-primary flex items-center space-x-2 mx-auto"
              >
                <UserPlus className="w-4 h-4" />
                <span>Add First User</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UsersManagement;