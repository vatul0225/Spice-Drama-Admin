import { createContext, useState, useContext, useEffect } from "react";
import adminApi from "../services/adminApi";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // 🔥 Load user from localStorage first
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("admin_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  /* ---------------- CHECK AUTH ---------------- */
  const checkAuth = async () => {
    try {
      const response = await adminApi.get("/auth/me");
      setUser(response.data.user);
      localStorage.setItem("admin_user", JSON.stringify(response.data.user));
    } catch (error) {
      setUser(null);
      localStorage.removeItem("admin_user");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- LOGIN ---------------- */
  const login = async (credentials) => {
    const response = await adminApi.post("/auth/login", credentials);
    setUser(response.data.user);
    localStorage.setItem("admin_user", JSON.stringify(response.data.user));
    return response.data;
  };

  /* ---------------- LOGOUT ---------------- */
  const logout = async () => {
    await adminApi.post("/auth/logout");
    setUser(null);
    localStorage.removeItem("admin_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
