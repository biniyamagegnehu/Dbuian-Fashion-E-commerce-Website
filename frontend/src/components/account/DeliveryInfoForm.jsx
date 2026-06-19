import React, { useState, useEffect } from 'react';
import AnimatedButton from '../ui/AnimatedButton';

const DeliveryInfoForm = ({ initialData, onSubmit, isLoading, successMsg, errorMsg }) => {
  const [formData, setFormData] = useState({
    phoneNumber: '',
    blockNumber: '',
    roomDormNumber: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        phoneNumber: initialData.phoneNumber || '',
        blockNumber: initialData.blockNumber || '',
        roomDormNumber: initialData.roomDormNumber || ''
      });
    }
  }, [initialData]);

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
        <label className="block text-sm font-medium text-gray-400 mb-1">Phone Number *</label>
        <input
          type="tel"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          required
          placeholder="+251 9XX XXX XXX"
          className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 text-white transition-all"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Block Number *</label>
          <input
            type="text"
            name="blockNumber"
            value={formData.blockNumber}
            onChange={handleChange}
            required
            placeholder="e.g., Block 5"
            className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 text-white transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Room/Dorm Number *</label>
          <input
            type="text"
            name="roomDormNumber"
            value={formData.roomDormNumber}
            onChange={handleChange}
            required
            placeholder="e.g., Room 101"
            className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 text-white transition-all"
          />
        </div>
      </div>

      <div className="pt-4">
        <AnimatedButton
          type="submit"
          disabled={isLoading}
          className="w-full sm:w-auto px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 rounded-lg"
        >
          {isLoading ? 'Saving...' : 'Save Delivery Info'}
        </AnimatedButton>
      </div>
    </form>
  );
};

export default DeliveryInfoForm;
