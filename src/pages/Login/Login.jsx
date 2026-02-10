import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Lock, Mail, Eye, EyeOff, LogIn, AlertCircle } from "lucide-react";

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(credentials);
      navigate("/");
    } catch (err) {
      setError(err?.response?.data?.error || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* LEFT BRANDING */}
      <div className="hidden lg:flex w-1/2 bg-gray-900 text-white relative">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-500" />

        <div className="relative z-10 flex flex-col justify-center px-16">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-lg">
              <img
                src="/logo.png"
                alt="Spice Drama"
                className="w-12 h-12 rounded-lg object-cover"
              />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Spice Drama</h1>
          </div>

          <h2 className="text-4xl font-semibold leading-tight mb-4">
            Restaurant <br /> Administration Panel
          </h2>

          <p className="text-gray-200 max-w-md mb-10 text-lg">
            Securely manage orders, menu items, and operations from a single
            dashboard.
          </p>

          <div className="w-16 h-1 bg-orange-500 rounded-full mb-8" />

          <p className="text-sm text-gray-200">
            © 2025 Spice Drama • Admin Access Only
          </p>
        </div>
      </div>

      {/* RIGHT LOGIN */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="mx-auto w-14 h-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-md mb-4">
              <Lock className="text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Admin Login</h2>
            <p className="text-gray-500 text-sm">
              Sign in to manage your restaurant
            </p>
          </div>

          {error && (
            <div className="mb-6 flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* USERNAME */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Username or Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  required
                  value={credentials.username}
                  onChange={(e) =>
                    setCredentials({
                      ...credentials,
                      username: e.target.value,
                    })
                  }
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 outline-none"
                  placeholder="admin@example.com"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={credentials.password}
                  onChange={(e) =>
                    setCredentials({
                      ...credentials,
                      password: e.target.value,
                    })
                  }
                  className="w-full pl-12 pr-12 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 outline-none"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="cursor-pointer w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white py-3.5 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50"
            >
              {loading ? (
                <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <>
                  <LogIn />
                  Login
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-gray-500">
            Protected admin area • Unauthorized access is prohibited
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
