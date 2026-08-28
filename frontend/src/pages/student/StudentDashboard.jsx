import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  TrendingUp,
  FileCheck2,
  BookOpen,
  ArrowRight,
} from "lucide-react";

import API from "../../api/axios";
import StudentLayout from "../../components/student/StudentLayout";
import "../../components/student/student.css";

export default function StudentDashboard() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    attendanceRate: 0,
    curriculumProgress: 0,
    completedAssignments: 0,
    totalAssignments: 0,
    batchName: "Bootcamp Student",
  });
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);

      // Load User Info
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error("Failed to parse user from localStorage", e);
        }
      }

      const [attendanceRes, assignmentsRes, announcementsRes] =
        await Promise.allSettled([
          API.get("/student/attendance"),
          API.get("/student/assignments"),
          API.get("/student/announcements"),
        ]);

      let attPercentage = 0;
      if (attendanceRes.status === "fulfilled" && attendanceRes.value?.data) {
        const attPayload = attendanceRes.value.data;
        const records = Array.isArray(attPayload)
          ? attPayload
          : attPayload.data?.records || attPayload.records || [];

        if (records.length > 0) {
          const present = records.filter(
            (r) => String(r.status).toLowerCase() === "present",
          ).length;

          const late = records.filter(
            (r) => String(r.status).toLowerCase() === "late",
          ).length;

          attPercentage = Math.round(((present + late) / records.length) * 100);
        }
      }

      let completedCount = 0;
      let totalCount = 0;

      if (assignmentsRes.status === "fulfilled" && assignmentsRes.value?.data) {
        const assignPayload = assignmentsRes.value.data;
        const assignmentsList = Array.isArray(assignPayload)
          ? assignPayload
          : assignPayload.data || assignPayload.assignments || [];

        totalCount = assignmentsList.length;

        completedCount = assignmentsList.filter((item) => {
          const status = String(item.status || "").toLowerCase();
          const subStatus = String(item.submission?.status || "").toLowerCase();

          return (
            status === "submitted" ||
            status === "graded" ||
            subStatus === "submitted" ||
            subStatus === "graded" ||
            Boolean(item.submission) ||
            Boolean(item.isSubmitted)
          );
        }).length;
      }

      // 3. Process Announcements
      let announcementList = [];
      if (
        announcementsRes.status === "fulfilled" &&
        announcementsRes.value?.data
      ) {
        const annPayload = announcementsRes.value.data;
        announcementList = Array.isArray(annPayload)
          ? annPayload
          : annPayload.data || [];
      }

      setStats((prev) => ({
        ...prev,
        attendanceRate: attPercentage,
        completedAssignments: completedCount,
        totalAssignments: totalCount,
      }));

      setAnnouncements(announcementList.slice(0, 5));
      setLoading(false);
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <StudentLayout title="Student Dashboard">
        <div className="student-card student-empty">
          Loading dashboard data...
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout title="Student Dashboard">
      {/* Banner */}
      <div className="bg-[#062a5c] text-white rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 shadow-sm">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">
            Welcome back, {user?.name || user?.username || "Student"}!
          </h1>
        </div>
        <Link
          to="/student/assignments"
          className="bg-[#08ad81] hover:bg-[#068e6a] text-white px-5 py-2.5 rounded-xl font-semibold transition text-sm inline-flex items-center gap-2 whitespace-nowrap"
        >
          View Assignments
        </Link>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Attendance Rate */}
        <div className="student-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Attendance Rate
            </span>
            <div className="w-10 h-10 rounded-xl bg-[#e8faf5] text-[#08ad81] grid place-items-center">
              <Calendar size={20} />
            </div>
          </div>
          <div className="text-3xl font-black text-[#062a5c] mt-3">
            {stats.attendanceRate}%
          </div>
          <div className="text-xs font-semibold text-emerald-600 mt-1">
            Active participation
          </div>
        </div>

        {/* Curriculum Progress */}
        <div className="student-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Curriculum Progress
            </span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 grid place-items-center">
              <TrendingUp size={20} />
            </div>
          </div>
          <div className="text-3xl font-black text-[#062a5c] mt-3">
            {stats.curriculumProgress}%
          </div>
          <div className="text-xs text-slate-400 mt-1">Modules completed</div>
        </div>

        {/* Assignments Completed */}
        <div className="student-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Assignments Completed
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 grid place-items-center">
              <FileCheck2 size={20} />
            </div>
          </div>
          <div className="text-3xl font-black text-[#062a5c] mt-3">
            {stats.completedAssignments} / {stats.totalAssignments}
          </div>
          <div className="text-xs text-slate-400 mt-1">Tasks submitted</div>
        </div>

        {/* Current Batch */}
        <div className="student-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Current Batch
            </span>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-500 grid place-items-center">
              <BookOpen size={20} />
            </div>
          </div>
          <div className="text-lg font-bold text-[#062a5c] mt-3 truncate">
            {stats.batchName}
          </div>
          <div className="text-xs text-purple-600 font-semibold mt-1">
            Enrolled
          </div>
        </div>
      </div>

      {/* Latest Announcements */}
      <section className="student-card student-panel">
        <div className="student-panel-header">
          <div>
            <h3>Latest Announcements</h3>
          </div>
          <Link
            to="/student/announcements"
            className="text-xs font-bold text-[#08ad81] hover:underline inline-flex items-center gap-1"
          >
            View all <ArrowRight size={14} />
          </Link>
        </div>

        <div className="divide-y divide-slate-100 mt-2">
          {announcements.length > 0 ? (
            announcements.map((item) => (
              <div
                key={item._id || item.id}
                className="py-4 first:pt-2 last:pb-2"
              >
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-slate-800 text-sm">
                    {item.title}
                  </h4>
                  <span className="text-xs text-slate-400 whitespace-nowrap ml-2">
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleDateString()
                      : ""}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  {item.content || item.message}
                </p>
              </div>
            ))
          ) : (
            <div className="student-empty">No announcements yet.</div>
          )}
        </div>
      </section>
    </StudentLayout>
  );
}
