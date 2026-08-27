import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardCheck,
  Layers3,
  UserRoundCog,
  Users,
  BookOpen,
  Menu,
  X,
  LogOut,
  ShieldCheck
} from "lucide-react";

const links = [
  {
    label: "Overview",
    path: "/admin",
    icon: LayoutDashboard
  },
  {
    label: "Applications",
    path: "/admin/applications",
    icon: ClipboardCheck
  },
  {
    label: "Batches",
    path: "/admin/batches",
    icon: Layers3
  },
  {
    label: "Mentors",
    path: "/admin/mentors",
    icon: UserRoundCog
  },
  {
    label: "Students",
    path: "/admin/students",
    icon: Users
  },
  {
    label: "Content",
    path: "/admin/content",
    icon: BookOpen
  }
];

export default function AdminLayout({ children, title }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#f5f7fa] text-slate-800">

      {mobileOpen && (
        <button
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`
          fixed left-0 top-0 bottom-0 z-50
          w-[250px] bg-[#062a5c] text-white
          transform transition-transform duration-200
          lg:translate-x-0
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="h-full flex flex-col">

          <div className="px-6 py-6 border-b border-white/10">
            <div className="text-[#08c98b] font-black tracking-[0.25em] text-sm">
              ASTUMSJ
            </div>

            <div className="font-black text-lg mt-1">
              Bootcamp Management
            </div>

            <div className="text-white/45 text-xs mt-1">
              Administration Portal
            </div>

            <button
              className="lg:hidden absolute top-5 right-5 text-white/70"
              onClick={() => setMobileOpen(false)}
            >
              <X size={20} />
            </button>
          </div>

          <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
            {links.map((link) => {
              const Icon = link.icon;

              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  end={link.path === "/admin"}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `
                    flex items-center gap-3 px-4 py-3 rounded-xl
                    text-sm font-bold transition
                    ${
                      isActive
                        ? "bg-[#08c98b] text-white shadow-lg shadow-emerald-900/20"
                        : "text-white/65 hover:text-white hover:bg-white/10"
                    }
                    `
                  }
                >
                  <Icon size={18} />
                  <span>{link.label}</span>
                </NavLink>
              );
            })}
          </nav>

          <div className="p-4 border-t border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#08c98b] grid place-items-center font-black">
                {(user.fullname || "A").charAt(0).toUpperCase()}
              </div>

              <div className="min-w-0">
                <p className="font-bold text-sm truncate">
                  {user.fullname || "Administrator"}
                </p>

                <p className="text-xs text-white/40 truncate">
                  Administrator
                </p>
              </div>
            </div>

            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-white/60 hover:text-white hover:bg-white/10"
            >
              <LogOut size={17} />
              Sign out
            </button>
          </div>
        </div>
      </aside>

      <div className="lg:ml-[250px] min-h-screen">

        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200">
          <div className="px-5 sm:px-8 h-[76px] flex items-center gap-4">

            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden w-10 h-10 rounded-xl border border-slate-200 grid place-items-center"
            >
              <Menu size={19} />
            </button>

            <div className="flex-1">
              <p className="text-xs uppercase tracking-[0.18em] font-black text-[#08ad81]">
                Administration
              </p>

              <h1 className="text-xl sm:text-2xl font-black text-[#062a5c]">
                {title}
              </h1>
            </div>

            <div className="hidden sm:flex w-10 h-10 rounded-xl bg-[#e8faf5] text-[#08ad81] items-center justify-center">
              <ShieldCheck size={19} />
            </div>
          </div>
        </header>

        <main className="p-5 sm:p-8 max-w-[1500px] mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}