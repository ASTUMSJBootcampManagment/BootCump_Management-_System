import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  TrendingUp,
  ClipboardList,
  Megaphone,
  BookOpen,
  History,
  Menu,
  LogOut,
  ChevronRight,
} from "lucide-react";

import astumsjLogo from "../../assets/astumsj-logo.png";

const links = [
  {
    label: "Dashboard",
    path: "/mentor/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "My Students",
    path: "/mentor/students",
    icon: Users,
  },
  {
    label: "Attendance",
    path: "/mentor/attendance",
    icon: CalendarCheck,
  },
  {
    label: "Progress",
    path: "/mentor/progress",
    icon: TrendingUp,
  },
  {
    label: "Assignments",
    path: "/mentor/assignments",
    icon: ClipboardList,
  },
  {
    label: "Announcements",
    path: "/mentor/announcements",
    icon: Megaphone,
  },
  {
    label: "Resources",
    path: "/mentor/resources",
    icon: BookOpen,
  },
  {
    label: "History",
    path: "/mentor/history",
    icon: History,
  },
];

export default function MentorLayout({ children, title = "Mentor Portal" }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  const Sidebar = () => (
    <aside className="h-full flex flex-col bg-[#062a5c] text-white">
      <div className="px-6 py-6 border-b border-white/10 flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-white p-1 grid place-items-center overflow-hidden shrink-0">
          <img
            src={astumsjLogo}
            alt="ASTU MSJ Logo"
            className="w-full h-full object-contain"
          />
        </div>

        <div className="min-w-0">
          <div className="text-[#08c98b] font-black tracking-[0.22em] text-xs">
            ASTU MSJ
          </div>

          <div className="text-sm font-black truncate">Bootcamp</div>

          <div className="text-[10px] text-white/50 mt-0.5 truncate">
            Mentor Portal
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {links.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              [
                "group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition",
                isActive
                  ? "bg-[#08c98b] text-white shadow-lg shadow-emerald-950/20"
                  : "text-white/65 hover:bg-white/10 hover:text-white",
              ].join(" ")
            }
          >
            <Icon size={18} />
            <span>{label}</span>
            <ChevronRight
              size={14}
              className="ml-auto opacity-0 group-hover:opacity-100"
            />
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-white/10">
        <div className="rounded-xl bg-white/5 p-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white p-1 grid place-items-center overflow-hidden shrink-0">
              <img
                src={astumsjLogo}
                alt="ASTU MSJ Logo"
                className="w-full h-full object-contain"
              />
            </div>

            <div className="min-w-0">
              <div className="font-bold text-sm truncate">
                {user.fullname || "Mentor"}
              </div>

              <div className="text-[11px] text-white/45 truncate">
                {user.email || ""}
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-white/60 hover:bg-red-500/10 hover:text-red-300 transition"
        >
          <LogOut size={17} />
          Sign out
        </button>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-[#f5f7fa] text-slate-800">
      <div className="hidden lg:block fixed inset-y-0 left-0 w-72 z-40">
        <Sidebar />
      </div>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        >
          <div className="w-72.5 h-full" onClick={(e) => e.stopPropagation()}>
            <Sidebar />
          </div>
        </div>
      )}

      <div className="lg:pl-72 min-h-screen">
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200">
          <div className="px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden w-10 h-10 rounded-xl border border-slate-200 grid place-items-center"
              >
                <Menu size={20} />
              </button>

              <div>
                <div className="text-xs uppercase tracking-[0.18em] font-black text-[#08ad81]">
                  Mentor workspace
                </div>

                <h1 className="text-xl sm:text-2xl font-black text-[#062a5c]">
                  {title}
                </h1>
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8 max-w-375">{children}</main>
      </div>
    </div>
  );
}
