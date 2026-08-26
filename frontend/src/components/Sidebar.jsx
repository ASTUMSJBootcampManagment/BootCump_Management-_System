import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  ClipboardCheck,
  History,
  BarChart3,
  ClipboardList,
  Megaphone,
  LogOut,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

export default function MentorSidebar() {
  const navigate = useNavigate();

  const [attendanceOpen, setAttendanceOpen] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  const navItems = [
    {
      name: "Dashboard",
      path: "/mentor/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "My Students",
      path: "/mentor/students",
      icon: Users,
    },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col justify-between min-h-screen p-4">
      <div className="space-y-6">
        {/* Brand Logo */}
        <div className="px-3 py-2 flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#00C896] flex items-center justify-center font-bold text-white">
            A
          </div>
          <div>
            <h1 className="font-bold text-white text-sm leading-tight">
              ASTU MSJ
            </h1>
            <p className="text-xs text-slate-400">Summer Bootcamp</p>
          </div>
        </div>

        {/* ================================
            NAVIGATION
        ================================= */}

        <nav className="space-y-1">
          {/* Dashboard + My Students */}

          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/mentor/dashboard"}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                    isActive
                      ? "bg-[#00C896] text-white shadow-sm"
                      : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                  }`
                }
              >
                <Icon size={18} />

                {item.name}
              </NavLink>
            );
          })}

          {/* ================================
              ATTENDANCE
          ================================= */}

          <div>
            <button
              type="button"
              onClick={() => setAttendanceOpen(!attendanceOpen)}
              className="
                w-full
                flex
                items-center
                justify-between
                gap-3
                px-3
                py-2.5
                rounded-xl
                text-xs
                font-semibold
                text-slate-400
                hover:bg-slate-800
                hover:text-slate-200
                transition
              "
            >
              <span className="flex items-center gap-3">
                <CalendarCheck size={18} />
                Attendance
              </span>

              {attendanceOpen ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
            </button>

            {/* Attendance children */}

            {attendanceOpen && (
              <div className="ml-6 mt-1 space-y-1">
                {/* Mark Attendance */}

                <NavLink
                  to="/mentor/attendance"
                  end
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition ${
                      isActive
                        ? "bg-[#00C896]/15 text-[#00C896]"
                        : "text-slate-500 hover:bg-slate-800 hover:text-slate-300"
                    }`
                  }
                >
                  <ClipboardCheck size={16} />
                  Mark Attendance
                </NavLink>

                {/* Attendance History */}

                <NavLink
                  to="/mentor/history"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition ${
                      isActive
                        ? "bg-[#00C896]/15 text-[#00C896]"
                        : "text-slate-500 hover:bg-slate-800 hover:text-slate-300"
                    }`
                  }
                >
                  <History size={16} />
                  Attendance History
                </NavLink>
              </div>
            )}
          </div>

          {/* ================================
              PROGRESS TRACKER
          ================================= */}

          <NavLink
            to="/mentor/progress"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                isActive
                  ? "bg-[#00C896] text-white shadow-sm"
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              }`
            }
          >
            <BarChart3 size={18} />
            Progress Tracker
          </NavLink>

          {/* ================================
              ASSIGNMENTS
          ================================= */}

          <NavLink
            to="/mentor/assignments"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                isActive
                  ? "bg-[#00C896] text-white shadow-sm"
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              }`
            }
          >
            <ClipboardList size={18} />
            Assignments
          </NavLink>

          {/* ================================
              ANNOUNCEMENTS
          ================================= */}

          <NavLink
            to="/mentor/announcements"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                isActive
                  ? "bg-[#00C896] text-white shadow-sm"
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              }`
            }
          >
            <Megaphone size={18} />
            Announcements
          </NavLink>
        </nav>
      </div>

      {/* Logout Button */}
      <div className="pt-4 border-t border-slate-800">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 rounded-xl transition"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
