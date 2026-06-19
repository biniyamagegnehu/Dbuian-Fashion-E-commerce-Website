import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authAPI } from '../../services/api';
import PasswordForm from '../../components/account/PasswordForm';

const Security = () => {
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
        setSuccessMsg('Password updated successfully!');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.error || 'Failed to update password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Security Settings</h2>
      <div className="max-w-xl">
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

export default Security;
