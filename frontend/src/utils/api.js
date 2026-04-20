import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api/',
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
