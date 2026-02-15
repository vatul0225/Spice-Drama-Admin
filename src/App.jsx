import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
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

/* ROUTES THAT WAIT FOR AUTH */
const AppRoutes = () => {
  const { loading } = useAuth();

  // wait till auth check completes
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-lg">
        Loading...
      </div>
    );
  }

  return (
    <Routes>
      {/* ---------------- LOGIN ---------------- */}
      <Route path="/login" element={<Login />} />

      {/* ---------------- DASHBOARD (ALL ROLES) ---------------- */}
      <Route
        path="/"
        element={
          <ProtectedRoute allowedRoles={["admin", "editor", "viewer"]}>
            <Dashboard />
          </ProtectedRoute>
        }
      >
        {/* Default */}
        <Route index element={<Navigate to="add" replace />} />

        {/* ---------- FOOD & ORDERS (ADMIN + EDITOR) ---------- */}
        <Route
          path="add"
          element={
            <ProtectedRoute allowedRoles={["admin", "editor"]}>
              <Add />
            </ProtectedRoute>
          }
        />
        <Route
          path="add/:id"
          element={
            <ProtectedRoute allowedRoles={["admin", "editor"]}>
              <Add />
            </ProtectedRoute>
          }
        />
        <Route
          path="list"
          element={
            <ProtectedRoute allowedRoles={["admin", "editor"]}>
              <List />
            </ProtectedRoute>
          }
        />
        <Route
          path="orders"
          element={
            <ProtectedRoute allowedRoles={["admin", "editor"]}>
              <Orders />
            </ProtectedRoute>
          }
        />

        {/* ---------- USERS (ADMIN ONLY) ---------- */}
        <Route
          path="users"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <UserManagement />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* ---------------- FALLBACK ---------------- */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <ToastContainer position="top-right" autoClose={3000} />
      <AppRoutes />
    </AuthProvider>
  );
};

export default App;
