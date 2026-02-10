import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, ShoppingBag, LogOut, Plus, List, Users } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  // Redirect viewer to orders only if on root path
  useEffect(() => {
    if (user?.role === "viewer" && location.pathname === "/") {
      navigate("/orders", { replace: true });
    }
  }, [user, navigate, location.pathname]);

  return (
    <div className="h-screen w-full overflow-hidden bg-gray-50 flex">
      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed lg:static z-40
          h-full
          bg-gradient-to-b from-orange-600 to-red-700 text-white
          transition-all duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          w-64
          flex flex-col
        `}
      >
        {/* SIDEBAR HEADER */}
        <div className="p-4 flex items-center justify-between border-b border-orange-500">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-white rounded-lg overflow-hidden">
              <img
                src="/logo.png"
                alt="Spice Drama"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="font-bold text-lg">Spice Drama</h1>
              <p className="text-xs text-orange-200">Admin Panel</p>
            </div>
          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 hover:bg-orange-500 rounded-lg lg:hidden"
          >
            <X />
          </button>
        </div>

        {/* NAV */}
        <nav className="flex-1 p-4 space-y-2">
          {["admin", "editor"].includes(user?.role) && (
            <NavLink
              to="/add"
              className={({ isActive }) =>
                `flex items-center gap-3 p-3 rounded-lg transition ${
                  isActive
                    ? "bg-white text-orange-600 shadow"
                    : "hover:bg-orange-500"
                }`
              }
              onClick={() => setSidebarOpen(false)}
            >
              <Plus size={20} />
              Add Items
            </NavLink>
          )}

          {["admin", "editor"].includes(user?.role) && (
            <NavLink
              to="/list"
              className={({ isActive }) =>
                `flex items-center gap-3 p-3 rounded-lg transition ${
                  isActive
                    ? "bg-white text-orange-600 shadow"
                    : "hover:bg-orange-500"
                }`
              }
              onClick={() => setSidebarOpen(false)}
            >
              <List size={20} />
              List Items
            </NavLink>
          )}

          <NavLink
            to="/orders"
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-lg transition ${
                isActive
                  ? "bg-white text-orange-600 shadow"
                  : "hover:bg-orange-500"
              }`
            }
            onClick={() => setSidebarOpen(false)}
          >
            <ShoppingBag size={20} />
            Orders
          </NavLink>

          {user?.role === "admin" && (
            <NavLink
              to="/users"
              className={({ isActive }) =>
                `flex items-center gap-3 p-3 rounded-lg transition ${
                  isActive
                    ? "bg-white text-orange-600 shadow"
                    : "hover:bg-orange-500"
                }`
              }
              onClick={() => setSidebarOpen(false)}
            >
              <Users size={20} />
              Manage Users
            </NavLink>
          )}
        </nav>

        {/* FOOTER */}
        <div className="p-4 border-t border-orange-500">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 p-3 hover:bg-orange-500 rounded-lg cursor-pointer transition-all duration-300"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* TOP BAR */}
        <header className="bg-white border-b shadow z-20">
          <div className="h-16 px-4 sm:px-6 flex items-center justify-between">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-lg lg:hidden"
            >
              <Menu />
            </button>

            {/* Profile */}
            <div className="flex items-center gap-3 ml-auto">
              <div className="hidden sm:flex flex-col text-right leading-tight">
                <span className="text-sm font-semibold text-gray-800">
                  {user?.username || "Admin"}
                </span>
                <span className="text-xs text-gray-500 capitalize">
                  {user?.role || "admin"}
                </span>
              </div>

              <div className="w-9 h-9 rounded-full bg-gray-100 border flex items-center justify-center overflow-hidden">
                <img
                  src="/profile.png"
                  alt="profile"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 min-w-0 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
