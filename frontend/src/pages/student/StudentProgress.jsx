<<<<<<< HEAD
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FiBarChart2,
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
  FiBookOpen,
  FiRefreshCw,
} from "react-icons/fi";

const StudentProgress = () => {
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get(
        "/api/progress/my-progress",
        config
      );

      const data = response.data?.data;

      if (Array.isArray(data)) {
        setProgress(data);
      } else {
        setProgress(
          data?.progress ||
            data?.records ||
            data?.items ||
            []
        );
      }
    } catch (err) {
      console.error(
        "Progress error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to load your progress."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // HELPERS
  // =========================

  const getStatus = (item) => {
    const status = String(
      item.status ||
        item.progressStatus ||
        ""
    ).toLowerCase();

    if (status === "completed") {
      return "Completed";
    }

    if (
      status === "in progress" ||
      status === "in-progress" ||
      status === "inprogress"
    ) {
      return "In Progress";
    }

    if (
      status === "needs improvement" ||
      status === "needs-improvement" ||
      status === "needsimprovement"
    ) {
      return "Needs Improvement";
    }

    if (
      status === "not started" ||
      status === "not-started" ||
      status === "notstarted"
    ) {
      return "Not Started";
    }

    return item.status || "Not Started";
  };

  const getPercentage = (item) => {
    if (
      item.percentage !== undefined &&
      item.percentage !== null
    ) {
      return Math.min(
        Math.max(
          Number(item.percentage) || 0,
          0
        ),
        100
      );
    }

    if (
      item.progress !== undefined &&
      item.progress !== null
    ) {
      return Math.min(
        Math.max(
          Number(item.progress) || 0,
          0
        ),
        100
      );
    }

    if (
      item.progressPercentage !==
        undefined &&
      item.progressPercentage !== null
    ) {
      return Math.min(
        Math.max(
          Number(
            item.progressPercentage
          ) || 0,
          0
        ),
        100
      );
    }

    const status = getStatus(item);

    if (status === "Completed") {
      return 100;
    }

    if (status === "In Progress") {
      return 60;
    }

    if (status === "Needs Improvement") {
      return 40;
    }

    return 0;
  };

  const getTopic = (item) => {
    return (
      item.topic ||
      item.title ||
      item.module ||
      item.name ||
      "Untitled Topic"
    );
  };

  const getDescription = (item) => {
    return (
      item.description ||
      item.notes ||
      item.comment ||
      ""
    );
  };

  const getMentor = (item) => {
    if (typeof item.mentor === "string") {
      return item.mentor;
    }

    return (
      item.mentor?.name ||
      item.mentor?.fullName ||
      item.mentor?.username ||
      "-"
    );
  };

  // =========================
  // SUMMARY
  // =========================

  const completed = progress.filter(
    (item) =>
      getStatus(item) === "Completed"
  ).length;

  const inProgress = progress.filter(
    (item) =>
      getStatus(item) === "In Progress"
  ).length;

  const needsImprovement = progress.filter(
    (item) =>
      getStatus(item) ===
      "Needs Improvement"
  ).length;

  const notStarted = progress.filter(
    (item) =>
      getStatus(item) === "Not Started"
  ).length;

  const overallPercentage =
    progress.length > 0
      ? Math.round(
          progress.reduce(
            (total, item) =>
              total + getPercentage(item),
            0
          ) / progress.length
        )
      : 0;

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="space-y-6">

        <div>
          <div className="h-8 w-56 rounded-lg bg-slate-200 animate-pulse" />

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

        <div className="h-40 rounded-2xl bg-white border border-slate-100 animate-pulse" />

        <div className="h-96 rounded-2xl bg-white border border-slate-100 animate-pulse" />

      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* =========================
          HEADER
      ========================== */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

        <div>

          <h1 className="text-2xl sm:text-3xl font-bold text-[#082A5B]">
            My Progress
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Track your learning progress and
            completed topics.
          </p>

        </div>

        <button
          type="button"
          onClick={fetchProgress}
          className="flex items-center justify-center gap-2 self-start rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-slate-50"
        >
          <FiRefreshCw />

          Refresh
        </button>

      </div>

      {/* =========================
          ERROR
      ========================== */}

      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">

          <FiAlertCircle className="shrink-0 text-lg" />

          <span>{error}</span>

        </div>
      )}

      {/* =========================
          SUMMARY CARDS
      ========================== */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

        <ProgressSummary
          title="Overall Progress"
          value={`${overallPercentage}%`}
          description="Average progress"
          icon={FiBarChart2}
        />

        <ProgressSummary
          title="Completed"
          value={completed}
          description="Completed topics"
          icon={FiCheckCircle}
        />

        <ProgressSummary
          title="In Progress"
          value={inProgress}
          description="Currently learning"
          icon={FiClock}
        />

        <ProgressSummary
          title="Needs Improvement"
          value={needsImprovement}
          description="Topics to review"
          icon={FiAlertCircle}
        />

      </div>

      {/* =========================
          OVERALL PROGRESS
      ========================== */}

      <section className="rounded-2xl border border-slate-100 bg-white p-5 sm:p-6 shadow-sm">

        <div className="flex items-center justify-between gap-4">

          <div>

            <h2 className="text-lg font-bold text-[#082A5B]">
              Overall Learning Progress
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Your average progress across
              recorded topics.
            </p>

          </div>

          <span className="text-2xl font-bold text-[#0F766E]">
            {overallPercentage}%
          </span>

        </div>

        <div className="mt-5 h-3 w-full overflow-hidden rounded-full bg-slate-100">

          <div
            className="h-full rounded-full bg-[#10B981] transition-all duration-500"
            style={{
              width: `${overallPercentage}%`,
            }}
          />

        </div>

      </section>

      {/* =========================
          TOPICS
      ========================== */}

      <section className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">

        <div className="border-b border-slate-100 p-5 sm:p-6">

          <h2 className="text-lg font-bold text-[#082A5B]">
            Topic Progress
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Detailed progress for your
            learning topics.
          </p>

        </div>

        {progress.length === 0 ? (
          <div className="flex min-h-64 items-center justify-center p-6 text-center">

            <div>

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                <FiBookOpen className="text-2xl" />
              </div>

              <h3 className="mt-4 font-semibold text-slate-700">
                No progress records
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Your learning progress will
                appear here.
              </p>

            </div>

          </div>
        ) : (
          <div className="divide-y divide-slate-100">

            {progress.map(
              (item, index) => {

                const status =
                  getStatus(item);

                const percentage =
                  getPercentage(item);

                return (
                  <div
                    key={
                      item._id ||
                      item.id ||
                      index
                    }
                    className="p-5 sm:p-6 transition hover:bg-slate-50"
                  >

                    {/* TOP */}

                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">

                      <div className="min-w-0">

                        <div className="flex items-start gap-3">

                          <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E8F7F2] text-[#0F766E]">

                            <FiBookOpen />

                          </div>

                          <div className="min-w-0">

                            <h3 className="font-semibold text-slate-800">
                              {getTopic(item)}
                            </h3>

                            {getDescription(
                              item
                            ) && (
                              <p className="mt-1 text-xs text-slate-500">
                                {getDescription(
                                  item
                                )}
                              </p>
                            )}

                          </div>

                        </div>

                      </div>

                      <StatusBadge
                        status={status}
                      />

                    </div>

                    {/* PROGRESS BAR */}

                    <div className="mt-5">

                      <div className="mb-2 flex items-center justify-between">

                        <span className="text-xs font-medium text-slate-500">
                          Progress
                        </span>

                        <span className="text-xs font-bold text-slate-700">
                          {percentage}%
                        </span>

                      </div>

                      <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">

                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            status ===
                            "Completed"
                              ? "bg-[#10B981]"
                              : status ===
                                "In Progress"
                              ? "bg-[#0F766E]"
                              : status ===
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

                    {/* FOOTER */}

                    <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-400">

                      {getMentor(item) !==
                        "-" && (
                        <span>
                          Mentor:{" "}
                          <span className="font-medium text-slate-500">
                            {getMentor(item)}
                          </span>
                        </span>
                      )}

                      {item.updatedAt && (
                        <span>
                          Updated:{" "}
                          <span className="font-medium text-slate-500">
                            {new Date(
                              item.updatedAt
                            ).toLocaleDateString()}
                          </span>
                        </span>
                      )}

                    </div>

                  </div>
                );
              }
            )}

          </div>
        )}

      </section>

      {/* =========================
          STATUS LEGEND
      ========================== */}

      <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">

        <h3 className="text-sm font-bold text-[#082A5B]">
          Progress Status
        </h3>

        <div className="mt-4 flex flex-wrap gap-4">

          <Legend
            label="Completed"
            className="bg-green-100 text-green-700"
          />

          <Legend
            label="In Progress"
            className="bg-teal-100 text-teal-700"
          />

          <Legend
            label="Needs Improvement"
            className="bg-amber-100 text-amber-700"
          />

          <Legend
            label="Not Started"
            className="bg-slate-100 text-slate-600"
          />

        </div>

      </section>

    </div>
  );
};

