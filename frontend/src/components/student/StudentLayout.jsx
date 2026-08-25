import { useEffect, useState } from "react";

import {
  NavLink,
  useNavigate,
} from "react-router-dom";

import {
  LayoutDashboard,
  CalendarCheck2,
  TrendingUp,
  ClipboardList,
  Megaphone,
  BookOpen,
  UserRound,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
} from "lucide-react";

import {
  STUDENT_PORTAL_CONFIG,
} from "./studentConfig";

const navigation = [
  {
    label: "My Dashboard",
    to: "/student/dashboard",
    icon: LayoutDashboard,
  },

  {
    label: "My Attendance",
    to: "/student/attendance",
    icon: CalendarCheck2,
  },

  {
    label: "Topic Progress",
    to: "/student/progress",
    icon: TrendingUp,
  },

  {
    label: "My Assignments",
    to: "/student/assignments",
    icon: ClipboardList,
  },

  {
    label: "Announcements",
    to: "/student/announcements",
    icon: Megaphone,
  },

  {
    label: "Resources & Guides",
    to: "/student/resources",
    icon: BookOpen,
  },

  {
    label: "My Profile",
    to: "/student/profile",
    icon: UserRound,
  },
];

export default function StudentLayout({
  children,
  title,
}) {
  const navigate = useNavigate();

  const [mobileMenu, setMobileMenu] =
    useState(false);

  const [user, setUser] = useState(() =>
    JSON.parse(
      localStorage.getItem("user") || "null"
    )
  );

  useEffect(() => {
    const updateUser = () => {
      setUser(
        JSON.parse(
          localStorage.getItem("user") ||
            "null"
        )
      );
    };

    window.addEventListener(
      "student-user-updated",
      updateUser
    );

    return () =>
      window.removeEventListener(
        "student-user-updated",
        updateUser
      );
  }, []);

  const name =
    user?.fullname ||
    user?.name ||
    "Student";

  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#f5f7fa] text-[#10213a]">

      {mobileMenu && (
        <button
          className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden"
          onClick={() => setMobileMenu(false)}
          aria-label="Close menu"
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          flex w-[234px] flex-col
          bg-[#061a31] text-white
          transition-transform
          lg:translate-x-0
          ${
            mobileMenu
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >

        {/* BRAND */}

        <div className="flex h-[74px] items-center border-b border-white/5 px-5">

          <div className="mr-3 grid h-9 w-9 place-items-center rounded-xl bg-[#08c98b] font-black">
            A
          </div>

          <div>
            <div className="text-[11px] font-black tracking-[.18em] text-[#08c98b]">
              ASTUMSJ
            </div>

            <div className="text-[11px] font-semibold text-white/50">
              BOOTCAMP
            </div>
          </div>

          <button
            className="ml-auto lg:hidden"
            onClick={() =>
              setMobileMenu(false)
            }
          >
            <X size={20} />
          </button>
        </div>

        {/* STUDENT */}

        <div className="border-b border-white/5 px-4 py-4">

          <div className="flex items-center gap-3">

            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#0e8b6b] text-xs font-black">
              {initials}
            </div>

            <div className="min-w-0">

              <div className="truncate text-sm font-bold">
                {name}
              </div>

              <div className="text-[10px] font-black uppercase tracking-wider text-[#08c98b]">
                Student
              </div>

            </div>

          </div>

        </div>

        {/* NAVIGATION */}

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">

          {navigation.map(
            ({
              label,
              to,
              icon: Icon,
            }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() =>
                  setMobileMenu(false)
                }
                className={({ isActive }) =>
                  `
                  flex items-center gap-3
                  rounded-xl px-3 py-2.5
                  text-[12px] font-bold
                  transition

                  ${
                    isActive
                      ? "bg-[#08c98b] text-white shadow-lg shadow-[#08c98b]/20"
                      : "text-white/65 hover:bg-white/5 hover:text-white"
                  }
                  `
                }
              >
                <Icon size={17} />
                {label}
              </NavLink>
            )
          )}

        </nav>

        {/* FOOTER */}

        <div className="border-t border-white/5 p-3">

          <div className="mb-3 rounded-xl bg-white/[.045] p-3">

            <div className="mb-1 text-[9px] font-black uppercase tracking-widest text-white/40">
              Bootcamp status
            </div>

            <div className="flex items-center justify-between gap-2 text-[11px] font-bold">

              <span className="truncate">
                {
                  STUDENT_PORTAL_CONFIG.bootcampLabel
                }
              </span>

              <span className="text-[#08c98b]">
                Active
              </span>

            </div>

          </div>

          <button
            onClick={() => navigate("/")}
            className="mb-1 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs font-bold text-white/55 hover:bg-white/5 hover:text-white"
          >
            <BookOpen size={16} />
            Public Website
          </button>

          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs font-bold text-rose-300 hover:bg-rose-400/10"
          >
            <LogOut size={16} />
            Sign Out
          </button>

        </div>

      </aside>

      {/* CONTENT */}

      <div className="lg:pl-[234px]">

        <header className="sticky top-0 z-30 flex h-[66px] items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-7">

          <div className="flex min-w-0 items-center gap-3">

            <button
              onClick={() =>
                setMobileMenu(true)
              }
              className="rounded-lg p-2 text-slate-600 lg:hidden"
            >
              <Menu size={20} />
            </button>

            <h1 className="truncate text-[17px] font-black sm:text-[18px]">
              {title}
            </h1>

            <span className="hidden h-5 w-px bg-slate-200 sm:block" />

            <span className="hidden text-xs font-semibold text-slate-400 sm:block">
              Student Portal
            </span>

          </div>

          <div className="flex items-center gap-2 sm:gap-4">

            <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 md:flex">
              <Search
                size={15}
                className="text-slate-400"
              />

              <span className="text-xs text-slate-400">
                Search portal...
              </span>
            </div>

            <span className="hidden rounded-full border border-[#9ce8ce] bg-[#edfff8] px-3 py-1.5 text-[11px] font-black text-[#059669] sm:block">
              Student
            </span>

            <button className="relative grid h-9 w-9 place-items-center rounded-full border border-slate-200 bg-white">
              <Bell size={16} />

              <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-[#08c98b]" />
            </button>

            <button
              onClick={() =>
                navigate("/student/profile")
              }
              className="flex items-center gap-2"
            >
              <div className="grid h-9 w-9 place-items-center rounded-full bg-[#0b294a] text-[10px] font-black text-white">
                {initials}
              </div>

              <span className="hidden text-xs font-bold sm:block">
                {name}
              </span>
            </button>

          </div>

        </header>

        <main className="p-4 sm:p-6 lg:p-7">
          {children}
        </main>

      </div>

    </div>
  );
}