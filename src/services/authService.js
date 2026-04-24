import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

export const authService = {
  login: async (email, password) => {
    console.log('Attempting login to:', `${API_BASE_URL}/auth/login`);
    console.log('Login payload:', { email, password });
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      email,
      password
    });
    console.log('Login response:', response.data);
    if (response.data.accessToken) {
      localStorage.setItem('token', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      // The entire response contains user data, not a nested user object
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  getToken: () => {
    return localStorage.getItem('token');
  },

  getRefreshToken: () => {
    return localStorage.getItem('refreshToken');
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  hasRole: (requiredRole) => {
    const user = authService.getCurrentUser();
    return user && user.role === requiredRole;
  },

  refreshToken: async () => {
    const refreshToken = authService.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
      refreshToken
    });
    if (response.data.accessToken) {
      localStorage.setItem('token', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
    }
    return response.data;
  }
};
