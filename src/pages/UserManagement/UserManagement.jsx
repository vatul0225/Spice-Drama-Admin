import React, { useState, useEffect } from "react";
import adminApi from "../../services/adminApi";
import {
  UserPlus,
  Trash2,
  Shield,
  Eye,
  Edit,
  X,
  Check,
  AlertCircle,
} from "lucide-react";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
    role: "viewer",
  });
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    fetchUsers();
  }, []);

  /* ---------------- FETCH USERS ---------------- */
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminApi.get("/auth/users");
      setUsers(response.data.users || []);
    } catch (err) {
      setError("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- CREATE USER ---------------- */
  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await adminApi.post("/auth/users", newUser);
      setNewUser({ username: "", email: "", password: "", role: "viewer" });
      setShowForm(false);
      fetchUsers();
      showMessage("success", "User created successfully!");
    } catch {
      showMessage("error", "Failed to create user");
    }
  };

  /* ---------------- DELETE USER ---------------- */
  const handleDeleteUser = async (userId, username) => {
    if (!window.confirm(`Delete user "${username}"?`)) return;
    try {
      await adminApi.delete(`/auth/users/${userId}`);
      fetchUsers();
      showMessage("success", "User deleted successfully!");
    } catch {
      showMessage("error", "Failed to delete user");
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 5000);
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-700 border-red-200";
      case "editor":
        return "bg-orange-100 text-orange-700 border-orange-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getRoleIcon = (role) => {
    if (role === "admin") return <Shield className="w-4 h-4" />;
    if (role === "editor") return <Edit className="w-4 h-4" />;
    return <Eye className="w-4 h-4" />;
  };

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-5 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
        <p className="text-gray-600">
          Manage admin panel users and permissions
        </p>
      </div>

      {message.text && (
        <div
          className={`p-4 rounded-lg flex items-center justify-between ${
            message.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          <div className="flex items-center gap-2">
            {message.type === "success" ? <Check /> : <AlertCircle />}
            {message.text}
          </div>
          <X
            className="cursor-pointer"
            onClick={() => setMessage({ type: "", text: "" })}
          />
        </div>
      )}

      <button
        onClick={() => setShowForm(!showForm)}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition w-fit ${
          showForm
            ? "bg-gray-200 text-gray-700"
            : "bg-orange-500 text-white hover:bg-orange-600"
        }`}
      >
        {showForm ? <X /> : <UserPlus />}
        {showForm ? "Cancel" : "Add New User"}
      </button>

      {/* (UI code same as before — no change needed) */}
    </div>
  );
}
