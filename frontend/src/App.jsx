import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ChangePassword from "./pages/ChangePassword";
import ProtectedRoute from "./components/ProtectedRoute";

/* Student */
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentAttendance from "./pages/student/StudentAttendance";
import StudentProgress from "./pages/student/StudentProgress";
import StudentAssignments from "./pages/student/StudentAssignments";
import StudentAnnouncements from "./pages/student/StudentAnnouncements";
import StudentResources from "./pages/student/StudentResources";
import StudentProfile from "./pages/student/StudentProfile";

/* Admin */
import AdminDashboard from "./pages/AdminDashbord";

/* Mentor */
import MentorDashboard from "./pages/mentor/Dashboard";
import MentorAttendance from "./pages/mentor/Attendance";
import MentorHistory from "./pages/mentor/History";
import MentorProgress from "./pages/mentor/Progress";
import MentorStudents from "./pages/mentor/Students";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/change-password"
          element={<ChangePassword />}
        />

        {/* Student */}
        <Route
          element={
            <ProtectedRoute allowedRoles={["Student"]} />
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

        {/* Admin */}
        <Route
          element={
            <ProtectedRoute allowedRoles={["Admin"]} />
          }
        >
          <Route
            path="/admin"
            element={<AdminDashboard />}
          />

          <Route
            path="/admin/dashboard"
            element={<AdminDashboard />}
          />
        </Route>

        {/* Mentor */}
        <Route
          element={
            <ProtectedRoute allowedRoles={["Mentor"]} />
          }
        >
          <Route
            path="/mentor"
            element={
              <Navigate
                to="/mentor/dashboard"
                replace
              />
            }
          />

          <Route
            path="/mentor/dashboard"
            element={<MentorDashboard />}
          />

          <Route
            path="/mentor/attendance"
            element={<MentorAttendance />}
          />

          <Route
            path="/mentor/history"
            element={<MentorHistory />}
          />

          <Route
            path="/mentor/progress"
            element={<MentorProgress />}
          />

          <Route
            path="/mentor/students"
            element={<MentorStudents />}
          />
        </Route>

        <Route
          path="/unauthorized"
          element={
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <div className="text-5xl font-black text-[#062a5c]">
                  403
                </div>

                <p className="text-slate-500 mt-2">
                  You do not have permission to access this page.
                </p>

                <a
                  href="/"
                  className="inline-block mt-5 bg-[#08c98b] text-white rounded-xl px-5 py-3 font-bold"
                >
                  Go home
                </a>
              </div>
            </div>
          }
        />

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;