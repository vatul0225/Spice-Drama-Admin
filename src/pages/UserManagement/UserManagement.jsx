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
  Search,
} from "lucide-react";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
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

  // Filter users based on search
  const filteredUsers = users.filter(
    (user) =>
      (user.username || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.role || "").toLowerCase().includes(searchTerm.toLowerCase()),
  );

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
          <p className="text-sm text-gray-500 mt-1">
            Manage admin panel users and permissions
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="cursor-pointer flex items-center justify-center gap-2 
                     bg-orange-500 text-white 
                     px-4 py-2 rounded-lg 
                     hover:bg-orange-600 transition
                     w-full sm:w-auto shadow-sm"
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
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
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
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 lg:p-8 w-full max-w-full lg:max-w-2xl mx-auto">
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-100 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
              <UserPlus className="text-orange-600" size={18} />
            </div>
            <div className="min-w-0">
              <h2 className="font-bold text-base sm:text-xl text-gray-800">
                Create New User
              </h2>
              <p className="text-xs text-gray-500 hidden sm:block">
                Add a new user to the system
              </p>
            </div>
          </div>

          <form onSubmit={handleCreateUser} className="space-y-4 sm:space-y-5">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
              {/* Username Field */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                  Username <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-2.5 sm:pl-3 flex items-center pointer-events-none">
                    <Edit className="text-gray-400" size={14} />
                  </div>
                  <input
                    type="text"
                    placeholder="johndoe"
                    value={newUser.username}
                    onChange={(e) =>
                      setNewUser({ ...newUser, username: e.target.value })
                    }
                    className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm border border-gray-300 rounded-lg sm:rounded-xl
                               focus:ring-2 focus:ring-orange-400 focus:border-orange-400 
                               outline-none transition-all bg-white"
                    required
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-2.5 sm:pl-3 flex items-center pointer-events-none">
                    <AlertCircle className="text-gray-400" size={14} />
                  </div>
                  <input
                    type="email"
                    placeholder="john@example.com"
                    value={newUser.email}
                    onChange={(e) =>
                      setNewUser({ ...newUser, email: e.target.value })
                    }
                    className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm border border-gray-300 rounded-lg sm:rounded-xl
                               focus:ring-2 focus:ring-orange-400 focus:border-orange-400 
                               outline-none transition-all bg-white"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2.5 sm:pl-3 flex items-center pointer-events-none">
                  <Shield className="text-gray-400" size={14} />
                </div>
                <input
                  type="password"
                  placeholder="Enter a strong password"
                  value={newUser.password}
                  onChange={(e) =>
                    setNewUser({ ...newUser, password: e.target.value })
                  }
                  className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm border border-gray-300 rounded-lg sm:rounded-xl
                             focus:ring-2 focus:ring-orange-400 focus:border-orange-400 
                             outline-none transition-all bg-white"
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-1 sm:mt-1.5">
                Minimum 6 characters recommended
              </p>
            </div>

            {/* Role Field */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                User Role <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2.5 sm:pl-3 flex items-center pointer-events-none">
                  {roleIcons[newUser.role]}
                </div>
                <select
                  value={newUser.role}
                  onChange={(e) =>
                    setNewUser({ ...newUser, role: e.target.value })
                  }
                  className="w-full pl-8 sm:pl-10 pr-8 sm:pr-10 py-2.5 sm:py-3 text-sm border border-gray-300 rounded-lg sm:rounded-xl
                             focus:ring-2 focus:ring-orange-400 focus:border-orange-400 
                             outline-none transition-all bg-white appearance-none cursor-pointer"
                >
                  <option value="admin">👑 Admin - Full system access</option>
                  <option value="editor">✏️ Editor - Can edit content</option>
                  <option value="viewer">👁️ Viewer - View only access</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-2.5 sm:pr-3 flex items-center pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="cursor-pointer order-2 sm:order-1 sm:flex-none sm:px-6 bg-gray-100 hover:bg-gray-200 
                           text-gray-700 py-2.5 sm:py-3 rounded-lg sm:rounded-xl transition-all font-semibold
                           border border-gray-200 text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="cursor-pointer order-1 sm:order-2 flex-1 bg-gradient-to-r from-green-600 to-green-500 
                           hover:from-green-700 hover:to-green-600 
                           text-white py-2.5 sm:py-3 px-6 sm:px-8 rounded-lg sm:rounded-xl transition-all font-semibold
                           shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-sm"
              >
                <Check size={16} />
                Create User
              </button>
            </div>
          </form>
        </div>
      )}

      {/* SEARCH BAR */}
      {!loading && users.length > 0 && (
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg
                       focus:ring-2 focus:ring-orange-400 focus:border-transparent
                       outline-none bg-white shadow-sm"
          />
        </div>
      )}

      {/* USERS TABLE */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        {loading ? (
          <p className="p-6 text-gray-500 text-center">Loading users...</p>
        ) : filteredUsers.length === 0 ? (
          <p className="p-6 text-gray-500 text-center">
            {searchTerm ? "No users found" : "No users found"}
          </p>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-600 border-b">
                  <tr>
                    <th className="px-4 sm:px-5 py-3 text-left font-semibold">
                      Username
                    </th>
                    <th className="px-4 sm:px-5 py-3 text-left font-semibold">
                      Email
                    </th>
                    <th className="px-4 sm:px-5 py-3 text-left font-semibold">
                      Role
                    </th>
                    <th className="px-4 sm:px-5 py-3 text-center font-semibold">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredUsers.map((u) => (
                    <tr
                      key={u._id}
                      className="border-t hover:bg-gray-50 transition"
                    >
                      <td className="px-4 sm:px-5 py-3 font-medium">
                        {u.username}
                      </td>
                      <td className="px-4 sm:px-5 py-3 text-gray-600">
                        {u.email}
                      </td>
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
                          className="cursor-pointer text-red-500 hover:text-red-700 hover:bg-red-50 
                                     p-2 rounded-lg transition inline-flex items-center"
                          title="Delete user"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="sm:hidden divide-y">
              {filteredUsers.map((u) => (
                <div key={u._id} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-800 mb-1">
                        {u.username}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2 break-all">
                        {u.email}
                      </p>
                      <span
                        className={`inline-flex items-center gap-1 
                        px-3 py-1 rounded-full 
                        text-xs font-medium capitalize
                        ${roleStyles[u.role]}`}
                      >
                        {roleIcons[u.role]}
                        {u.role}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDeleteUser(u._id)}
                      className="cursor-pointer flex-shrink-0 text-red-500 hover:text-red-700 
                                 hover:bg-red-50 p-2 rounded-lg transition"
                      title="Delete user"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* User Count */}
      {!loading && filteredUsers.length > 0 && (
        <div className="text-center text-sm text-gray-500">
          Showing {filteredUsers.length} of {users.length} user
          {users.length !== 1 ? "s" : ""}
        </div>
      )}
    </div>
  );
}
