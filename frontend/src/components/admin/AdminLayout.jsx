import {
  useEffect,
  useState,
} from "react";

import {
  Outlet,
  useLocation,
} from "react-router-dom";

import {
  Menu,
  ShieldCheck,
} from "lucide-react";

import AdminSidebar from "../AdminSidebar";

const titles = {
  "/admin/dashboard": "Dashboard",
  "/admin/applications": "Applications",
  "/admin/users": "User Management",
  "/admin/students": "Students",
  "/admin/mentors": "Mentors",
  "/admin/batches": "Batches",
  "/admin/attendance": "Attendance",
  "/admin/progress": "Progress",
  "/admin/assignments": "Assignments",
  "/admin/announcements": "Announcements",
  "/admin/resources": "Resources",
  "/admin/settings": "System Settings",
};

export default function AdminLayout() {
  const location = useLocation();

  const [
    mobileOpen,
    setMobileOpen,
  ] = useState(false);

  const [
    user,
    setUser,
  ] = useState({});

  useEffect(() => {
    try {
      setUser(
        JSON.parse(
          localStorage.getItem(
            "user"
          ) || "{}"
        )
      );
    } catch {
      setUser({});
    }
  }, [location.pathname]);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const title =
    titles[
      location.pathname
    ] || "Administration";

  return (
    <div className="min-h-screen bg-[#f5f7fa] text-slate-800">

      {mobileOpen && (
        <button
          type="button"
          aria-label="Close menu"
          onClick={() =>
            setMobileOpen(false)
          }
          className="
            fixed
            inset-0
            z-40
            bg-black/40
            lg:hidden
          "
        />
      )}

      <div className="hidden lg:block">
        <AdminSidebar />
      </div>

      <div
        className={`
          fixed
          inset-y-0
          left-0
          z-50
          w-[250px]
          lg:hidden
          transition-transform
          duration-200
          ${
            mobileOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        <AdminSidebar
          mobile
          onNavigate={() =>
            setMobileOpen(false)
          }
        />
      </div>

      <div className="lg:ml-[250px] min-h-screen">

        <header
          className="
            sticky
            top-0
            z-30
            h-[76px]
            bg-white/95
            backdrop-blur
            border-b
            border-slate-200
          "
        >
          <div
            className="
              h-full
              px-5
              sm:px-8
              flex
              items-center
              gap-4
            "
          >

            <button
              type="button"
              onClick={() =>
                setMobileOpen(true)
              }
              className="
                lg:hidden
                w-10
                h-10
                rounded-xl
                border
                border-slate-200
                bg-white
                grid
                place-items-center
              "
            >
              <Menu size={19} />
            </button>

            <div className="flex-1">
              <p
                className="
                  text-[10px]
                  sm:text-xs
                  uppercase
                  tracking-[0.18em]
                  font-black
                  text-[#08ad81]
                "
              >
                Administration
              </p>

              <h1
                className="
                  text-lg
                  sm:text-2xl
                  font-black
                  text-[#062a5c]
                "
              >
                {title}
              </h1>
            </div>

            <div
              className="
                hidden
                sm:flex
                items-center
                gap-3
              "
            >
              <div
                className="
                  w-10
                  h-10
                  rounded-xl
                  bg-[#e8faf5]
                  text-[#08ad81]
                  grid
                  place-items-center
                "
              >
                <ShieldCheck
                  size={19}
                />
              </div>

              <div className="hidden md:block">
                <p
                  className="
                    text-sm
                    font-black
                    text-[#062a5c]
                  "
                >
                  {user.fullname ||
                    "Administrator"}
                </p>

                <p
                  className="
                    text-[10px]
                    text-slate-400
                  "
                >
                  {user.email || ""}
                </p>
              </div>
            </div>
          </div>
        </header>

        <main
          className="
            p-5
            sm:p-8
            max-w-[1500px]
            mx-auto
          "
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}