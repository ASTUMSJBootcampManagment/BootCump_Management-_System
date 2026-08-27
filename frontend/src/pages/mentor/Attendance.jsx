import { useEffect, useState } from "react";
import {
  ClipboardCheck,
  RefreshCw,
  Save,
  AlertCircle,
} from "lucide-react";
import API from "../../api/axios";
import MentorLayout from "../../components/mentor/MentorLayout";

export default function Attendance() {
  const [students, setStudents] = useState([]);
  const [records, setRecords] = useState({});
  const [date, setDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState({});
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await API.get(
        "/admin/users?role=Student"
      );

      const list = response.data.data || [];

      setStudents(list);

      const initial = {};

      list.forEach((student) => {
        initial[student._id] = "Present";
      });

      setRecords(initial);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load students."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const saveAttendance = async (studentId) => {
    setSaving((prev) => ({
      ...prev,
      [studentId]: true,
    }));

    setError("");
    setMessage("");

    try {
      await API.post("/attendance/create", {
        studentId,
        date,
        status: records[studentId],
      });

      setMessage("Attendance saved successfully.");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to save attendance."
      );
    } finally {
      setSaving((prev) => ({
        ...prev,
        [studentId]: false,
      }));
    }
  };

  return (
    <MentorLayout title="Attendance">
      <div className="bg-white border rounded-2xl p-5 mb-5">
        <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
          <div>
            <h2 className="font-black text-[#062a5c]">
              Daily Attendance
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Record attendance for your students.
            </p>
          </div>

          <div className="flex gap-2">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border rounded-xl px-3 py-2 text-sm"
            />

            <button
              onClick={load}
              className="border rounded-xl px-3"
            >
              <RefreshCw size={16} />
            </button>
          </div>
        </div>
      </div>

      {message && (
        <div className="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl p-3">
          {message}
        </div>
      )}

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 flex gap-2">
          <AlertCircle size={17} />
          {error}
        </div>
      )}

      {loading ? (
        <div className="bg-white border rounded-2xl p-10 text-center">
          Loading attendance...
        </div>
      ) : (
        <div className="bg-white border rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="text-left px-5 py-4 text-xs uppercase tracking-wider text-slate-400">
                    Student
                  </th>

                  <th className="text-left px-5 py-4 text-xs uppercase tracking-wider text-slate-400">
                    Status
                  </th>

                  <th className="text-right px-5 py-4 text-xs uppercase tracking-wider text-slate-400">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {students.map((student) => (
                  <tr
                    key={student._id}
                    className="border-b last:border-0"
                  >
                    <td className="px-5 py-4">
                      <div className="font-bold">
                        {student.fullname}
                      </div>

                      <div className="text-xs text-slate-400">
                        {student.email}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <select
                        value={records[student._id] || "Present"}
                        onChange={(e) =>
                          setRecords((prev) => ({
                            ...prev,
                            [student._id]: e.target.value,
                          }))
                        }
                        className="border rounded-lg px-3 py-2 text-sm"
                      >
                        <option value="Present">
                          Present
                        </option>

                        <option value="Late">
                          Late
                        </option>

                        <option value="Absent">
                          Absent
                        </option>
                      </select>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() =>
                          saveAttendance(student._id)
                        }
                        disabled={saving[student._id]}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#08c98b] text-white font-bold text-sm disabled:opacity-50"
                      >
                        {saving[student._id] ? (
                          "Saving..."
                        ) : (
                          <>
                            <Save size={14} />
                            Save
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {!students.length && (
            <div className="p-10 text-center text-slate-500">
              No students found.
            </div>
          )}
        </div>
      )}
    </MentorLayout>
  );
}