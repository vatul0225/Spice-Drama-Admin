import axios from "axios";

const adminApi = axios.create({
  baseURL: `${import.meta.env.VITE_ADMIN_API}/api`,
});

adminApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("admin_token"); // 🛠 ONLY ADMIN TOKEN
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default adminApi;
