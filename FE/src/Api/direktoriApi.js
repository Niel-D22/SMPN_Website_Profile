import api from './axios';

export const direktoriApi = {
  getGuru: async () => {
    const response = await api.get('/guru'); // Sesuaikan path ini dengan route backend-mu (misal: /api/guru)
    return response.data;
  },
  addGuru: async (data) => {
    const response = await api.post('/guru', data);
    return response.data;
  },
  updateGuru: async (id, data) => {
    const response = await api.put(`/guru/${id}`, data);
    return response.data;
  },
  deleteGuru: async (id) => {
    const response = await api.delete(`/guru/${id}`);
    return response.data;
  },
};
