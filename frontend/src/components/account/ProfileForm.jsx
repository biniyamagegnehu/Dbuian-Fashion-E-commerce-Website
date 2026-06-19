import React, { useState, useEffect } from 'react';
import AnimatedButton from '../ui/AnimatedButton';

const ProfileForm = ({ user, onSubmit, isLoading, successMsg, errorMsg, isAdminView = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {successMsg && (
        <div className="p-3 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400 text-sm">
          {successMsg}
        </div>
      )}
      {errorMsg && (
        <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
          {errorMsg}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 text-white transition-all"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-400 mb-1">Phone Number</label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 text-white transition-all"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-400 mb-1">Email Address</label>
        <input
          type="email"
          value={user?.email || ''}
          readOnly
          className="w-full px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-gray-500 cursor-not-allowed"
        />
        <p className="text-xs text-gray-500 mt-1">Email cannot be changed.</p>
      </div>

      {isAdminView && (
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Role</label>
          <input
            type="text"
            value={user?.role || 'user'}
            readOnly
            className="w-full px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-purple-400 font-semibold cursor-not-allowed uppercase text-xs tracking-wider"
          />
        </div>
      )}

      <div className="pt-4">
        <AnimatedButton
          type="submit"
          disabled={isLoading}
          className="w-full sm:w-auto px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 rounded-lg"
        >
          {isLoading ? 'Saving...' : 'Save Changes'}
        </AnimatedButton>
      </div>
    </form>
  );
};

export default ProfileForm;
