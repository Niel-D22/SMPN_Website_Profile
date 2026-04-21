// src/Api/pengunjungApi.js
import api from './axios';

export const pengunjungApi = {
  // Dipanggil di App.jsx untuk publik
  recordVisit: async () => {
    const response = await api.post('/pengunjung/record');
    return response.data;
  },

  // Dipanggil di AdminDashboardPage.jsx untuk chart
  getStats7Hari: async () => {
    const response = await api.get('/pengunjung/7hari');
    return response.data;
  },

  getStatsBulanIni: async () => {
    const response = await api.get('/pengunjung/bulanini');
    return response.data;
  },
};
