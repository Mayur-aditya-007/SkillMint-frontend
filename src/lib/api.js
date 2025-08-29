// src/lib/api.js
import axios from "axios";

const API_BASE = import.meta.env.VITE_BASE_URL ?? "http://localhost:4000";

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // keep cookies if you use them
});

// Attach Bearer token (from login) to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
