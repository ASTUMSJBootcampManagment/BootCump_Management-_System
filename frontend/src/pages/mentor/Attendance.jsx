import { useEffect, useMemo, useState } from "react";
import {
  CalendarCheck,
  Check,
  RefreshCw,
  Search,
} from "lucide-react";
import MentorLayout from "../../components/mentor/MentorLayout";
import Toast from "../../components/common/Toast";
import API from "../../api/axios";

export default function Attendance() {
  const [students, setStudents] = useState([]);
  const [present, setPresent] = useState({});
  const [date, setDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const loadStudents = async () => {
    setLoading(true);

    try {
      const response = await API.get(
        "/progress/get/students-progress"
      );

      const map = new Map();

      (response.data.data || []).forEach((row) => {
        if (row.student?._id) {
          map.set(row.student._id, row.student);
        }
      });

      setStudents(Array.from(map.values()));
    } catch (error) {
      setToast({
        message:
          error.response?.data?.message ||
          "Unable to load students.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const filteredStudents = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) return students;

    return students.filter(
      (student) =>
        student.fullname?.toLowerCase().includes(value) ||
        student.email?.toLowerCase().includes(value)
    );
  }, [students, search]);

  const toggle = (id) => {
    setPresent((previous) => ({
      ...previous,
      [id]: !previous[id],
    }));
  };

  const markAll = (value) => {
    const next = {};

    students.forEach((student) => {
      next[student._id] = value;
    });

    setPresent(next);
  };

  const submit = async () => {
    if (!date) {
      setToast({
        message: "Select an attendance date.",
        type: "error",
      });
      return;
    }

    setSaving(true);

    try {
      await API.post("/attendance/attender", {
        date,
        presentIds: Object.keys(present).filter(
          (id) => present[id]
        ),
      });

      setToast({
        message: "Attendance recorded successfully.",
        type: "success",
      });
    } catch (error) {
      setToast({
        message:
          error.response?.data?.message ||
          "Unable to record attendance.",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  const presentCount = Object.values(present).filter(Boolean).length;

  return (
    <MentorLayout title="Attendance">
      <Toast
        {...toast}
        onClose={() => setToast(null)}
      />

      <div className="mb-6">
        <h2 className="text-3xl font-black text-[#062a5c]">
          Record Attendance
        </h2>

        <p className="text-slate-500 mt-2">
          Mark attendance for students assigned to you.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-5">
        <div className="grid md:grid-cols-[220px_1fr_auto] gap-4 items-end">
          <label className="text-sm font-bold">
            Attendance date

            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="block w-full mt-2 border border-slate-200 rounded-xl px-3 py-3 outline-none focus:border-[#08c98b]"
            />
          </label>

          <label className="text-sm font-bold">
            Search students

            <div className="relative mt-2">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="w-full pl-10 border border-slate-200 rounded-xl px-3 py-3 outline-none focus:border-[#08c98b]"
              />
            </div>
          </label>

          <div className="flex gap-2">
            <button
              onClick={() => markAll(true)}
              className="px-3 py-3 rounded-xl bg-[#e8faf5] text-[#08ad81] font-bold text-xs"
            >
              All present
            </button>

            <button
              onClick={() => markAll(false)}
              className="px-3 py-3 rounded-xl bg-slate-100 font-bold text-xs"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 bg-[#062a5c] text-white flex justify-between items-center">
          <div className="font-black">
            Students
          </div>

          <div className="text-xs font-bold text-white/70">
            {presentCount} / {students.length} present
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400">
            Loading students...
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredStudents.map((student) => {
              const isPresent = Boolean(present[student._id]);

              return (
                <button
                  key={student._id}
                  type="button"
                  onClick={() => toggle(student._id)}
                  className="w-full text-left px-5 py-4 flex items-center justify-between hover:bg-slate-50 transition"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-100 text-[#062a5c] grid place-items-center font-black">
                      {(student.fullname || "S")
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <div>
                      <div className="font-black">
                        {student.fullname}
                      </div>

                      <div className="text-xs text-slate-400">
                        {student.email}
                      </div>
                    </div>
                  </div>

                  <div
                    className={`w-9 h-9 rounded-xl grid place-items-center border ${
                      isPresent
                        ? "bg-[#08c98b] border-[#08c98b] text-white"
                        : "bg-white border-slate-200 text-transparent"
                    }`}
                  >
                    <Check size={18} />
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {!loading && !filteredStudents.length && (
          <div className="p-12 text-center text-slate-400">
            No students found.
          </div>
        )}
      </div>

      <div className="mt-5 flex justify-end">
        <button
          onClick={submit}
          disabled={saving || loading || !students.length}
          className="px-6 py-3.5 rounded-xl bg-[#08c98b] text-white font-black flex items-center gap-2 disabled:opacity-50"
        >
          {saving ? (
            <RefreshCw size={17} className="animate-spin" />
          ) : (
            <CalendarCheck size={17} />
          )}

          {saving ? "Saving..." : "Save attendance"}
        </button>
      </div>
    </MentorLayout>
  );
}