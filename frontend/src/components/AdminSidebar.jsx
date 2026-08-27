import {
  NavLink,
  useNavigate,
} from "react-router-dom";

import {
  LayoutDashboard,
  Users,
  UserCheck,
  Layers,
  Megaphone,
  BookOpen,
  Settings,
  LogOut,
  ClipboardCheck,
  TrendingUp,
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
    path: "/admin/assignments",
    label: "Assignments",
    icon: ClipboardCheck,
  },
  {
    path: "/admin/progress",
    label: "Progress",
    icon: TrendingUp,
  },
  {
    path: "/admin/announcements",
    label: "Announcements",
    icon: Megaphone,
  },
  {
    path: "/admin/resources",
    label: "Resources",
    icon: BookOpen,
  },
  {
    path: "/admin/settings",
    label: "System Settings",
    icon: Settings,
  },
];

export default function AdminSidebar() {
  const navigate =
    useNavigate();

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

    navigate("/login");
  };

  return (
    <aside className="
      fixed
      left-0
      top-0
      bottom-0
      z-40
      w-[250px]
      bg-[#062a5c]
      text-white
      flex
      flex-col
    ">
      <div className="
        px-6
        py-6
        border-b
        border-white/10
      ">
        <div className="
          flex
          items-center
          gap-3
        ">
          <div className="
            w-11
            h-11
            rounded-xl
            bg-[#08c98b]
            flex
            items-center
            justify-center
            font-black
          ">
            A
          </div>

          <div>
            <div className="
              font-black
              tracking-wide
            ">
              ASTUMSJ
            </div>

            <div className="
              text-xs
              text-white/50
            ">
              Admin Portal
            </div>
          </div>
        </div>
      </div>

      <nav className="
        flex-1
        overflow-y-auto
        p-4
        space-y-1
      ">
        <div className="
          px-3
          mb-3
          mt-1
          text-[10px]
          uppercase
          tracking-[.2em]
          text-white/35
          font-black
        ">
          Management
        </div>

        {items.map(
          ({
            path,
            label,
            icon: Icon,
          }) => (
            <NavLink
              key={path}
              to={path}
              className={({
                isActive,
              }) =>
                `
                flex
                items-center
                gap-3
                px-3
                py-3
                rounded-xl
                text-sm
                font-semibold
                transition
                ${
                  isActive
                    ? "bg-[#08c98b] text-white shadow-lg"
                    : "text-white/65 hover:text-white hover:bg-white/10"
                }
              `
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          )
        )}
      </nav>

      <div className="
        p-4
        border-t
        border-white/10
      ">
        <button
          onClick={logout}
          className="
            w-full
            flex
            items-center
            gap-3
            px-3
            py-3
            rounded-xl
            text-sm
            font-semibold
            text-white/60
            hover:bg-red-500/10
            hover:text-red-200
          "
        >
          <LogOut size={18} />
          Sign out
        </button>
      </div>
    </aside>
  );
}