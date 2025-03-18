import { createContext, useState, useEffect } from 'react';

// Create auth context
export const AuthContext = createContext();

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load user on initial app load
  useEffect(() => {
    // Simplified authentication check
    if (token) {
      try {
        // Just check if there's a user in localStorage
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error("Error loading user:", err);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
      }
    }
  }, [token]);

  // Register user - simplified mock version
  const register = async (userData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Mock successful registration
      console.log("Registering user:", userData);
      
      // Create mock user and token
      const mockUser = {
        id: 'temp-' + Date.now(),
        name: userData.name,
        email: userData.email
      };
      
      const mockToken = 'mock-token-' + Date.now();
      
      // Store in localStorage
      localStorage.setItem('token', mockToken);
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      // Update state
      setToken(mockToken);
      setUser(mockUser);
      setIsAuthenticated(true);
      
      return mockUser;
    } catch (err) {
      setError('Registration failed');
      throw new Error('Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Login user - simplified mock version
  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log("Logging in user:", email);
      
      // Create mock user and token
      const mockUser = {
        id: 'temp-' + Date.now(),
        name: email.split('@')[0], // Use part of email as name
        email: email
      };
      
      const mockToken = 'mock-token-' + Date.now();
      
      // Store in localStorage
      localStorage.setItem('token', mockToken);
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      // Update state
      setToken(mockToken);
      setUser(mockUser);
      setIsAuthenticated(true);
      
      return mockUser;
    } catch (err) {
      setError('Login failed');
      throw new Error('Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
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