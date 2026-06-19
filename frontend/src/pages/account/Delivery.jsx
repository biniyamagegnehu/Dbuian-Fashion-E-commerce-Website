import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authAPI } from '../../services/api';
import DeliveryInfoForm from '../../components/account/DeliveryInfoForm';

const Delivery = () => {
  const { user, updateUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (formData) => {
    setIsLoading(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const response = await authAPI.updateDeliveryInfo(formData);
      if (response.data.success) {
        updateUser(response.data.user);
        setSuccessMsg('Delivery information saved successfully!');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.error || 'Failed to save delivery info');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-2">Saved Delivery Information</h2>
      <p className="text-gray-400 mb-6">This information will be pre-filled during checkout to save you time.</p>
      <div className="max-w-2xl">
        <DeliveryInfoForm 
          initialData={user?.deliveryInfo}
          onSubmit={handleSubmit} 
          isLoading={isLoading} 
          successMsg={successMsg} 
          errorMsg={errorMsg}
        />
      </div>
    </div>
  );
};

export default Delivery;
