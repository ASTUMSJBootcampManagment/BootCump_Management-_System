import { useEffect, useMemo, useState } from "react";
import {
  Users,
  CalendarCheck,
  TrendingUp,
  ClipboardList,
  Megaphone,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import { Link } from "react-router-dom";
import API from "../../api/axios";
import MentorLayout from "../../components/mentor/MentorLayout";
import Toast from "../../components/Toast";

function StatCard({ icon: Icon, label, value, description }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs uppercase tracking-wider font-black text-slate-400">
            {label}
          </div>

          <div className="text-3xl font-black text-[#062a5c] mt-2">
            {value}
          </div>

          <div className="text-xs text-slate-400 mt-1">
            {description}
          </div>
        </div>

        <div className="w-11 h-11 rounded-xl bg-[#e8faf5] text-[#08ad81] grid place-items-center">
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [students, setStudents] = useState([]);
  const [progress, setProgress] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const load = async () => {
    setLoading(true);

    const results = {
      students: [],
      progress: [],
      assignments: [],
      announcements: [],
    };

    try {
      const r = await API.get("/progress/get/students-progress");
      results.progress = r.data.data || [];
    } catch (e) {
      setToast({
        message: "Unable to load progress.",
        type: "error",
      });
    }

    try {
      const r = await API.get("/assignments");
      results.assignments = r.data.data || [];
    } catch (e) {
      setToast({
        message: "Unable to load assignments.",
        type: "error",
      });
    }

    try {
      const r = await API.get("/announcement");
      results.announcements = r.data.data || [];
    } catch (e) {
      setToast({
        message: "Unable to load announcements.",
        type: "error",
      });
    }

    const uniqueStudents = new Map();

    results.progress.forEach((row) => {
      if (row.student?._id) {
        uniqueStudents.set(row.student._id, row.student);
      }
    });

    results.students = Array.from(uniqueStudents.values());

    setStudents(results.students);
    setProgress(results.progress);
    setAssignments(results.assignments);
    setAnnouncements(results.announcements);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const stats = useMemo(() => {
    const completed = progress.filter(
      (x) => x.status === "Completed"
    ).length;

    const progressPercentage = progress.length
      ? Math.round((completed / progress.length) * 100)
      : 0;

    return {
      students: students.length,
      progress: progressPercentage,
      assignments: assignments.length,
      announcements: announcements.length,
    };
  }, [students, progress, assignments, announcements]);

  return (
    <MentorLayout title="Dashboard">
      <Toast
        {...toast}
        onClose={() => setToast(null)}
      />

      <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          

          <p className="text-slate-500 mt-2">
            Manage your assigned students and keep their bootcamp progress moving.
          </p>
        </div>

        <button
          onClick={load}
          className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 font-bold text-sm flex items-center gap-2 hover:bg-slate-50"
        >
          <RefreshCw
            size={16}
            className={loading ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          icon={Users}
          label="My students"
          value={stats.students}
          description="Students assigned to you"
        />

        <StatCard
          icon={TrendingUp}
          label="Progress"
          value={`${stats.progress}%`}
          description="Completed curriculum topics"
        />

        <StatCard
          icon={ClipboardList}
          label="Assignments"
          value={stats.assignments}
          description="Assignments in your batches"
        />

        <StatCard
          icon={Megaphone}
          label="Announcements"
          value={stats.announcements}
          description="Published announcements"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-5 mt-6">
        <section className="bg-white border border-slate-200 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-black text-lg text-[#062a5c]">
                Students
              </h3>

              <p className="text-sm text-slate-400">
                Students currently assigned to you
              </p>
            </div>

            <Link
              to="/mentor/students"
              className="text-xs font-black text-[#08ad81] flex items-center gap-1"
            >
              View all <ArrowRight size={13} />
            </Link>
          </div>

          <div className="mt-5 space-y-3">
            {students.slice(0, 5).map((student) => (
              <div
                key={student._id}
                className="flex items-center gap-3 p-3 rounded-xl bg-slate-50"
              >
                <div className="w-10 h-10 rounded-full bg-[#062a5c] text-white grid place-items-center font-black">
                  {(student.fullname || "S").charAt(0).toUpperCase()}
                </div>

                <div className="min-w-0">
                  <div className="font-bold text-sm truncate">
                    {student.fullname}
                  </div>

                  <div className="text-xs text-slate-400 truncate">
                    {student.email}
                  </div>
                </div>
              </div>
            ))}

            {!students.length && !loading && (
              <div className="text-center py-8 text-slate-400">
                No students are assigned to you yet.
              </div>
            )}
          </div>
        </section>

        <section className="bg-white border border-slate-200 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-black text-lg text-[#062a5c]">
                Recent announcements
              </h3>

              <p className="text-sm text-slate-400">
                Updates visible to your mentor workspace
              </p>
            </div>

            <Link
              to="/mentor/announcements"
              className="text-xs font-black text-[#08ad81] flex items-center gap-1"
            >
              Manage <ArrowRight size={13} />
            </Link>
          </div>

          <div className="mt-5 space-y-4">
            {announcements.slice(0, 4).map((item) => (
              <div
                key={item._id}
                className="border-b border-slate-100 pb-3"
              >
                <div className="flex gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#e8faf5] text-[#08ad81] grid place-items-center shrink-0">
                    <Megaphone size={16} />
                  </div>

                  <div className="min-w-0">
                    <div className="font-bold text-sm">
                      {item.title}
                    </div>

                    <div className="text-xs text-slate-500 mt-1 line-clamp-2">
                      {item.content}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {!announcements.length && !loading && (
              <div className="text-center py-8 text-slate-400">
                No announcements available.
              </div>
            )}
          </div>
        </section>
      </div>

      <div className="mt-6 bg-[#062a5c] rounded-2xl p-6 text-white">
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-xl bg-white/10 grid place-items-center shrink-0">
            <CalendarCheck size={21} className="text-[#08c98b]" />
          </div>

          <div>
            <h3 className="font-black text-lg">
              Keep attendance and progress updated
            </h3>

            <p className="text-sm text-white/60 mt-1">
              Your updates are reflected in each student's protected portal.
            </p>
          </div>
        </div>
      </div>
    </MentorLayout>
  );
}