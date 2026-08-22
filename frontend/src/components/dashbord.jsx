import {
  FiBell,
  FiMenu,
  FiUser,
  FiChevronDown,
} from "react-icons/fi";

const Navbar = ({ role = "admin", onMenuClick }) => {
  const roleName =
    role.charAt(0).toUpperCase() + role.slice(1);

  return (
    <header className="flex h-20 items-center justify-between border-b border-gray-200 bg-white px-5 sm:px-8">

      {/* Left side */}
      <div className="flex items-center gap-4">

        {/* Mobile menu */}
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 lg:hidden"
        >
          <FiMenu className="text-xl" />
        </button>

        <div>
          <h2 className="text-lg font-bold text-[#14213d] sm:text-xl">
            Dashboard
          </h2>

          <p className="hidden text-sm text-gray-500 sm:block">
            Overview of your bootcamp activities
          </p>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3 sm:gap-5">

        {/* Notification */}
        <button className="relative rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-[#0b4ea2]">
          <FiBell className="text-xl" />

          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-green-500" />
        </button>

        <div className="hidden h-8 w-px bg-gray-200 sm:block" />

        {/* User */}
        <button className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e8f0ff] text-[#0b4ea2]">
            <FiUser />
          </div>

          <div className="hidden text-left sm:block">
            <p className="text-sm font-semibold text-[#14213d]">
              {roleName} User
            </p>

            <p className="text-xs text-gray-500">
              {roleName}
            </p>
          </div>

          <FiChevronDown className="hidden text-gray-400 sm:block" />
        </button>

      </div>
    </header>
  );
};

export default Navbar;
