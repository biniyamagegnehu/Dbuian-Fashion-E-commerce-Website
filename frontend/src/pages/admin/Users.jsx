import { useState, useEffect } from 'react';
import { Users as UsersIcon, UserPlus, Shield, Mail, Search, Filter, Edit, Trash2, Download, X, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import { usersAPI } from '../../services/api';
import LoadingSpinner from '../../components/admin/UI/LoadingSpinner';

const UsersManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    customers: 0,
    admins: 0,
    active: 0
  });

  // ─── Add User Modal state ─────────────────────────────────────────────────────
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({ name: '', email: '', password: '', role: 'user', phone: '', studentId: '' });
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState(null);
  const [addSuccess, setAddSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  // ─────────────────────────────────────────────────────────────────────────────

  // ─── Pagination state ────────────────────────────────────────────────────────
  const [page, setPage] = useState(1);
  const LIMIT = 10;
  const [pagination, setPagination] = useState({
    page: 1, limit: LIMIT, total: 0, pages: 0,
    hasNextPage: false, hasPrevPage: false
  });

  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = useState('');
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchTerm), 400);
    return () => clearTimeout(t);
  }, [searchTerm]);

  // Reset to page 1 whenever filters change
  useEffect(() => { setPage(1); }, [debouncedSearch, roleFilter]);

  // Fetch whenever page or filters change
  useEffect(() => {
    fetchUsers();
  }, [page, debouncedSearch, roleFilter]);
  // ─────────────────────────────────────────────────────────────────────────────

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: LIMIT,
        search: debouncedSearch || undefined,
        role: roleFilter !== 'all' ? roleFilter : undefined
      };
      const response = await usersAPI.getAll(params);
      const resData = response.data;
      setUsers(resData.data || resData.users || []);

      if (resData.pagination) {
        setPagination(resData.pagination);
      }
      if (resData.stats) {
        setStats(resData.stats);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId, newRole) => {
    try {
      await usersAPI.update(userId, { role: newRole });
      await fetchUsers();
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
      await fetchUsers();
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
    const headers = ['Name', 'Email', 'Student ID', 'Phone', 'Role', 'Status', 'Joined Date'];
    const csvData = users.map(user => [
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

  // ─── Add User Modal handlers ──────────────────────────────────────────────────
  const addNewUser = () => setShowAddModal(true);

  const closeAddModal = () => {
    setShowAddModal(false);
    setAddForm({ name: '', email: '', password: '', role: 'user', phone: '', studentId: '' });
    setAddError(null);
    setAddSuccess(false);
    setShowPassword(false);
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setAddLoading(true);
    setAddError(null);
    try {
      await usersAPI.create(addForm);
      setAddSuccess(true);
      await fetchUsers();
      setTimeout(closeAddModal, 1500);
    } catch (err) {
      setAddError(err.response?.data?.message || 'Failed to create user');
    } finally {
      setAddLoading(false);
    }
  };
  // ─────────────────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" text="Loading users..." />
      </div>
    );
  }

  return (
    <>
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
              Showing {users.length} of {pagination.total || users.length} users
            </span>
          </div>
        </div>

        {/* Users Table */}
        <div className="glass-card p-6">
          <div className="overflow-x-auto">
            {users.length > 0 ? (
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
                  {users.map((user) => (
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
                  {pagination.total === 0
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

          {/* Pagination Controls */}
          {pagination.pages > 1 && (
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-white/10">
              <span className="text-gray-400 text-sm">
                Page {pagination.page} of {pagination.pages}
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={!pagination.hasPrevPage}
                  className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
                  disabled={!pagination.hasNextPage}
                  className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ─── Add User Modal ─────────────────────────────────────────────────────── */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closeAddModal}
          />

          {/* Modal Card */}
          <div className="relative glass-card w-full max-w-lg p-8 space-y-6 z-10">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">Add New User</h2>
                <p className="text-gray-400 text-sm mt-1">Create a new user account</p>
              </div>
              <button
                onClick={closeAddModal}
                className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Success Message */}
            {addSuccess && (
              <div className="flex items-center space-x-3 p-4 bg-green-500/20 border border-green-500/30 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span className="text-green-300 font-medium">User created successfully!</span>
              </div>
            )}

            {/* Error Message */}
            {addError && (
              <div className="flex items-center space-x-3 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                <span className="text-red-300">{addError}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleAddUser} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={addForm.name}
                  onChange={e => setAddForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                  placeholder="e.g. Biniyam Agegnehu"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Email *</label>
                <input
                  type="email"
                  required
                  value={addForm.email}
                  onChange={e => setAddForm(f => ({ ...f, email: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                  placeholder="user@example.com"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Password *</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={addForm.password}
                    onChange={e => setAddForm(f => ({ ...f, password: e.target.value }))}
                    className="w-full px-4 py-3 pr-12 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                    placeholder="Minimum 6 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Role *</label>
                <select
                  value={addForm.role}
                  onChange={e => setAddForm(f => ({ ...f, role: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {/* Optional fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Phone</label>
                  <input
                    type="text"
                    value={addForm.phone}
                    onChange={e => setAddForm(f => ({ ...f, phone: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    placeholder="Optional"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Student ID</label>
                  <input
                    type="text"
                    value={addForm.studentId}
                    onChange={e => setAddForm(f => ({ ...f, studentId: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    placeholder="Optional"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={closeAddModal}
                  className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-gray-300 hover:bg-white/10 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addLoading || addSuccess}
                  className="flex-1 px-4 py-3 bg-cyan-500 hover:bg-cyan-600 disabled:opacity-60 disabled:cursor-not-allowed rounded-lg text-white font-semibold transition-colors flex items-center justify-center space-x-2"
                >
                  {addLoading ? (
                    <span>Creating...</span>
                  ) : addSuccess ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      <span>Created!</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      <span>Create User</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default UsersManagement;
