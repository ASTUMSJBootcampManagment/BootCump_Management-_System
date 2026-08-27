import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
  useNavigate,
} from "react-router-dom";

// Public / Shared Pages
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Protection & Layouts
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./components/layout/DashbordLayout";
import AdminLayout from "./layouts/adminlayouts";

// Admin Pages
import AdminDashboard from "./pages/AdminDashbord";
import UserManagement from "./pages/admin/UserManagement";
import BatchManagement from "./pages/admin/BatchManagement";
import Announcements from "./pages/admin/Announcements";

// Mentor Pages
import Dashboard from "./pages/mentor/Dashboard";
import Attendance from "./pages/mentor/Attendance";
import History from "./pages/mentor/History";
import Progress from "./pages/mentor/Progress";
import Students from "./pages/mentor/Students";

// Student Pages
import StudentDashboard
  from "./pages/student/StudentDashboard";

import StudentAttendance
  from "./pages/student/StudentAttendance";

import StudentProgress
  from "./pages/student/StudentProgress";

import StudentAssignments
  from "./pages/student/StudentAssignments";

import StudentAnnouncements
  from "./pages/student/StudentAnnouncements";

import StudentResources
  from "./pages/student/StudentResources";

import StudentProfile
  from "./pages/student/StudentProfile";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={["Admin"]} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="batches" element={<BatchManagement />} />
            <Route path="announcements" element={<Announcements />} />
          </Route>
        </Route>

        {/* Protected Mentor Routes */}
        <Route element={<ProtectedRoute allowedRoles={["Mentor"]} />}>
          <Route path="/mentor/dashboard" element={<Dashboard />} />
          <Route path="/mentor/students" element={<Students />} />
          <Route path="/mentor/attendance" element={<Attendance />} />
          <Route path="/mentor/history" element={<History />} />
          <Route path="/mentor/progress" element={<Progress />} />
        </Route>

        {/* Protected Student Routes */}
        <Route
          element={
            <ProtectedRoute
              allowedRoles={["Student"]}
            />
          }
        >
          <Route
            path="/student"
            element={
              <Navigate
                to="/student/dashboard"
                replace
              />
            }
          />

          <Route
            path="/student/dashboard"
            element={<StudentDashboard />}
          />

          <Route
            path="/student/attendance"
            element={<StudentAttendance />}
          />

          <Route
            path="/student/progress"
            element={<StudentProgress />}
          />

          <Route
            path="/student/assignments"
            element={<StudentAssignments />}
          />

          {/* Keep old route working */}
          <Route
            path="/student/assignment"
            element={
              <Navigate
                to="/student/assignments"
                replace
              />
            }
          />

          <Route
            path="/student/announcements"
            element={<StudentAnnouncements />}
          />

          <Route
            path="/student/resources"
            element={<StudentResources />}
          />

          <Route
            path="/student/profile"
            element={<StudentProfile />}
          />
        </Route>

        {/* Access Denied Route */}
        <Route
          path="/unauthorized"
          element={
            <div className="flex min-h-screen items-center justify-center bg-slate-50">
              <div className="text-center">
                <h1 className="text-3xl font-bold text-red-600">
                  Access Denied
                </h1>
                <p className="mt-2 text-gray-600">
                  You don't have permission to access this page
                </p>
              </div>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
