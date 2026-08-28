import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  TrendingUp,
  CalendarCheck2,
  ClipboardList,
  Megaphone,
  BookOpen,
  User,
  LogOut,
  Menu,
  X,
} from "lucide-react";

import astumsjLogo from "../../assets/astumsj-logo.png";

const links = [
  {
    to: "/student/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    to: "/student/progress",
    label: "My Progress",
    icon: TrendingUp,
  },
  {
    to: "/student/attendance",
    label: "Attendance",
    icon: CalendarCheck2,
  },
  {
    to: "/student/assignments",
    label: "Assignments",
    icon: ClipboardList,
  },
  {
    to: "/student/announcements",
    label: "Announcements",
    icon: Megaphone,
  },
  {
    to: "/student/resources",
    label: "Resources",
    icon: BookOpen,
  },
  {
    to: "/student/profile",
    label: "My Profile",
    icon: User,
  },
];

function getUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "{}");
  } catch {
    return {};
  }
}

export default function StudentLayout({ title, children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const user = getUser();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("requiresPasswordChange");
    navigate("/login");
  };

  const sidebar = (
    <aside className="h-full flex flex-col bg-[#062a5c] text-white">
      <div className="px-6 py-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-white p-1 grid place-items-center overflow-hidden shrink-0">
            <img
              src={astumsjLogo}
              alt="ASTU MSJ Logo"
              className="w-full h-full object-contain"
            />
          </div>

          <div className="min-w-0">
            <div className="font-black tracking-wider text-[#08c98b]">
              ASTUMSJ
            </div>
            <div className="text-xs text-white/60 truncate">
              Bootcamp Portal
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-5 flex-1 overflow-y-auto">
        <div className="px-3 mb-3 text-[10px] uppercase tracking-widest text-white/40 font-black">
          Student Menu
        </div>

        <nav className="space-y-1">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold transition ${
                  isActive
                    ? "bg-[#08c98b] text-white shadow-lg"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-4 border-t border-white/10">
        <div className="rounded-2xl bg-white/5 border border-white/10 p-4 flex items-center justify-between gap-2">
          <div className="w-9 h-9 rounded-full bg-white p-1 grid place-items-center overflow-hidden shrink-0">
            <img
              src={astumsjLogo}
              alt="ASTU MSJ Logo"
              className="w-full h-full object-contain"
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="font-bold truncate text-sm">
              {user.fullname || "Student"}
            </div>

            <div className="text-xs text-white/50 truncate mt-0.5">
              {user.email || ""}
            </div>
          </div>

          <button
            onClick={logout}
            title="Sign out"
            className="p-2.5 rounded-xl text-white/70 hover:bg-red-500/20 hover:text-red-200 transition shrink-0"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-[#f5f7fa] text-slate-800">
      {/* Desktop sidebar */}
      <div className="hidden lg:block fixed inset-y-0 left-0 w-63.75">
        {sidebar}
      </div>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />

          <div className="relative w-67.5 h-full">
            {sidebar}

            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-5 -right-11.25 w-9 h-9 rounded-lg bg-white text-slate-700 grid place-items-center shadow"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Main */}
      <div className="lg:ml-63.75 min-h-screen">
        <header className="sticky top-0 z-30 h-18 bg-white border-b border-slate-200 flex items-center justify-between px-5 sm:px-8">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden w-10 h-10 rounded-xl border border-slate-200 grid place-items-center"
              onClick={() => setMobileOpen(true)}
            >
              <Menu size={20} />
            </button>

            <div>
              <div className="text-xs uppercase tracking-wider text-slate-400 font-bold">
                Student Portal
              </div>
              <h1 className="font-black text-[#062a5c] text-lg">
                {title}
              </h1>
            </div>
          </div>
        </header>

        <main className="p-5 sm:p-8 max-w-375 mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}