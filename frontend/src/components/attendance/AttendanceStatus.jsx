import { useEffect, useState } from "react";
import {
  FiCalendar,
  FiChevronDown,
  FiSave,
  FiX,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";

import {
  getAttendance,
  markAttendance,
} from "../../services/attendanceService";

const statuses = ["Present", "Absent", "Late", "Excused"];

const Attendance = () => {
  const [batch, setBatch] = useState("WD-2026-01");

  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getAttendance();

        const records = response?.data || [];

        const studentMap = new Map();

        records.forEach((record) => {
          if (!record.student?._id) return;

          const studentId = record.student._id;

          if (!studentMap.has(studentId)) {
            studentMap.set(studentId, {
              id: studentId,
              name: record.student.name,
              email: record.student.email,
            });
          }
        });

        setStudents(Array.from(studentMap.values()));
      } catch (err) {
        setError(
          err?.response?.data?.message ||
            "Failed to load students and attendance.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, []);

  const handleStatusChange = (studentId, status) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: status,
    }));

    setError("");
    setSuccess("");
  };
  const handleSave = async () => {
    setError("");
    setSuccess("");

    const unmarked = students.filter((student) => !attendance[student.id]);

    if (unmarked.length > 0) {
      setError("Please select an attendance status for every student.");
      return;
    }

    try {
      setSaving(true);

      await Promise.all(
        students.map((student) =>
          markAttendance({
            student: student.id,
            batch: batch,

            status: attendance[student.id].toLowerCase(),

            date,
          }),
        ),
      );

      setSuccess("Attendance saved successfully.");
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Failed to save attendance. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setAttendance({});
    setError("");
    setSuccess("");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

            <p className="mt-4 text-sm text-slate-500">Loading students...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Mark Attendance
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Record attendance for students in your current batch.
          </p>
        </div>

        {/* Error */}
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

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <FiCalendar size={20} />
              </div>

              <div>
                <h2 className="font-bold text-slate-900">Attendance</h2>

                <p className="text-xs text-slate-500">Current batch</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 border-b border-slate-200 p-5 sm:grid-cols-2 sm:p-6">
            {/* Batch */}
            <div>
              <label
                htmlFor="batch"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Batch
              </label>

              <div className="relative">
                <select
                  id="batch"
                  value={batch}
                  onChange={(e) => setBatch(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-slate-300 bg-white px-4 py-3 pr-10 text-sm text-slate-700 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="WD-2026-01">
                    WD-2026-01 • Web Development
                  </option>

                  <option value="WD-2026-02">
                    WD-2026-02 • Web Development
                  </option>
                </select>

                <FiChevronDown
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={17}
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="date"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Date
              </label>

              <input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>
          {students.length === 0 ? (
            <div className="p-10 text-center">
              <FiAlertCircle className="mx-auto text-slate-400" size={30} />

              <h3 className="mt-4 font-semibold text-slate-800">
                No students found
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                No students were returned by the backend.
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full min-w-190">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Student
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Email
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Status
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {students.map((student) => {
                      const selected = attendance[student.id] || "";

                      return (
                        <tr
                          key={student.id}
                          className="border-t border-slate-100 hover:bg-slate-50"
                        >
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-blue-600">
                                {student.name?.charAt(0)?.toUpperCase()}
                              </div>

                              <p className="text-sm font-semibold text-slate-800">
                                {student.name}
                              </p>
                            </div>
                          </td>
                          <td className="px-5 py-4 text-sm text-slate-500">
                            {student.email || "-"}
                          </td>
                          <td className="px-5 py-4">
                            <select
                              value={selected}
                              onChange={(e) =>
                                handleStatusChange(student.id, e.target.value)
                              }
                              className={`w-full max-w-47.5 rounded-xl border px-3 py-2.5 text-sm font-semibold outline-none transition focus:ring-2 ${
                                selected === "Present"
                                  ? "border-green-200 bg-green-50 text-green-700 focus:ring-green-100"
                                  : selected === "Absent"
                                    ? "border-red-200 bg-red-50 text-red-700 focus:ring-red-100"
                                    : selected === "Late"
                                      ? "border-amber-200 bg-amber-50 text-amber-700 focus:ring-amber-100"
                                      : selected === "Excused"
                                        ? "border-blue-200 bg-blue-50 text-blue-700 focus:ring-blue-100"
                                        : "border-slate-300 bg-white text-slate-500 focus:ring-blue-100"
                              }`}
                            >
                              <option value="">Choose status</option>
                              {statuses.map((status) => (
                                <option key={status} value={status}>
                                  {status}
                                </option>
                              ))}
                            </select>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="flex flex-col-reverse gap-3 border-t border-slate-200 p-5 sm:flex-row sm:justify-end sm:p-6">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={saving}
                  className="flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <FiX size={17} />
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center justify-center gap-2 rounded-xl bg-green-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <FiSave size={17} />

                  {saving ? "Saving..." : "Save Attendance"}
                </button>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
};

export default Attendance;
