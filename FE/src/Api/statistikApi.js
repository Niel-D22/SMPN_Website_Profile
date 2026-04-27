// Api/statistikApi.js
import api from './axios';

export const statistikApi = {
  getStatistik: async () => {
    const res = await api.get('/statistik');
    return res.data;
  },
};
