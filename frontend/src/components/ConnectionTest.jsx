// src/components/Debug/ConnectionTest.jsx
import { useEffect, useState } from 'react';
import { testConnection, healthCheck } from '../services/api';

const ConnectionTest = () => {
  const [status, setStatus] = useState('testing');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const test = async () => {
      try {
        setStatus('testing');
        setMessage('Testing backend connection...');
        
        const result = await testConnection();
        
        setStatus('success');
        setMessage(`✅ Backend is running: ${result.message}`);
        
        console.log('Backend details:', {
          url: process.env.REACT_APP_API_URL,
          status: result.status,
          timestamp: result.timestamp
        });
      } catch (error) {
        setStatus('error');
        setMessage(`❌ Backend connection failed: ${error.message}`);
        
        console.error('Connection failed:', {
          error: error.message,
          backendURL: process.env.REACT_APP_API_URL,
          fullError: error
        });
      }
    };

    test();
  }, []);

  return (
    <div className={`p-4 rounded-lg mb-4 ${
      status === 'success' ? 'bg-green-500/20 border border-green-500/30' :
      status === 'error' ? 'bg-red-500/20 border border-red-500/30' :
      'bg-yellow-500/20 border border-yellow-500/30'
    }`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold">Backend Connection</h3>
          <p className="text-sm opacity-80">{message}</p>
        </div>
        <div className={`w-3 h-3 rounded-full ${
          status === 'success' ? 'bg-green-500' :
          status === 'error' ? 'bg-red-500' :
          'bg-yellow-500 animate-pulse'
        }`} />
      </div>
      {process.env.REACT_APP_API_URL && (
        <p className="text-xs mt-2 opacity-60">
          Backend URL: {process.env.REACT_APP_API_URL}
        </p>
      )}
    </div>
  );
};

export default ConnectionTest;