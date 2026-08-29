import {
  Outlet,
  useLocation,
} from "react-router-dom";

import {
  Bell,
  Menu,
  X,
} from "lucide-react";

import {
  useState,
} from "react";

import AdminSidebar from "../AdminSidebar";

export default function AdminLayout() {
  const [
    mobileOpen,
    setMobileOpen,
  ] = useState(false);

  const location =
    useLocation();

  const user = JSON.parse(
    localStorage.getItem(
      "user"
    ) || "{}"
  );

  const title =
    location.pathname
      .split("/")
      .filter(Boolean)
      .pop() || "dashboard";

  return (
    <div className="
      min-h-screen
      bg-[#f5f7fa]
    ">
      <div className="
        hidden
        lg:block
      ">
        <AdminSidebar />
      </div>

      {mobileOpen && (
        <div className="
          fixed
          inset-0
          z-50
          lg:hidden
        ">
          <div
            className="
              absolute
              inset-0
              bg-black/50
            "
            onClick={() =>
              setMobileOpen(false)
            }
          />

          <div className="
            relative
            w-[250px]
            h-full
          ">
            <AdminSidebar />
          </div>
        </div>
      )}

      <div className="
        lg:ml-[250px]
        min-h-screen
      ">
        <header className="
          h-16
          bg-white
          border-b
          border-slate-200
          px-4
          lg:px-7
          flex
          items-center
          justify-between
          sticky
          top-0
          z-30
        ">
          <div className="
            flex
            items-center
            gap-3
          ">
            <button
              className="
                lg:hidden
                p-2
                rounded-lg
                hover:bg-slate-100
              "
              onClick={() =>
                setMobileOpen(
                  !mobileOpen
                )
              }
            >
              {mobileOpen ? (
                <X size={20} />
              ) : (
                <Menu size={20} />
              )}
            </button>

            <div>
              <div className="
                text-xs
                uppercase
                tracking-widest
                text-slate-400
                font-bold
              ">
                Admin portal
              </div>

              <h1 className="
                text-lg
                font-black
                text-[#062a5c]
                capitalize
              ">
                {title}
              </h1>
            </div>
          </div>

          <div className="
            flex
            items-center
            gap-4
          ">
            <button className="
              w-9
              h-9
              rounded-xl
              bg-slate-100
              grid
              place-items-center
              text-slate-500
            ">
              <Bell size={17} />
            </button>

            <div className="
              hidden
              sm:flex
              items-center
              gap-2
            ">
              <div className="
                w-9
                h-9
                rounded-full
                bg-[#08c98b]
                text-white
                grid
                place-items-center
                font-black
              ">
                {(
                  user.fullname ||
                  "A"
                )
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <div>
                <div className="
                  text-sm
                  font-bold
                  text-[#062a5c]
                ">
                  {user.fullname ||
                    "Administrator"}
                </div>

                <div className="
                  text-[10px]
                  text-slate-400
                ">
                  Administrator
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="
          p-4
          md:p-6
        ">
          <Outlet />
        </main>
      </div>
    </div>
  );
}