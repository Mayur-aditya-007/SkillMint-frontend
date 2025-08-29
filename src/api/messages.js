// src/api/messages.js
import axios from "axios";

const API = import.meta.env.VITE_BASE_URL || "http://localhost:4000";

const auth = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const MessagesAPI = {
  async threads() {
    const { data } = await axios.get(`${API}/api/messages/threads`, {
      withCredentials: true,
      headers: { "Content-Type": "application/json", ...auth() },
    });
    // backend returns an array
    return Array.isArray(data) ? data : (data?.data || []);
  },

  async conversation(peerId, cursor = null, limit = 30) {
    const url = new URL(`${API}/api/messages/${peerId}`);
    if (cursor) url.searchParams.set("cursor", cursor);
    if (limit) url.searchParams.set("limit", String(limit));
    const { data } = await axios.get(url.toString(), {
      withCredentials: true,
      headers: { "Content-Type": "application/json", ...auth() },
    });
    // backend returns { messages, nextCursor }
    const messages = Array.isArray(data?.messages) ? data.messages : (Array.isArray(data) ? data : []);
    return { messages, nextCursor: data?.nextCursor || null };
  },

  async send(to, content) {
    const { data } = await axios.post(
      `${API}/api/messages`,
      { to, content },
      { withCredentials: true, headers: { "Content-Type": "application/json", ...auth() } }
    );
    // backend returns normalized DTO
    return data;
  },
};
