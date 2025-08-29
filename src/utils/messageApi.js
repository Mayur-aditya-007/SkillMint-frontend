import axios from 'axios';

const API = import.meta.env.VITE_BASE_URL || "http://localhost:4000/api";

export async function sendMessage(recipient, content) {
  return axios.post(`${API}/messages`, { recipient, content }, { withCredentials: true });
}

export async function getMessagesWith(userId) {
  return axios.get(`${API}/messages/${userId}`, { withCredentials: true });
}

export async function getConversations() {
  return axios.get(`${API}/messages`, { withCredentials: true });
}