import { useEffect, useMemo, useState } from "react";
import {
  RefreshCw,
  Save,
  TrendingUp,
  Search,
} from "lucide-react";
import MentorLayout from "../../components/mentor/MentorLayout";
import Toast from "../../components/common/Toast";
import API from "../../api/axios";

const STATUSES = [
  "Not started",
  "In progress",
  "Needs improvement",
  "Completed",
];

function normalizeStatus(status) {
  if (!status) return "Not started";

  const value = String(status).toLowerCase();

  if (value === "inprogress" || value === "in progress") {
    return "In progress";
  }

  if (value === "needsimprovement" || value === "needs improvement") {
    return "Needs improvement";
  }

  if (value === "completed") {
    return "Completed";
  }

  return "Not started";
}

export default function Progress() {
  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState("");
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const load = async () => {
    setLoading(true);

    try {
      const response = await API.get(
        "/progress/get/students-progress"
      );

      setRecords(response.data.data || []);
    } catch (error) {
      setToast({
        message:
          error.response?.data?.message ||
          "Unable to load progress records.",
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
        row.topic?.toLowerCase().includes(value)
    );
  }, [records, search]);

  const update = async (row, status, notes = row.notes || "") => {
    setSaving(row._id);

    try {
      const response = await API.patch(`/progress/update-progress/${row.student?._id || row.student}`, {
        topic: row.topic,
        status,
        notes,
      });

      const updated = response.data.data;

      setRecords((previous) =>
        previous.map((item) =>
          item._id === row._id
            ? { ...item, ...updated, status, notes }
            : item
        )
      );

      setToast({
        message: `${row.student?.fullname || "Student"} progress updated.`,
        type: "success",
      });

      await load();
    } catch (error) {
      setToast({
        message:
          error.response?.data?.message ||
          "Unable to update progress.",
        type: "error",
      });
    } finally {
      setSaving("");
    }
  };

  return (
    <MentorLayout title="Progress">
      <Toast
        {...toast}
        onClose={() => setToast(null)}
      />

      <div className="mb-6 flex flex-wrap justify-between gap-4 items-end">
        <div>
         

          <p className="text-slate-500 mt-2">
            Update curriculum status for students assigned to you.
          </p>
        </div>

        <button
          onClick={load}
          className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 font-bold flex items-center gap-2"
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
            placeholder="Search student or topic..."
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-[#08c98b]"
          />
        </div>
      </div>

      {loading ? (
        <div className="bg-white border rounded-2xl p-12 text-center text-slate-400">
          Loading progress...
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[800px]">
              <thead className="bg-[#062a5c] text-white">
                <tr>
                  <th className="text-left px-5 py-4">
                    Student
                  </th>

                  <th className="text-left px-5 py-4">
                    Topic
                  </th>

                  <th className="text-left px-5 py-4">
                    Current status
                  </th>

                  <th className="text-left px-5 py-4">
                    Update
                  </th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((row) => {
                  const current = normalizeStatus(row.status);

                  return (
                    <tr
                      key={row._id}
                      className="border-t border-slate-100"
                    >
                      <td className="px-5 py-4">
                        <div className="font-black">
                          {row.student?.fullname || "Unknown"}
                        </div>

                        <div className="text-xs text-slate-400">
                          {row.batch?.name || ""}
                        </div>
                      </td>

                      <td className="px-5 py-4 font-bold">
                        {row.topic || "Untitled topic"}
                      </td>

                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#e8faf5] text-[#078b68] font-bold text-xs">
                          <TrendingUp size={13} />
                          {current}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex flex-wrap gap-2">
                          <select
                            value={current}
                            disabled={saving === row._id}
                            onChange={(e) =>
                              update(row, e.target.value)
                            }
                            className="border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold outline-none focus:border-[#08c98b]"
                          >
                            {STATUSES.map((status) => (
                              <option
                                key={status}
                                value={status}
                              >
                                {status}
                              </option>
                            ))}
                          </select>

                          {saving === row._id && (
                            <Save
                              size={17}
                              className="text-[#08ad81] animate-pulse mt-2"
                            />
                          )}
                        </div>

                        <textarea
                          defaultValue={row.notes || ""}
                          onBlur={(e) => {
                            if (e.target.value !== (row.notes || "")) {
                              update(row, current, e.target.value);
                            }
                          }}
                          placeholder="Add a progress note..."
                          rows="2"
                          className="mt-2 w-full border border-slate-200 rounded-lg px-3 py-2 text-xs outline-none focus:border-[#08c98b]"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {!filtered.length && (
            <div className="p-12 text-center text-slate-400">
              No progress records found.
            </div>
          )}
        </div>
      )}
    </MentorLayout>
  );
}
