import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";

import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashbord";

// Layout (Fixed file name typo matching your directory)
import DashboardLayout from "./components/layout/DashbordLayout";

// Mentor pages
import Attendance from "./pages/mentor/Attendance";
import History from "./pages/mentor/History";
import Progress from "./pages/mentor/Progress";

// Student pages
import StudentDashboard from "./pages/student/StudentDashbord";
import StudentAttendnce from "./pages/student/StudentAttendnce";
import StudentProgress from "./pages/student/StudentProgress";
import StudentAssignment from "./pages/student/StudentAssignment";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* =========================
            PUBLIC PAGES
        ========================== */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* =========================
            ADMIN
        ========================== */}
        <Route path="/admin" element={<AdminDashboard />} />

        {/* =========================
            MENTOR
        ========================== */}
        <Route element={<ProtectedRoute allowedRoles={["Mentor"]} />}>
          <Route
            path="/dashboard"
            element={
              <DashboardLayout role="mentor">
                <Dashboard />
              </DashboardLayout>
            }
          />
          <Route
            path="/mentor/attendance"
            element={
              <DashboardLayout role="mentor">
                <Attendance />
              </DashboardLayout>
            }
          />
          <Route
            path="/mentor/history"
            element={
              <DashboardLayout role="mentor">
                <History />
              </DashboardLayout>
            }
          />
          <Route
            path="/mentor/progress"
            element={
              <DashboardLayout role="mentor">
                <Progress />
              </DashboardLayout>
            }
          />
        </Route>

        {/* =========================
            STUDENT
        ========================== */}
        <Route element={<ProtectedRoute allowedRoles={["Student"]} />}>
          <Route
            path="/student/dashboard"
            element={
              <DashboardLayout role="student">
                <StudentDashboard />
              </DashboardLayout>
            }
          />
          <Route
            path="/student/attendance"
            element={
              <DashboardLayout role="student">
                <StudentAttendnce />
              </DashboardLayout>
            }
          />
          <Route
            path="/student/progress"
            element={
              <DashboardLayout role="student">
                <StudentProgress />
              </DashboardLayout>
            }
          />
          <Route
            path="/student/assignments"
            element={
              <DashboardLayout role="student">
                <StudentAssignment />
              </DashboardLayout>
            }
          />
        </Route>

        {/* =========================
            UNAUTHORIZED
        ========================== */}
        <Route
          path="/unauthorized"
          element={
            <div className="flex min-h-screen items-center justify-center bg-slate-50">
              <div className="text-center">
                <h1 className="text-3xl font-bold text-red-600">Access Denied</h1>
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