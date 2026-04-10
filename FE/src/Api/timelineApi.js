import api from './axios';

export const timelineApi = {
  getTimeline: async () => {
    const response = await api.get('/ppdb/timeline');
    return response.data;
  },
  addTimeline: async (data) => {
    const response = await api.post('/ppdb/timeline', data);
    return response.data;
  },
  updateTimeline: async (id, data) => {
    const response = await api.put(`/ppdb/timeline/${id}`, data);
    return response.data;
  },
  deleteTimeline: async (id) => {
    const response = await api.delete(`/ppdb/timeline/${id}`);
    return response.data;
  },
};
