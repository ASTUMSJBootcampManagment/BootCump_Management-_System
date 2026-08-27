import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Layers, Megaphone, ClipboardList, LogOut } from 'lucide-react';

export default function AdminSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Users', path: '/admin/users', icon: Users },
    { name: 'Batches', path: '/admin/batches', icon: Layers },
    { name: 'Assignments', path: '/admin/assignments', icon: ClipboardList },
    { name: 'Announcements', path: '/admin/announcements', icon: Megaphone },
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
            <h1 className="font-bold text-white text-sm leading-tight">ASTU MSJ</h1>
            <p className="text-xs text-slate-400">Admin Control</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/admin'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                    isActive
                      ? 'bg-[#00C896] text-white shadow-sm'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`
                }
              >
                <Icon size={18} />
                {item.name}
              </NavLink>
            );
          })}
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
