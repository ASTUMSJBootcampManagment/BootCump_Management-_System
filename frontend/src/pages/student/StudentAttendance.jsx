import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Clock3,
  CircleAlert,
  CalendarX2,
  CalendarDays,
  RefreshCw,
} from "lucide-react";

import API from "../../api/axios";
import StudentLayout from "../../components/student/StudentLayout";
import "../../components/student/student.css";

export default function StudentAttendance() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAttendance = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get("/attendance/mine");

      setRecords(response.data?.data || []);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Unable to load your attendance records."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAttendance();
  }, []);

  const stats = useMemo(() => {
    const present = records.filter(
      (item) => String(item.status).toLowerCase() === "present"
    ).length;

    const late = records.filter(
      (item) => String(item.status).toLowerCase() === "late"
    ).length;

    const absent = records.filter(
      (item) => String(item.status).toLowerCase() === "absent"
    ).length;

    const excused = records.filter(
      (item) => String(item.status).toLowerCase() === "excused"
    ).length;

    const attended = present + late;

    const percentage = records.length
      ? Math.round((attended / records.length) * 100)
      : 0;

    return {
      present,
      late,
      absent,
      excused,
      attended,
      total: records.length,
      percentage,
    };
  }, [records]);

  const sortedRecords = [...records].sort(
    (a, b) =>
      new Date(b.date).getTime() -
      new Date(a.date).getTime()
  );

  return (
    <StudentLayout title="My Attendance Transcript">
      <div className="student-page-head">
        <h2>My Attendance Record</h2>

        <p>
          Monitor your attendance and keep your bootcamp
          participation above the required threshold.
        </p>
      </div>

      {error && (
        <div className="student-banner">
          {error}
        </div>
      )}

      <div className="student-banner">
        <b>Attendance Policy:</b>{" "}
        Students should maintain the required attendance
        percentage throughout the bootcamp.
      </div>

      <div className="student-stat-grid">
        <AttendanceStat
          icon={<CheckCircle2 size={15} />}
          label="PRESENT"
          value={stats.present}
          note="on-time sessions"
        />

        <AttendanceStat
          icon={<Clock3 size={15} />}
          label="LATE"
          value={stats.late}
          note="late arrivals"
        />

        <AttendanceStat
          icon={<CircleAlert size={15} />}
          label="EXCUSED"
          value={stats.excused}
          note="approved absences"
        />

        <AttendanceStat
          icon={<CalendarX2 size={15} />}
          label="ABSENT"
          value={stats.absent}
          note="missed sessions"
        />
      </div>

      <section
        className="student-card student-panel"
        style={{ marginTop: 14 }}
      >
        <div className="student-panel-header">
          <div>
            <h3>Attendance Overview</h3>

            <span
              style={{
                display: "block",
                marginTop: 4,
                color: "#8b97a5",
                fontSize: 8,
              }}
            >
              {stats.attended} of {stats.total} sessions attended
            </span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span className="student-status">
              {stats.percentage}% attendance
            </span>

            <button
              className="student-filter"
              onClick={loadAttendance}
              title="Refresh attendance"
            >
              <RefreshCw size={12} />
            </button>
          </div>
        </div>

        <div
          style={{
            height: 9,
            background: "#e9eef1",
            borderRadius: 10,
            overflow: "hidden",
            marginBottom: 18,
          }}
        >
          <div
            style={{
              width: `${Math.min(stats.percentage, 100)}%`,
              height: "100%",
              background:
                stats.percentage >= 80
                  ? "#00bd8c"
                  : "#e49b24",
              borderRadius: 10,
              transition: "width .3s ease",
            }}
          />
        </div>

        {loading ? (
          <div className="student-empty">
            <CalendarDays
              size={20}
              style={{ marginBottom: 8 }}
            />
            <div>Loading attendance...</div>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="student-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Batch</th>
                </tr>
              </thead>

              <tbody>
                {sortedRecords.map((record) => {
                  const status = String(
                    record.status || ""
                  ).toLowerCase();

                  return (
                    <tr key={record._id}>
                      <td>
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

                      <td>
                        <span
                          className={`student-status ${status}`}
                        >
                          {status
                            ? status
                                .charAt(0)
                                .toUpperCase() +
                              status.slice(1)
                            : "Unknown"}
                        </span>
                      </td>

                      <td>
                        {record.batch?.batchName ||
                          record.batch?.name ||
                          "Current batch"}
                      </td>
                    </tr>
                  );
                })}

                {!sortedRecords.length && (
                  <tr>
                    <td colSpan="3">
                      <div className="student-empty">
                        No attendance records have been
                        recorded yet.
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </StudentLayout>
  );
}

function AttendanceStat({
  icon,
  label,
  value,
  note,
}) {
  return (
    <div className="student-card student-stat">
      <div className="student-stat-top">
        <span className="student-stat-label">
          {label}
        </span>

        <span className="student-stat-icon">
          {icon}
        </span>
      </div>

      <div className="student-stat-value">
        {value}
      </div>

      <span className="student-stat-note">
        {note}
      </span>
    </div>
  );
}