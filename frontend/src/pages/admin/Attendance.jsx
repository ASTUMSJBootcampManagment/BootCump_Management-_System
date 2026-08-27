import { useEffect, useMemo, useState } from "react";
import {
  CalendarCheck2,
  RefreshCw,
  Search,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout";
import API from "../../api/axios";

function getData(response) {
  return response?.data?.data || response?.data || [];
}

function formatDate(value) {
  if (!value) return "—";

  const d = new Date(value);

  if (Number.isNaN(d.getTime())) return String(value);

  return d.toLocaleDateString();
}

export default function AdminAttendance() {
  const [records, setRecords] = useState([]);
  const [students, setStudents] = useState([]);
  const [date, setDate] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
      const [attendanceRes, studentsRes] = await Promise.all([
        API.get("/attendance"),
        API.get("/admin/users?role=Student"),
      ]);

      setRecords(getData(attendanceRes));
      setStudents(getData(studentsRes));
    } catch (error) {
      showToast(
        error.response?.data?.message ||
          "Unable to load attendance information.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filteredRecords = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) return records;

    return records.filter((record) => {
      const student =
        record.student?.fullname ||
        record.studentId?.fullname ||
        record.studentName ||
        "";

      return String(student).toLowerCase().includes(term);
    });
  }, [records, search]);

  const markAttendance = async () => {
    if (!date) {
      showToast("Please select a date.", "error");
      return;
    }

    setSaving(true);

    try {
      await API.post("/attendance/attender", {
        date,
        presentIds: [],
      });

      showToast("Attendance session recorded.");
      await load();
    } catch (error) {
      showToast(
        error.response?.data?.message ||
          "Unable to record attendance.",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  const getStudentName = (record) => {
    return (
      record.student?.fullname ||
      record.studentId?.fullname ||
      record.studentName ||
      "Unknown student"
    );
  };

  const isPresent = (record) => {
    return record.present === true || record.status === "Present";
  };

  return (
    <AdminLayout title="Attendance">
      {toast && (
        <div
          className={`fixed right-5 top-5 z-[100] flex max-w-sm items-center gap-3 rounded-2xl border px-4 py-3 shadow-2xl ${
            toast.type === "error"
              ? "border-red-200 bg-red-50 text-red-700"
              : "border-emerald-200 bg-emerald-50 text-emerald-700"
          }`}
        >
          {toast.type === "error" ? (
            <XCircle size={19} />
          ) : (
            <CheckCircle2 size={19} />
          )}

          <span className="text-sm font-bold">{toast.message}</span>
        </div>
      )}

      <div className="mb-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-[#e8faf5] px-3 py-1 text-xs font-black uppercase tracking-wider text-[#08ad81]">
              <CalendarCheck2 size={14} />
              Attendance management
            </div>

            <h2 className="text-2xl font-black text-[#062a5c]">
              Bootcamp Attendance
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Review attendance records across the bootcamp.
            </p>
          </div>

          <button
            onClick={load}
            disabled={loading}
            className="rounded-xl border border-slate-200 bg-white p-3 text-slate-600 shadow-sm hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw
              size={18}
              className={loading ? "animate-spin" : ""}
            />
          </button>
        </div>
      </div>

      <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4">
          <h3 className="font-black text-[#062a5c]">
            Attendance session
          </h3>
          <p className="mt-1 text-xs text-slate-400">
            Select a date before recording attendance.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#08c98b]"
          />

          <button
            onClick={markAttendance}
            disabled={saving}
            className="rounded-xl bg-[#08c98b] px-5 py-3 text-sm font-black text-white hover:bg-[#07b97e] disabled:opacity-50"
          >
            {saving ? "Saving..." : "Record Session"}
          </button>
        </div>

        <div className="mt-3 text-xs text-slate-400">
          Students available:{" "}
          <strong className="text-slate-600">{students.length}</strong>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center">
          <div>
            <h3 className="font-black text-[#062a5c]">
              Attendance records
            </h3>
            <p className="mt-1 text-xs text-slate-400">
              {filteredRecords.length} records found
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search student..."
              className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-[#08c98b]"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-10 text-center text-sm font-bold text-slate-400">
            Loading attendance...
          </div>
        ) : filteredRecords.length === 0 ? (
          <div className="p-12 text-center">
            <CalendarCheck2
              size={35}
              className="mx-auto text-slate-300"
            />
            <div className="mt-3 font-black text-slate-600">
              No attendance records
            </div>
            <p className="mt-1 text-sm text-slate-400">
              Attendance records will appear here once sessions are recorded.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left">
              <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-5 py-4">Student</th>
                  <th className="px-5 py-4">Date</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Batch</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredRecords.map((record, index) => (
                  <tr key={record._id || index}>
                    <td className="px-5 py-4 font-bold text-slate-700">
                      {getStudentName(record)}
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-500">
                      {formatDate(record.date || record.attendanceDate)}
                    </td>

                    <td className="px-5 py-4">
                      {isPresent(record) ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
                          <CheckCircle2 size={13} />
                          Present
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-3 py-1 text-xs font-black text-red-700">
                          <XCircle size={13} />
                          Absent
                        </span>
                      )}
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-500">
                      {record.batch?.name || record.batchName || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </AdminLayout>
  );
}