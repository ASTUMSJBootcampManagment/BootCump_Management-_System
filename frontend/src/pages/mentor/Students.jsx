import { useEffect, useState } from "react";
import {
  Users,
  Search,
  RefreshCw,
  Mail,
  User,
  AlertCircle,
} from "lucide-react";
import API from "../../api/axios";
import MentorLayout from "../../components/mentor/MentorLayout";

export default function Students() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await API.get("/admin/users?role=Student");

      setStudents(response.data.data || []);
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

  const filtered = students.filter((student) => {
    const value = search.toLowerCase();

    return (
      student.fullname?.toLowerCase().includes(value) ||
      student.email?.toLowerCase().includes(value)
    );
  });

  return (
    <MentorLayout title="My Students">
      <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-5">
        <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
          <div>
            <h2 className="font-black text-[#062a5c]">
              Student Management
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Students available in the system.
            </p>
          </div>

          <button
            onClick={load}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl border text-sm font-bold"
          >
            <RefreshCw size={15} />
            Refresh
          </button>
        </div>

        <div className="relative mt-5">
          <Search
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search student by name or email..."
            className="w-full pl-10 pr-4 py-3 border rounded-xl outline-none focus:border-[#08c98b]"
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4 mb-5 flex gap-3">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-2xl border p-10 text-center text-slate-500">
          Loading students...
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((student) => (
            <article
              key={student._id}
              className="bg-white border border-slate-200 rounded-2xl p-5"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#e8faf5] text-[#08ad81] grid place-items-center font-black">
                  {(student.fullname || "S")
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <div className="min-w-0">
                  <h3 className="font-black text-[#062a5c] truncate">
                    {student.fullname}
                  </h3>

                  <div className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                    <Mail size={12} />
                    <span className="truncate">
                      {student.email}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-5">
                <div className="bg-slate-50 rounded-xl p-3">
                  <div className="text-[10px] uppercase font-black text-slate-400">
                    Status
                  </div>

                  <div className="font-bold text-sm mt-1">
                    {student.status || "Active"}
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-3">
                  <div className="text-[10px] uppercase font-black text-slate-400">
                    Mentor
                  </div>

                  <div className="font-bold text-sm mt-1">
                    {student.assignedMentor
                      ? "Assigned"
                      : "Not assigned"}
                  </div>
                </div>
              </div>

              <div className="mt-4 text-xs text-slate-400 flex items-center gap-2">
                <User size={13} />
                Student account
              </div>
            </article>
          ))}

          {!filtered.length && (
            <div className="md:col-span-2 xl:col-span-3 bg-white rounded-2xl border p-12 text-center text-slate-500">
              No students found.
            </div>
          )}
        </div>
      )}
    </MentorLayout>
  );
}