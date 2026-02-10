import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.isActive === false) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center bg-white p-8 rounded-lg shadow-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Account Blocked
          </h2>
          <p className="text-gray-600 mb-4">
            Your account has been deactivated. Please contact the administrator.
          </p>
          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = "/login";
            }}
            className="bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  // Role-based access control
  if (allowedRoles && allowedRoles.length > 0) {
    const hasAccess = allowedRoles.includes(user.role);

    if (!hasAccess) {
      return (
        <div className="h-screen flex items-center justify-center bg-gray-100">
          <div className="text-center bg-white p-8 rounded-lg shadow-md max-w-md">
            <div className="text-red-500 text-6xl mb-4">🚫</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Access Denied
            </h2>
            <p className="text-gray-600 mb-2">
              You don't have permission to access this page.
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Your role: <span className="font-semibold">{user.role}</span>
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Required role(s):{" "}
              <span className="font-semibold">{allowedRoles.join(", ")}</span>
            </p>
            <button
              onClick={() => window.history.back()}
              className="w-full bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600"
            >
              Go Back
            </button>
          </div>
        </div>
      );
    }
  }

  return children;
};

export default ProtectedRoute;
