import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FiCalendar,
  FiBarChart2,
  FiClipboard,
  FiAward,
  FiArrowRight,
  FiClock,
} from "react-icons/fi";
import { Link } from "react-router-dom";

const StudentDashboard = () => {
  const [attendance, setAttendance] = useState(null);
  const [progress, setProgress] = useState([]);
  const [assignments, setAssignments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const results = await Promise.allSettled([
        axios.get("/api/attendance/my", config),
        axios.get("/api/progress/my-progress", config),
        axios.get(
          "/api/assignments/my-assignments",
          config
        ),
      ]);

      // =========================
      // ATTENDANCE
      // =========================

      if (results[0].status === "fulfilled") {
        setAttendance(
          results[0].value.data?.data || null
        );
      }

      // =========================
      // PROGRESS
      // =========================

      if (results[1].status === "fulfilled") {
        setProgress(
          results[1].value.data?.data || []
        );
      }

      // =========================
      // ASSIGNMENTS
      // =========================

      if (results[2].status === "fulfilled") {
        const data = results[2].value.data;

        setAssignments(
          Array.isArray(data)
            ? data
            : data?.data || []
        );
      }
    } catch (err) {
      console.error(
        "Dashboard error:",
        err
      );

      setError(
        "Unable to load dashboard information."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // CALCULATIONS
  // =========================

  const totalTopics = progress.length;

  const completedTopics = progress.filter(
    (item) => item.status === "Completed"
  ).length;

  const progressPercentage =
    totalTopics > 0
      ? Math.round(
          (completedTopics / totalTopics) *
            100
        )
      : 0;

  const submittedAssignments =
    assignments.filter(
      (item) =>
        item.submission ||
        item.submissionStatus === "Submitted" ||
        item.submissionStatus === "Graded"
    ).length;

  const gradedAssignments =
    assignments.filter(
      (item) =>
        item.grade !== null &&
        item.grade !== undefined
    );

  const averageGrade =
    gradedAssignments.length > 0
      ? Math.round(
          gradedAssignments.reduce(
            (total, item) =>
              total + Number(item.grade),
            0
          ) / gradedAssignments.length
        )
      : 0;

  const upcomingAssignments =
    [...assignments]
      .filter(
        (item) =>
          item.dueDate &&
          new Date(item.dueDate) >=
            new Date()
      )
      .sort(
        (a, b) =>
          new Date(a.dueDate) -
          new Date(b.dueDate)
      )
      .slice(0, 4);

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="space-y-6">

        <div>
          <div className="h-8 w-64 rounded-lg bg-slate-200 animate-pulse" />

          <div className="mt-2 h-4 w-80 rounded bg-slate-200 animate-pulse" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-32 rounded-2xl bg-white border border-slate-100 animate-pulse"
            />
          ))}

        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

          <div className="h-80 rounded-2xl bg-white border border-slate-100 animate-pulse" />

          <div className="h-80 rounded-2xl bg-white border border-slate-100 animate-pulse" />

        </div>

      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* =========================
          HEADER
      ========================== */}

      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#082A5B]">
          Student Dashboard
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Welcome back. Here is your bootcamp
          overview.
        </p>
      </div>

      {/* =========================
          ERROR
      ========================== */}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* =========================
          SUMMARY CARDS
      ========================== */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

        <SummaryCard
          icon={FiCalendar}
          title="Attendance"
          value={`${
            attendance?.attendancePercentage ||
            0
          }%`}
          description="Overall attendance"
        />

        <SummaryCard
          icon={FiBarChart2}
          title="Progress"
          value={`${progressPercentage}%`}
          description={`${completedTopics} completed topics`}
        />

        <SummaryCard
          icon={FiClipboard}
          title="Assignments"
          value={assignments.length}
          description={`${submittedAssignments} submitted`}
        />

        <SummaryCard
          icon={FiAward}
          title="Average Grade"
          value={`${averageGrade}%`}
          description={`${gradedAssignments.length} graded`}
        />

      </div>

      {/* =========================
          PROGRESS + ASSIGNMENTS
      ========================== */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* PROGRESS */}

        <section className="rounded-2xl border border-slate-100 bg-white p-5 sm:p-6 shadow-sm">

          <div className="flex items-center justify-between mb-6">

            <div>
              <h2 className="text-lg font-bold text-[#082A5B]">
                My Progress
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Your latest topic progress
              </p>
            </div>

            <Link
              to="/student/progress"
              className="flex items-center gap-1 text-sm font-semibold text-[#0F766E] hover:text-[#065f59]"
            >
              View all
              <FiArrowRight />
            </Link>

          </div>

          {progress.length === 0 ? (
            <EmptyState text="No progress records available yet." />
          ) : (
            <div className="space-y-5">

              {progress
                .slice(0, 5)
                .map((item) => {

                  const percentage =
                    item.status ===
                    "Completed"
                      ? 100
                      : item.status ===
                        "In Progress"
                      ? 60
                      : item.status ===
                        "Needs Improvement"
                      ? 40
                      : 0;

                  return (
                    <div
                      key={item._id}
                    >

                      <div className="flex items-center justify-between gap-4 mb-2">

                        <p className="text-sm font-semibold text-slate-700 truncate">
                          {item.topic ||
                            "Untitled Topic"}
                        </p>

                        <span className="shrink-0 text-xs font-medium text-slate-500">
                          {item.status ||
                            "Not Started"}
                        </span>

                      </div>

                      <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">

                        <div
                          className={`h-full rounded-full transition-all ${
                            item.status ===
                            "Completed"
                              ? "bg-[#10B981]"
                              : item.status ===
                                "In Progress"
                              ? "bg-[#0F766E]"
                              : item.status ===
                                "Needs Improvement"
                              ? "bg-[#D4A72C]"
                              : "bg-slate-300"
                          }`}
                          style={{
                            width: `${percentage}%`,
                          }}
                        />

                      </div>

                    </div>
                  );
                })}

            </div>
          )}

        </section>

        {/* UPCOMING ASSIGNMENTS */}

        <section className="rounded-2xl border border-slate-100 bg-white p-5 sm:p-6 shadow-sm">

          <div className="flex items-center justify-between mb-6">

            <div>
              <h2 className="text-lg font-bold text-[#082A5B]">
                Upcoming Assignments
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Your next deadlines
              </p>
            </div>

            <Link
              to="/student/assignments"
              className="flex items-center gap-1 text-sm font-semibold text-[#0F766E] hover:text-[#065f59]"
            >
              View all
              <FiArrowRight />
            </Link>

          </div>

          {upcomingAssignments.length ===
          0 ? (
            <EmptyState text="No upcoming assignments." />
          ) : (
            <div className="space-y-3">

              {upcomingAssignments.map(
                (assignment) => {

                  const dueDate =
                    new Date(
                      assignment.dueDate
                    );

                  return (
                    <div
                      key={assignment._id}
                      className="flex items-center justify-between gap-4 rounded-xl border border-slate-100 bg-[#F8FAFC] p-4"
                    >

                      <div className="min-w-0">

                        <h3 className="truncate text-sm font-semibold text-slate-800">
                          {assignment.title}
                        </h3>

                        <div className="mt-1 flex items-center gap-1 text-xs text-slate-500">

                          <FiClock />

                          <span>
                            Due{" "}
                            {dueDate.toLocaleDateString()}
                          </span>

                        </div>

                      </div>

                      <span className="shrink-0 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                        Pending
                      </span>

                    </div>
                  );
                }
              )}

            </div>
          )}

        </section>

      </div>

      {/* =========================
          ATTENDANCE
      ========================== */}

      <section className="rounded-2xl border border-slate-100 bg-white p-5 sm:p-6 shadow-sm">

        <div className="flex items-center justify-between mb-6">

          <div>
            <h2 className="text-lg font-bold text-[#082A5B]">
              Attendance Summary
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Your attendance record
            </p>
          </div>

          <Link
            to="/student/attendance"
            className="flex items-center gap-1 text-sm font-semibold text-[#0F766E] hover:text-[#065f59]"
          >
            View history
            <FiArrowRight />
          </Link>

        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

          <AttendanceItem
            title="Present"
            value={
              attendance?.presentCount || 0
            }
            className="text-green-600"
          />

          <AttendanceItem
            title="Absent"
            value={
              attendance?.absentCount || 0
            }
            className="text-red-500"
          />

          <AttendanceItem
            title="Late"
            value={
              attendance?.lateCount || 0
            }
            className="text-amber-600"
          />

          <AttendanceItem
            title="Excused"
            value={
              attendance?.excusedCount || 0
            }
            className="text-blue-600"
          />

        </div>

      </section>

      {/* =========================
          QUICK ACCESS
      ========================== */}

      <section>

        <h2 className="mb-4 text-lg font-bold text-[#082A5B]">
          Quick Access
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <QuickLink
            to="/student/attendance"
            icon={FiCalendar}
            title="Attendance"
            description="View your attendance history."
          />

          <QuickLink
            to="/student/progress"
            icon={FiBarChart2}
            title="Progress"
            description="Track your topic progress."
          />

          <QuickLink
            to="/student/assignments"
            icon={FiClipboard}
            title="Assignments"
            description="View and submit your work."
          />

        </div>

      </section>

    </div>
  );
};

