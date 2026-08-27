import { useEffect, useMemo, useState } from "react";
import {
  TrendingUp,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock3,
  Circle,
} from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout";
import API from "../../api/axios";

const STATUS_OPTIONS = [
  "Not started",
  "In progress",
  "Needs improvement",
  "Completed",
];

function getData(response) {
  return response?.data?.data || response?.data || [];
}

function statusIcon(status) {
  if (status === "Completed") return CheckCircle2;
  if (status === "Needs improvement") return AlertCircle;
  if (status === "In progress") return Clock3;
  return Circle;
}

function normalizeStatus(value) {
  const text = String(value || "").toLowerCase();

  if (text === "completed") return "Completed";
  if (text === "inprogress" || text === "in progress") {
    return "In progress";
  }
  if (
    text === "needsimprovement" ||
    text === "needs improvement"
  ) {
    return "Needs improvement";
  }

  return "Not started";
}

export default function AdminProgress() {
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });

    window.setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const load = async () => {
    setLoading(true);

    try {
      const response = await API.get(
        "/progress/get/students-progress"
      );

      setRows(getData(response));
    } catch (error) {
      showToast(
        error.response?.data?.message ||
          "Unable to load progress.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();

    return rows.filter((row) => {
      const name =
        row.student?.fullname ||
        row.studentName ||
        "";

      const topic = row.topic || "";

      const matchesSearch =
        !term ||
        String(name).toLowerCase().includes(term) ||
        String(topic).toLowerCase().includes(term);

      const status = normalizeStatus(row.status);

      const matchesStatus =
        statusFilter === "All" || status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [rows, search, statusFilter]);

  const updateProgress = async (row, status) => {
    const studentId =
      row.student?._id ||
      row.studentId?._id ||
      row.studentId;

    if (!studentId) {
      showToast("Student ID is missing from this record.", "error");
      return;
    }

    setSavingId(row._id);

    try {
      const response = await API.patch(
        `/progress/update-progress/${studentId}`,
        {
          topic: row.topic,
          status,
          batch: row.batch?._id || row.batch,
        }
      );

      const updated = response?.data?.data;

      setRows((current) =>
        current.map((item) =>
          item._id === row._id
            ? { ...item, ...(updated || {}), status }
            : item
        )
      );

      showToast("Progress updated.");
    } catch (error) {
      showToast(
        error.response?.data?.message ||
          "Unable to update progress.",
        "error"
      );
    } finally {
      setSavingId(null);
    }
  };

  const completed = rows.filter(
    (r) => normalizeStatus(r.status) === "Completed"
  ).length;

  const inProgress = rows.filter(
    (r) => normalizeStatus(r.status) === "In progress"
  ).length;

  const needsImprovement = rows.filter(
    (r) => normalizeStatus(r.status) === "Needs improvement"
  ).length;

  return (
    <AdminLayout title="Progress">
      {toast && (
        <div
          className={`fixed right-5 top-5 z-[100] rounded-2xl border px-4 py-3 text-sm font-bold shadow-2xl ${
            toast.type === "error"
              ? "border-red-200 bg-red-50 text-red-700"
              : "border-emerald-200 bg-emerald-50 text-emerald-700"
          }`}
        >
          {toast.message}
        </div>
      )}

      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-[#e8faf5] px-3 py-1 text-xs font-black uppercase tracking-wider text-[#08ad81]">
            <TrendingUp size={14} />
            Learning progress
          </div>

          <h2 className="text-2xl font-black text-[#062a5c]">
            Student Progress
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Monitor and update curriculum progress across students.
          </p>
        </div>

        <button
          onClick={load}
          disabled={loading}
          className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm hover:bg-slate-50 disabled:opacity-50"
        >
          <RefreshCw
            size={18}
            className={loading ? "animate-spin" : ""}
          />
        </button>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Stat
          label="Completed"
          value={completed}
          icon={CheckCircle2}
        />

        <Stat
          label="In progress"
          value={inProgress}
          icon={Clock3}
        />

        <Stat
          label="Needs improvement"
          value={needsImprovement}
          icon={AlertCircle}
        />
      </div>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="font-black text-[#062a5c]">
              Progress records
            </h3>
            <p className="mt-1 text-xs text-slate-400">
              {filtered.length} records
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Student or topic..."
                className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-[#08c98b] sm:w-64"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold outline-none focus:border-[#08c98b]"
            >
              <option value="All">All statuses</option>
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="p-10 text-center text-sm font-bold text-slate-400">
            Loading progress...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-sm text-slate-400">
            No progress records found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left">
              <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-5 py-4">Student</th>
                  <th className="px-5 py-4">Topic</th>
                  <th className="px-5 py-4">Batch</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Update</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filtered.map((row, index) => {
                  const status = normalizeStatus(row.status);
                  const Icon = statusIcon(status);

                  return (
                    <tr key={row._id || index}>
                      <td className="px-5 py-4 font-bold text-slate-700">
                        {row.student?.fullname ||
                          row.studentName ||
                          "Unknown"}
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {row.topic || "—"}
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-500">
                        {row.batch?.name ||
                          row.batchName ||
                          "—"}
                      </td>

                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">
                          <Icon size={13} />
                          {status}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <select
                          value={status}
                          disabled={savingId === row._id}
                          onChange={(e) =>
                            updateProgress(
                              row,
                              e.target.value
                            )
                          }
                          className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold outline-none focus:border-[#08c98b] disabled:opacity-50"
                        >
                          {STATUS_OPTIONS.map((option) => (
                            <option key={option} value={option}>
                              {option}
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
        )}
      </section>
    </AdminLayout>
  );
}

function Stat({ label, value, icon: Icon }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs font-black uppercase tracking-wider text-slate-400">
            {label}
          </div>

          <div className="mt-2 text-3xl font-black text-[#062a5c]">
            {value}
          </div>
        </div>

        <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#e8faf5] text-[#08ad81]">
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
}