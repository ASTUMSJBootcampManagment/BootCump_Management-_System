import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import { Users, UserCheck, Layers, CalendarCheck } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalMentors: 0,
    activeBatches: 0,
    avgAttendance: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        // Adjust endpoint path according to your backend setup
        const { data } = await API.get('/users/stats');
        setStats(data);
      } catch (err) {
        console.error('Failed to load dashboard metrics', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardStats();
  }, []);

  const cards = [
    { title: 'Total Students', value: stats.totalStudents, icon: Users, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { title: 'Total Mentors', value: stats.totalMentors, icon: UserCheck, color: 'text-blue-500', bg: 'bg-blue-50' },
    { title: 'Active Batches', value: stats.activeBatches, icon: Layers, color: 'text-purple-500', bg: 'bg-purple-50' },
    { title: 'Avg Attendance', value: `${stats.avgAttendance}%`, icon: CalendarCheck, color: 'text-amber-500', bg: 'bg-amber-50' },
  ];

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      {/* Banner */}
      <div className="bg-[#0F172A] text-white p-8 rounded-2xl flex justify-between items-center shadow-lg">
        <div>
          <span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-xs font-semibold tracking-wide">
            ADMINISTRATOR PORTAL
          </span>
          <h1 className="text-3xl font-bold mt-2">Bootcamp Overview</h1>
          <p className="text-slate-400 text-sm mt-1">
            Monitor cohorts, platform engagement, and platform health.
          </p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 font-semibold tracking-wider uppercase">{card.title}</p>
                <h3 className="text-2xl font-bold text-slate-800 mt-1">
                  {loading ? '...' : card.value}
                </h3>
              </div>
              <div className={`p-3 rounded-xl ${card.bg}`}>
                <Icon className={`w-6 h-6 ${card.color}`} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}