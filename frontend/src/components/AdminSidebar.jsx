import {
  NavLink,
  useNavigate,
} from "react-router-dom";

import {
  LayoutDashboard,
  ClipboardCheck,
  Users,
  UserCheck,
  Layers,
  CalendarCheck,
  TrendingUp,
  BookOpenCheck,
  Megaphone,
  Settings,
  LogOut,
  X,
} from "lucide-react";

const items = [
  {
    path: "/admin/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    path: "/admin/applications",
    label: "Applications",
    icon: ClipboardCheck,
  },
  {
    path: "/admin/users",
    label: "User Management",
    icon: Users,
  },
  {
    path: "/admin/students",
    label: "Students",
    icon: UserCheck,
  },
  {
    path: "/admin/mentors",
    label: "Mentors",
    icon: UserCheck,
  },
  {
    path: "/admin/batches",
    label: "Batches",
    icon: Layers,
  },
  {
    path: "/admin/attendance",
    label: "Attendance",
    icon: CalendarCheck,
  },
  {
    path: "/admin/progress",
    label: "Progress",
    icon: TrendingUp,
  },
  {
    path: "/admin/assignments",
    label: "Assignments",
    icon: BookOpenCheck,
  },
  {
    path: "/admin/announcements",
    label: "Announcements",
    icon: Megaphone,
  },
  {
    path: "/admin/settings",
    label: "System Settings",
    icon: Settings,
  },
];

export default function AdminSidebar({
  mobile = false,
  onNavigate,
}) {
  const navigate = useNavigate();

  let user = {};

  try {
    user = JSON.parse(
      localStorage.getItem(
        "user"
      ) || "{}"
    );
  } catch {
    user = {};
  }

  const logout = () => {
    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "user"
    );

    localStorage.removeItem(
      "requiresPasswordChange"
    );

    localStorage.removeItem(
      "rememberMe"
    );

    navigate("/login", {
      replace: true,
    });
  };

  return (
    <aside
      className="
        fixed
        left-0
        top-0
        bottom-0
        z-50
        w-[250px]
        bg-[#062a5c]
        text-white
      "
    >
      <div
        className="
          h-full
          flex
          flex-col
        "
      >

        <div
          className="
            px-6
            py-6
            border-b
            border-white/10
            relative
          "
        >
          {mobile && (
            <button
              type="button"
              onClick={onNavigate}
              className="
                absolute
                right-4
                top-4
                text-white/60
              "
            >
              <X size={19} />
            </button>
          )}

          <div
            className="
              flex
              items-center
              gap-3
            "
          >
            <div
              className="
                w-11
                h-11
                rounded-xl
                bg-[#08c98b]
                grid
                place-items-center
                font-black
                text-lg
              "
            >
              A
            </div>

            <div className="min-w-0">
              <p
                className="
                  text-[#08c98b]
                  font-black
                  tracking-[0.2em]
                  text-xs
                "
              >
                ASTUMSJ
              </p>

              <p
                className="
                  font-black
                  text-sm
                  truncate
                "
              >
                Bootcamp Management
              </p>

              <p
                className="
                  text-white/40
                  text-[10px]
                  mt-0.5
                "
              >
                Administration Portal
              </p>
            </div>
          </div>
        </div>

        <nav
          className="
            flex-1
            overflow-y-auto
            px-3
            py-5
            space-y-1
          "
        >
          <p
            className="
              px-4
              mb-3
              text-[9px]
              uppercase
              tracking-[0.22em]
              font-black
              text-white/30
            "
          >
            Management
          </p>

          {items.map(
            ({
              path,
              label,
              icon: Icon,
            }) => (
              <NavLink
                key={path}
                to={path}
                onClick={onNavigate}
                className={({ isActive }) =>
                  `
                    flex
                    items-center
                    gap-3
                    px-4
                    py-3
                    rounded-xl
                    text-sm
                    font-bold
                    transition
                    ${
                      isActive
                        ? "bg-[#08c98b] text-white shadow-lg"
                        : "text-white/60 hover:text-white hover:bg-white/10"
                    }
                  `
                }
              >
                <Icon size={18} />
                <span>
                  {label}
                </span>
              </NavLink>
            )
          )}
        </nav>

        <div
          className="
            p-4
            border-t
            border-white/10
          "
        >
          <div
            className="
              flex
              items-center
              gap-3
              mb-4
            "
          >
            <div
              className="
                w-10
                h-10
                rounded-full
                bg-[#08c98b]
                grid
                place-items-center
                font-black
              "
            >
              {(
                user.fullname ||
                "A"
              )
                .charAt(0)
                .toUpperCase()}
            </div>

            <div className="min-w-0">
              <p
                className="
                  text-sm
                  font-bold
                  truncate
                "
              >
                {user.fullname ||
                  "Administrator"}
              </p>

              <p
                className="
                  text-[10px]
                  text-white/40
                "
              >
                Administrator
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={logout}
            className="
              w-full
              flex
              items-center
              gap-3
              px-4
              py-3
              rounded-xl
              text-sm
              font-bold
              text-white/60
              hover:text-white
              hover:bg-white/10
              transition
            "
          >
            <LogOut size={17} />
            Sign out
          </button>
        </div>
      </div>
    </aside>
  );
}