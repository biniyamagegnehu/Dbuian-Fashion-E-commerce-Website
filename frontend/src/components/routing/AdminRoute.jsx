import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../admin/UI/LoadingSpinner'; // Assume this is where the loading spinner is

const AdminRoute = ({ children }) => {
  const { user, isInitialized, isAuthenticated } = useAuth();

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Checking authentication..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (user && user.role !== 'admin') {
    // Authenticated normal user, redirect to unauthorized
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default AdminRoute;
