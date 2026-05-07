import api from './axios'; // Sesuai dengan instance axios kamu

export const profilSekolahApi = {
  // Ambil Data Profil Sekolah
  getProfilSekolah: async () => {
    const response = await api.get('/profil');
    return response.data;
  },

  updateProfilSekolah: async (data) => {
    const response = await api.put('/profil', data);
    return response.data;
  },

  // Tambah di profilSekolahApi.js
  uploadKurikulum: async (file, deskripsi) => {
    const formData = new FormData();
    formData.append('file', file);
    if (deskripsi) formData.append('deskripsi_kurikulum', deskripsi);

    const response = await api.post('/profil/kurikulum', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  uploadAkreditasi: async (file, deskripsi) => {
    const formData = new FormData();
    formData.append('file', file);
    if (deskripsi) formData.append('deskripsi_akreditasi', deskripsi);

    const response = await api.post('/profil/akreditasi', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};
