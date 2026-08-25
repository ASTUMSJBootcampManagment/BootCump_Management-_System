import React, { useEffect, useState } from "react";
import axios from "axios";
import { CheckCircle } from "lucide-react";
import StudentLayout from "../../components/student/StudentLayout"; // Adjust path if needed

export default function StudentProgress() {
  const [progressData, setProgressData] = useState(null);
  const user = JSON.parse(localStorage.getItem("user") || '{"id":"current_id"}');

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:3000/api/progress/get-one/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data) setProgressData(res.data);
      } catch (err) {
        console.error("Progress fetch error:", err);
      }
    };
    fetchProgress();
  }, [user.id]);

  const modules = Array(4).fill({
    moduleNum: "Module #",
    topic: "Upcoming topic",
    status: "Completed",
    mastery: "Mastered"
  });

  return (
    <StudentLayout title="Topic Progress">
      <div className="space-y-6 p-6 font-sans">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Curriculum Syllabus & Learning Journey</h1>
          <p className="text-sm text-slate-500">Track technical competencies delivered in Full-Stack MERN Development.</p>
        </div>

        <div className="rounded-2xl bg-[#0a192f] p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-400">Bootcamp Completion Rate</p>
              <h2 className="mt-1 text-2xl font-extrabold">6 of 12 Modules Delivered</h2>
            </div>
            <span className="text-3xl font-black text-emerald-400">50%</span>
          </div>
          <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-slate-800">
            <div className="h-full rounded-full bg-emerald-500" style={{ width: "50%" }}></div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {modules.map((mod, index) => (
            <div key={index} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">{mod.moduleNum}</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-600">
                  • {mod.status}
                </span>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500">{mod.topic}</p>
                <div className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                  <CheckCircle className="h-4 w-4" />
                  <span>{mod.mastery}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </StudentLayout>
  );
}