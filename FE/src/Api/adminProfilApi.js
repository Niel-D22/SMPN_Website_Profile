import api from './axios'; // Pastikan path import-nya sesuai

export const profilApi = {
  // Login
  login: async (credentials) => {
    const response = await api.post('/auth', credentials);
    return response.data;
  },

  // Ambil Data Profil
  getProfile: async () => {
    // Token otomatis terpasang berkat interceptor di axios.js
    const response = await api.get('/auth/profile');
    return response.data;
  },

  // Update Profil
  updateProfile: async (data) => {
    const response = await api.put('/auth/update-profile', data);
    return response.data;
  },

  // Lupa Password
  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },
};
