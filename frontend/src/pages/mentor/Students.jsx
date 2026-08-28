import { useEffect, useMemo, useState } from "react";
import {
  Users,
  Search,
  RefreshCw,
  Mail,
  FolderGit2,
  Code2,
} from "lucide-react";
import MentorLayout from "../../components/mentor/MentorLayout";
import Toast from "../../components/common/Toast";
import API from "../../api/axios";

export default function Students() {
  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const load = async () => {
    setLoading(true);

    try {
      // Fetch directly from your user/attendance route for students
      const response = await API.get("/attendance/students");

      // Extract array based on API response structure
      const studentData =
        response.data?.data || response.data?.users || response.data || [];

      setRecords(Array.isArray(studentData) ? studentData : []);
    } catch (error) {
      setToast({
        message:
          error.response?.data?.message || "Unable to load your students.",
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
      (student) =>
        student.fullname?.toLowerCase().includes(value) ||
        student.email?.toLowerCase().includes(value) ||
        student.universityId?.toLowerCase().includes(value),
    );
  }, [records, search]);

  return (
    <MentorLayout title="My Students">
      <Toast {...toast} onClose={() => setToast(null)} />

      <div className="mb-6 flex flex-wrap justify-between items-end gap-4">
        <div>
          <h2 className="text-3xl font-black text-[#062a5c]">My Students</h2>

          <p className="text-slate-500 mt-2">
            Only students authorized under your mentor assignment are shown.
          </p>
        </div>

        <button
          onClick={load}
          className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl font-bold flex gap-2 items-center hover:bg-slate-50 transition-colors"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-5">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email or university ID..."
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-[#08c98b] focus:ring-4 focus:ring-[#08c98b]/10"
          />
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl border p-12 text-center text-slate-400">
          Loading students...
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((student) => (
            <article
              key={student._id}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[#062a5c] text-white grid place-items-center text-lg font-black">
                  {(student.fullname || "S").charAt(0).toUpperCase()}
                </div>

                <div className="min-w-0">
                  <h3 className="font-black text-[#062a5c] truncate">
                    {student.fullname}
                  </h3>

                  <p className="text-xs text-slate-400 truncate mt-1">
                    {student.email}
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">University ID</span>

                  <span className="font-bold">
                    {student.universityId || "—"}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-400">Batch</span>

                  <span className="font-bold">
                    {student.assignedBatch?.name ||
                      student.batch?.name ||
                      "Assigned batch"}
                  </span>
                </div>
              </div>

              <div className="border-t border-slate-100 mt-5 pt-4 flex flex-wrap gap-2">
                {student.githubAccount && (
                  <a
                    href={student.githubAccount}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-bold px-3 py-2 rounded-lg bg-slate-100 flex items-center gap-1 hover:bg-slate-200 transition-colors"
                  >
                    <FolderGit2 size={13} />
                    GitHub
                  </a>
                )}

                {student.leetcodeAccount && (
                  <a
                    href={student.leetcodeAccount}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-bold px-3 py-2 rounded-lg bg-slate-100 flex items-center gap-1 hover:bg-slate-200 transition-colors"
                  >
                    <Code2 size={13} />
                    LeetCode
                  </a>
                )}

                <a
                  href={`mailto:${student.email}`}
                  className="text-xs font-bold px-3 py-2 rounded-lg bg-[#e8faf5] text-[#08ad81] flex items-center gap-1 hover:bg-[#d1f5eb] transition-colors"
                >
                  <Mail size={13} />
                  Email
                </a>
              </div>
            </article>
          ))}

          {!filtered.length && (
            <div className="md:col-span-2 xl:col-span-3 bg-white rounded-2xl border p-12 text-center">
              <Users className="mx-auto text-slate-300" size={40} />

              <h3 className="font-black mt-3">No students found</h3>

              <p className="text-sm text-slate-400 mt-1">
                Students assigned to you will appear here.
              </p>
            </div>
          )}
        </div>
      )}
    </MentorLayout>
  );
}
