import api from './axios';

export const direktoriApi = {
  // Ambil semua guru
  getGuru: async () => {
    const response = await api.get('/guru');
    return response.data;
  },

  // Tambah guru
  addGuru: async (data) => {
    const response = await api.post('/guru', data);
    return response.data;
  },

  // Update guru
  updateGuru: async (id, data) => {
    const response = await api.put(`/guru/${id}`, data);
    return response.data;
  },

  // Nonaktifkan guru
  nonaktifkanGuru: async (id) => {
    const response = await api.patch(`/guru/${id}/nonaktif`);
    return response.data;
  },

  // Aktifkan kembali guru
  aktifkanGuru: async (id) => {
    const response = await api.patch(`/guru/${id}/aktif`);
    return response.data;
  },

  // Hapus guru permanen
  deleteGuru: async (id) => {
    const response = await api.delete(`/guru/${id}`);
    return response.data;
  },
};
