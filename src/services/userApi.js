import axios from "axios";

const userApi = axios.create({
  baseURL: `${import.meta.env.VITE_USER_API}/api`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default userApi;
