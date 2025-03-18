import axios from 'axios';

// Create an axios instance
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor to add auth token to requests
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Add a response interceptor for global error handling
api.interceptors.response.use(
  response => response,
  error => {
    // Handle session expiration
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

export const logout = async () => {
  const response = await api.post('/auth/logout');
  localStorage.removeItem('token');
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

// Ideas API calls
export const getIdeas = async () => {
  const response = await api.get('/ideas');
  return response.data;
};

export const getIdea = async (id) => {
  const response = await api.get(`/ideas/${id}`);
  return response.data;
};

export const createIdea = async (ideaData) => {
  const response = await api.post('/ideas', ideaData);
  return response.data;
};

export const updateIdea = async (id, ideaData) => {
  const response = await api.put(`/ideas/${id}`, ideaData);
  return response.data;
};

export const deleteIdea = async (id) => {
  const response = await api.delete(`/ideas/${id}`);
  return response.data;
};

export const validateIdea = async (id) => {
  const response = await api.post(`/ideas/${id}/validate`);
  return response.data;
};

export default api; 