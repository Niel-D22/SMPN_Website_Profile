import api from './axios';

export const prestasiApi = {
  getPrestasi: async () => {
    const res = await api.get('/prestasi');
    return res.data;
  },

  // POST — FormData untuk support file upload
  addPrestasi: async (formData) => {
    const res = await api.post('/prestasi', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  // PUT — FormData untuk support file upload
  updatePrestasi: async (id, formData) => {
    const res = await api.put(`/prestasi/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  deletePrestasi: async (id) => {
    const res = await api.delete(`/prestasi/${id}`);
    return res.data;
  },
};
