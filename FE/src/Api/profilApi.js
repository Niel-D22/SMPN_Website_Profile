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
};
