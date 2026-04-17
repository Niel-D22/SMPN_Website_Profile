import api from './axios';

export const beritaApi = {
  getBeritaPublic: async () => {
    const response = await api.get('/berita/public'); // Pastikan route di backend sesuai
    return response.data;
  },

  getBeritaAdmin: async () => {
    const response = await api.get('/berita/admin');
    return response.data;
  },
  addBerita: async (data) => {
    const response = await api.post('/berita', data);
    return response.data;
  },
  updateBerita: async (id, data) => {
    const response = await api.put(`/berita/${id}`, data);
    return response.data;
  },
  deleteBerita: async (id) => {
    const response = await api.delete(`/berita/${id}`);
    return response.data;
  },
};
