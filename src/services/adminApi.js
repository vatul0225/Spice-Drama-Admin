import axios from "axios";

const adminApi = axios.create({
  // 🔥 FOOD & ORDER admin actions user-backend pe jaayengi
  baseURL: `${import.meta.env.VITE_USER_API}/api`,
});

adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("admin_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default adminApi;
