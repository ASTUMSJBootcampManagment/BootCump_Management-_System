import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage"
import Login from "./pages/Login";
import Register from "./pages/Register";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Attendance from "./pages/mentor/Attendance";
import History from "./pages/mentor/History";
import Progress from "./pages/mentor/Progress";
import AdminDashboard from "./pages/AdminDashbord";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminDashboard />} />

        
        <Route path="/student" element={<AppRoutes />} />
        <Route path="/register" element={<Register />} />
        <Route element={<ProtectedRoute allowedRoles={["Mentor"]} />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/mentor/attendance" element={<Attendance />} />
          <Route path="/mentor/history" element={<History />} />
          <Route path="/mentor/progress" element={<Progress />} />
        </Route>
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
import Sidebar from "./components/Sidebar/Sidebar"

function App() {
  return (
    <div>
      <Sidebar />
      <main className="ml-[230px] min-h-screen bg-[#f8fafc] p-8">
        <h1 className="text-3xl font-bold text-[#102a56]">
          Dashboard
        </h1>
        <p className="mt-2 text-gray-500">
          Welcome to the ASTUMSJ Bootcamp Management System.
        </p>
      </main>
    </div>
  )
}

export default App
