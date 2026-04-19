// file: src/Api/beritaApi.js
import api from './axios';

export const beritaApi = {
  // Mengambil berita untuk halaman publik (Hanya status 'active')
  getBeritaPublic: async () => {
    const res = await api.get('/berita/public'); // HARUS ADA /public-nya
    return res.data;
  },

  // Mengambil berita untuk halaman Admin (Semua berita)
  getBeritaAdmin: async () => {
    const res = await api.get('/berita/admin'); // HARUS ADA /admin-nya
    return res.data;
  },

  addBerita: async (formData) => {
    const res = await api.post('/berita', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  getBeritaById: async (id) => {
    const res = await api.get(`/berita/${id}`);
    return res.data;
  },

  updateBerita: async (id, formData) => {
    const res = await api.put(`/berita/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  deleteBerita: async (id) => {
    const res = await api.delete(`/berita/${id}`);
    return res.data;
  },
};
