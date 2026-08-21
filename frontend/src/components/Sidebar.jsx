import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FiHome,
  FiUsers,
  FiCalendar,
  FiBarChart2,
  FiClipboard,
  FiBell,
  FiSettings,
  FiMenu,
  FiX,
  FiChevronDown,
  FiChevronRight,
  FiClock,
} from "react-icons/fi";
import logo from "../assets/astumsj-logo.png";

const Sidebar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [attendanceOpen, setAttendanceOpen] = useState(true);

  const closeMobile = () => {
    setMobileOpen(false);
  };

  const navItem = ({ isActive }) =>
    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition
    ${
      isActive
        ? "bg-blue-600 text-white"
        : "text-slate-300 hover:bg-slate-800 hover:text-white"
    }`;

  return (
    <>
      {/* Mobile menu button */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-40 rounded-xl bg-white p-2.5 text-slate-700 shadow-md lg:hidden"
        aria-label="Open menu"
      >
        <FiMenu size={22} />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close menu"
          onClick={closeMobile}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-64 flex-col bg-[#062A5C] transition-transform duration-300
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      >
        {/* Brand */}
        <div className="flex h-20 items-center justify-between border-b border-slate-800 px-5">
          <div className="flex items-center gap-3">
            
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg">
              <img
                src={logo}
                alt="ASTUMSJ Bootcamp"
                className="h-full w-full object-contain"
              />
            </div>

            <div>
              <p className="text-sm font-bold text-white">ASTUMSJ</p>

              <p className="text-xs font-medium text-slate-400">BOOTCAMP</p>
            </div>
          </div>

          {/* Mobile close */}
          <button
            type="button"
            onClick={closeMobile}
            className="text-slate-400 hover:text-white lg:hidden"
            aria-label="Close menu"
          >
            <FiX size={22} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-6">
          {/* Main */}
          <p className="mb-3 px-4 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Main
          </p>

          <div className="space-y-1">
            <NavLink to="/mentor" end className={navItem} onClick={closeMobile}>
              <FiHome size={19} />
              <span>Dashboard</span>
            </NavLink>

            <NavLink
              to="/mentor/students"
              className={navItem}
              onClick={closeMobile}
            >
              <FiUsers size={19} />
              <span>My Students</span>
            </NavLink>
          </div>

          {/* Management */}
          <p className="mb-3 mt-7 px-4 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Management
          </p>

          <div className="space-y-1">
            {/* Attendance parent */}
            <button
              type="button"
              onClick={() => setAttendanceOpen(!attendanceOpen)}
              className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
            >
              <span className="flex items-center gap-3">
                <FiCalendar size={19} />
                Attendance
              </span>
              {attendanceOpen ? (
                <FiChevronDown size={17} />
              ) : (
                <FiChevronRight size={17} />
              )}
            </button>

            {/* Attendance children */}
            {attendanceOpen && (
              <div className="ml-4 space-y-1 border-l border-slate-700 pl-3">
                <NavLink
                  to="/mentor/attendance"
                  end
                  onClick={closeMobile}
                  className={({ isActive }) =>
                    `flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm transition ${
                      isActive
                        ? "bg-blue-600/20 font-semibold text-blue-400"
                        : "text-slate-400 hover:text-white"
                    }`
                  }
                >
                  <FiClipboard size={16} />
                  Mark Attendance
                </NavLink>

                <NavLink
                  to="/mentor/attendance/history"
                  onClick={closeMobile}
                  className={({ isActive }) =>
                    `flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm transition ${
                      isActive
                        ? "bg-blue-600/20 font-semibold text-blue-400"
                        : "text-slate-400 hover:text-white"
                    }`
                  }
                >
                  <FiClock size={16} />
                  Attendance History
                </NavLink>
              </div>
            )}

            <NavLink
              to="/mentor/progress"
              className={navItem}
              onClick={closeMobile}
            >
              <FiBarChart2 size={19} />
              <span>Progress Tracker</span>
            </NavLink>

            <NavLink
              to="/mentor/assignments"
              className={navItem}
              onClick={closeMobile}
            >
              <FiClipboard size={19} />
              <span>Assignments</span>
            </NavLink>

            <NavLink
              to="/mentor/announcements"
              className={navItem}
              onClick={closeMobile}
            >
              <FiBell size={19} />
              <span>Announcements</span>
            </NavLink>
          </div>
        </nav>

        {/* Bottom profile */}
        <div className="border-t border-slate-800 p-4">
          <div className="flex items-center gap-3 rounded-xl bg-slate-800 p-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-500 font-bold text-white">
              M
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">
                Mentor
              </p>

              <p className="truncate text-xs text-slate-400">Mentor Account</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
