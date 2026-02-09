import { createContext, useState, useContext, useEffect } from "react";
import userApi from "../services/userApi";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ================= INIT AUTH ================= */
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await userApi.get("/auth/me");
        setUser(res.data.user);
      } catch (err) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  /* ================= LOGIN ================= */
  const login = async (credentials) => {
    const res = await userApi.post("/auth/login", credentials);

    // 🔥 SINGLE TOKEN FOR ALL ROLES
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("role", res.data.user.role);

    setUser(res.data.user);
    return res.data;
  };

  /* ================= LOGOUT ================= */
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loading,
      }}
    >
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
