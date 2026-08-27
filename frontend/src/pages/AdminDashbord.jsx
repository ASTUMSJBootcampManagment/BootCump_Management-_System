import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  ClipboardCheck,
  Layers3,
  Users,
  UserRoundCog,
  Settings,
  Plus,
  Power,
  Check,
  X,
  RefreshCw,
  Menu,
  LogOut,
  ChevronRight,
  AlertTriangle,
  Mail,
  UserPlus,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import API from "../api/axios";

const navItems = [
  {
    id: "overview",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    id: "applications",
    label: "Applications",
    icon: ClipboardCheck,
  },
  {
    id: "batches",
    label: "Batches",
    icon: Layers3,
  },
  {
    id: "mentors",
    label: "Mentors",
    icon: UserRoundCog,
  },
  {
    id: "students",
    label: "Students",
    icon: Users,
  },
];

function StatCard({
  title,
  value,
  icon: Icon,
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5">
      <div className="flex justify-between items-start">
        <div>
          <div className="text-xs font-black uppercase tracking-wider text-slate-400">
            {title}
          </div>

          <div className="text-3xl font-black text-[#062a5c] mt-2">
            {value}
          </div>
        </div>

        <div className="w-11 h-11 rounded-xl bg-[#e8faf5] text-[#08ad81] grid place-items-center">
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
}

function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-black text-[#062a5c]">
            {title}
          </h2>

          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

export default function AdminDashbord() {
  const navigate = useNavigate();

  const [section, setSection] = useState("overview");
  const [mobileOpen, setMobileOpen] = useState(false);

  const [apps, setApps] = useState([]);
  const [batches, setBatches] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [students, setStudents] = useState([]);
  const [registration, setRegistration] =
    useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [showBatchModal, setShowBatchModal] =
    useState(false);

  const [showMentorModal, setShowMentorModal] =
    useState(false);

  const [batchForm, setBatchForm] = useState({
    name: "",
    year: new Date().getFullYear(),
    startDate: "",
    endDate: "",
  });

  const [mentorForm, setMentorForm] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
  });

  const load = async () => {
    setLoading(true);
    setError("");

    try {
      const [
        applicationsResponse,
        batchesResponse,
        mentorsResponse,
        studentsResponse,
        registrationResponse,
      ] = await Promise.all([
        API.get("/admin/applications"),
        API.get("/batches"),
        API.get("/admin/users?role=Mentor"),
        API.get("/admin/users?role=Student"),
        API.get("/auth/registration-status"),
      ]);

      setApps(
        applicationsResponse.data.data || []
      );

      setBatches(
        batchesResponse.data.data || []
      );

      setMentors(
        mentorsResponse.data.data || []
      );

      setStudents(
        studentsResponse.data.data || []
      );

      setRegistration(
        registrationResponse.data
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load administration data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const clearMessages = () => {
    setError("");
    setMessage("");
  };

  const openRegistration = async (batchId) => {
    clearMessages();

    try {
      await API.post(
        "/admin/registration/open",
        { batchId }
      );

      setMessage(
        "Student registration has been opened."
      );

      await load();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to open registration."
      );
    }
  };

  const closeRegistration = async () => {
    clearMessages();

    try {
      await API.post(
        "/admin/registration/close"
      );

      setMessage(
        "Student registration has been closed."
      );

      await load();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to close registration."
      );
    }
  };

  const createBatch = async (e) => {
    e.preventDefault();

    clearMessages();

    try {
      await API.post("/batches", {
        ...batchForm,
        year: Number(batchForm.year),
        status: "Upcoming",
      });

      setMessage("Batch created successfully.");

      setShowBatchModal(false);

      setBatchForm({
        name: "",
        year: new Date().getFullYear(),
        startDate: "",
        endDate: "",
      });

      await load();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to create batch."
      );
    }
  };

  const createMentor = async (e) => {
    e.preventDefault();

    clearMessages();

    try {
      await API.post("/admin/mentors", mentorForm);

      setMessage(
        "Mentor account created and credentials sent by email."
      );

      setShowMentorModal(false);

      setMentorForm({
        fullname: "",
        email: "",
        phoneNumber: "",
      });

      await load();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to create mentor."
      );
    }
  };

  const approveStudent = async (application) => {
    if (!application?.appliedBatch?._id) {
      setError(
        "This application does not have an assigned batch."
      );
      return;
    }

    clearMessages();

    try {
      await API.patch(
        `/admin/students/${application._id}/approve`,
        {
          batchId:
            application.appliedBatch._id,
        }
      );

      setMessage(
        "Student accepted. Temporary credentials were sent by email."
      );

      await load();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to accept student."
      );
    }
  };

  const rejectStudent = async (application) => {
    const reason = window.prompt(
      "Enter the rejection reason:"
    );

    if (reason === null) return;

    clearMessages();

    try {
      await API.patch(
        `/admin/students/${application._id}/reject`,
        { reason }
      );

      setMessage("Application rejected.");

      await load();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to reject application."
      );
    }
  };

  const completeBatch = async (batch) => {
    const first =
      window.confirm(
        `WARNING!\n\nYou are about to complete "${batch.name}".\n\nThis should only be done after the bootcamp has finished.\n\nContinue?`
      );

    if (!first) return;

    const confirmation = window.prompt(
      `FINAL WARNING\n\nCompleting "${batch.name}" will mark the batch as completed.\n\nType COMPLETE to continue.`
    );

    if (confirmation !== "COMPLETE") {
      setError(
        "Batch completion cancelled. You must type COMPLETE."
      );
      return;
    }

    clearMessages();

    try {
      await API.post(
        `/admin/batches/${batch._id}/complete`,
        {
          confirmation: "COMPLETE",
        }
      );

      setMessage(
        "Batch completed successfully. Records were preserved."
      );

      await load();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to complete batch."
      );
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const activeLabel =
    navItems.find((x) => x.id === section)?.label ||
    "Dashboard";

  return (
    <div className="min-h-screen bg-[#f5f7fa]">
      {/* Mobile top bar */}
      <header className="lg:hidden h-16 bg-[#062a5c] text-white px-5 flex items-center justify-between sticky top-0 z-40">
        <div>
          <div className="text-[#08c98b] font-black tracking-widest">
            ASTUMSJ
          </div>

          <div className="text-xs text-white/60">
            Administration
          </div>
        </div>

        <button
          onClick={() => setMobileOpen(true)}
          className="p-2"
        >
          <Menu size={22} />
        </button>
      </header>

      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 bottom-0 z-50
          w-[270px] bg-[#062a5c] text-white
          transition-transform duration-300
          lg:translate-x-0
          ${mobileOpen
            ? "translate-x-0"
            : "-translate-x-full"}
        `}
      >
        <div className="h-full flex flex-col">
          <div className="px-6 py-6 border-b border-white/10">
            <div className="text-[#08c98b] font-black tracking-[0.2em] text-lg">
              ASTUMSJ
            </div>

            <div className="font-bold mt-1">
              Bootcamp Administration
            </div>
          </div>

          <nav className="flex-1 px-4 py-5">
            <div className="text-[10px] uppercase tracking-widest font-black text-white/40 px-3 mb-3">
              Administration
            </div>

            {navItems.map(
              ({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => {
                    setSection(id);
                    setMobileOpen(false);
                  }}
                  className={`
                    w-full flex items-center gap-3
                    px-4 py-3 rounded-xl mb-1
                    text-sm font-semibold
                    ${
                      section === id
                        ? "bg-[#08c98b] text-white"
                        : "text-white/70 hover:bg-white/10 hover:text-white"
                    }
                  `}
                >
                  <Icon size={18} />

                  <span>{label}</span>

                  <ChevronRight
                    size={14}
                    className="ml-auto opacity-40"
                  />
                </button>
              )
            )}
          </nav>

          <div className="p-4 border-t border-white/10">
            <button
              onClick={logout}
              className="w-full flex gap-3 items-center px-4 py-3 rounded-xl text-white/70 hover:bg-red-500/20"
            >
              <LogOut size={18} />
              Sign out
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="lg:ml-[270px]">
        <main className="p-5 sm:p-7 lg:p-9 max-w-[1500px]">
          <div className="flex items-center justify-between mb-7">
            <div>
              <div className="text-xs text-slate-400 font-bold">
                Administration / {activeLabel}
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-[#062a5c] mt-1">
                {activeLabel}
              </h1>
            </div>

            <button
              onClick={load}
              className="bg-white border rounded-xl p-3"
            >
              <RefreshCw size={17} />
            </button>
          </div>

          {message && (
            <div className="mb-5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl p-4">
              {message}
            </div>
          )}

          {error && (
            <div className="mb-5 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4">
              {error}
            </div>
          )}

          {loading ? (
            <div className="bg-white border rounded-2xl p-12 text-center text-slate-500">
              Loading administration...
            </div>
          ) : (
            <>
              {/* OVERVIEW */}
              {section === "overview" && (
                <>
                  <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
                    <StatCard
                      title="Waiting Applications"
                      value={apps.length}
                      icon={ClipboardCheck}
                    />

                    <StatCard
                      title="Batches"
                      value={batches.length}
                      icon={Layers3}
                    />

                    <StatCard
                      title="Mentors"
                      value={mentors.length}
                      icon={UserRoundCog}
                    />

                    <StatCard
                      title="Students"
                      value={students.length}
                      icon={Users}
                    />
                  </div>

                  <div className="grid lg:grid-cols-[1.2fr_.8fr] gap-5 mt-6">
                    <section className="bg-white border rounded-2xl p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h2 className="font-black text-[#062a5c] text-xl">
                            Registration Control
                          </h2>

                          <p className="text-sm text-slate-500 mt-1">
                            Registration is controlled by the administrator.
                          </p>
                        </div>

                        <div
                          className={`
                            px-3 py-1 rounded-full text-xs font-black
                            ${
                              registration?.open
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-slate-100 text-slate-500"
                            }
                          `}
                        >
                          {registration?.open
                            ? "OPEN"
                            : "CLOSED"}
                        </div>
                      </div>

                      <div className="mt-6">
                        {registration?.open ? (
                          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                            <div className="font-black text-emerald-800">
                              Registration is open
                            </div>

                            <div className="text-sm text-emerald-700 mt-1">
                              {registration.batch?.name ||
                                "Current batch"}
                            </div>

                            <button
                              onClick={
                                closeRegistration
                              }
                              className="mt-4 px-4 py-2 rounded-xl bg-white border border-red-200 text-red-700 font-bold text-sm"
                            >
                              <Power
                                size={14}
                                className="inline mr-2"
                              />
                              Close Registration
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {batches
                              .filter(
                                (batch) =>
                                  batch.status !==
                                  "Completed"
                              )
                              .map((batch) => (
                                <button
                                  key={batch._id}
                                  onClick={() =>
                                    openRegistration(
                                      batch._id
                                    )
                                  }
                                  className="w-full text-left border rounded-xl p-4 hover:border-[#08c98b] transition"
                                >
                                  <div className="flex justify-between">
                                    <div>
                                      <div className="font-bold">
                                        {batch.name}
                                      </div>

                                      <div className="text-xs text-slate-500 mt-1">
                                        {batch.startDate
                                          ? new Date(
                                              batch.startDate
                                            ).toLocaleDateString()
                                          : "Start date not set"}
                                      </div>
                                    </div>

                                    <span className="text-[#08ad81] text-sm font-black">
                                      Open
                                    </span>
                                  </div>
                                </button>
                              ))}

                            {!batches.length && (
                              <p className="text-sm text-slate-500">
                                Create a batch first.
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </section>

                    <section className="bg-[#062a5c] text-white rounded-2xl p-6">
                      <div className="text-[#08c98b] text-xs uppercase tracking-widest font-black">
                        Quick actions
                      </div>

                      <h2 className="text-xl font-black mt-2">
                        Manage Bootcamp
                      </h2>

                      <div className="space-y-3 mt-6">
                        <button
                          onClick={() =>
                            setShowBatchModal(true)
                          }
                          className="w-full bg-white/10 hover:bg-white/20 rounded-xl p-4 flex items-center gap-3 text-left"
                        >
                          <Plus size={18} />

                          <div>
                            <div className="font-bold">
                              Create Batch
                            </div>

                            <div className="text-xs text-white/50">
                              Start a new bootcamp batch
                            </div>
                          </div>
                        </button>

                        <button
                          onClick={() =>
                            setShowMentorModal(true)
                          }
                          className="w-full bg-white/10 hover:bg-white/20 rounded-xl p-4 flex items-center gap-3 text-left"
                        >
                          <UserPlus size={18} />

                          <div>
                            <div className="font-bold">
                              Create Mentor
                            </div>

                            <div className="text-xs text-white/50">
                              Create a mentor account
                            </div>
                          </div>
                        </button>
                      </div>
                    </section>
                  </div>
                </>
              )}

              {/* APPLICATIONS */}
              {section === "applications" && (
                <section className="bg-white border rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <h2 className="text-xl font-black text-[#062a5c]">
                        Waiting-list Applications
                      </h2>

                      <p className="text-sm text-slate-500 mt-1">
                        Review applications before accepting students.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {apps.map((application) => (
                      <div
                        key={application._id}
                        className="border rounded-2xl p-5"
                      >
                        <div className="flex flex-col lg:flex-row justify-between gap-5">
                          <div>
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-[#e8faf5] text-[#08ad81] grid place-items-center font-black">
                                {(
                                  application.fullname ||
                                  "S"
                                )
                                  .charAt(0)
                                  .toUpperCase()}
                              </div>

                              <div>
                                <h3 className="font-black">
                                  {
                                    application.fullname
                                  }
                                </h3>

                                <div className="text-xs text-slate-500 flex gap-1 items-center mt-1">
                                  <Mail size={12} />

                                  {
                                    application.email
                                  }
                                </div>
                              </div>
                            </div>

                            <div className="mt-4 grid sm:grid-cols-2 gap-3">
                              <div className="bg-slate-50 rounded-xl p-3">
                                <div className="text-[10px] uppercase font-black text-slate-400">
                                  Requested Batch
                                </div>

                                <div className="text-sm font-bold mt-1">
                                  {application
                                    .appliedBatch
                                    ?.name ||
                                    "Not specified"}
                                </div>
                              </div>

                              <div className="bg-slate-50 rounded-xl p-3">
                                <div className="text-[10px] uppercase font-black text-slate-400">
                                  Reason
                                </div>

                                <div className="text-sm mt-1">
                                  {
                                    application.reasonToJoin
                                  }
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex lg:flex-col gap-2 justify-end">
                            <button
                              onClick={() =>
                                approveStudent(
                                  application
                                )
                              }
                              className="px-4 py-2 rounded-xl bg-[#08c98b] text-white font-black text-sm"
                            >
                              <Check
                                size={14}
                                className="inline mr-1"
                              />
                              Accept
                            </button>

                            <button
                              onClick={() =>
                                rejectStudent(
                                  application
                                )
                              }
                              className="px-4 py-2 rounded-xl bg-red-50 text-red-700 font-black text-sm"
                            >
                              <X
                                size={14}
                                className="inline mr-1"
                              />
                              Reject
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}

                    {!apps.length && (
                      <div className="py-12 text-center text-slate-500">
                        No waiting applications.
                      </div>
                    )}
                  </div>
                </section>
              )}

              {/* BATCHES */}
              {section === "batches" && (
                <section className="bg-white border rounded-2xl p-6">
                  <div className="flex flex-col sm:flex-row justify-between gap-3 mb-6">
                    <div>
                      <h2 className="text-xl font-black text-[#062a5c]">
                        Bootcamp Batches
                      </h2>

                      <p className="text-sm text-slate-500 mt-1">
                        Create, manage and finish batches.
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        setShowBatchModal(true)
                      }
                      className="bg-[#08c98b] text-white px-4 py-3 rounded-xl font-black text-sm"
                    >
                      <Plus
                        size={15}
                        className="inline mr-2"
                      />
                      Create Batch
                    </button>
                  </div>

                  <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {batches.map((batch) => (
                      <article
                        key={batch._id}
                        className="border rounded-2xl p-5"
                      >
                        <div className="flex justify-between">
                          <div className="font-black text-[#062a5c]">
                            {batch.name}
                          </div>

                          <span className="text-xs font-black px-2 py-1 rounded-full bg-slate-100">
                            {batch.status}
                          </span>
                        </div>

                        <div className="text-sm text-slate-500 mt-4">
                          Year: {batch.year}
                        </div>

                        <div className="text-sm text-slate-500 mt-1">
                          {batch.startDate
                            ? new Date(
                                batch.startDate
                              ).toLocaleDateString()
                            : "—"}{" "}
                          →{" "}
                          {batch.endDate
                            ? new Date(
                                batch.endDate
                              ).toLocaleDateString()
                            : "—"}
                        </div>

                        {batch.status !==
                          "Completed" && (
                          <button
                            onClick={() =>
                              completeBatch(batch)
                            }
                            className="w-full mt-5 border border-red-200 bg-red-50 text-red-700 rounded-xl py-3 font-black text-sm"
                          >
                            <AlertTriangle
                              size={15}
                              className="inline mr-2"
                            />
                            Complete Batch
                          </button>
                        )}
                      </article>
                    ))}
                  </div>

                  {!batches.length && (
                    <div className="py-12 text-center text-slate-500">
                      No batches have been created.
                    </div>
                  )}
                </section>
              )}

              {/* MENTORS */}
              {section === "mentors" && (
                <section className="bg-white border rounded-2xl p-6">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h2 className="text-xl font-black text-[#062a5c]">
                        Mentors
                      </h2>

                      <p className="text-sm text-slate-500 mt-1">
                        Mentor accounts are created by Admin.
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        setShowMentorModal(true)
                      }
                      className="bg-[#08c98b] text-white px-4 py-3 rounded-xl font-black text-sm"
                    >
                      <Plus
                        size={15}
                        className="inline mr-2"
                      />
                      Add Mentor
                    </button>
                  </div>

                  <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {mentors.map((mentor) => (
                      <article
                        key={mentor._id}
                        className="border rounded-2xl p-5"
                      >
                        <div className="flex gap-3 items-center">
                          <div className="w-12 h-12 rounded-full bg-[#e8faf5] text-[#08ad81] grid place-items-center font-black">
                            {(mentor.fullname ||
                              "M")
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <div>
                            <h3 className="font-black">
                              {mentor.fullname}
                            </h3>

                            <div className="text-xs text-slate-500 mt-1">
                              {mentor.email}
                            </div>
                          </div>
                        </div>

                        <div className="mt-5 bg-slate-50 rounded-xl p-3">
                          <div className="text-[10px] uppercase font-black text-slate-400">
                            Account status
                          </div>

                          <div className="font-bold text-sm mt-1">
                            {mentor.status ||
                              "Active"}
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              )}

              {/* STUDENTS */}
              {section === "students" && (
                <section className="bg-white border rounded-2xl p-6">
                  <div className="mb-6">
                    <h2 className="text-xl font-black text-[#062a5c]">
                      Students
                    </h2>

                    <p className="text-sm text-slate-500 mt-1">
                      Accepted students currently in the system.
                    </p>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left px-4 py-3 text-xs uppercase text-slate-400">
                            Student
                          </th>

                          <th className="text-left px-4 py-3 text-xs uppercase text-slate-400">
                            Batch
                          </th>

                          <th className="text-left px-4 py-3 text-xs uppercase text-slate-400">
                            Mentor
                          </th>

                          <th className="text-left px-4 py-3 text-xs uppercase text-slate-400">
                            Status
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {students.map(
                          (student) => (
                            <tr
                              key={student._id}
                              className="border-b last:border-0"
                            >
                              <td className="px-4 py-4">
                                <div className="font-bold">
                                  {
                                    student.fullname
                                  }
                                </div>

                                <div className="text-xs text-slate-400">
                                  {student.email}
                                </div>
                              </td>

                              <td className="px-4 py-4 text-sm">
                                {student
                                  .assignedBatch
                                  ?.name ||
                                  "—"}
                              </td>

                              <td className="px-4 py-4 text-sm">
                                {student
                                  .assignedMentor
                                  ?.fullname ||
                                  "Not assigned"}
                              </td>

                              <td className="px-4 py-4">
                                <span className="bg-slate-100 px-3 py-1 rounded-full text-xs font-black">
                                  {student.status ||
                                    "Active"}
                                </span>
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>

                  {!students.length && (
                    <div className="py-12 text-center text-slate-500">
                      No students found.
                    </div>
                  )}
                </section>
              )}
            </>
          )}
        </main>
      </div>

      {/* CREATE BATCH MODAL */}
      {showBatchModal && (
        <Modal
          title="Create New Batch"
          onClose={() =>
            setShowBatchModal(false)
          }
        >
          <form
            onSubmit={createBatch}
            className="space-y-4"
          >
            <div>
              <label className="text-xs font-black text-slate-500 uppercase">
                Batch Name
              </label>

              <input
                required
                value={batchForm.name}
                onChange={(e) =>
                  setBatchForm({
                    ...batchForm,
                    name: e.target.value,
                  })
                }
                placeholder="Example: ASTU MSJ Batch 2026"
                className="w-full mt-2 border rounded-xl px-4 py-3"
              />
            </div>

            <div>
              <label className="text-xs font-black text-slate-500 uppercase">
                Year
              </label>

              <input
                required
                type="number"
                value={batchForm.year}
                onChange={(e) =>
                  setBatchForm({
                    ...batchForm,
                    year: e.target.value,
                  })
                }
                className="w-full mt-2 border rounded-xl px-4 py-3"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-black text-slate-500 uppercase">
                  Start Date
                </label>

                <input
                  required
                  type="date"
                  value={batchForm.startDate}
                  onChange={(e) =>
                    setBatchForm({
                      ...batchForm,
                      startDate:
                        e.target.value,
                    })
                  }
                  className="w-full mt-2 border rounded-xl px-4 py-3"
                />
              </div>

              <div>
                <label className="text-xs font-black text-slate-500 uppercase">
                  End Date
                </label>

                <input
                  required
                  type="date"
                  value={batchForm.endDate}
                  onChange={(e) =>
                    setBatchForm({
                      ...batchForm,
                      endDate:
                        e.target.value,
                    })
                  }
                  className="w-full mt-2 border rounded-xl px-4 py-3"
                />
              </div>
            </div>

            <button className="w-full bg-[#08c98b] text-white rounded-xl py-3 font-black">
              Create Batch
            </button>
          </form>
        </Modal>
      )}

      {/* CREATE MENTOR MODAL */}
      {showMentorModal && (
        <Modal
          title="Create Mentor Account"
          onClose={() =>
            setShowMentorModal(false)
          }
        >
          <form
            onSubmit={createMentor}
            className="space-y-4"
          >
            <div>
              <label className="text-xs font-black text-slate-500 uppercase">
                Full Name
              </label>

              <input
                required
                value={mentorForm.fullname}
                onChange={(e) =>
                  setMentorForm({
                    ...mentorForm,
                    fullname:
                      e.target.value,
                  })
                }
                className="w-full mt-2 border rounded-xl px-4 py-3"
                placeholder="Mentor full name"
              />
            </div>

            <div>
              <label className="text-xs font-black text-slate-500 uppercase">
                Email
              </label>

              <input
                required
                type="email"
                value={mentorForm.email}
                onChange={(e) =>
                  setMentorForm({
                    ...mentorForm,
                    email: e.target.value,
                  })
                }
                className="w-full mt-2 border rounded-xl px-4 py-3"
                placeholder="mentor@example.com"
              />
            </div>

            <div>
              <label className="text-xs font-black text-slate-500 uppercase">
                Phone Number
              </label>

              <input
                value={mentorForm.phoneNumber}
                onChange={(e) =>
                  setMentorForm({
                    ...mentorForm,
                    phoneNumber:
                      e.target.value,
                  })
                }
                className="w-full mt-2 border rounded-xl px-4 py-3"
                placeholder="Optional"
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-700">
              The mentor will receive their temporary password through the existing Nodemailer setup.
            </div>

            <button className="w-full bg-[#08c98b] text-white rounded-xl py-3 font-black">
              Create Mentor
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}