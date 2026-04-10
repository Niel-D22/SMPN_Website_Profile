// src/Api/dashboardApi.js
import api from './axios'; // Pastikan import axios.js kamu benar

export const dashboardApi = {
  getStats: async () => {
    try {
      const response = await api.get('/dashboard/stats');
      return response.data; // Mengembalikan object: { success: true, data: { ... } }
    } catch (error) {
      console.error('Gagal mengambil data dashboard:', error);
      throw error;
    }
  },
};
