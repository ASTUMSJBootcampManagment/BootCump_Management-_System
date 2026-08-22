import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StudentAttendance = ({ studentId }) => {
  const [attendanceData, setAttendanceData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`/api/attendance/stats/${studentId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAttendanceData(res.data);
      } catch (err) {
        console.error('Error loading attendance stats', err);
      } finally {
        setLoading(false);
      }
    };
    if (studentId) fetchAttendance();
  }, [studentId]);

  if (loading) return <div className="p-6 text-slate-600">Loading attendance data...</div>;

  const percentage = attendanceData?.attendancePercentage || 0;

  return (
    <div className="p-6 space-y-6 bg-[#F8FAFC] min-h-screen">
      <h1 className="text-2xl font-bold text-[#0F172A]">Attendance Tracking</h1>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-sm text-slate-500 font-medium">Overall Attendance</p>
          <p className="text-3xl font-extrabold text-[#22C55E] mt-2">{percentage}%</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-sm text-slate-500 font-medium">Present</p>
          <p className="text-3xl font-extrabold text-[#0F172A] mt-2">
            {attendanceData?.presentCount || 0}
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-sm text-slate-500 font-medium">Absent</p>
          <p className="text-3xl font-extrabold text-red-500 mt-2">
            {attendanceData?.absentCount || 0}
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-sm text-slate-500 font-medium">Late / Excused</p>
          <p className="text-3xl font-extrabold text-[#14B8A6] mt-2">
            {(attendanceData?.lateCount || 0) + (attendanceData?.excusedCount || 0)}
          </p>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-[#0F172A]">Attendance Records</h2>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider">
              <th className="p-4">Date</th>
              <th className="p-4">Session / Topic</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
            {attendanceData?.history?.map((record) => (
              <tr key={record._id} className="hover:bg-slate-50/50">
                <td className="p-4 font-medium">{new Date(record.date).toLocaleDateString()}</td>
                <td className="p-4">{record.topic || 'Regular Session'}</td>
                <td className="p-4">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      record.status === 'Present'
                        ? 'bg-green-100 text-green-700'
                        : record.status === 'Absent'
                        ? 'bg-red-100 text-red-700'
                        : record.status === 'Late'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {record.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentAttendance;