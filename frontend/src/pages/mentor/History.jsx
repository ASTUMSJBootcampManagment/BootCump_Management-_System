import { useEffect, useState } from "react";
import {
  History as HistoryIcon,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import API from "../../api/axios";
import MentorLayout from "../../components/mentor/MentorLayout";

export default function History() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await API.get(
        "/attendance/history"
      );

      setRecords(response.data.data || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load attendance history."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <MentorLayout title="History">
      <div className="bg-white border rounded-2xl p-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-black text-[#062a5c]">
              Attendance History
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Previous attendance records.
            </p>
          </div>

          <button
            onClick={load}
            className="border rounded-xl p-2"
          >
            <RefreshCw size={16} />
          </button>
        </div>

        {error && (
          <div className="mt-5 bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 flex gap-2">
            <AlertCircle size={17} />
            {error}
          </div>
        )}

        {loading ? (
          <div className="py-12 text-center text-slate-500">
            Loading history...
          </div>
        ) : (
          <div className="mt-6 overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left">
                  <th className="px-4 py-3 text-xs uppercase text-slate-400">
                    Date
                  </th>

                  <th className="px-4 py-3 text-xs uppercase text-slate-400">
                    Student
                  </th>

                  <th className="px-4 py-3 text-xs uppercase text-slate-400">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {records.map((record) => (
                  <tr
                    key={record._id}
                    className="border-b last:border-0"
                  >
                    <td className="px-4 py-4 text-sm">
                      {record.date
                        ? new Date(
                            record.date
                          ).toLocaleDateString()
                        : "—"}
                    </td>

                    <td className="px-4 py-4 font-bold text-sm">
                      {record.student?.fullname ||
                        record.studentName ||
                        "Student"}
                    </td>

                    <td className="px-4 py-4">
                      <span className="px-3 py-1 rounded-full bg-slate-100 text-xs font-black">
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {!records.length && (
              <div className="py-12 text-center text-slate-500">
                No attendance history found.
              </div>
            )}
          </div>
        )}
      </div>
    </MentorLayout>
  );
}