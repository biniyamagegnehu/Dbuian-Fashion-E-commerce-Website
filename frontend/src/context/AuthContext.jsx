// src/context/AuthContext.jsx
import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'AUTH_START':
      return { ...state, isLoading: true, error: null };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        isInitialized: true
      };
    case 'AUTH_FAILURE':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
        isInitialized: true
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        isInitialized: true
      };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'SET_INITIALIZED':
      return { ...state, isInitialized: true, isLoading: false };
    default:
      return state;
  }
};

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true, // Start loading as we check auth on mount
  isInitialized: false,
  error: null
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Centralized auth success handler
  const handleAuthSuccess = useCallback((user, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    dispatch({
      type: 'AUTH_SUCCESS',
      payload: { user, token }
    });
  }, []);

  // Check if user is logged in on app load
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        dispatch({ type: 'SET_INITIALIZED' });
        return;
      }

      try {
        // Verify token with backend to get latest user details
        const response = await authAPI.getMe();
        if (response.data.success && response.data.user) {
          handleAuthSuccess(response.data.user, token);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (error) {
        console.error('Auth initialization failed:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        dispatch({ type: 'AUTH_FAILURE', payload: null });
      }
    };

    initAuth();
  }, [handleAuthSuccess]);

  const login = async (email, password) => {
    dispatch({ type: 'AUTH_START' });
    
    try {
      const response = await authAPI.login({ email, password });
      const { user, token, message } = response.data;

      handleAuthSuccess(user, token);
      return { user, message };
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Login failed';
      dispatch({
        type: 'AUTH_FAILURE',
        payload: errorMessage
      });
      throw new Error(errorMessage);
    }
  };

  const register = async (userData) => {
    dispatch({ type: 'AUTH_START' });
    
    try {
      const response = await authAPI.register(userData);
      const { user, token, message } = response.data;

      handleAuthSuccess(user, token);
      return { user, message };
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Registration failed';
      dispatch({
        type: 'AUTH_FAILURE',
        payload: errorMessage
      });
      throw new Error(errorMessage);
    }
  };

  const googleLogin = async (credential) => {
    dispatch({ type: 'AUTH_START' });
    
    try {
      const response = await authAPI.googleAuth(credential);
      const { user, token, message } = response.data;

      handleAuthSuccess(user, token);
      return { user, message };
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Google login failed';
      dispatch({
        type: 'AUTH_FAILURE',
        payload: errorMessage
      });
      throw new Error(errorMessage);
    }
  };

  const logout = (navigate) => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    dispatch({ type: 'LOGOUT' });
    if (navigate) {
      navigate('/login');
    }
  };

  const updateUser = (updatedUser) => {
    localStorage.setItem('user', JSON.stringify(updatedUser));
    dispatch({
      type: 'AUTH_SUCCESS',
      payload: { user: updatedUser, token: state.token }
    });
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        googleLogin,
        register,
        logout,
        updateUser,
        clearError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};