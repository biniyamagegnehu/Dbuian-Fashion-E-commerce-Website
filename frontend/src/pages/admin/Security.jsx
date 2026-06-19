import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authAPI } from '../../services/api';
import PasswordForm from '../../components/account/PasswordForm';

const AdminSecurity = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const isGoogleLinkedOnly = !user?.password && user?.authProvider === 'google';

  const handleSubmit = async (passwordData) => {
    setIsLoading(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const response = await authAPI.updatePassword(passwordData);
      if (response.data.success) {
        setSuccessMsg('Admin password updated successfully!');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.error || 'Failed to update password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Security Settings</h1>
        <p className="text-gray-400">Update your administrative password.</p>
      </div>

      <div className="bg-[#1a1f2e]/95 border border-white/10 rounded-2xl p-6 max-w-2xl">
        <PasswordForm 
          onSubmit={handleSubmit} 
          isLoading={isLoading} 
          successMsg={successMsg} 
          errorMsg={errorMsg}
          isGoogleLinkedOnly={isGoogleLinkedOnly}
        />
      </div>
    </div>
  );
};

export default AdminSecurity;