/* =========================
   SUMMARY CARD
========================= */

const ProgressSummary = ({
  title,
  value,
  description,
  icon: Icon,
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
   STATUS BADGE
========================= */

const StatusBadge = ({ status }) => {
  let classes =
    "bg-slate-100 text-slate-600";

  if (status === "Completed") {
    classes =
      "bg-green-100 text-green-700";
  }

  if (status === "In Progress") {
    classes =
      "bg-teal-100 text-teal-700";
  }

  if (status === "Needs Improvement") {
    classes =
      "bg-amber-100 text-amber-700";
  }

  return (
    <span
      className={`inline-flex self-start rounded-full px-3 py-1 text-xs font-semibold ${classes}`}
    >
      {status}
    </span>
  );
};

/* =========================
   LEGEND
========================= */

const Legend = ({
  label,
  className,
}) => {
  return (
    <div className="flex items-center gap-2">

      <span
        className={`h-2.5 w-2.5 rounded-full ${className}`}
      />

      <span className="text-xs text-slate-500">
        {label}
      </span>

=======
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StudentProgress = () => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/progress/my-progress', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTopics(res.data);
      } catch (err) {
        console.error('Error fetching progress:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProgress();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed':
        return <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">Completed</span>;
      case 'In Progress':
        return <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">In Progress</span>;
      case 'Needs Improvement':
        return <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full">Needs Improvement</span>;
      default:
        return <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-full">Not Started</span>;
    }
  };

  if (loading) return <div className="p-6 text-slate-600">Loading progress...</div>;

  return (
    <div className="p-6 space-y-6 bg-[#F8FAFC] min-h-screen">
      <h1 className="text-2xl font-bold text-[#0F172A]">Topic Progress & Summary</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {topics.map((item) => (
          <div key={item._id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-3">
                <span className="text-xs font-bold text-[#14B8A6] uppercase tracking-wide">
                  {item.category || 'General'}
                </span>
                {getStatusBadge(item.status)}
              </div>
              <h3 className="text-lg font-bold text-[#0F172A]">{item.topicName}</h3>
              <p className="text-sm text-slate-600 mt-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                {item.notes || 'No mentor notes provided yet.'}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-400">
              Last updated: {new Date(item.updatedAt).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
>>>>>>> 214d84b7c5f769fb4594a0436d655bc9571b2928
    </div>
  );
};

export default StudentProgress;