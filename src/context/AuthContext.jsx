import { createContext, useState, useContext, useEffect } from "react";
import adminApi from "../services/adminApi";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("admin_user");
    return saved ? JSON.parse(saved) : null;
  });

  const [loading, setLoading] = useState(true);

  /* ---------------- INIT AUTH (JWT) ---------------- */
  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    const savedUser = localStorage.getItem("admin_user");

    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      setUser(null);
    }

    setLoading(false);
  }, []);

  /* ---------------- LOGIN ---------------- */
  const login = async (credentials) => {
    const res = await adminApi.post("/auth/login", credentials);

    // SAVE JWT + USER (both keys for compatibility)
    localStorage.setItem("admin_token", res.data.token);
    localStorage.setItem("token", res.data.token); // Added for userApi compatibility
    localStorage.setItem("admin_user", JSON.stringify(res.data.user));

    setUser(res.data.user);
    return res.data;
  };

  /* ---------------- LOGOUT ---------------- */
  const logout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("token"); // Clear both tokens
    localStorage.removeItem("admin_user");
    setUser(null);
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
