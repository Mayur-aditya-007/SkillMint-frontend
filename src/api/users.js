// src/api/users.js
import api from "../lib/api";

export const UsersAPI = {
  async search(q) {
    const { data } = await api.get(`/user/search`, { params: { q } });
    return data?.data || [];
  },

  async getById(id) {
    const { data } = await api.get(`/user/${id}`);
    return data?.data || null;
  },

  async connect(userId) {
    const { data } = await api.post(`/user/connect/${userId}`);
    return data;
  },

  // NEW: Recently joined (expects backend: GET /user/recent?limit=N)
  async recent(limit = 12) {
    const { data } = await api.get(`/user/recent`, { params: { limit } });
    // expect: { success, data: [ {_id, fullname, email, avatar, createdAt, ...} ] }
    return data?.data || [];
  },
};
