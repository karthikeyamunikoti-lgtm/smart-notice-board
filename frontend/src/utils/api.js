import axios from 'axios';

// Set base URL dynamically based on environment
export const BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:5000' 
  : 'https://smart-notice-board-0k2k.onrender.com';

export const SOCKET_URL = BASE_URL;

const API = axios.create({
  baseURL: `${BASE_URL}/api/`,
});

// Add a request interceptor to handle auth and URL normalization
API.interceptors.request.use((config) => {
  // Ensure we don't have double slashes when joining baseURL and url
  if (config.url && config.url.startsWith('/')) {
    config.url = config.url.substring(1);
  }

  if (localStorage.getItem('userInfo')) {
    config.headers.Authorization = `Bearer ${
      JSON.parse(localStorage.getItem('userInfo')).token
    }`;
  }
  return config;
});

export default API;
