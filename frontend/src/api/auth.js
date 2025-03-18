import axios from 'axios';

// API URLs - Configure for both development and production
const LOCAL_API_URL = '/api';
const NETLIFY_FUNCTION_URL = '/.netlify/functions/api';

// Use the Netlify Functions URL in production, local API in development
const API_URL = process.env.NODE_ENV === 'production' 
  ? NETLIFY_FUNCTION_URL 
  : LOCAL_API_URL;

// Register user
export const register = async (userData) => {
  try {
    console.log(`Attempting registration at: ${API_URL}/auth/register`, userData);
    
    try {
      const response = await axios.post(`${API_URL}/auth/register`, userData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Registration response:', response.data);
      
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (err) {
      console.error('Registration request failed:', err.message);
      if (err.response) {
        console.error('Server responded with:', err.response.status, err.response.data);
        throw err.response.data.error || 'Unable to register. Please try again.';
      } else if (err.request) {
        // Request was made but no response
        console.error('No response from server');
        throw 'Server is not responding. It may be starting up - please try again in a moment.';
      } else {
        throw 'Unable to register. Please try again.';
      }
    }
  } catch (error) {
    console.error('Registration process error:', error);
    throw error;
  }
};

// Login user
export const login = async (email, password) => {
  try {
    console.log(`Attempting login at: ${API_URL}/auth/login`);
    
    const response = await axios.post(`${API_URL}/auth/login`, {
      email,
      password
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Login response:', response.data);
    
    if (response.data.success) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return response.data;
    }
  } catch (error) {
    console.error('Login error:', error);
    throw error.response?.data?.error || 'Invalid credentials. Please try again.';
  }
};

// Get current user
export const getCurrentUser = async () => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No token found');
    }
    
    const response = await axios.get(`${API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    if (response.data.success) {
      return response.data.data;
    }
  } catch (error) {
    localStorage.removeItem('token');
    throw error.response?.data?.error || 'Session expired. Please login again.';
  }
};

// Logout user
export const logout = async () => {
  try {
    await axios.get(`${API_URL}/auth/logout`);
    
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return true;
  } catch (error) {
    throw error.response?.data?.error || 'Unable to logout. Please try again.';
  }
};

// Forgot password
export const forgotPassword = async (email) => {
  try {
    const response = await axios.post(`${API_URL}/auth/forgotpassword`, {
      email
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Unable to process request. Please try again.';
  }
}; 