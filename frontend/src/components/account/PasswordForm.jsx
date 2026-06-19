import React, { useState } from 'react';
import AnimatedButton from '../ui/AnimatedButton';

const PasswordForm = ({ onSubmit, isLoading, successMsg, errorMsg, isGoogleLinkedOnly }) => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [localError, setLocalError] = useState('');

  if (isGoogleLinkedOnly) {
    return (
      <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
        <div className="flex items-start">
          <span className="text-2xl mr-3">🔗</span>
          <div>
            <h3 className="text-white font-medium mb-1">Google Linked Account</h3>
            <p className="text-sm text-gray-400">
              You log in using your Google account. You don't have a local password to change. 
              If you wish to secure your account, please manage your security settings through Google.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setLocalError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      setLocalError('New passwords do not match');
      return;
    }
    if (formData.newPassword.length < 6) {
      setLocalError('Password must be at least 6 characters');
      return;
    }
    onSubmit({
      currentPassword: formData.currentPassword,
      newPassword: formData.newPassword
    });
    setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {successMsg && (
        <div className="p-3 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400 text-sm">
          {successMsg}
        </div>
      )}
      {(errorMsg || localError) && (
        <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
          {localError || errorMsg}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-400 mb-1">Current Password</label>
        <input
          type="password"
          name="currentPassword"
          value={formData.currentPassword}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 text-white transition-all"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-400 mb-1">New Password</label>
        <input
          type="password"
          name="newPassword"
          value={formData.newPassword}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 text-white transition-all"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-400 mb-1">Confirm New Password</label>
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 text-white transition-all"
        />
      </div>

      <div className="pt-4">
        <AnimatedButton
          type="submit"
          disabled={isLoading}
          className="w-full sm:w-auto px-6 py-2 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 rounded-lg"
        >
          {isLoading ? 'Updating...' : 'Update Password'}
        </AnimatedButton>
      </div>
    </form>
  );
};

export default PasswordForm;