/* =========================
   SUMMARY CARD
========================= */

const SummaryCard = ({
  icon: Icon,
  title,
  value,
  description,
}) => {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">

      <div className="flex items-start justify-between">

        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <p className="mt-2 text-3xl font-bold text-[#082A5B]">
            {value}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            {description}
          </p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E8F7F2] text-[#0F766E]">

          <Icon className="text-xl" />

        </div>

      </div>

    </div>
  );
};

/* =========================
   ATTENDANCE ITEM
========================= */

const AttendanceItem = ({
  title,
  value,
  className,
}) => {
  return (
    <div className="rounded-xl border border-slate-100 bg-[#F8FAFC] p-4">

      <p className="text-xs font-medium text-slate-500">
        {title}
      </p>

      <p
        className={`mt-1 text-2xl font-bold ${className}`}
      >
        {value}
      </p>

    </div>
  );
};

/* =========================
   QUICK LINK
========================= */

const QuickLink = ({
  to,
  icon: Icon,
  title,
  description,
}) => {
  return (
    <Link
      to={to}
      className="group rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >

      <div className="flex items-center gap-4">

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#E8F7F2] text-[#0F766E]">

          <Icon className="text-xl" />

        </div>

        <div>

          <h3 className="font-bold text-[#082A5B]">
            {title}
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            {description}
          </p>

        </div>

      </div>

      <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-[#0F766E]">

        Open

        <FiArrowRight className="transition group-hover:translate-x-1" />

      </div>

    </Link>
  );
};

/* =========================
   EMPTY STATE
========================= */

const EmptyState = ({ text }) => {
  return (
    <div className="flex min-h-32 items-center justify-center rounded-xl bg-[#F8FAFC] text-center text-sm text-slate-500">
      {text}
    </div>
  );
};

export default StudentDashboard;