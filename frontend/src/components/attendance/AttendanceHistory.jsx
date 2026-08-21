import { useEffect, useMemo, useState } from "react";
import {
  FiCalendar,
  FiSearch,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiInfo,
} from "react-icons/fi";
import { getAttendance } from "../../services/attendanceService";

const AttendanceHistory = () => {
  const [attendance, setAttendance] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("all");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getAttendance();

        setAttendance(response.data || []);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to load attendance history.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, []);

  const batches = useMemo(() => {
    const batchMap = new Map();

    attendance.forEach((record) => {
      if (record.batch?._id) {
        batchMap.set(record.batch._id, record.batch.name || "Unnamed Batch");
      }
    });

    return Array.from(batchMap.entries()).map(([id, name]) => ({
      id,
      name,
    }));
  }, [attendance]);

  const history = useMemo(() => {
    const grouped = {};

    attendance.forEach((record) => {
      if (!record.date || !record.batch?._id) return;

      const date = new Date(record.date).toISOString().split("T")[0];

      const batchId = record.batch._id;

      const key = `${date}-${batchId}`;

      if (!grouped[key]) {
        grouped[key] = {
          id: key,
          date,
          batchId,
          batch: record.batch.name || "Unknown Batch",
          present: 0,
          absent: 0,
          late: 0,
          excused: 0,
          total: 0,
        };
      }

      grouped[key].total += 1;

      switch (record.status?.toLowerCase()) {
        case "present":
          grouped[key].present += 1;
          break;

        case "absent":
          grouped[key].absent += 1;
          break;

        case "late":
          grouped[key].late += 1;
          break;

        case "excused":
          grouped[key].excused += 1;
          break;

        default:
          break;
      }
    });

    return Object.values(grouped).sort(
      (a, b) => new Date(b.date) - new Date(a.date),
    );
  }, [attendance]);

  const filteredHistory = history.filter((record) => {
    const matchesBatch =
      selectedBatch === "all" || record.batchId === selectedBatch;

    const matchesSearch =
      record.date.toLowerCase().includes(search.toLowerCase()) ||
      record.batch.toLowerCase().includes(search.toLowerCase());

    return matchesBatch && matchesSearch;
  });

  const summary = useMemo(() => {
    const records = filteredHistory;

    const present = records.reduce((sum, record) => sum + record.present, 0);

    const absent = records.reduce((sum, record) => sum + record.absent, 0);

    const late = records.reduce((sum, record) => sum + record.late, 0);

    const excused = records.reduce((sum, record) => sum + record.excused, 0);

    const total = present + absent + late + excused;

    const attendancePercentage =
      total > 0 ? Math.round((present / total) * 100) : 0;

    return {
      present,
      absent,
      late,
      excused,
      attendancePercentage,
    };
  }, [filteredHistory]);
  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

            <p className="mt-4 text-sm text-slate-500">
              Loading attendance history...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
            <div className="flex items-start gap-3">
              <FiInfo className="mt-0.5 text-red-600" />

              <div>
                <h2 className="font-semibold text-red-800">
                  Unable to load attendance history
                </h2>

                <p className="mt-1 text-sm text-red-700">{error}</p>
              </div>
            </div>
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
            Attendance History
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Review attendance records for your current batch.
          </p>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <SummaryCard
            title="Present"
            value={summary.present}
            icon={<FiCheckCircle size={20} />}
            iconClass="bg-green-50 text-green-600"
          />

          <SummaryCard
            title="Absent"
            value={summary.absent}
            icon={<FiXCircle size={20} />}
            iconClass="bg-red-50 text-red-600"
          />

          <SummaryCard
            title="Late"
            value={summary.late}
            icon={<FiClock size={20} />}
            iconClass="bg-amber-50 text-amber-600"
          />

          <SummaryCard
            title="Attendance"
            value={`${summary.attendancePercentage}%`}
            icon={<FiCalendar size={20} />}
            iconClass="bg-blue-50 text-blue-600"
          />
        </div>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-200 p-5 sm:p-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="w-full lg:max-w-xs">
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Batch
              </label>

              <select
                value={selectedBatch}
                onChange={(e) => setSelectedBatch(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              >
                <option value="all">All Batches</option>

                {batches.map((batch) => (
                  <option key={batch.id} value={batch.id}>
                    {batch.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-full lg:max-w-xs">
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Search date
              </label>
              <div className="relative">
                <FiSearch
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search..."
                  className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>
          </div>

          {filteredHistory.length === 0 ? (
            <div className="p-10 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
                <FiCalendar size={24} className="text-slate-400" />
              </div>

              <h3 className="mt-4 font-semibold text-slate-800">
                No attendance records
              </h3>

              <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">
                There are no attendance records matching your current filters.
              </p>
            </div>
          ) : (
            <>
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-212.5">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Date
                      </th>

                      <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Present
                      </th>

                      <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Absent
                      </th>

                      <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Late
                      </th>

                      <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Excused
                      </th>

                      <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Attendance
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredHistory.map((record) => {
                      const percentage =
                        record.total > 0
                          ? Math.round((record.present / record.total) * 100)
                          : 0;

                      return (
                        <tr
                          key={record.id}
                          className="border-t border-slate-100 hover:bg-slate-50"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                                <FiCalendar size={17} />
                              </div>

                              <div>
                                <p className="text-sm font-semibold text-slate-800">
                                  {record.date}
                                </p>
                                <p className="text-xs text-slate-400">
                                  {record.batch}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-4 text-center text-sm font-semibold text-green-600">
                            {record.present}
                          </td>

                          <td className="px-6 py-4 text-center text-sm font-semibold text-red-600">
                            {record.absent}
                          </td>

                          <td className="px-6 py-4 text-center text-sm font-semibold text-amber-600">
                            {record.late}
                          </td>

                          <td className="px-6 py-4 text-center text-sm font-semibold text-blue-600">
                            {record.excused}
                          </td>

                          <td className="px-6 py-4 text-center">
                            <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                              {percentage}%
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="space-y-3 p-4 md:hidden">
                {filteredHistory.map((record) => {
                  const percentage =
                    record.total > 0
                      ? Math.round((record.present / record.total) * 100)
                      : 0;

                  return (
                    <div
                      key={record.id}
                      className="rounded-xl border border-slate-200 p-4"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold text-slate-800">
                            {record.date}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {record.batch}
                          </p>
                        </div>

                        <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                          {percentage}%
                        </span>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-3">
                        <MiniStat
                          label="Present"
                          value={record.present}
                          className="text-green-600"
                        />

                        <MiniStat
                          label="Absent"
                          value={record.absent}
                          className="text-red-600"
                        />

                        <MiniStat
                          label="Late"
                          value={record.late}
                          className="text-amber-600"
                        />

                        <MiniStat
                          label="Excused"
                          value={record.excused}
                          className="text-blue-600"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
};

const SummaryCard = ({ title, value, icon, iconClass }) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500 sm:text-sm">
            {title}
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
            {value}
          </p>
        </div>

        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconClass}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};

const MiniStat = ({ label, value, className }) => {
  return (
    <div className="rounded-lg bg-slate-50 p-3">
      <p className="text-xs text-slate-400">{label}</p>

      <p className={`mt-1 text-lg font-bold ${className}`}>{value}</p>
    </div>
  );
};

export default AttendanceHistory;
