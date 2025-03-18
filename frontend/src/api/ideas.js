import axios from 'axios';

// Use the same constant from auth.js
const RENDER_API_URL = 'https://idea-validator-backend.onrender.com';

// Get auth header
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Get all ideas for a user
export const getIdeas = async () => {
  try {
    const response = await axios.get(`${RENDER_API_URL}/ideas`, {
      headers: getAuthHeader(),
      withCredentials: true
    });
    
    if (response.data.success) {
      return response.data.data;
    }
  } catch (error) {
    throw error.response?.data?.error || 'Failed to fetch ideas';
  }
};

// Get single idea
export const getIdea = async (ideaId) => {
  try {
    const response = await axios.get(`${RENDER_API_URL}/ideas/${ideaId}`, {
      headers: getAuthHeader(),
      withCredentials: true
    });
    
    if (response.data.success) {
      return response.data.data;
    }
  } catch (error) {
    throw error.response?.data?.error || 'Failed to fetch idea details';
  }
};

// Create new idea
export const createIdea = async (ideaData) => {
  try {
    const response = await axios.post(`${RENDER_API_URL}/ideas`, ideaData, {
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json'
      },
      withCredentials: true
    });
    
    if (response.data.success) {
      return response.data.data;
    }
  } catch (error) {
    throw error.response?.data?.error || 'Failed to create idea';
  }
};

// Update idea
export const updateIdea = async (ideaId, ideaData) => {
  try {
    const response = await axios.put(`${RENDER_API_URL}/ideas/${ideaId}`, ideaData, {
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json'
      },
      withCredentials: true
    });
    
    if (response.data.success) {
      return response.data.data;
    }
  } catch (error) {
    throw error.response?.data?.error || 'Failed to update idea';
  }
};

// Delete idea
export const deleteIdea = async (ideaId) => {
  try {
    const response = await axios.delete(`${RENDER_API_URL}/ideas/${ideaId}`, {
      headers: getAuthHeader(),
      withCredentials: true
    });
    
    if (response.data.success) {
      return true;
    }
  } catch (error) {
    throw error.response?.data?.error || 'Failed to delete idea';
  }
};

// Validate idea
export const validateIdea = async (ideaId) => {
  try {
    const response = await axios.post(`${RENDER_API_URL}/ideas/${ideaId}/validate`, {}, {
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json'
      },
      withCredentials: true
    });
    
    if (response.data.success) {
      return response.data.data;
    }
  } catch (error) {
    throw error.response?.data?.error || 'Failed to validate idea';
  }
}; 