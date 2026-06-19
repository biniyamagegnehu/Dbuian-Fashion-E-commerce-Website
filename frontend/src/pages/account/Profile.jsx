import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authAPI } from '../../services/api';
import ProfileForm from '../../components/account/ProfileForm';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (formData) => {
    setIsLoading(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const response = await authAPI.updateProfile(formData);
      if (response.data.success) {
        updateUser(response.data.user);
        setSuccessMsg('Profile updated successfully!');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Profile Details</h2>
      <div className="max-w-xl">
        <ProfileForm 
          user={user} 
          onSubmit={handleSubmit} 
          isLoading={isLoading} 
          successMsg={successMsg} 
          errorMsg={errorMsg}
        />
      </div>
    </div>
  );
};

export default Profile;
