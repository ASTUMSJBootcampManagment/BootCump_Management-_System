<<<<<<< HEAD
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FiCalendar,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiAlertCircle,
} from "react-icons/fi";

const StudentAttendnce = () => {
  const [attendance, setAttendance] = useState([]);
  const [summary, setSummary] = useState({
    present: 0,
    absent: 0,
    late: 0,
    excused: 0,
    percentage: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      /*
       * Use the existing student attendance API.
       */
      const response = await axios.get(
        "/api/attendance/my",
        config
      );

      const data = response.data?.data;

      /*
       * Support either:
       *
       * {
       *   data: [...]
       * }
       *
       * or
       *
       * {
       *   data: {
       *     attendance: [...],
       *     presentCount: ...
       *   }
       * }
       */

      if (Array.isArray(data)) {
        setAttendance(data);
        calculateSummary(data);
      } else {
        const records =
          data?.attendance ||
          data?.records ||
          data?.attendanceRecords ||
          [];

        setAttendance(
          Array.isArray(records)
            ? records
            : []
        );

        setSummary({
          present:
            data?.presentCount || 0,

          absent:
            data?.absentCount || 0,

          late:
            data?.lateCount || 0,

          excused:
            data?.excusedCount || 0,

          percentage:
            data?.attendancePercentage ||
            data?.percentage ||
            0,
        });
      }
    } catch (err) {
      console.error(
        "Attendance error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to load your attendance."
      );
    } finally {
      setLoading(false);
    }
  };

  const calculateSummary = (records) => {
    const present = records.filter(
      (item) =>
        normalizeStatus(item) === "present"
    ).length;

    const absent = records.filter(
      (item) =>
        normalizeStatus(item) === "absent"
    ).length;

    const late = records.filter(
      (item) =>
        normalizeStatus(item) === "late"
    ).length;

    const excused = records.filter(
      (item) =>
        normalizeStatus(item) === "excused"
    ).length;

    const total = records.length;

    const percentage =
      total > 0
        ? Math.round(
            ((present + late) / total) *
              100
          )
        : 0;

    setSummary({
      present,
      absent,
      late,
      excused,
      percentage,
    });
  };

  const normalizeStatus = (item) => {
    return String(
      item.status ||
        item.attendanceStatus ||
        ""
    ).toLowerCase();
  };

  const getStatus = (item) => {
    const status = normalizeStatus(item);

    if (status === "present") {
      return "Present";
    }

    if (status === "absent") {
      return "Absent";
    }

    if (status === "late") {
      return "Late";
    }

    if (status === "excused") {
      return "Excused";
    }

    return item.status || "Unknown";
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Present":
        return "bg-green-100 text-green-700";

      case "Absent":
        return "bg-red-100 text-red-700";

      case "Late":
        return "bg-amber-100 text-amber-700";

      case "Excused":
        return "bg-blue-100 text-blue-700";

      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Present":
        return <FiCheckCircle />;

      case "Absent":
        return <FiXCircle />;

      case "Late":
        return <FiClock />;

      case "Excused":
        return <FiAlertCircle />;

      default:
        return <FiCalendar />;
    }
  };

  const getDate = (item) => {
    const date =
      item.date ||
      item.attendanceDate ||
      item.createdAt;

    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleDateString(
      undefined,
      {
        year: "numeric",
        month: "short",
        day: "numeric",
      }
    );
  };

  const getDay = (item) => {
    const date =
      item.date ||
      item.attendanceDate ||
      item.createdAt;

    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleDateString(
      undefined,
      {
        weekday: "long",
      }
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

  const getBatch = (item) => {
    if (typeof item.batch === "string") {
      return item.batch;
    }

    return (
      item.batch?.name ||
      item.batch?.batchName ||
      "-"
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">

        <div>
          <div className="h-8 w-56 rounded-lg bg-slate-200 animate-pulse" />

          <div className="mt-2 h-4 w-80 rounded bg-slate-200 animate-pulse" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-32 rounded-2xl bg-white border border-slate-100 animate-pulse"
            />
          ))}

        </div>

        <div className="h-96 rounded-2xl bg-white border border-slate-100 animate-pulse" />

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
          My Attendance
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          View your attendance records and
          overall attendance percentage.
        </p>
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
          SUMMARY
      ========================== */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

        <SummaryCard
          title="Attendance"
          value={`${summary.percentage}%`}
          icon={FiCalendar}
          description="Overall attendance"
        />

        <SummaryCard
          title="Present"
          value={summary.present}
          icon={FiCheckCircle}
          description="Days present"
        />

        <SummaryCard
          title="Absent"
          value={summary.absent}
          icon={FiXCircle}
          description="Days absent"
        />

        <SummaryCard
          title="Late"
          value={summary.late}
          icon={FiClock}
          description="Days late"
        />

      </div>

      {/* =========================
          ATTENDANCE PROGRESS
      ========================== */}

      <section className="rounded-2xl border border-slate-100 bg-white p-5 sm:p-6 shadow-sm">

        <div className="flex items-center justify-between mb-4">

          <div>
            <h2 className="text-lg font-bold text-[#082A5B]">
              Attendance Rate
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Your current overall attendance
            </p>
          </div>

          <span className="text-xl font-bold text-[#0F766E]">
            {summary.percentage}%
          </span>

        </div>

        <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">

          <div
            className="h-full rounded-full bg-[#10B981] transition-all duration-500"
            style={{
              width: `${Math.min(
                Math.max(
                  Number(summary.percentage) ||
                    0,
                  0
                ),
                100
              )}%`,
            }}
          />

        </div>

        <div className="mt-3 flex justify-between text-xs text-slate-400">

          <span>0%</span>

          <span>50%</span>

          <span>100%</span>

        </div>

      </section>

      {/* =========================
          ATTENDANCE TABLE
      ========================== */}

      <section className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 p-5 sm:p-6">

          <div>
            <h2 className="text-lg font-bold text-[#082A5B]">
              Attendance History
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Your attendance records
            </p>
          </div>

          <button
            onClick={fetchAttendance}
            className="self-start rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
          >
            Refresh
          </button>

        </div>

        {attendance.length === 0 ? (
          <div className="flex min-h-56 items-center justify-center p-6 text-center">

            <div>

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                <FiCalendar className="text-2xl" />
              </div>

              <h3 className="mt-4 font-semibold text-slate-700">
                No attendance records
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Your attendance records will
                appear here.
              </p>

            </div>

          </div>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full min-w-[700px] text-left">

              <thead className="bg-[#F8FAFC]">

                <tr>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Date
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Day
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Status
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Batch
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Mentor
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y divide-slate-100">

                {attendance.map(
                  (item, index) => {

                    const status =
                      getStatus(item);

                    return (
                      <tr
                        key={
                          item._id ||
                          item.id ||
                          index
                        }
                        className="transition hover:bg-slate-50"
                      >

                        <td className="px-6 py-4 text-sm font-medium text-slate-700">
                          {getDate(item)}
                        </td>

                        <td className="px-6 py-4 text-sm text-slate-500">
                          {getDay(item)}
                        </td>

                        <td className="px-6 py-4">

                          <span
                            className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                              status
                            )}`}
                          >
                            {getStatusIcon(
                              status
                            )}

                            {status}
                          </span>

                        </td>

                        <td className="px-6 py-4 text-sm text-slate-500">
                          {getBatch(item)}
                        </td>

                        <td className="px-6 py-4 text-sm text-slate-500">
                          {getMentor(item)}
                        </td>

                      </tr>
                    );
                  }
                )}

              </tbody>

            </table>

          </div>
        )}

      </section>

=======
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StudentAttendance = ({ studentId }) => {
  const [attendanceData, setAttendanceData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`/api/attendance/stats/${studentId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAttendanceData(res.data);
      } catch (err) {
        console.error('Error loading attendance stats', err);
      } finally {
        setLoading(false);
      }
    };
    if (studentId) fetchAttendance();
  }, [studentId]);

  if (loading) return <div className="p-6 text-slate-600">Loading attendance data...</div>;

  const percentage = attendanceData?.attendancePercentage || 0;

  return (
    <div className="p-6 space-y-6 bg-[#F8FAFC] min-h-screen">
      <h1 className="text-2xl font-bold text-[#0F172A]">Attendance Tracking</h1>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-sm text-slate-500 font-medium">Overall Attendance</p>
          <p className="text-3xl font-extrabold text-[#22C55E] mt-2">{percentage}%</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-sm text-slate-500 font-medium">Present</p>
          <p className="text-3xl font-extrabold text-[#0F172A] mt-2">
            {attendanceData?.presentCount || 0}
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-sm text-slate-500 font-medium">Absent</p>
          <p className="text-3xl font-extrabold text-red-500 mt-2">
            {attendanceData?.absentCount || 0}
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-sm text-slate-500 font-medium">Late / Excused</p>
          <p className="text-3xl font-extrabold text-[#14B8A6] mt-2">
            {(attendanceData?.lateCount || 0) + (attendanceData?.excusedCount || 0)}
          </p>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-[#0F172A]">Attendance Records</h2>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider">
              <th className="p-4">Date</th>
              <th className="p-4">Session / Topic</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
            {attendanceData?.history?.map((record) => (
              <tr key={record._id} className="hover:bg-slate-50/50">
                <td className="p-4 font-medium">{new Date(record.date).toLocaleDateString()}</td>
                <td className="p-4">{record.topic || 'Regular Session'}</td>
                <td className="p-4">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      record.status === 'Present'
                        ? 'bg-green-100 text-green-700'
                        : record.status === 'Absent'
                        ? 'bg-red-100 text-red-700'
                        : record.status === 'Late'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {record.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
>>>>>>> 214d84b7c5f769fb4594a0436d655bc9571b2928
    </div>
  );
};

<<<<<<< HEAD
/* =========================
   SUMMARY CARD
========================= */

const SummaryCard = ({
  title,
  value,
  icon: Icon,
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

export default StudentAttendnce;
=======
export default StudentAttendance;
>>>>>>> 214d84b7c5f769fb4594a0436d655bc9571b2928
