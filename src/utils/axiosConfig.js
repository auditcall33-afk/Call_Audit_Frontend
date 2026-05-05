import axios from 'axios';

// Create axios instance with global configuration
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
  withCredentials: true, // Important: Send cookies with requests
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
