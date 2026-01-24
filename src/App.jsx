import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login/Login";
import Dashboard from "./components/Dashboard";
import Add from "./pages/Add/Add";
import List from "./pages/List/List";
import Orders from "./pages/Orders/Orders";
import UserManagement from "./pages/UserManagement/UserManagement";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";

const App = () => {
  // 🔑 BACKEND URLS
  const adminUrl = import.meta.env.VITE_ADMIN_API; // admin backend
  const userUrl = import.meta.env.VITE_USER_API; // user backend

  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastContainer position="top-right" autoClose={3000} />
        <Routes>
          {/* ---------------- LOGIN ---------------- */}
          <Route path="/login" element={<Login />} />

          {/* ---------------- PROTECTED DASHBOARD ---------------- */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          >
            {/* Default route */}
            <Route index element={<Navigate to="add" replace />} />

            {/* ---------- FOOD & ORDERS (USER BACKEND) ---------- */}
            <Route path="add" element={<Add url={userUrl} />} />
            <Route path="add/:id" element={<Add url={userUrl} />} />
            <Route path="list" element={<List url={userUrl} />} />
            <Route path="orders" element={<Orders url={userUrl} />} />

            {/* ---------- USERS (ADMIN BACKEND) ---------- */}
            <Route
              path="users"
              element={
                <ProtectedRoute requiredRole="admin">
                  <UserManagement />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* ---------------- FALLBACK ---------------- */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
