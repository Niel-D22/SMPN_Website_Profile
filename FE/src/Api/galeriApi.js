import api from './axios';

export const galeriApi = {
  getGaleri: async () => {
    const res = await api.get('/galeri');
    return res.data;
  },

  addGaleri: async (formData) => {
    const res = await api.post('/galeri', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  // Kembali pakai PUT dengan header multipart yang eksplisit
  updateGaleri: async (id, formData) => {
    const res = await api.put(`/galeri/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  deleteGaleri: async (id) => {
    const res = await api.delete(`/galeri/${id}`);
    return res.data;
  },
};
