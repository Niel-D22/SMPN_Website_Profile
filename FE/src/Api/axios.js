import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Sesuaikan dengan port backendmu
});

// Middleware otomatis untuk pasang Token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // FormData: biarkan browser set multipart boundary (jangan pakai Content-Type JSON)
  if (typeof FormData !== 'undefined' && config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }
  return config;
});

export default api;
