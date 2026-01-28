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
      const res = await adminApi.get("/auth/users");
      setUsers(res.data.users || []);
    } catch (err) {
      showMessage("error", "Failed to fetch users");
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
      showMessage("success", "User created successfully");
    } catch {
      showMessage("error", "Failed to create user");
    }
  };

  /* ---------------- DELETE USER ---------------- */
  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await adminApi.delete(`/auth/users/${id}`);
      fetchUsers();
      showMessage("success", "User deleted successfully");
    } catch {
      showMessage("error", "Failed to delete user");
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 4000);
  };

  const roleStyles = {
    admin: "bg-red-100 text-red-700",
    editor: "bg-blue-100 text-blue-700",
    viewer: "bg-gray-100 text-gray-700",
  };

  const roleIcons = {
    admin: <Shield size={14} />,
    editor: <Edit size={14} />,
    viewer: <Eye size={14} />,
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-5 py-6 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
          <p className="text-sm text-gray-500">
            Manage admin panel users and permissions
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center justify-center gap-2 
                     bg-orange-500 text-white 
                     px-4 py-2 rounded-lg 
                     hover:bg-orange-600 transition
                     w-full sm:w-auto"
        >
          {showForm ? <X size={18} /> : <UserPlus size={18} />}
          {showForm ? "Close Form" : "Add User"}
        </button>
      </div>

      {/* MESSAGE */}
      {message.text && (
        <div
          className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm ${
            message.type === "success"
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {message.type === "success" ? (
            <Check size={18} />
          ) : (
            <AlertCircle size={18} />
          )}
          {message.text}
        </div>
      )}

      {/* ADD USER FORM */}
      {showForm && (
        <div className="bg-white rounded-xl shadow p-5 w-full sm:max-w-lg">
          <h2 className="font-semibold text-lg mb-4">Create New User</h2>

          <form onSubmit={handleCreateUser} className="space-y-3">
            <input
              type="text"
              placeholder="Username"
              value={newUser.username}
              onChange={(e) =>
                setNewUser({ ...newUser, username: e.target.value })
              }
              className="w-full border rounded-lg px-3 py-3 sm:py-2 
                         focus:ring-2 focus:ring-orange-400 outline-none"
              required
            />

            <input
              type="email"
              placeholder="Email"
              value={newUser.email}
              onChange={(e) =>
                setNewUser({ ...newUser, email: e.target.value })
              }
              className="w-full border rounded-lg px-3 py-3 sm:py-2 
                         focus:ring-2 focus:ring-orange-400 outline-none"
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={newUser.password}
              onChange={(e) =>
                setNewUser({ ...newUser, password: e.target.value })
              }
              className="w-full border rounded-lg px-3 py-3 sm:py-2 
                         focus:ring-2 focus:ring-orange-400 outline-none"
              required
            />

            <select
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              className="w-full border rounded-lg px-3 py-3 sm:py-2"
            >
              <option value="admin">Admin</option>
              <option value="editor">Editor</option>
              <option value="viewer">Viewer</option>
            </select>

            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 
                         text-white py-2 rounded-lg transition"
            >
              Create User
            </button>
          </form>
        </div>
      )}

      {/* USERS TABLE */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        {loading ? (
          <p className="p-6 text-gray-500">Loading users...</p>
        ) : users.length === 0 ? (
          <p className="p-6 text-gray-500">No users found</p>
        ) : (
          <table className="w-full text-xs sm:text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-4 sm:px-5 py-3 text-left">Username</th>
                <th className="px-4 sm:px-5 py-3 text-left">Email</th>
                <th className="px-4 sm:px-5 py-3 text-left">Role</th>
                <th className="px-4 sm:px-5 py-3 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {users.map((u) => (
                <tr
                  key={u._id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="px-4 sm:px-5 py-3 font-medium">
                    {u.username}
                  </td>
                  <td className="px-4 sm:px-5 py-3 text-gray-600">{u.email}</td>
                  <td className="px-4 sm:px-5 py-3">
                    <span
                      className={`inline-flex items-center gap-1 
                      px-3 py-1 rounded-full 
                      text-xs font-medium capitalize whitespace-nowrap
                      ${roleStyles[u.role]}`}
                    >
                      {roleIcons[u.role]}
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 sm:px-5 py-3 text-center">
                    <button
                      onClick={() => handleDeleteUser(u._id)}
                      className="text-red-500 hover:text-red-700 transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
