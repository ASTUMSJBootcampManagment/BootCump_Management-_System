import {
  useEffect,
  useState,
} from "react";

import {
  Users,
  UserRoundCog,
  Layers,
  ClipboardCheck,
  RefreshCw,
} from "lucide-react";

import API from "../api/axios";
import Toast from "../components/common/Toast";

function getArray(response) {
  const data = response?.data;

  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.data)) {
    return data.data;
  }

  if (Array.isArray(data?.users)) {
    return data.users;
  }

  return [];
}

function errorMessage(error) {
  return (
    error?.response?.data?.message ||
    error?.message ||
    "Unable to load data."
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
}) {
  return (
    <div
      className="
        bg-white
        rounded-2xl
        border
        border-slate-200
        p-5
        shadow-sm
      "
    >
      <div className="flex items-center justify-between">
        <div>
          <p
            className="
              text-[11px]
              uppercase
              tracking-wider
              font-black
              text-slate-400
            "
          >
            {title}
          </p>

          <p
            className="
              text-3xl
              font-black
              text-[#062a5c]
              mt-2
            "
          >
            {value}
          </p>
        </div>

        <div
          className="
            w-11
            h-11
            rounded-xl
            bg-[#e8faf5]
            text-[#08ad81]
            grid
            place-items-center
          "
        >
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [students, setStudents] =
    useState([]);

  const [mentors, setMentors] =
    useState([]);

  const [batches, setBatches] =
    useState([]);

  const [applications, setApplications] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [toast, setToast] =
    useState(null);

  const loadDashboard = async () => {
    setLoading(true);

    try {
      const [
        studentResult,
        mentorResult,
        batchResult,
        applicationResult,
      ] = await Promise.allSettled([
        API.get(
          "/users/search?role=Student"
        ),
        API.get(
          "/users/search?role=Mentor"
        ),
        API.get("/batches"),
        API.get(
          "/admin/applications"
        ),
      ]);

      if (
        studentResult.status ===
        "fulfilled"
      ) {
        setStudents(
          getArray(
            studentResult.value
          )
        );
      }

      if (
        mentorResult.status ===
        "fulfilled"
      ) {
        setMentors(
          getArray(
            mentorResult.value
          )
        );
      }

      if (
        batchResult.status ===
        "fulfilled"
      ) {
        setBatches(
          getArray(
            batchResult.value
          )
        );
      }

      if (
        applicationResult.status ===
        "fulfilled"
      ) {
        setApplications(
          getArray(
            applicationResult.value
          )
        );
      }

      const failures = [
        studentResult,
        mentorResult,
        batchResult,
        applicationResult,
      ].filter(
        (result) =>
          result.status ===
          "rejected"
      );

      if (failures.length) {
        setToast({
          message:
            "Some dashboard data could not be loaded.",
          type: "error",
        });
      }
    } catch (error) {
      setToast({
        message:
          errorMessage(error),
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const waitingApplications =
    applications.filter(
      (item) =>
        item.applicationStatus ===
        "waiting"
    ).length;

  const activeBatches =
    batches.filter(
      (batch) =>
        batch.status ===
        "Active"
    ).length;

  return (
    <>
      <Toast
        message={toast?.message}
        type={toast?.type}
        onClose={() =>
          setToast(null)
        }
      />

      <div className="space-y-7">

        <section
          className="
            bg-[#062a5c]
            rounded-3xl
            p-7
            sm:p-9
            text-white
          "
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div>
              <span
                className="
                  inline-block
                  bg-[#08c98b]/20
                  text-[#08c98b]
                  px-3
                  py-1
                  rounded-full
                  text-[10px]
                  font-black
                  tracking-wider
                "
              >
                ADMINISTRATOR PORTAL
              </span>

              <h2
                className="
                  text-2xl
                  sm:text-3xl
                  font-black
                  mt-3
                "
              >
                Bootcamp Overview
              </h2>

              <p
                className="
                  text-white/50
                  text-sm
                  mt-2
                "
              >
                Manage users, batches,
                applications and bootcamp
                activities from one place.
              </p>
            </div>

            <button
              type="button"
              onClick={loadDashboard}
              disabled={loading}
              className="
                self-start
                inline-flex
                items-center
                gap-2
                px-4
                py-2.5
                rounded-xl
                bg-white/10
                hover:bg-white/20
                text-sm
                font-bold
                disabled:opacity-50
              "
            >
              <RefreshCw
                size={16}
                className={
                  loading
                    ? "animate-spin"
                    : ""
                }
              />

              Refresh
            </button>
          </div>
        </section>

        <section
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            xl:grid-cols-4
            gap-4
          "
        >
          <StatCard
            title="Students"
            value={
              loading
                ? "..."
                : students.length
            }
            icon={Users}
          />

          <StatCard
            title="Mentors"
            value={
              loading
                ? "..."
                : mentors.length
            }
            icon={UserRoundCog}
          />

          <StatCard
            title="Batches"
            value={
              loading
                ? "..."
                : batches.length
            }
            icon={Layers}
          />

          <StatCard
            title="Waiting Applications"
            value={
              loading
                ? "..."
                : waitingApplications
            }
            icon={ClipboardCheck}
          />
        </section>

        <section
          className="
            grid
            grid-cols-1
            lg:grid-cols-2
            gap-5
          "
        >
          <div
            className="
              bg-white
              border
              border-slate-200
              rounded-2xl
              p-6
            "
          >
            <h3
              className="
                font-black
                text-[#062a5c]
              "
            >
              Batch Overview
            </h3>

            <div className="mt-5 space-y-3">
              {batches.length === 0 ? (
                <p className="text-sm text-slate-400">
                  No batches found.
                </p>
              ) : (
                batches.slice(0, 5).map(
                  (batch) => (
                    <div
                      key={batch._id}
                      className="
                        flex
                        items-center
                        justify-between
                        gap-4
                        p-4
                        rounded-xl
                        bg-slate-50
                      "
                    >
                      <div>
                        <p className="font-bold text-slate-700">
                          {batch.name}
                        </p>

                        <p className="text-xs text-slate-400 mt-1">
                          {batch.students?.length || 0} students
                        </p>
                      </div>

                      <span
                        className="
                          px-2.5
                          py-1
                          rounded-full
                          text-[10px]
                          font-black
                          bg-emerald-50
                          text-emerald-700
                        "
                      >
                        {batch.status}
                      </span>
                    </div>
                  )
                )
              )}
            </div>
          </div>

          <div
            className="
              bg-white
              border
              border-slate-200
              rounded-2xl
              p-6
            "
          >
            <h3
              className="
                font-black
                text-[#062a5c]
              "
            >
              Quick Administration
            </h3>

            <div className="grid grid-cols-2 gap-3 mt-5">
              <a
                href="/admin/users"
                className="
                  p-4
                  rounded-xl
                  bg-slate-50
                  hover:bg-emerald-50
                  transition
                "
              >
                <Users
                  size={20}
                  className="text-[#08ad81]"
                />

                <p className="font-bold text-sm mt-3">
                  Manage Users
                </p>
              </a>

              <a
                href="/admin/applications"
                className="
                  p-4
                  rounded-xl
                  bg-slate-50
                  hover:bg-emerald-50
                  transition
                "
              >
                <ClipboardCheck
                  size={20}
                  className="text-[#08ad81]"
                />

                <p className="font-bold text-sm mt-3">
                  Applications
                </p>
              </a>

              <a
                href="/admin/batches"
                className="
                  p-4
                  rounded-xl
                  bg-slate-50
                  hover:bg-emerald-50
                  transition
                "
              >
                <Layers
                  size={20}
                  className="text-[#08ad81]"
                />

                <p className="font-bold text-sm mt-3">
                  Manage Batches
                </p>
              </a>

              <a
                href="/admin/settings"
                className="
                  p-4
                  rounded-xl
                  bg-slate-50
                  hover:bg-emerald-50
                  transition
                "
              >
                <RefreshCw
                  size={20}
                  className="text-[#08ad81]"
                />

                <p className="font-bold text-sm mt-3">
                  Registration
                </p>
              </a>
            </div>

            <div className="mt-5 p-4 rounded-xl bg-slate-50">
              <p className="text-xs text-slate-400">
                Active batches
              </p>

              <p className="text-2xl font-black text-[#062a5c] mt-1">
                {activeBatches}
              </p>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}