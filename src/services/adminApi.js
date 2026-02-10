import axios from "axios";

const adminApi = axios.create({
  baseURL: `${import.meta.env.VITE_ADMIN_API}/api`,
});

adminApi.interceptors.request.use(
  (config) => {
    // Try both token keys for compatibility
    const token =
      localStorage.getItem("admin_token") || localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Add response interceptor for better error handling
adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token invalid or expired
      localStorage.removeItem("admin_token");
      localStorage.removeItem("token");
      localStorage.removeItem("admin_user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default adminApi;
