import { useEffect, useMemo, useState } from "react";
import {
  History as HistoryIcon,
  RefreshCw,
  Search,
  CalendarDays,
} from "lucide-react";
import MentorLayout from "../../components/mentor/MentorLayout";
import Toast from "../../components/common/Toast";
import API from "../../api/axios";

export default function History() {
  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const load = async () => {
    setLoading(true);

    try {
      const response = await API.get("/attendance/history");
      setRecords(response.data.data || []);
    } catch (error) {
      setToast({
        message:
          error.response?.data?.message ||
          "Unable to load attendance history.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) return records;

    return records.filter(
      (row) =>
        row.student?.fullname?.toLowerCase().includes(value) ||
        row.status?.toLowerCase().includes(value)
    );
  }, [records, search]);

  return (
    <MentorLayout title="History">
      <Toast
        {...toast}
        onClose={() => setToast(null)}
      />

      <div className="mb-6 flex flex-wrap justify-between items-end gap-4">
        <div>
          

          <p className="text-slate-500 mt-2">
            Review previously recorded attendance.
          </p>
        </div>

        <button
          onClick={load}
          className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 font-bold flex gap-2 items-center"
        >
          <RefreshCw
            size={16}
            className={loading ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-5">
        <div className="relative">
          <Search
            size={17}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search student or attendance status..."
            className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-[#08c98b]"
          />
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400">
            Loading history...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-175 text-sm">
              <thead className="bg-[#062a5c] text-white">
                <tr>
                  <th className="text-left px-5 py-4">
                    Student
                  </th>

                  <th className="text-left px-5 py-4">
                    Date
                  </th>

                  <th className="text-left px-5 py-4">
                    Status
                  </th>

                  <th className="text-left px-5 py-4">
                    Recorded
                  </th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((row) => (
                  <tr
                    key={row._id}
                    className="border-t border-slate-100"
                  >
                    <td className="px-5 py-4 font-black">
                      {row.student?.fullname ||
                        row.studentName ||
                        "Unknown"}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <CalendarDays
                          size={14}
                          className="text-[#08ad81]"
                        />

                        {row.date
                          ? new Date(row.date).toLocaleDateString()
                          : "—"}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`px-3 py-1.5 rounded-full text-xs font-black ${
                          row.status === "present"
                            ? "bg-emerald-50 text-emerald-700"
                            : row.status === "late"
                            ? "bg-amber-50 text-amber-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {row.status || "absent"}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-slate-400">
                      {row.createdAt
                        ? new Date(
                            row.createdAt
                          ).toLocaleString()
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && !filtered.length && (
          <div className="p-12 text-center">
            <HistoryIcon
              size={42}
              className="mx-auto text-slate-300"
            />

            <div className="font-black mt-3">
              No history yet
            </div>

            <p className="text-sm text-slate-400 mt-1">
              Attendance records will appear here after they are recorded.
            </p>
          </div>
        )}
      </div>
    </MentorLayout>
  );
}
