import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children, role }) {
  const location = useLocation();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  // Check authentication status
  if (!token || !user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }

  // Handle Role-based route authorization
  if (role && user.role !== role) {
    if (user.role === "Admin") {
      return <Navigate to="/admin" replace />;
    }

    if (user.role === "Mentor") {
      return <Navigate to="/mentor" replace />;
    }

    if (user.role === "Student") {
      return <Navigate to="/student/dashboard" replace />;
    }

    return <Navigate to="/login" replace />;
  }

  // Handle temporary password requirement redirect
  if (
    user.mustChangePassword === true &&
    location.pathname !== "/change-password"
  ) {
    return <Navigate to="/change-password" replace />;
  }

  return children;
}