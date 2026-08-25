import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import { Search, Bell } from 'lucide-react';

export default function AdminLayout() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Fixed Sidebar */}
      <AdminSidebar />

      {/* Main Right Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-100 px-6 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <h2 className="font-bold text-slate-800 text-lg">Admin Portal</h2>
            <span className="text-xs bg-slate-100 text-slate-600 font-semibold px-2.5 py-1 rounded-full">
              ASTU MSJ Management
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Search portal..."
                className="pl-9 pr-4 py-1.5 bg-slate-100/80 rounded-xl text-xs w-64 focus:outline-emerald-500"
              />
            </div>
            <button className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100">
              <Bell size={18} />
            </button>
            <div className="flex items-center gap-2 border-l pl-4 border-slate-200">
              <div className="w-8 h-8 rounded-full bg-emerald-500 text-white font-bold flex items-center justify-center text-xs">
                {user.name ? user.name[0] : 'A'}
              </div>
              <span className="text-xs font-semibold text-slate-700">{user.name || 'Admin'}</span>
            </div>
          </div>
        </header>

        {/* Page View Outlet */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}