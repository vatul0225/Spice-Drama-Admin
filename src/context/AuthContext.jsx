import { createContext, useState, useContext, useEffect } from "react";
import adminApi from "../services/adminApi";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ================= INIT AUTH ================= */
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("token");
      const savedUser = localStorage.getItem("user");

      if (token && savedUser) {
        try {
          const response = await adminApi.get("/auth/me");
          setUser(response.data.user);
          localStorage.setItem("user", JSON.stringify(response.data.user));
        } catch (error) {
          console.error("Token verification failed:", error);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setUser(null);
        }
      }

      setLoading(false);
    };

    initAuth();
  }, []);

  /* ================= LOGIN ================= */
  const login = async (credentials) => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await adminApi.post("/auth/login", credentials);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      setUser(response.data.user);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  /* ================= LOGOUT ================= */
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  /* ================= UPDATE USER ================= */
  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  /* ================= ROLE CHECKS ================= */
  const hasRole = (roles) => {
    if (!user) return false;
    if (Array.isArray(roles)) {
      return roles.includes(user.role);
    }
    return user.role === roles;
  };

  const isAdmin = () => hasRole("admin");
  const isEditor = () => hasRole(["editor", "admin"]);
  const isViewer = () => hasRole(["viewer", "editor", "admin"]);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loading,
        updateUser,
        hasRole,
        isAdmin,
        isEditor,
        isViewer,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
