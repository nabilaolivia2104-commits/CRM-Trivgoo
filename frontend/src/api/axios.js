import axios from "axios";

// Ambil baseURL dari environment variable VITE_API_URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // <-- gunakan VITE_API_URL
});

// Interceptor untuk menambahkan token JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
