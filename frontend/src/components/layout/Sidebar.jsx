import {
  FiHome,
  FiUsers,
  FiBook,
  FiUserCheck,
  FiCalendar,
  FiClipboard,
  FiBarChart2,
  FiBell,
  FiSettings,
  FiUser,
  FiAward,
  FiFileText,
  FiLogOut,
  FiX,
} from "react-icons/fi";

<<<<<<< HEAD
import { NavLink } from "react-router-dom";

import logo from "../../assets/astumsj-logo.png";

const Sidebar = ({
  role = "admin",
  isOpen,
  setIsOpen,
}) => {
  const menus = {
    admin: [
      {
        name: "Dashboard",
        icon: FiHome,
        path: "/admin/dashboard",
      },
      {
        name: "Users",
        icon: FiUsers,
        path: "/admin/users",
      },
      {
        name: "Batches",
        icon: FiBook,
        path: "/admin/batches",
      },
      {
        name: "Mentors",
        icon: FiUserCheck,
        path: "/admin/mentors",
      },
      {
        name: "Students",
        icon: FiUsers,
        path: "/admin/students",
      },
      {
        name: "Attendance",
        icon: FiCalendar,
        path: "/admin/attendance",
      },
      {
        name: "Assignments",
        icon: FiClipboard,
        path: "/admin/assignments",
      },
      {
        name: "Progress",
        icon: FiBarChart2,
        path: "/admin/progress",
      },
      {
        name: "Announcements",
        icon: FiBell,
        path: "/admin/announcements",
      },
      {
        name: "Settings",
        icon: FiSettings,
        path: "/admin/settings",
      },
    ],

    mentor: [
      {
        name: "Dashboard",
        icon: FiHome,
        path: "/mentor/dashboard",
      },
      {
        name: "My Students",
        icon: FiUsers,
        path: "/mentor/students",
      },
      {
        name: "Attendance",
        icon: FiCalendar,
        path: "/mentor/attendance",
      },
      {
        name: "Progress",
        icon: FiBarChart2,
        path: "/mentor/progress",
      },
      {
        name: "Assignments",
        icon: FiClipboard,
        path: "/mentor/assignments",
      },
      {
        name: "Submissions",
        icon: FiFileText,
        path: "/mentor/submissions",
      },
      {
        name: "Announcements",
        icon: FiBell,
        path: "/mentor/announcements",
      },
      {
        name: "Settings",
        icon: FiSettings,
        path: "/mentor/settings",
      },
    ],

    student: [
      {
        name: "Dashboard",
        icon: FiHome,
        path: "/student/dashboard",
      },
      {
        name: "Attendance",
        icon: FiCalendar,
        path: "/student/attendance",
      },
      {
        name: "Progress",
        icon: FiBarChart2,
        path: "/student/progress",
      },
      {
        name: "Assignments",
        icon: FiClipboard,
        path: "/student/assignments",
      },
      {
        name: "Grades",
        icon: FiAward,
        path: "/student/grades",
      },
      {
        name: "Announcements",
        icon: FiBell,
        path: "/student/announcements",
      },
      {
        name: "Profile",
        icon: FiUser,
        path: "/student/profile",
      },
    ],
  };

  const currentMenus =
    menus[role] || menus.student;

  const roleName =
    role.charAt(0).toUpperCase() +
    role.slice(1);

  return (
    <>
      {/* =========================
          MOBILE OVERLAY
      ========================== */}

=======
import logo from "../../assets/astumsj-logo.png";
const Sidebar = ({ role = "admin", isOpen, setIsOpen }) => {
  const menus = {
    admin: [
      { name: "Dashboard", icon: FiHome, path: "/admin/dashboard" },
      { name: "Users", icon: FiUsers, path: "/admin/users" },
      { name: "Batches", icon: FiBook, path: "/admin/batches" },
      { name: "Mentors", icon: FiUserCheck, path: "/admin/mentors" },
      { name: "Students", icon: FiUsers, path: "/admin/students" },
      { name: "Attendance", icon: FiCalendar, path: "/admin/attendance" },
      { name: "Assignments", icon: FiClipboard, path: "/admin/assignments" },
      { name: "Progress", icon: FiBarChart2, path: "/admin/progress" },
      { name: "Announcements", icon: FiBell, path: "/admin/announcements" },
      { name: "Settings", icon: FiSettings, path: "/admin/settings" },
    ],

    mentor: [
      { name: "Dashboard", icon: FiHome, path: "/mentor/dashboard" },
      { name: "My Students", icon: FiUsers, path: "/mentor/students" },
      { name: "Attendance", icon: FiCalendar, path: "/mentor/attendance" },
      { name: "Progress", icon: FiBarChart2, path: "/mentor/progress" },
      { name: "Assignments", icon: FiClipboard, path: "/mentor/assignments" },
      { name: "Submissions", icon: FiFileText, path: "/mentor/submissions" },
      { name: "Announcements", icon: FiBell, path: "/mentor/announcements" },
      { name: "Settings", icon: FiSettings, path: "/mentor/settings" },
    ],

    student: [
      { name: "Dashboard", icon: FiHome, path: "/student/dashboard" },
      { name: "Attendance", icon: FiCalendar, path: "/student/attendance" },
      { name: "Progress", icon: FiBarChart2, path: "/student/progress" },
      { name: "Assignments", icon: FiClipboard, path: "/student/assignments" },
      { name: "Grades", icon: FiAward, path: "/student/grades" },
      { name: "Announcements", icon: FiBell, path: "/student/announcements" },
      { name: "Profile", icon: FiUser, path: "/student/profile" },
    ],
  };

  const currentMenus = menus[role] || menus.student;

  const roleName =
    role.charAt(0).toUpperCase() + role.slice(1);

  return (
    <>
      {/* Mobile overlay */}
>>>>>>> 214d84b7c5f769fb4594a0436d655bc9571b2928
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

<<<<<<< HEAD
      {/* =========================
          SIDEBAR
      ========================== */}

      <aside
        className={`
          fixed
          left-0
          top-0
          z-50
          flex
          h-screen
          w-64
          flex-col
          bg-[#06295c]
          text-white
          transition-transform
          duration-300
          lg:translate-x-0
          ${
            isOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        {/* =========================
            LOGO
        ========================== */}

        <div className="flex h-24 items-center justify-between border-b border-white/10 px-5">

          <div className="flex items-center gap-3">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white">

=======
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-64 flex-col bg-[#06295c] text-white transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo section */}
        <div className="flex h-24 items-center justify-between border-b border-white/10 px-5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white">
>>>>>>> 214d84b7c5f769fb4594a0436d655bc9571b2928
              <img
                src={logo}
                alt="ASTUMSJ Logo"
                className="h-11 w-11 object-contain"
              />
<<<<<<< HEAD

            </div>

            <div>

=======
            </div>

            <div>
>>>>>>> 214d84b7c5f769fb4594a0436d655bc9571b2928
              <h1 className="text-sm font-bold">
                ASTUMSJ
              </h1>

              <p className="text-[10px] font-semibold tracking-[0.2em] text-green-400">
                BOOTCAMP
              </p>
<<<<<<< HEAD

            </div>

          </div>

          {/* Mobile close */}

          <button
            type="button"
            onClick={() =>
              setIsOpen(false)
            }
=======
            </div>
          </div>

          {/* Mobile close button */}
          <button
            onClick={() => setIsOpen(false)}
>>>>>>> 214d84b7c5f769fb4594a0436d655bc9571b2928
            className="text-xl text-blue-200 hover:text-white lg:hidden"
          >
            <FiX />
          </button>
<<<<<<< HEAD

        </div>

        {/* =========================
            NAVIGATION
        ========================== */}

        <nav className="flex-1 overflow-y-auto px-4 py-6">

=======
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-6">
>>>>>>> 214d84b7c5f769fb4594a0436d655bc9571b2928
          <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-widest text-blue-200/60">
            {roleName} Menu
          </p>

          <div className="space-y-1">
<<<<<<< HEAD

            {currentMenus.map((item) => {

              const Icon = item.icon;

              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={() =>
                    setIsOpen(false)
                  }
                  className={({ isActive }) =>
                    `
                    flex
                    items-center
                    gap-3
                    rounded-lg
                    px-3
                    py-3
                    text-sm
                    transition
                    ${
                      isActive
                        ? "bg-[#10b981] font-semibold text-white shadow-lg shadow-green-900/20"
                        : "text-blue-100 hover:bg-white/10 hover:text-white"
                    }
                    `
                  }
                >
                  <Icon className="text-lg" />

                  <span>
                    {item.name}
                  </span>
                </NavLink>
              );
            })}

          </div>

        </nav>

        {/* =========================
            USER SECTION
        ========================== */}

        <div className="border-t border-white/10 p-4">

          <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#06295c]">

              <FiUser />

            </div>

            <div className="min-w-0 flex-1">

=======
            {currentMenus.map((item, index) => {
              const Icon = item.icon;

              const active = index === 0;

              return (
                <a
                  key={item.name}
                  href={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm transition ${
                    active
                      ? "bg-[#10b981] font-semibold text-white shadow-lg shadow-green-900/20"
                      : "text-blue-100 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon className="text-lg" />

                  <span>{item.name}</span>
                </a>
              );
            })}
          </div>
        </nav>

        {/* User section */}
        <div className="border-t border-white/10 p-4">
          <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#06295c]">
              <FiUser />
            </div>

            <div className="min-w-0 flex-1">
>>>>>>> 214d84b7c5f769fb4594a0436d655bc9571b2928
              <p className="truncate text-sm font-semibold">
                {roleName} User
              </p>

              <p className="truncate text-xs text-blue-200">
                {roleName}
              </p>
<<<<<<< HEAD

            </div>

            <button
              type="button"
              className="text-blue-200 transition hover:text-white"
            >
              <FiLogOut />
            </button>

          </div>

        </div>

=======
            </div>

            <button className="text-blue-200 transition hover:text-white">
              <FiLogOut />
            </button>
          </div>
        </div>
>>>>>>> 214d84b7c5f769fb4594a0436d655bc9571b2928
      </aside>
    </>
  );
};

<<<<<<< HEAD
export default Sidebar;
=======
export default Sidebar;
>>>>>>> 214d84b7c5f769fb4594a0436d655bc9571b2928
