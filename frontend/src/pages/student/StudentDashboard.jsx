import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  Bell,
  Award,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

import API from "../../api/axios";
import StudentLayout from "../../components/student/StudentLayout";
import "../../components/student/student.css";

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
}

export default function StudentDashboard() {
  const [user] = useState(getStoredUser());
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    attendancePercentage: 0,
    assignmentsCompleted: 0,
    assignmentsTotal: 0,
    progressPercentage: 0,
    batchName: "Bootcamp Student",
  });
  const [announcements, setAnnouncements] = useState([]);
  const [upcomingAssignments, setUpcomingAssignments] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch data from existing backend APIs concurrently
        const [progressRes, attendanceRes, assignmentsRes, announcementsRes] =
          await Promise.allSettled([
            API.get("/progress/student"),
            API.get("/attendance/mine"),
            API.get("/assignments"),
            API.get("/announcement"),
          ]);

        // Process Progress
        let completedProgress = 0;
        let totalProgress = 0;
        if (progressRes.status === "fulfilled" && progressRes.value.data) {
          const items = Array.isArray(progressRes.value.data)
            ? progressRes.value.data
            : progressRes.value.data.data || [];
          totalProgress = items.length;
          completedProgress = items.filter(
            (item) => item.status === "Completed"
          ).length;
        }

        // Process Attendance
        let attPercentage = 100;
        if (attendanceRes.status === "fulfilled" && attendanceRes.value.data) {
          const attData = Array.isArray(attendanceRes.value.data)
            ? attendanceRes.value.data
            : attendanceRes.value.data.data || [];
          if (attData.length > 0) {
            const presentCount = attData.filter(
              (a) => a.status === "Present" || a.present
            ).length;
            attPercentage = Math.round((presentCount / attData.length) * 100);
          }
        }

        // Process Assignments
        let assignCompleted = 0;
        let assignTotal = 0;
        if (assignmentsRes.status === "fulfilled" && assignmentsRes.value.data) {
          const assignList = Array.isArray(assignmentsRes.value.data)
            ? assignmentsRes.value.data
            : assignmentsRes.value.data.data || [];
          assignTotal = assignList.length;
          assignCompleted = assignList.filter(
            (a) => a.submitted || a.status === "Submitted"
          ).length;
          setUpcomingAssignments(assignList.slice(0, 3));
        }

        // Process Announcements
        if (announcementsRes.status === "fulfilled" && announcementsRes.value.data) {
          const announceList = Array.isArray(announcementsRes.value.data)
            ? announcementsRes.value.data
            : announcementsRes.value.data.data || [];
          setAnnouncements(announceList.slice(0, 3));
        }

        setStats({
          attendancePercentage: attPercentage,
          assignmentsCompleted: assignCompleted,
          assignmentsTotal: assignTotal,
          progressPercentage: totalProgress
            ? Math.round((completedProgress / totalProgress) * 100)
            : 0,
          batchName: user?.batch?.name || user?.batchName || "Current Batch",
        });
      } catch (err) {
        console.warn("Failed to load dashboard statistics:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  const name = user?.fullname || user?.name || "Student";

  return (
    <StudentLayout title="Student Dashboard">
      {/* Welcome Banner */}
      <div
        className="student-card"
        style={{
          background: "linear-[#0d1b2a], #1b263b",
          backgroundColor: "#062a5c",
          color: "#ffffff",
          padding: "24px 28px",
          borderRadius: "12px",
          marginBottom: "24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div>
          <h2 style={{ margin: "0 0 8px 0", fontSize: "1.5rem", color: "#ffffff" }}>
            Welcome back, {name}! 
          </h2>
          {/* <p style={{ margin: 0, color: "#a0aec0", fontSize: "0.95rem" }}>
            Here is what's happening in your bootcamp today. Stay on track with your progress!
          </p> */}
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <Link
            to="/student/assignments"
            className="student-btn"
            style={{
              background: "#08ad81",
              color: "#fff",
              textDecoration: "none",
              padding: "10px 16px",
              borderRadius: "6px",
              fontSize: "0.875rem",
              fontWeight: 600,
            }}
          >
            View Assignments
          </Link>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        <div className="student-card" style={{ padding: "18px 20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "0.85rem", color: "#718096", fontWeight: 500 }}>
              Attendance Rate
            </span>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                background: "#e8faf5",
                color: "#08ad81",
                display: "grid",
                placeItems: "center",
              }}
            >
              <Calendar size={18} />
            </div>
          </div>
          <h3 style={{ fontSize: "1.6rem", margin: "10px 0 4px 0", color: "#1a202c" }}>
            {loading ? "..." : `${stats.attendancePercentage}%`}
          </h3>
          <span style={{ fontSize: "0.75rem", color: "#08ad81", fontWeight: 600 }}>
            Active participation
          </span>
        </div>

        <div className="student-card" style={{ padding: "18px 20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "0.85rem", color: "#718096", fontWeight: 500 }}>
              Curriculum Progress
            </span>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                background: "#ebf8ff",
                color: "#3182ce",
                display: "grid",
                placeItems: "center",
              }}
            >
              <TrendingUp size={18} />
            </div>
          </div>
          <h3 style={{ fontSize: "1.6rem", margin: "10px 0 4px 0", color: "#1a202c" }}>
            {loading ? "..." : `${stats.progressPercentage}%`}
          </h3>
          <span style={{ fontSize: "0.75rem", color: "#3182ce", fontWeight: 600 }}>
            Modules completed
          </span>
        </div>

        <div className="student-card" style={{ padding: "18px 20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "0.85rem", color: "#718096", fontWeight: 500 }}>
              Assignments Completed
            </span>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                background: "#fefcbf",
                color: "#d69e2e",
                display: "grid",
                placeItems: "center",
              }}
            >
              <FileText size={18} />
            </div>
          </div>
          <h3 style={{ fontSize: "1.6rem", margin: "10px 0 4px 0", color: "#1a202c" }}>
            {loading ? "..." : `${stats.assignmentsCompleted} / ${stats.assignmentsTotal}`}
          </h3>
          <span style={{ fontSize: "0.75rem", color: "#718096" }}>Tasks submitted</span>
        </div>

        <div className="student-card" style={{ padding: "18px 20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "0.85rem", color: "#718096", fontWeight: 500 }}>
              Current Batch
            </span>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                background: "#f3e8ff",
                color: "#8b5cf6",
                display: "grid",
                placeItems: "center",
              }}
            >
              <BookOpen size={18} />
            </div>
          </div>
          <h3
            style={{
              fontSize: "1.1rem",
              margin: "14px 0 4px 0",
              color: "#1a202c",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {stats.batchName}
          </h3>
          <span style={{ fontSize: "0.75rem", color: "#8b5cf6", fontWeight: 600 }}>
            Enrolled
          </span>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="student-two-col">
        {/* Recent Announcements Section */}
        <section className="student-card student-panel">
          <div
            className="student-panel-header"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Bell size={18} style={{ color: "#08ad81" }} />
              <h3 style={{ margin: 0 }}>Latest Announcements</h3>
            </div>
            <Link
              to="/student/announcements"
              style={{
                fontSize: "0.8rem",
                color: "#08ad81",
                textDecoration: "none",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              View all <ArrowRight size={14} />
            </Link>
          </div>

          <div className="student-list" style={{ marginTop: 12 }}>
            {announcements.length > 0 ? (
              announcements.map((item, idx) => (
                <div
                  key={item._id || idx}
                  className="student-list-item"
                  style={{ padding: "12px 14px", flexDirection: "column", alignItems: "flex-start", gap: 6 }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                    <strong style={{ fontSize: "0.95rem", color: "#2d3748" }}>
                      {item.title}
                    </strong>
                    <span style={{ fontSize: "0.75rem", color: "#a0aec0" }}>
                      {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "Recent"}
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "#718096", lineHeight: 1.4 }}>
                    {item.content || item.message || "No summary provided."}
                  </p>
                </div>
              ))
            ) : (
              <div style={{ textAlign: "center", padding: "20px", color: "#a0aec0", fontSize: "0.875rem" }}>
                No recent announcements.
              </div>
            )}
          </div>
        </section>

        {/* Upcoming Assignments / Tasks */}
        <section className="student-card student-panel">
          <div
            className="student-panel-header"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <FileText size={18} style={{ color: "#3182ce" }} />
              <h3 style={{ margin: 0 }}>Upcoming Assignments</h3>
            </div>
            <Link
              to="/student/assignments"
              style={{
                fontSize: "0.8rem",
                color: "#3182ce",
                textDecoration: "none",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              View all <ArrowRight size={14} />
            </Link>
          </div>

          <div className="student-list" style={{ marginTop: 12 }}>
            {upcomingAssignments.length > 0 ? (
              upcomingAssignments.map((assignment, idx) => (
                <div
                  key={assignment._id || idx}
                  className="student-list-item"
                  style={{ padding: "12px 14px" }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 6,
                        background: assignment.submitted ? "#e8faf5" : "#fff7ed",
                        color: assignment.submitted ? "#08ad81" : "#f59e0b",
                        display: "grid",
                        placeItems: "center",
                      }}
                    >
                      {assignment.submitted ? <CheckCircle2 size={16} /> : <Clock size={16} />}
                    </div>
                    <div>
                      <strong style={{ display: "block", fontSize: "0.9rem" }}>
                        {assignment.title}
                      </strong>
                      <span style={{ fontSize: "0.75rem", color: "#718096" }}>
                        Due: {assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString() : "TBD"}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`student-status ${assignment.submitted ? "" : "pending"}`}
                    style={{ fontSize: "0.75rem" }}
                  >
                    {assignment.submitted ? "Submitted" : "Pending"}
                  </span>
                </div>
              ))
            ) : (
              <div style={{ textAlign: "center", padding: "20px", color: "#a0aec0", fontSize: "0.875rem" }}>
                No active or pending assignments.
              </div>
            )}
          </div>
        </section>
      </div>
    </StudentLayout>
  );
}