import { useEffect, useState } from "react";
import {
  Users,
  UserRoundCog,
  Layers3,
  ClipboardCheck,
  RefreshCw,
  Power,
  CheckCircle2,
  XCircle,
  UserPlus,
  AlertTriangle
} from "lucide-react";

import API from "../api/axios";
import AdminLayout from "../components/admin/AdminLayout";
import Toast from "../components/Toast";

const Card = ({ title, value, icon: Icon }) => (
  <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-[11px] font-black uppercase tracking-wider text-slate-400">
          {title}
        </p>

        <p className="text-3xl font-black text-[#062a5c] mt-2">
          {value}
        </p>
      </div>

      <div className="w-11 h-11 rounded-xl bg-[#e8faf5] text-[#08ad81] grid place-items-center">
        <Icon size={19} />
      </div>
    </div>
  </div>
);

function getError(error) {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    "Request failed."
  );
}

export default function AdminDashboard() {
  const [apps, setApps] = useState([]);
  const [batches, setBatches] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [students, setStudents] = useState([]);
  const [registration, setRegistration] = useState(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [failed, setFailed] = useState([]);

  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  const load = async () => {
    setLoading(true);
    setFailed([]);

    const failures = [];

    /*
      IMPORTANT:
      Do NOT replace this with Promise.all().
      Every section is loaded independently.
    */

    try {
      const res = await API.get("/admin/applications");
      setApps(res.data?.data || []);
    } catch (error) {
      setApps([]);
      failures.push(`Applications: ${getError(error)}`);
    }

    try {
      const res = await API.get("/batches");
      setBatches(res.data?.data || []);
    } catch (error) {
      setBatches([]);
      failures.push(`Batches: ${getError(error)}`);
    }

    try {
      const res = await API.get("/admin/users?role=Mentor");
      setMentors(res.data?.data || []);
    } catch (error) {
      setMentors([]);
      failures.push(`Mentors: ${getError(error)}`);
    }

    try {
      const res = await API.get("/admin/users?role=Student");
      setStudents(res.data?.data || []);
    } catch (error) {
      setStudents([]);
      failures.push(`Students: ${getError(error)}`);
    }

    try {
      const res = await API.get("/auth/registration-status");
      setRegistration(res.data || null);
    } catch (error) {
      setRegistration(null);
      failures.push(`Registration: ${getError(error)}`);
    }

    setFailed(failures);

    if (failures.length > 0) {
      showToast(
        `${failures.length} administration section(s) could not be loaded.`,
        "error"
      );
    }

    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    load();
  }, []);

  const refresh = () => {
    setRefreshing(true);
    load();
  };

  const openRegistration = async (batchId) => {
    try {
      await API.post("/admin/registration/open", { batchId });

      showToast("Registration has been opened.");
      load();
    } catch (error) {
      showToast(getError(error), "error");
    }
  };

  const closeRegistration = async () => {
    const confirmed = window.confirm(
      "Close registration for the current batch?"
    );

    if (!confirmed) return;

    try {
      await API.post("/admin/registration/close");

      showToast("Registration has been closed.");
      load();
    } catch (error) {
      showToast(getError(error), "error");
    }
  };

  const completeBatch = async (batch) => {
    const first = window.confirm(
      `WARNING!\n\nYou are about to complete "${batch.name}".\n\nCompleted batches cannot be casually modified.\n\nContinue?`
    );

    if (!first) return;

    const confirmation = window.prompt(
      `This action is permanent.\n\nType COMPLETE to finish "${batch.name}":`
    );

    if (confirmation !== "COMPLETE") {
      showToast("Batch completion cancelled.", "info");
      return;
    }

    try {
      await API.post(`/admin/batches/${batch._id}/complete`, {
        confirmation: "COMPLETE"
      });

      showToast("Batch completed successfully.");
      load();
    } catch (error) {
      showToast(getError(error), "error");
    }
  };

  return (
    <AdminLayout title="Overview">
      <Toast
        {...toast}
        onClose={() => setToast(null)}
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7">
        <div>
          <h2 className="text-2xl font-black text-[#062a5c]">
            Bootcamp overview
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Manage applications, batches, mentors and students.
          </p>
        </div>

        <button
          onClick={refresh}
          disabled={refreshing}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold hover:border-[#08c98b] disabled:opacity-50"
        >
          <RefreshCw
            size={16}
            className={refreshing ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      {failed.length > 0 && (
        <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <div className="flex gap-3">
            <AlertTriangle
              size={20}
              className="text-amber-600 shrink-0 mt-0.5"
            />

            <div>
              <p className="font-black text-amber-800">
                Some administration data could not be loaded
              </p>

              <div className="mt-2 space-y-1">
                {failed.map((item, index) => (
                  <p
                    key={index}
                    className="text-sm text-amber-700"
                  >
                    • {item}
                  </p>
                ))}
              </div>

              <button
                onClick={refresh}
                className="mt-3 text-sm font-black text-amber-800 underline"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-14 text-center">
          <RefreshCw
            size={30}
            className="mx-auto animate-spin text-[#08ad81]"
          />

          <p className="font-bold text-slate-500 mt-4">
            Loading administration data...
          </p>
        </div>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <Card
              title="Waiting applications"
              value={apps.length}
              icon={ClipboardCheck}
            />

            <Card
              title="Batches"
              value={batches.length}
              icon={Layers3}
            />

            <Card
              title="Mentors"
              value={mentors.length}
              icon={UserRoundCog}
            />

            <Card
              title="Students"
              value={students.length}
              icon={Users}
            />
          </div>

          <section className="mt-6 bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <p className="text-[11px] font-black uppercase tracking-wider text-[#08ad81]">
                  Registration
                </p>

                <h3 className="text-xl font-black text-[#062a5c] mt-1">
                  Registration control
                </h3>

                <p className="text-sm text-slate-500 mt-1">
                  {registration?.open
                    ? `Currently open${
                        registration.batch?.name
                          ? ` for ${registration.batch.name}`
                          : ""
                      }`
                    : "Currently closed"}
                </p>
              </div>

              <div
                className={`px-4 py-2 rounded-xl text-sm font-black ${
                  registration?.open
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {registration?.open ? "OPEN" : "CLOSED"}
              </div>
            </div>

            <div className="mt-6 grid md:grid-cols-2 xl:grid-cols-3 gap-3">
              {batches
                .filter((batch) => batch.status !== "Completed")
                .map((batch) => (
                  <div
                    key={batch._id}
                    className="border border-slate-200 rounded-xl p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-black text-[#062a5c]">
                          {batch.name}
                        </p>

                        <p className="text-xs text-slate-400 mt-1">
                          {batch.status || "Active"}
                        </p>
                      </div>

                      <Layers3
                        size={18}
                        className="text-[#08ad81]"
                      />
                    </div>

                    <div className="flex flex-wrap gap-2 mt-4">
                      <button
                        onClick={() =>
                          openRegistration(batch._id)
                        }
                        className="flex-1 min-w-[120px] inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-[#08c98b] text-white text-xs font-black hover:bg-[#06ae7a]"
                      >
                        <Power size={14} />
                        Open
                      </button>

                      <button
                        onClick={closeRegistration}
                        className="flex-1 min-w-[120px] inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-black hover:bg-slate-200"
                      >
                        <XCircle size={14} />
                        Close
                      </button>
                    </div>

                    <button
                      onClick={() => completeBatch(batch)}
                      className="w-full mt-2 inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border border-red-200 text-red-600 text-xs font-black hover:bg-red-50"
                    >
                      <CheckCircle2 size={14} />
                      Complete batch
                    </button>
                  </div>
                ))}

              {!batches.length && (
                <div className="md:col-span-2 xl:col-span-3 py-10 text-center text-slate-400">
                  <Layers3 size={35} className="mx-auto mb-3" />
                  No batches have been created yet.
                </div>
              )}
            </div>
          </section>

          <div className="grid lg:grid-cols-3 gap-5 mt-6">

            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#e8faf5] text-[#08ad81] grid place-items-center">
                  <ClipboardCheck size={18} />
                </div>

                <div>
                  <h3 className="font-black text-[#062a5c]">
                    Applications
                  </h3>

                  <p className="text-xs text-slate-400">
                    Waiting for review
                  </p>
                </div>
              </div>

              <p className="text-4xl font-black text-[#062a5c] mt-6">
                {apps.length}
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#e8faf5] text-[#08ad81] grid place-items-center">
                  <UserRoundCog size={18} />
                </div>

                <div>
                  <h3 className="font-black text-[#062a5c]">
                    Mentors
                  </h3>

                  <p className="text-xs text-slate-400">
                    Registered by Admin
                  </p>
                </div>
              </div>

              <p className="text-4xl font-black text-[#062a5c] mt-6">
                {mentors.length}
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#e8faf5] text-[#08ad81] grid place-items-center">
                  <UserPlus size={18} />
                </div>

                <div>
                  <h3 className="font-black text-[#062a5c]">
                    Students
                  </h3>

                  <p className="text-xs text-slate-400">
                    Accepted students
                  </p>
                </div>
              </div>

              <p className="text-4xl font-black text-[#062a5c] mt-6">
                {students.length}
              </p>
            </div>

          </div>
        </>
      )}
    </AdminLayout>
  );
}