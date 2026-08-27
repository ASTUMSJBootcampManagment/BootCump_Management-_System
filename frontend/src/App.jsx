import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import Login from "./pages/login";
import Register from "./pages/register";
import ChangePassword from "./pages/ChangePassword";

import ProtectedRoute from "./components/ProtectedRoute";

import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/AdminDashbord";

import Applications from "./pages/admin/Applications";
import UserManagement from "./pages/admin/UserManagement";
import Students from "./pages/admin/Students";
import Mentors from "./pages/admin/Mentors";
import BatchManagement from "./pages/admin/BatchManagement";
import Attendance from "./pages/admin/Attendance";
import Progress from "./pages/admin/Progress";
import Assignments from "./pages/admin/Assignments";
import Announcements from "./pages/admin/Announcements";
import Settings from "./pages/admin/Settings";

// Student
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentAttendance from "./pages/student/StudentAttendance";
import StudentProgress from "./pages/student/StudentProgress";
import StudentAssignments from "./pages/student/StudentAssignments";
import StudentAnnouncements from "./pages/student/StudentAnnouncements";
import StudentResources from "./pages/student/StudentResources";
import StudentProfile from "./pages/student/StudentProfile";

// Mentor
import MentorDashboard from "./pages/mentor/Dashboard";
import MentorAttendance from "./pages/mentor/Attendance";
import MentorHistory from "./pages/mentor/History";
import MentorProgress from "./pages/mentor/Progress";
import MentorStudents from "./pages/mentor/Students";
import MentorAssignments from "./pages/mentor/Assignments";
import MentorAnnouncements from "./pages/mentor/Announcements";
import MentorResources from "./pages/mentor/Resources";

function Unauthorized() {
  return (
    <div className="min-h-screen bg-[#f7f4ea] grid place-items-center p-5">
      <div className="bg-white rounded-3xl shadow-xl p-10 text-center max-w-md">
        <div className="text-[#08c98b] font-black tracking-widest">
          ASTU MSJ BOOTCAMP
        </div>

        <h1 className="text-3xl font-black text-[#062a5c] mt-4">
          Access denied
        </h1>

        <p className="text-slate-500 mt-3">
          You do not have permission to access this page.
        </p>

        <a
          href="/"
          className="inline-block mt-6 px-5 py-3 rounded-xl bg-[#062a5c] text-white font-bold"
        >
          Back to website
        </a>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC */}

        <Route
          path="/"
          element={<LandingPage />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/change-password"
          element={<ChangePassword />}
        />

        {/* ADMIN */}

        <Route
          element={
            <ProtectedRoute
              allowedRoles={["Admin"]}
            />
          }
        >
          <Route
            element={<AdminLayout />}
          >

            <Route
              path="/admin"
              element={
                <Navigate
                  to="/admin/dashboard"
                  replace
                />
              }
            />

            <Route
              path="/admin/dashboard"
              element={<AdminDashboard />}
            />

            <Route
              path="/admin/applications"
              element={<Applications />}
            />

            <Route
              path="/admin/users"
              element={<UserManagement />}
            />

            <Route
              path="/admin/students"
              element={<Students />}
            />

            <Route
              path="/admin/mentors"
              element={<Mentors />}
            />

            <Route
              path="/admin/batches"
              element={<BatchManagement />}
            />

            <Route
              path="/admin/attendance"
              element={<Attendance />}
            />

            <Route
              path="/admin/progress"
              element={<Progress />}
            />

            <Route
              path="/admin/assignments"
              element={<Assignments />}
            />

            <Route
              path="/admin/announcements"
              element={<Announcements />}
            />

            <Route
              path="/admin/settings"
              element={<Settings />}
            />

          </Route>
        </Route>

        {/* STUDENT */}

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

        {/* MENTOR */}

        <Route
          element={
            <ProtectedRoute
              allowedRoles={["Mentor"]}
            />
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
            path="/mentor/students"
            element={<MentorStudents />}
          />

          <Route
            path="/mentor/attendance"
            element={<MentorAttendance />}
          />

          <Route
            path="/mentor/progress"
            element={<MentorProgress />}
          />

          <Route
            path="/mentor/assignments"
            element={<MentorAssignments />}
          />

          <Route
            path="/mentor/announcements"
            element={<MentorAnnouncements />}
          />

          <Route
            path="/mentor/resources"
            element={<MentorResources />}
          />

          <Route
            path="/mentor/history"
            element={<MentorHistory />}
          />
        </Route>

        <Route
          path="/unauthorized"
          element={<Unauthorized />}
        />

        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />

      </Routes>
    </BrowserRouter>
  );
}