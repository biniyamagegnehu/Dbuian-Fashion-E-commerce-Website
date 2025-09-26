import React, { createContext, useContext, useReducer } from 'react';

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      };
    default:
      return state;
  }
};

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: false
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const login = async (email, password) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    // Simulate API call - Only customer login now
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Mock authentication - All users are customers
        if ((email === 'student@dbuian.com' && password === 'student123') || 
            (email === 'customer@dbuian.com' && password === 'customer123')) {
          const user = { 
            id: '2', 
            name: 'Customer User', 
            email: email,
            role: 'customer', // All users are customers now
            university: 'Dbuian University'
          };
          dispatch({ type: 'LOGIN', payload: user });
          localStorage.setItem('user', JSON.stringify(user));
          resolve(user);
        } else {
          reject(new Error('Invalid credentials'));
        }
        dispatch({ type: 'SET_LOADING', payload: false });
      }, 1000);
    });
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
    localStorage.removeItem('user');
  };

  const register = async (userData) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    // Simulate API call - All new registrations are customers
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = { 
          id: Date.now().toString(), 
          ...userData,
          role: 'customer' // Always customer role
        };
        dispatch({ type: 'LOGIN', payload: user });
        localStorage.setItem('user', JSON.stringify(user));
        dispatch({ type: 'SET_LOADING', payload: false });
        resolve(user);
      }, 1000);
    });
  };

  // Check if user is logged in on app load
  React.useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      dispatch({ type: 'LOGIN', payload: user });
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        isLoading: state.isLoading,
        login,
        logout,
        register
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