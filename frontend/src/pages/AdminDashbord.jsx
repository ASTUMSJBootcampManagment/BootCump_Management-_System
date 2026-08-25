import React from "react";
import { FiUsers, FiBook, FiCalendar, FiBarChart2 } from "react-icons/fi";
import Card from "../components/Card";

const AdminDashboard = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="mb-7">
        <h1 className="text-2xl font-bold text-slate-800">Admin Dashboard</h1>
        <p className="text-slate-500 text-sm">Overview of system statistics and operations.</p>
      </div>

      {/* Dashboard Cards / Grid content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Your cards go here */}
      </div>
    </div>
  );
};

export default AdminDashboard;