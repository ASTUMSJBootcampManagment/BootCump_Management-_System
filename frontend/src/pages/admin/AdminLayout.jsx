import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Layers3,
  Users,
  UserRoundCog,
  ClipboardCheck,
  TrendingUp,
  ClipboardList,
  Megaphone,
  Settings,
  Menu,
  X,
  LogOut,
  ShieldCheck,
} from "lucide-react";

const links = [
  {
    to: "/admin/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    to: "/admin/batches",
    label: "Batch Management",
    icon: Layers3,
  },
  {
    to: "/admin/applications",
    label: "Applications",
    icon: ClipboardCheck,
  },
  {
    to: "/admin/students",
    label: "Students",
    icon: Users,
  },
  {
    to: "/admin/mentors",
    label: "Mentors",
    icon: UserRoundCog,
  },
  {
    to: "/admin/attendance",
    label: "Attendance",
    icon: ClipboardCheck,
  },
  {
    to: "/admin/progress",
    label: "Progress",
    icon: TrendingUp,
  },
  {
    to: "/admin/assignments",
    label: "Assignments",
    icon: ClipboardList,
  },
  {
    to: "/admin/announcements",
    label: "Announcements",
    icon: Megaphone,
  },
  {
    to: "/admin/settings",
    label: "Settings",
    icon: Settings,
  },
];

export default function AdminLayout({ title, children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#f6f8f7] text-slate-800">
      {mobileOpen && (
        <button
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-label="Close menu"
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-[270px] flex-col bg-[#062a5c] text-white shadow-xl transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex h-[76px] items-center justify-between border-b border-white/10 px-5">
          <div>
            <div className="flex items-center gap-2">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#08c98b] text-[#062a5c]">
                <ShieldCheck size={21} />
              </div>

              <div>
                <div className="text-sm font-black tracking-wide">
                  ASTU MSJ
                </div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/50">
                  Bootcamp Admin
                </div>
              </div>
            </div>
          </div>

          <button
            className="rounded-lg p-2 hover:bg-white/10 lg:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <X size={19} />
          </button>
        </div>

        <div className="px-5 py-5">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="text-[10px] font-bold uppercase tracking-widest text-white/40">
              Administrator
            </div>

            <div className="mt-2 truncate text-sm font-black">
              {user.fullname || "System Administrator"}
            </div>

            <div className="mt-1 truncate text-xs text-white/50">
              {user.email || "Admin account"}
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-4">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition ${
                  isActive
                    ? "bg-[#08c98b] text-[#062a5c] shadow-lg shadow-emerald-950/20"
                    : "text-white/65 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-white/10 p-3">
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-white/65 transition hover:bg-red-500/15 hover:text-red-200"
          >
            <LogOut size={18} />
            Sign out
          </button>
        </div>
      </aside>

      <div className="lg:pl-[270px]">
        <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-slate-200 bg-white/95 px-4 shadow-sm backdrop-blur lg:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="rounded-xl border border-slate-200 p-2.5 text-slate-600 hover:bg-slate-50 lg:hidden"
            >
              <Menu size={20} />
            </button>

            <div>
              <h1 className="text-xl font-black text-[#062a5c]">
                {title || "Administration"}
              </h1>
              <p className="hidden text-xs font-medium text-slate-400 sm:block">
                ASTU MSJ Bootcamp Management System
              </p>
            </div>
          </div>

          <div className="hidden items-center gap-3 sm:flex">
            <div className="text-right">
              <div className="text-xs font-black text-slate-700">
                {user.fullname || "Administrator"}
              </div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Administrator
              </div>
            </div>

            <div className="grid h-10 w-10 place-items-center rounded-full bg-[#e8faf5] font-black text-[#08ad81]">
              {(user.fullname || "A").charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        <main className="min-h-[calc(100vh-76px)] p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-[1500px]">{children}</div>
        </main>
      </div>
    </div>
  );
}