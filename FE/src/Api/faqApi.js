import api from './axios'; // Pastikan axios instance mu sudah setup (misal: baseURL dan interceptor token)

export const faqApi = {
  getFaq: async () => {
    const res = await api.get('/faq'); // Sesuaikan path ini dengan route backend
    return res.data;
  },

  addFaq: async (data) => {
    // data = { kategori, pertanyaan, jawaban }
    const res = await api.post('/faq', data);
    return res.data;
  },

  updateFaq: async (id, data) => {
    const res = await api.put(`/faq/${id}`, data);
    return res.data;
  },

  deleteFaq: async (id) => {
    const res = await api.delete(`/faq/${id}`);
    return res.data;
  },
};
