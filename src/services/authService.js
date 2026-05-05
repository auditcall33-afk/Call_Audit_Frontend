import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

export const authService = {
  login: async (email, password) => {
    console.log('Attempting login to:', `${API_BASE_URL}/auth/login`);
    console.log('Login payload:', { email, password });
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      email,
      password
    }, {
      withCredentials: true
    });
    console.log('Login response:', response.data);
    // Tokens are now stored in HttpOnly cookies by the backend
    // Store user data in localStorage for UI purposes only
    if (response.data) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },

  logout: async () => {
    // Call backend to clear cookies
    await axios.post(`${API_BASE_URL}/auth/logout`, {}, {
      withCredentials: true
    });
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  getToken: () => {
    // Tokens are now in HttpOnly cookies, not accessible from JS
    return null;
  },

  getRefreshToken: () => {
    // Tokens are now in HttpOnly cookies, not accessible from JS
    return null;
  },

  isAuthenticated: () => {
    // Check if user data exists in localStorage
    const user = localStorage.getItem('user');
    return !!user;
  },

  hasRole: (requiredRole) => {
    const user = authService.getCurrentUser();
    return user && user.role === requiredRole;
  },

  refreshToken: async () => {
    // Refresh tokens are now handled automatically by the backend via cookies
    const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {}, {
      withCredentials: true
    });
    return response.data;
  }
};
