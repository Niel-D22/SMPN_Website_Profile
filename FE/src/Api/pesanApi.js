import api from './axios'; // Sesuaikan dengan file axios instance kamu

export const pesanApi = {
  kirimPesan: async (dataPesan) => {
    const response = await api.post('/pesan', dataPesan);
    return response.data;
  },

  // 1. Ambil semua pesan
  getSemuaPesan: async () => {
    const response = await api.get('/pesan');
    return response.data;
  },

  // 2. Hapus pesan
  hapusPesan: async (id) => {
    const response = await api.delete(`/pesan/${id}`);
    return response.data;
  },

  // 3. Tandai pesan sudah dibaca
  tandaiDibaca: async (id) => {
    const response = await api.put(`/pesan/${id}/read`);
    return response.data;
  },

  // 4. KIRIM BALASAN (Ini fungsi yang tadi dibilang "not a function")
  balasPesan: async (id, dataBalasan) => {
    const response = await api.post(`/pesan/${id}/balas`, dataBalasan);
    return response.data;
  },
};
