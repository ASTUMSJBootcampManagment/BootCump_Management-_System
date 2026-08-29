import React, { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Check,
  Clock3,
  Search,
  UserCheck,
  XCircle,
  RefreshCw,
} from "lucide-react";
import API from "../../api/axios";

const STATUS_OPTIONS = [
  { value: "present", label: "Present" },
  { value: "absent", label: "Absent" },
  { value: "late", label: "Late" },
  { value: "excused", label: "Excused" },
];

export default function Attendance() {
  const [students, setStudents] = useState([]);
  const [batches, setBatches] = useState([]);
  const [attendance, setAttendance] = useState({});

  const [search, setSearch] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const loadData = async () => {
    setLoading(true);
    setMessage("");

    try {
      const [studentsResponse, batchesResponse, attendanceResponse] =
        await Promise.all([
          API.get("/admin/users?role=Student"),
          API.get("/batches"),
          API.get(`/attendance?date=${selectedDate}`),
        ]);

      const studentData = studentsResponse.data?.data || [];
      const batchData = batchesResponse.data?.data || [];
      const attendanceData = attendanceResponse.data?.data || [];

      setStudents(studentData);
      setBatches(batchData);

      const initialAttendance = {};

      attendanceData.forEach((record) => {
        const studentId =
          typeof record.student === "object"
            ? record.student?._id
            : record.student;

        if (!studentId) return;

        const recordDate = new Date(record.date)
          .toISOString()
          .split("T")[0];

        if (recordDate === selectedDate) {
          initialAttendance[studentId] = record.status;
        }
      });

      setAttendance(initialAttendance);
    } catch (error) {
      console.error(error);
      setMessage(
        error.response?.data?.message ||
          "Unable to load attendance data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedDate]);

  const filteredStudents = useMemo(() => {
    const query = search.toLowerCase().trim();

    return students.filter((student) => {
      const fullname = student.fullname || student.name || "";
      const email = student.email || "";

      const matchesSearch =
        !query ||
        fullname.toLowerCase().includes(query) ||
        email.toLowerCase().includes(query);

      const studentBatchId =
        student.assignedBatch?._id || student.appliedBatch?._id || student.assignedBatch || student.appliedBatch;

      const matchesBatch =
        !selectedBatch || studentBatchId === selectedBatch;

      return matchesSearch && matchesBatch;
    });
  }, [students, search, selectedBatch]);

  const updateStatus = (studentId, status) => {
    setAttendance((previous) => ({
      ...previous,
      [studentId]: status,
    }));
  };

  const markAll = (status) => {
    const updated = { ...attendance };
    filteredStudents.forEach((student) => {
      updated[student._id] = status;
    });
    setAttendance(updated);
  };

  const saveAttendance = async () => {
    if (filteredStudents.length === 0) {
      setMessage("There are no students to save.");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const records = filteredStudents
        .filter((student) => attendance[student._id])
        .map((student) => ({
          student: student._id,
          status: attendance[student._id],
          date: selectedDate,
          batch:
            student.assignedBatch?._id ||
            student.appliedBatch?._id ||
            selectedBatch ||
            undefined,
        }));

      if (records.length === 0) {
        setMessage("Please mark attendance before saving.");
        setSaving(false);
        return;
      }

      // Batch bulk upsert endpoint
      await API.post("/attendance/bulk", { records });

      setMessage("Attendance saved successfully.");
      await loadData();
    } catch (error) {
      console.error(error);
      setMessage(
        error.response?.data?.message ||
          "Unable to save attendance. Check server logs."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-800">
            Attendance Tracker
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage daily student attendance records.
          </p>
        </div>

        <button
          onClick={loadData}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 font-bold text-sm hover:bg-slate-50 transition"
        >
          <RefreshCw size={17} />
          Refresh
        </button>
      </div>

      {/* Message */}
      {message && (
        <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm">
          {message}
        </div>
      )}

      {/* Filters */}
      <section className="bg-white border border-slate-200 rounded-2xl p-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-black text-slate-600">
              Date
            </label>
            <div className="relative mt-1">
              <CalendarDays
                size={17}
                className="absolute left-3 top-3 text-slate-400"
              />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#08c98b]/20"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-black text-slate-600">
              Batch
            </label>
            <select
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
              className="w-full mt-1 px-3 py-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#08c98b]/20"
            >
              <option value="">All Batches</option>
              {batches.map((batch) => (
                <option key={batch._id} value={batch._id}>
                  {batch.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-black text-slate-600">
              Search Student
            </label>
            <div className="relative mt-1">
              <Search
                size={17}
                className="absolute left-3 top-3 text-slate-400"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Name or email..."
                className="w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#08c98b]/20"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => markAll("present")}
          className="px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 font-bold text-sm hover:bg-emerald-100 transition"
        >
          Mark All Present
        </button>

        <button
          onClick={() => markAll("absent")}
          className="px-4 py-2 rounded-xl bg-rose-50 text-rose-700 font-bold text-sm hover:bg-rose-100 transition"
        >
          Mark All Absent
        </button>

        <button
          onClick={() => markAll("late")}
          className="px-4 py-2 rounded-xl bg-amber-50 text-amber-700 font-bold text-sm hover:bg-amber-100 transition"
        >
          Mark All Late
        </button>
      </div>

      {/* Table */}
      <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-slate-400">
            Loading attendance...
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="p-10 text-center text-slate-400">
            No students found.
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left px-5 py-4 text-xs font-black text-slate-500">
                      Student
                    </th>
                    <th className="text-left px-5 py-4 text-xs font-black text-slate-500">
                      Batch
                    </th>
                    <th className="text-left px-5 py-4 text-xs font-black text-slate-500">
                      Attendance
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredStudents.map((student) => {
                    const studentName =
                      student.fullname ||
                      student.name ||
                      "Unnamed Student";

                    const status = attendance[student._id];

                    return (
                      <tr key={student._id}>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#e8faf5] text-[#08ad81] grid place-items-center font-black">
                              {studentName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-bold text-slate-800">
                                {studentName}
                              </p>
                              <p className="text-xs text-slate-400">
                                {student.email}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4 text-sm text-slate-600">
                          {student.assignedBatch?.name ||
                            student.appliedBatch?.name ||
                            "Not assigned"}
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex flex-wrap gap-2">
                            {STATUS_OPTIONS.map((option) => {
                              const active = status === option.value;

                              return (
                                <button
                                  key={option.value}
                                  onClick={() =>
                                    updateStatus(
                                      student._id,
                                      option.value
                                    )
                                  }
                                  className={`px-3 py-2 rounded-lg text-xs font-black border transition ${
                                    active
                                      ? option.value === "present"
                                        ? "bg-emerald-500 text-white border-emerald-500"
                                        : option.value === "absent"
                                        ? "bg-rose-500 text-white border-rose-500"
                                        : option.value === "late"
                                        ? "bg-amber-500 text-white border-amber-500"
                                        : "bg-blue-500 text-white border-blue-500"
                                      : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
                                  }`}
                                >
                                  {option.value === "present" && (
                                    <Check
                                      size={13}
                                      className="inline mr-1"
                                    />
                                  )}
                                  {option.value === "absent" && (
                                    <XCircle
                                      size={13}
                                      className="inline mr-1"
                                    />
                                  )}
                                  {option.value === "late" && (
                                    <Clock3
                                      size={13}
                                      className="inline mr-1"
                                    />
                                  )}
                                  {option.label}
                                </button>
                              );
                            })}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="p-5 border-t border-slate-100 flex justify-end">
              <button
                onClick={saveAttendance}
                disabled={saving}
                className="px-5 py-3 rounded-xl bg-[#08c98b] hover:bg-emerald-600 disabled:opacity-50 text-white font-black text-sm flex items-center gap-2 transition"
              >
                <UserCheck size={17} />
                {saving ? "Saving..." : "Save Attendance"}
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}