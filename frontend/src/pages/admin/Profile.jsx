import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { authAPI } from '../../../services/api';
import ProfileForm from '../../../components/account/ProfileForm';

const AdminProfile = () => {
  const { user, updateUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (formData) => {
    setIsLoading(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      // Reusing the same endpoint, since admin is just a user role
      const response = await authAPI.updateProfile(formData);
      if (response.data.success) {
        updateUser(response.data.user);
        setSuccessMsg('Admin profile updated successfully!');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Admin Profile</h1>
        <p className="text-gray-400">Manage your administrative account details.</p>
      </div>

      <div className="bg-[#1a1f2e]/95 border border-white/10 rounded-2xl p-6 max-w-2xl">
        <ProfileForm 
          user={user} 
          onSubmit={handleSubmit} 
          isLoading={isLoading} 
          successMsg={successMsg} 
          errorMsg={errorMsg}
          isAdminView={true}
        />
      </div>
    </div>
  );
};

export default AdminProfile;
