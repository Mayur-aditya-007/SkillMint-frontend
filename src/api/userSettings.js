// src/api/userSettings.js
import api from "../lib/api";

export const UserSettingsAPI = {
  async updateProfile(payload) {
    // JSON update
    const { data } = await api.put("/user/profile", payload);
    return data;
  },

  async uploadAvatar(file) {
    const fd = new FormData();
    fd.append("avatar", file);
    const { data } = await api.post("/user/avatar", fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    // expect { success, url }
    return data;
  },
};
