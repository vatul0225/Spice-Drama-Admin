import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_USER_API}/api`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Auth APIs
export const authAPI = {
  login: (credentials) => api.post("/auth/login", credentials),
  logout: () => api.post("/auth/logout"),
  getCurrentUser: () => api.get("/auth/me"),
  getAllUsers: () => api.get("/auth/users"),
  createUser: (userData) => api.post("/auth/users", userData),
  deleteUser: (userId) => api.delete(`/auth/users/${userId}`),
  updateUserStatus: (userId, isActive) =>
    api.patch(`/auth/users/${userId}/status`, { isActive }),
};

export default api;
