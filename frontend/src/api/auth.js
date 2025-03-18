import axios from 'axios';

// Try with a direct URL to register
const RENDER_API_URL = 'https://idea-validator-backend.onrender.com';

// Register user
export const register = async (userData) => {
  try {
    // First, make a simple request to wake up the server
    try {
      await axios.get(RENDER_API_URL);
      console.log('Backend is awake');
    } catch (err) {
      console.log('Failed to wake backend:', err.message);
    }
    
    // Wait a moment for server to fully wake up
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Now try registration with a single endpoint
    const endpoint = `${RENDER_API_URL}/api/auth/register`;
    console.log(`Attempting registration at: ${endpoint}`, userData);
    
    try {
      const response = await axios.post(endpoint, userData, {
        headers: {
          'Content-Type': 'application/json'
        },
        // Increase timeout for potentially slow free-tier services
        timeout: 10000
      });
      
      console.log('Registration response:', response.data);
      
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
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
    const response = await axios.post(`${RENDER_API_URL}/auth/login`, {
      email,
      password
    }, {
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true
    });
    
    if (response.data.success) {
      localStorage.setItem('token', response.data.token);
      return response.data;
    }
  } catch (error) {
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
    
    const response = await axios.get(`${RENDER_API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      withCredentials: true
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
    await axios.get(`${RENDER_API_URL}/auth/logout`, {
      withCredentials: true
    });
    
    localStorage.removeItem('token');
    return true;
  } catch (error) {
    throw error.response?.data?.error || 'Unable to logout. Please try again.';
  }
};

// Forgot password
export const forgotPassword = async (email) => {
  try {
    const response = await axios.post(`${RENDER_API_URL}/auth/forgotpassword`, {
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