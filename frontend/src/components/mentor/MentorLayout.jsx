import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  ClipboardCheck,
  TrendingUp,
  History,
  Menu,
  X,
  LogOut,
  GraduationCap,
  ChevronRight,
} from "lucide-react";

const links = [
  {
    to: "/mentor/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    to: "/mentor/students",
    label: "My Students",
    icon: Users,
  },
  {
    to: "/mentor/attendance",
    label: "Attendance",
    icon: ClipboardCheck,
  },
  {
    to: "/mentor/progress",
    label: "Student Progress",
    icon: TrendingUp,
  },
  {
    to: "/mentor/history",
    label: "History",
    icon: History,
  },
];

export default function MentorLayout({ children, title }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#f5f7fa] text-slate-800">
      {/* Mobile header */}
      <header className="lg:hidden h-16 bg-[#062a5c] text-white flex items-center justify-between px-5 sticky top-0 z-40">
        <div>
          <div className="text-[#08c98b] font-black tracking-widest">
            ASTUMSJ
          </div>
          <div className="text-xs text-white/70">Mentor Portal</div>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="p-2 rounded-lg hover:bg-white/10"
        >
          <Menu size={22} />
        </button>
      </header>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed z-50 left-0 top-0 bottom-0 w-[270px]
          bg-[#062a5c] text-white
          transform transition-transform duration-300
          lg:translate-x-0
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="px-6 py-6 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[#08c98b] font-black tracking-[0.2em] text-lg">
                  ASTUMSJ
                </div>

                <div className="text-white font-bold mt-1">
                  Bootcamp Portal
                </div>
              </div>

              <button
                onClick={() => setOpen(false)}
                className="lg:hidden text-white/70"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Mentor profile */}
          <div className="px-5 py-5">
            <div className="bg-white/10 rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-[#08c98b] grid place-items-center font-black">
                  {(user.fullname || "M").charAt(0).toUpperCase()}
                </div>

                <div className="min-w-0">
                  <div className="font-bold truncate">
                    {user.fullname || "Mentor"}
                  </div>

                  <div className="text-xs text-white/60 truncate">
                    {user.email || "Mentor account"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="px-4 space-y-1 flex-1">
            <div className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-black px-3 py-3">
              Mentor workspace
            </div>

            {links.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `
                  flex items-center gap-3 px-4 py-3 rounded-xl
                  font-semibold text-sm transition
                  ${
                    isActive
                      ? "bg-[#08c98b] text-white shadow-lg"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  }
                  `
                }
              >
                <Icon size={18} />

                <span>{label}</span>

                <ChevronRight
                  size={15}
                  className="ml-auto opacity-50"
                />
              </NavLink>
            ))}
          </nav>

          {/* Bottom */}
          <div className="p-4 border-t border-white/10">
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:bg-red-500/20 hover:text-white transition font-semibold"
            >
              <LogOut size={18} />
              Sign out
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="lg:ml-[270px] min-h-screen">
        <main className="p-5 sm:p-7 lg:p-9 max-w-[1500px]">
          {/* Desktop title bar */}
          <div className="mb-7">
            <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold mb-2">
              <GraduationCap size={14} />
              Mentor Portal
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-[#062a5c]">
              {title}
            </h1>
          </div>

          {children}
        </main>
      </div>
    </div>
  );
}