import { createContext, useState, useEffect } from 'react';
import { register as apiRegister, login as apiLogin, logout as apiLogout, getCurrentUser } from '../utils/api';

// Create auth context
export const AuthContext = createContext();

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user on initial app load
  useEffect(() => {
    const loadUser = async () => {
      setIsLoading(true);
      
      try {
        if (token) {
          const userData = await getCurrentUser();
          setUser(userData.data);
          setIsAuthenticated(true);
        }
      } catch (err) {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
        setError('Authentication failed. Please log in again.');
      }
      
      setIsLoading(false);
    };

    loadUser();
  }, [token]);

  // Register user
  const register = async (userData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiRegister(userData);
      
      localStorage.setItem('token', response.token);
      setToken(response.token);
      setUser(response.data);
      setIsAuthenticated(true);
      setIsLoading(false);
      
      return response.data;
    } catch (err) {
      setIsLoading(false);
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
      throw err;
    }
  };

  // Login user
  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiLogin(email, password);
      
      localStorage.setItem('token', response.token);
      setToken(response.token);
      setUser(response.data);
      setIsAuthenticated(true);
      setIsLoading(false);
      
      return response.data;
    } catch (err) {
      setIsLoading(false);
      setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
      throw err;
    }
  };

  // Logout user
  const logout = async () => {
    setIsLoading(true);
    
    try {
      await apiLogout();
      
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Logout failed. Please try again.');
    }
    
    setIsLoading(false);
  };

  // Clear any errors
  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isLoading,
        error,
        register,
        login,
        logout,
        clearError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}; 