import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  CalendarCheck, 
  TrendingUp, 
  BookOpen, 
  Bell, 
  FileText, 
  UserCheck, 
  Globe, 
  LogOut, 
  Search 
} from "lucide-react";

export default function DashboardLayout({ children, role = "student" }) {
  const navigate = useNavigate();
  const location = useLocation();

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : { name: "Fatima Zahra", role: "Student" };

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const navItems = [
    { label: "My Dashboard", path: "/student/dashboard", icon: LayoutDashboard },
    { label: "My Attendance", path: "/student/attendance", icon: CalendarCheck },
    { label: "Topic Progress", path: "/student/progress", icon: TrendingUp },
    { label: "My Assignments", path: "/student/assignments", icon: BookOpen },
    { label: "Announcements", path: "/student/announcements", icon: Bell },
    { label: "Resources & Guides", path: "/student/resources", icon: FileText },
    { label: "My Profile & Badges", path: "/student/profile", icon: UserCheck },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* Sidebar */}
      <aside className="w-64 bg-[#071325] text-white flex flex-col justify-between p-4 shrink-0">
        <div>
          <div className="flex items-center gap-2 px-3 py-4 text-emerald-400 font-extrabold tracking-wider text-sm">
            <div className="h-6 w-6 rounded-full border-2 border-emerald-400 flex items-center justify-center text-[10px]">
              MSJ
            </div>
            BOOTCAMP
          </div>

          <div className="flex items-center gap-3 p-3 my-2 rounded-xl bg-slate-800/40 border border-slate-700/50">
            <div className="h-9 w-9 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs border border-emerald-500/30">
              FZ
            </div>
            <div className="overflow-hidden">
              <h4 className="text-xs font-bold text-slate-100 truncate">{user.name}</h4>
              <span className="text-[10px] font-semibold tracking-wider text-emerald-400 uppercase">
                {user.role || role}
              </span>
            </div>
          </div>

          <nav className="mt-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                    isActive
                      ? "bg-emerald-500 text-slate-950 shadow-md font-bold"
                      : "text-slate-400 hover:bg-slate-800/60 hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="space-y-3 pt-4 border-t border-slate-800">
          <div className="rounded-xl bg-slate-900/80 p-3 border border-slate-800/80">
            <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Bootcamp Status</p>
            <div className="flex items-center justify-between mt-1">
              <span className="text-xs font-bold text-slate-200">Summer 2026 B...</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-semibold px-2 py-0.5 rounded-full border border-emerald-500/30">
                Active
              </span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-emerald-500 h-full w-1/2"></div>
            </div>
          </div>

          <Link to="/" className="flex items-center gap-2 px-3 py-2 text-xs text-slate-400 hover:text-white transition">
            <Globe className="h-4 w-4" />
            Public Website
          </Link>

          <button
            onClick={handleSignOut}
            className="flex w-full items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 rounded-xl transition"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-slate-200 bg-white px-6 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900">
              {location.pathname.includes("attendance") && "My Attendance Transcript"}
              {location.pathname.includes("progress") && "Curriculum Progress & Topics"}
              {location.pathname.includes("assignments") && "My Assignments & Projects"}
              {(location.pathname.includes("dashboard") || location.pathname === "/student") && "My Academic Dashboard"}
            </h2>
            <span className="text-slate-300">|</span>
            <span className="text-xs text-slate-400 font-medium">Student Portal</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search portal..."
                className="w-64 rounded-full bg-slate-100 pl-9 pr-4 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
            </div>

            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-600 border border-emerald-200">
              Student
            </span>

            <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-emerald-500"></span>
            </button>

            <div className="flex items-center gap-2 border-l border-slate-200 pl-4">
              <div className="h-8 w-8 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
                FZ
              </div>
              <span className="text-xs font-bold text-slate-800">{user.name}</span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}