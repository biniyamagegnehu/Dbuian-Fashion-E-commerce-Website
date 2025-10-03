import React, { useEffect, useState } from 'react';
import { healthCheck, testAPI } from '../services/api';

const ConnectionTest = () => {
  const [status, setStatus] = useState('testing');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const testConnection = async () => {
      try {
        setStatus('testing');
        const response = await healthCheck();
        setStatus('connected');
        setMessage('Backend is connected successfully!');
        console.log('Health check:', response.data);
      } catch (error) {
        setStatus('error');
        setMessage(`Connection failed: ${error.message}`);
        console.error('Connection error:', error);
      }
    };

    testConnection();
  }, []);

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className={`p-4 rounded-lg ${
        status === 'connected' ? 'bg-green-500' : 
        status === 'error' ? 'bg-red-500' : 'bg-yellow-500'
      } text-white`}>
        <strong>Backend Status:</strong> {status.toUpperCase()}
        {message && <div className="text-sm mt-1">{message}</div>}
      </div>
    </div>
  );
};

export default ConnectionTest;