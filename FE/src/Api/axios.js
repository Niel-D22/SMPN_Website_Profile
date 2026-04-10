import axios from 'axios';
import { getApiBaseUrl } from '../config/apiBase';

const api = axios.create({
  baseURL: getApiBaseUrl(),
});

// Middleware otomatis untuk pasang Token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
