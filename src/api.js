import axios from 'axios';

const baseUrl = import.meta.env.VITE_BASE_URL || "http://localhost:3000";

const api = axios.create({
  baseURL: baseUrl,
});

const token = localStorage.getItem("authToken");
if (token) {
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

export default api;