import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../admin/UI/LoadingSpinner';

/**
 * PrivateRoute — wraps pages that require the user to be logged in.
 * Unauthenticated users are redirected to /login.
 * The intended destination is preserved via location state so the user
 * can be sent back after they log in.
 */
const PrivateRoute = ({ children }) => {
  const { isLoading, isInitialized, isAuthenticated } = useAuth();
  const location = useLocation();

  if (isLoading || !isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <LoadingSpinner size="lg" text="Loading..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default PrivateRoute;
