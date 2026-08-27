import { useEffect, useState } from "react";
import {
  Users,
  ClipboardCheck,
  TrendingUp,
  AlertCircle,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import { Link } from "react-router-dom";
import API from "../../api/axios";
import MentorLayout from "../../components/mentor/MentorLayout";

function StatCard({ icon: Icon, title, value, description }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-wider text-slate-400">
            {title}
          </p>

          <div className="text-3xl font-black text-[#062a5c] mt-2">
            {value}
          </div>

          <p className="text-xs text-slate-500 mt-2">
            {description}
          </p>
        </div>

        <div className="w-11 h-11 rounded-xl bg-[#e8faf5] text-[#08ad81] grid place-items-center">
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await API.get("/student/overview");

      setData(response.data.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load mentor dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <MentorLayout title="Mentor Dashboard">
      <div className="flex justify-end mb-5">
        <button
          onClick={load}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-sm font-bold text-slate-600 hover:border-[#08c98b]"
        >
          <RefreshCw size={15} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 text-red-700 p-4 flex gap-3">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-2xl border p-12 text-center text-slate-500">
          Loading mentor dashboard...
        </div>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <StatCard
              icon={Users}
              title="Students"
              value={data?.summary?.students ?? 0}
              description="Students assigned to you"
            />

            <StatCard
              icon={ClipboardCheck}
              title="Attendance"
              value={`${data?.summary?.attendance ?? 0}%`}
              description="Current attendance rate"
            />

            <StatCard
              icon={TrendingUp}
              title="Progress"
              value={`${data?.summary?.progress ?? 0}%`}
              description="Average learning progress"
            />

            <StatCard
              icon={AlertCircle}
              title="Pending"
              value={data?.summary?.pendingAssignments ?? 0}
              description="Assignments needing attention"
            />
          </div>

          <div className="grid lg:grid-cols-[1.4fr_.6fr] gap-5 mt-6">
            <section className="bg-white rounded-2xl border border-slate-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-black text-[#062a5c] text-lg">
                    Mentor workspace
                  </h2>

                  <p className="text-sm text-slate-500 mt-1">
                    Manage your assigned students from the sidebar.
                  </p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3 mt-6">
                <Link
                  to="/mentor/students"
                  className="border rounded-xl p-4 hover:border-[#08c98b] transition"
                >
                  <Users className="text-[#08ad81]" size={20} />

                  <h3 className="font-bold mt-3">
                    My Students
                  </h3>

                  <p className="text-xs text-slate-500 mt-1">
                    View and manage students assigned to you.
                  </p>

                  <div className="text-[#08ad81] text-xs font-black mt-4 flex items-center gap-1">
                    Open <ArrowRight size={13} />
                  </div>
                </Link>

                <Link
                  to="/mentor/attendance"
                  className="border rounded-xl p-4 hover:border-[#08c98b] transition"
                >
                  <ClipboardCheck className="text-[#08ad81]" size={20} />

                  <h3 className="font-bold mt-3">
                    Attendance
                  </h3>

                  <p className="text-xs text-slate-500 mt-1">
                    Record and review student attendance.
                  </p>

                  <div className="text-[#08ad81] text-xs font-black mt-4 flex items-center gap-1">
                    Open <ArrowRight size={13} />
                  </div>
                </Link>
              </div>
            </section>

            <section className="bg-[#062a5c] rounded-2xl p-6 text-white">
              <div className="text-[#08c98b] text-xs font-black uppercase tracking-widest">
                Bootcamp
              </div>

              <h2 className="text-xl font-black mt-2">
                {data?.batch?.name || "Current Batch"}
              </h2>

              <p className="text-white/60 text-sm mt-2">
                {data?.batch?.track ||
                  "ASTU MSJ Bootcamp"}
              </p>

              <div className="mt-7 pt-5 border-t border-white/10">
                <div className="text-xs text-white/50">
                  Your role
                </div>

                <div className="font-bold mt-1">
                  Mentor
                </div>
              </div>
            </section>
          </div>
        </>
      )}
    </MentorLayout>
  );
}