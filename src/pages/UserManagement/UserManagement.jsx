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
  Users,
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

  // Filter users based on search term
  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center justify-center w-12 h-12 bg-orange-100 rounded-xl">
              <Users className="text-orange-600" size={24} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                User Management
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Manage admin panel users and permissions
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center justify-center gap-2 
                       bg-orange-500 text-white 
                       px-5 py-2.5 rounded-lg 
                       hover:bg-orange-600 active:bg-orange-700
                       transition-all duration-200
                       shadow-sm hover:shadow-md
                       font-medium
                       w-full sm:w-auto"
          >
            {showForm ? <X size={18} /> : <UserPlus size={18} />}
            <span>{showForm ? "Close Form" : "Add User"}</span>
          </button>
        </div>

        {/* MESSAGE */}
        {message.text && (
          <div
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium
                        shadow-sm animate-fadeIn ${
                          message.type === "success"
                            ? "bg-green-50 text-green-700 border border-green-200"
                            : "bg-red-50 text-red-700 border border-red-200"
                        }`}
          >
            {message.type === "success" ? (
              <Check size={18} className="flex-shrink-0" />
            ) : (
              <AlertCircle size={18} className="flex-shrink-0" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        {/* ADD USER FORM */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-md p-5 sm:p-6 w-full animate-slideDown">
            <h2 className="font-semibold text-lg sm:text-xl mb-5 text-gray-800">
              Create New User
            </h2>

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Username
                </label>
                <input
                  type="text"
                  placeholder="Enter username"
                  value={newUser.username}
                  onChange={(e) =>
                    setNewUser({ ...newUser, username: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 sm:py-2 
                             focus:ring-2 focus:ring-orange-400 focus:border-transparent 
                             outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Enter email address"
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 sm:py-2 
                             focus:ring-2 focus:ring-orange-400 focus:border-transparent 
                             outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Enter password"
                  value={newUser.password}
                  onChange={(e) =>
                    setNewUser({ ...newUser, password: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 sm:py-2 
                             focus:ring-2 focus:ring-orange-400 focus:border-transparent 
                             outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Role
                </label>
                <select
                  value={newUser.role}
                  onChange={(e) =>
                    setNewUser({ ...newUser, role: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 sm:py-2
                             focus:ring-2 focus:ring-orange-400 focus:border-transparent 
                             outline-none transition-all bg-white cursor-pointer"
                >
                  <option value="admin">Admin - Full access</option>
                  <option value="editor">Editor - Edit content</option>
                  <option value="viewer">Viewer - View only</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700 active:bg-green-800
                             text-white py-2.5 rounded-lg transition-all duration-200
                             font-medium shadow-sm hover:shadow-md"
                >
                  Create User
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 bg-gray-200 hover:bg-gray-300 active:bg-gray-400
                             text-gray-700 py-2.5 rounded-lg transition-all duration-200
                             font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* SEARCH BAR */}
        {!loading && users.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-4">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search by username, email, or role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg
                           focus:ring-2 focus:ring-orange-400 focus:border-transparent
                           outline-none transition-all"
              />
            </div>
          </div>
        )}

        {/* USERS TABLE / CARDS */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
              <p className="mt-4 text-gray-500">Loading users...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Users className="text-gray-300 mb-3" size={48} />
              <p className="text-gray-500 font-medium">
                {searchTerm ? "No users found matching your search" : "No users found"}
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="mt-3 text-orange-500 hover:text-orange-600 text-sm font-medium"
                >
                  Clear search
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Username
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-200">
                    {filteredUsers.map((u) => (
                      <tr
                        key={u._id}
                        className="hover:bg-gray-50 transition-colors duration-150"
                      >
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-800">
                            {u.username}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-gray-600 text-sm">{u.email}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 
                            px-3 py-1.5 rounded-full 
                            text-xs font-medium capitalize
                            ${roleStyles[u.role]}`}
                          >
                            {roleIcons[u.role]}
                            {u.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => handleDeleteUser(u._id)}
                            className="inline-flex items-center justify-center
                                       text-red-500 hover:text-white hover:bg-red-500
                                       p-2 rounded-lg transition-all duration-200"
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

              {/* Mobile Card View */}
              <div className="md:hidden divide-y divide-gray-200">
                {filteredUsers.map((u) => (
                  <div
                    key={u._id}
                    className="p-4 hover:bg-gray-50 transition-colors duration-150"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-800 truncate">
                          {u.username}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1 truncate">
                          {u.email}
                        </p>
                        <div className="mt-2">
                          <span
                            className={`inline-flex items-center gap-1.5 
                            px-3 py-1 rounded-full 
                            text-xs font-medium capitalize
                            ${roleStyles[u.role]}`}
                          >
                            {roleIcons[u.role]}
                            {u.role}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteUser(u._id)}
                        className="flex-shrink-0 text-red-500 hover:text-white 
                                   hover:bg-red-500 p-2 rounded-lg 
                                   transition-all duration-200"
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

        {/* USER COUNT */}
        {!loading && filteredUsers.length > 0 && (
          <div className="text-center text-sm text-gray-500">
            Showing {filteredUsers.length} of {users.length} user
            {users.length !== 1 ? "s" : ""}
          </div>
        )}
      </div>
    </div>
  );
}