import { useEffect, useMemo, useState } from "react";
import {
  CalendarCheck2,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Clock3,
  ShieldCheck,
} from "lucide-react";

import API from "../../api/axios";
import StudentLayout from "../../components/student/StudentLayout";
import "../../components/student/student.css";

const STATUS = {
  present: {
    label: "Present",
    icon: CheckCircle2,
  },
  late: {
    label: "Late",
    icon: Clock3,
  },
  absent: {
    label: "Absent",
    icon: XCircle,
  },
  excused: {
    label: "Excused",
    icon: ShieldCheck,
  },
};

export default function StudentAttendance() {
  const [data, setData] = useState(null);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await API.get("/student/attendance");
      setData(response.data.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load attendance."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const records = useMemo(() => {
    if (!data?.records) return [];

    if (filter === "all") return data.records;

    return data.records.filter(
      (record) => record.status === filter
    );
  }, [data, filter]);

  if (loading) {
    return (
      <StudentLayout title="Attendance">
        <div className="student-card student-empty">
          Loading attendance...
        </div>
      </StudentLayout>
    );
  }

  const all = data?.records || [];

  const present = all.filter(
    (x) => x.status === "present"
  ).length;

  const late = all.filter(
    (x) => x.status === "late"
  ).length;

  const absent = all.filter(
    (x) => x.status === "absent"
  ).length;

  const excused = all.filter(
    (x) => x.status === "excused"
  ).length;

  // Derive percentage directly or fallback to stats object
  const calculatedPercentage = all.length
    ? Math.round(((present + late) / all.length) * 100)
    : 0;

  const attendancePercentage =
    data?.percentage ??
    data?.stats?.percentage ??
    calculatedPercentage;

  return (
    <StudentLayout title="Attendance">
      {/* <div className="student-page-head">
        <h2>Attendance</h2>
        <p>
          Track your attendance throughout the bootcamp.
        </p>
      </div> */}

      {error && (
        <div className="student-banner">
          {error}
        </div>
      )}

      {data && (
        <>
          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <div className="student-card p-5">
              <div className="flex justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase">
                    Attendance rate
                  </div>

                  <div className="text-3xl font-black text-[#062a5c] mt-2">
                    {attendancePercentage}%
                  </div>
                </div>

                <div className="w-11 h-11 rounded-xl bg-[#e8faf5] text-[#08ad81] grid place-items-center">
                  <CalendarCheck2 size={20} />
                </div>
              </div>
            </div>

            <div className="student-card p-5">
              <div className="text-xs font-bold text-slate-400 uppercase">
                Present
              </div>

              <div className="text-3xl font-black text-[#062a5c] mt-2">
                {present}
              </div>
            </div>

            <div className="student-card p-5">
              <div className="text-xs font-bold text-slate-400 uppercase">
                Late
              </div>

              <div className="text-3xl font-black text-[#062a5c] mt-2">
                {late}
              </div>
            </div>

            <div className="student-card p-5">
              <div className="text-xs font-bold text-slate-400 uppercase">
                Absent
              </div>

              <div className="text-3xl font-black text-[#062a5c] mt-2">
                {absent}
              </div>
            </div>
          </div>

          {/* Attendance visual */}
          <section className="student-card student-panel mt-5">
            <div className="student-panel-header">
              <div>
                <h3>Attendance overview</h3>
                <span>
                  {all.length} recorded session
                  {all.length === 1 ? "" : "s"}
                </span>
              </div>

              <button
                className="student-filter"
                onClick={load}
              >
                <RefreshCw size={13} />
                Refresh
              </button>
            </div>

            <div className="grid sm:grid-cols-3 gap-4 mt-5">
              <div className="rounded-xl bg-emerald-50 p-4">
                <div className="text-xs text-emerald-700 font-bold">
                  Present / Late
                </div>

                <div className="text-2xl font-black text-emerald-800 mt-1">
                  {present + late}
                </div>
              </div>

              <div className="rounded-xl bg-red-50 p-4">
                <div className="text-xs text-red-700 font-bold">
                  Absent
                </div>

                <div className="text-2xl font-black text-red-800 mt-1">
                  {absent}
                </div>
              </div>

              <div className="rounded-xl bg-blue-50 p-4">
                <div className="text-xs text-blue-700 font-bold">
                  Excused
                </div>

                <div className="text-2xl font-black text-blue-800 mt-1">
                  {excused}
                </div>
              </div>
            </div>
          </section>

          {/* Filter */}
          <div className="flex flex-wrap gap-2 mt-5">
            {[
              ["all", "All"],
              ["present", "Present"],
              ["late", "Late"],
              ["absent", "Absent"],
              ["excused", "Excused"],
            ].map(([value, label]) => (
              <button
                key={value}
                className={`student-filter ${
                  filter === value ? "active" : ""
                }`}
                onClick={() => setFilter(value)}
              >
                {label}
              </button>
            ))}
          </div>

          {/* History */}
          <section className="student-card student-panel mt-4">
            <div className="student-panel-header">
              <div>
                <h3>Attendance history</h3>
                <span>Most recent sessions first</span>
              </div>
            </div>

            <div className="overflow-x-auto mt-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-slate-400 border-b">
                    <th className="py-3 pr-4">Date</th>
                    <th className="py-3 pr-4">Status</th>
                    <th className="py-3">Note</th>
                  </tr>
                </thead>

                <tbody>
                  {records.map((record) => {
                    const config =
                      STATUS[record.status] ||
                      STATUS.absent;

                    const Icon = config.icon;

                    return (
                      <tr
                        key={record._id}
                        className="border-b last:border-0"
                      >
                        <td className="py-4 pr-4 font-semibold text-slate-700">
                          {record.date
                            ? new Date(
                                record.date
                              ).toLocaleDateString(
                                undefined,
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                }
                              )
                            : "—"}
                        </td>

                        <td className="py-4 pr-4">
                          <span className="inline-flex items-center gap-2">
                            <Icon size={15} />
                            <span className="student-status">
                              {config.label}
                            </span>
                          </span>
                        </td>

                        <td className="py-4 text-slate-500">
                          {record.note || "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {!records.length && (
                <div className="student-empty">
                  No attendance records found.
                </div>
              )}
            </div>
          </section>
        </>
      )}
    </StudentLayout>
  );
}