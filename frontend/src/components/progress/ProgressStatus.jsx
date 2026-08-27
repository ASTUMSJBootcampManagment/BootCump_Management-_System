import { useEffect, useState } from "react";
import {
  FiBookOpen,
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
  FiRefreshCw,
} from "react-icons/fi";

import {
  getStudentsProgress,
  updateProgress,
} from "../../services/progressService";

const statuses = ["NotStarted", "InProgress", "Completed", "NeedsImprovement"];

const Progress = () => {
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchProgress = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getStudentsProgress();
      console.log("Fetched progress data:", response);
      setProgress(response?.data || []);
    } catch (err) {
      console.error("Fetch progress error:", err?.response || err);
      setError(
        err?.response?.data?.message || "Failed to load students progress."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgress();
  }, []);

  const handleStatusChange = async (targetId, status, topic) => {
    try {
      setUpdating(targetId);
      setError("");
      setSuccess("");

      console.log("Attempting status update:", { targetId, status });

      const response = await updateProgress(targetId, status, topic);
      console.log("Update success response:", response);

      const updatedStatus = response?.data?.status || status;

      setProgress((prev) =>
        prev.map((item) => {
          const currentStudentId = item.student?._id;
          const currentRecordId = item._id;

          if (currentStudentId === targetId || currentRecordId === targetId) {
            return { ...item, status: updatedStatus };
          }
          return item;
        })
      );

      setSuccess("Progress updated successfully.");
    } catch (err) {
      console.error("DEBUG ERROR LOG:", err);
      console.error("SERVER ERROR RESPONSE:", err?.response?.data);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to update progress."
      );
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
            <p className="mt-4 text-sm text-slate-500">
              Loading students progress...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Student Progress
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Monitor and update progress for students in your batch.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchProgress}
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            <FiRefreshCw size={17} />
            Refresh
          </button>
        </div>

        {error && (
          <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <FiAlertCircle className="mt-0.5 shrink-0" size={18} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-5 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
            <FiCheckCircle className="mt-0.5 shrink-0" size={18} />
            <span>{success}</span>
          </div>
        )}

        {progress.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
              <FiBookOpen size={25} className="text-slate-400" />
            </div>
            <h2 className="mt-4 font-semibold text-slate-800">
              No progress records
            </h2>
            <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">
              There are currently no progress records for students in your
              assigned batch.
            </p>
          </div>
        ) : (
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-187.5">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Student
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Topic
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {progress.map((item) => {
                    const studentId = item.student?._id || item._id;

                    return (
                      <tr
                        key={item._id}
                        className="border-t border-slate-100 hover:bg-slate-50"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-blue-600">
                              {item.student?.name?.charAt(0)?.toUpperCase() ||
                                "?"}
                            </div>
                            <p className="text-sm font-semibold text-slate-800">
                              {item.student?.name || "Unknown student"}
                            </p>
                          </div>
                        </td>

                        <td className="px-6 py-4 text-sm text-slate-500">
                          {item.student?.email || "-"}
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <FiBookOpen className="text-blue-500" size={17} />
                            <span className="text-sm font-medium text-slate-700">
                              {item.topic || "-"}
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <select
                            value={item.status || "NotStarted"}
                            disabled={updating === studentId}
                            onChange={(e) =>
                              handleStatusChange(studentId, e.target.value, item.topic)
                            }
                            className={`rounded-xl border px-3 py-2.5 text-sm font-semibold outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 ${
                              item.status === "Completed"
                                ? "border-green-200 bg-green-50 text-green-700 focus:ring-green-100"
                                : item.status === "InProgress"
                                  ? "border-blue-200 bg-blue-50 text-blue-700 focus:ring-blue-100"
                                  : item.status === "NeedsImprovement"
                                    ? "border-amber-200 bg-amber-50 text-amber-700 focus:ring-amber-100"
                                    : "border-slate-300 bg-white text-slate-600 focus:ring-blue-100"
                            }`}
                          >
                            {statuses.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>

                          {updating === studentId && (
                            <span className="ml-2 inline-flex items-center text-xs text-slate-400">
                              <FiClock className="mr-1" size={13} />
                              Updating...
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="space-y-3 p-4 md:hidden">
              {progress.map((item) => {
                const studentId = item.student?._id || item._id;

                return (
                  <div
                    key={item._id}
                    className="rounded-xl border border-slate-200 p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 font-bold text-blue-600">
                        {item.student?.name?.charAt(0)?.toUpperCase() || "?"}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-slate-800">
                          {item.student?.name || "Unknown student"}
                        </p>
                        <p className="mt-1 truncate text-xs text-slate-500">
                          {item.student?.email || "-"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 rounded-lg bg-slate-50 p-3">
                      <p className="text-xs text-slate-400">Topic</p>
                      <p className="mt-1 text-sm font-semibold text-slate-700">
                        {item.topic || "-"}
                      </p>
                    </div>

                    <div className="mt-3">
                      <label className="mb-2 block text-xs font-semibold text-slate-500">
                        Progress Status
                      </label>
                      <select
                        value={item.status || "NotStarted"}
                        disabled={updating === studentId}
                        onChange={(e) =>
                          handleStatusChange(studentId, e.target.value, item.topic)
                        }
                        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:opacity-60"
                      >
                        {statuses.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default Progress;
