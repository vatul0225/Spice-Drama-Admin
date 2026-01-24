import axios from "axios";

const adminApi = axios.create({
  baseURL: `${import.meta.env.VITE_ADMIN_API}/api`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default adminApi;
