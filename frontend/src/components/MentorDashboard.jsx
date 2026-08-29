import {
  Users,
  ClipboardCheck,
  AlertTriangle,
  Clock,
  Bell,
  Search,
  ChevronDown,
  CalendarDays,
  CheckCircle2,
  CircleAlert,
  BookOpen,
} from "lucide-react";

const MentorDashboard = ({ dashboard }) => {
  const {
    summary = {},
    studentProgress = [],
    atRiskStudents = [],
    recentSubmissions = [],
    upcomingAssignments = [],
    batch,
  } = dashboard || {};

  const mentor = JSON.parse(localStorage.getItem("user") || "{}");

  const mentorName = mentor?.fullname || mentor?.name || "Mentor";

  const track = mentor?.track || batch?.track || "Web Development";

  return (
    <div className="min-h-screen bg-[#f7f9fc] text-slate-800">
      {/* =========================
          TOP HEADER
      ========================== */}

      <header className="bg-white border-b border-slate-200">
        <div className="px-5 md:px-8 py-5">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            {/* Greeting */}

            <div>
              <p className="text-sm text-slate-400 font-medium">
                Mentor • {track}
              </p>

              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mt-1">
                Welcome back, {mentorName} 👋
              </h1>
            </div>

            {/* Header actions */}

            <div className="flex items-center gap-4">
              {/* Search */}

              <div className="hidden md:flex items-center w-64 h-10 bg-slate-50 border border-slate-200 rounded-xl px-3">
                <Search size={17} className="text-slate-400" />

                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full bg-transparent outline-none border-none text-sm px-2 text-slate-600 placeholder:text-slate-400"
                />
              </div>

              {/* Notification */}

              <button className="relative w-10 h-10 rounded-xl border border-slate-200 bg-white flex items-center justify-center hover:bg-slate-50">
                <Bell size={18} className="text-slate-600" />

                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
              </button>

              {/* Profile */}

              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  {getInitials(mentorName)}
                </div>

                <div className="hidden sm:block">
                  <p className="text-sm font-semibold text-slate-800">
                    {mentorName}
                  </p>

                  <p className="text-xs text-slate-400">Mentor</p>
                </div>

                <ChevronDown size={16} className="text-slate-400" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* =========================
          MAIN CONTENT
      ========================== */}

      <main className="px-5 md:px-8 py-6 max-w-[1600px] mx-auto">
        {/* =========================
            STAT CARDS
        ========================== */}

        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard
            title="My Students"
            value={summary.students || 0}
            icon={<Users size={20} />}
            iconBg="bg-blue-50"
            iconColor="text-blue-600"
          />

          <StatCard
            title="Attendance"
            value={`${summary.attendance || 0}%`}
            icon={<ClipboardCheck size={20} />}
            iconBg="bg-emerald-50"
            iconColor="text-emerald-600"
          />

          <StatCard
            title="At Risk"
            value={summary.atRisk || 0}
            icon={<AlertTriangle size={20} />}
            iconBg="bg-red-50"
            iconColor="text-red-500"
            valueColor="text-red-500"
          />

          <StatCard
            title="Pending Reviews"
            value={summary.pendingReviews || 0}
            icon={<Clock size={20} />}
            iconBg="bg-amber-50"
            iconColor="text-amber-600"
          />
        </section>

        {/* =========================
            PROGRESS + AT RISK
        ========================== */}

        <section className="grid grid-cols-1 xl:grid-cols-5 gap-5 mt-5">
          {/* Student Progress */}

          <div className="xl:col-span-3 bg-white border border-slate-200 rounded-2xl">
            <div className="px-5 py-4 border-b border-slate-100">
              <h2 className="font-bold text-slate-900">Student Progress</h2>

              <p className="text-xs text-slate-400 mt-1">
                Overall progress by topic
              </p>
            </div>

            <div className="p-5">
              {studentProgress.length === 0 ? (
                <EmptyState
                  icon={<BookOpen size={22} />}
                  message="No progress data available yet."
                />
              ) : (
                <div className="h-70 flex items-end justify-around gap-3">
                  {studentProgress.map((item, index) => {
                    const percentage = Math.round(Number(item.percentage) || 0);

                    return (
                      <div
                        key={item.topic || index}
                        className="flex-1 h-full flex flex-col items-center justify-end"
                      >
                        {/* Percentage */}

                        <span className="text-xs font-bold text-slate-600 mb-2">
                          {percentage}%
                        </span>

                        {/* Bar */}

                        <div className="w-full max-w-13.5 h-47.5 bg-slate-50 rounded-t-lg flex items-end overflow-hidden">
                          <div
                            className="w-full bg-blue-600 rounded-t-lg transition-all duration-700"
                            style={{
                              height: `${Math.min(percentage, 100)}%`,
                            }}
                          />
                        </div>

                        {/* Topic */}

                        <span className="text-[11px] text-slate-500 mt-3 text-center truncate max-w-17.5">
                          {item.topic}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* At Risk Students */}

          <div className="xl:col-span-2 bg-white border border-slate-200 rounded-2xl">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="font-bold text-slate-900">At-Risk Students</h2>

                <p className="text-xs text-slate-400 mt-1">
                  Attendance below 75%
                </p>
              </div>

              <span className="text-xs font-bold bg-red-50 text-red-500 px-2.5 py-1 rounded-full">
                {atRiskStudents.length}
              </span>
            </div>

            <div className="p-4">
              {atRiskStudents.length === 0 ? (
                <EmptyState
                  icon={<CheckCircle2 size={22} />}
                  message="No students are currently at risk."
                />
              ) : (
                <div className="space-y-2">
                  {atRiskStudents.slice(0, 6).map((student) => {
                    const name = student.name || student.fullname || "Student";

                    return (
                      <div
                        key={student._id}
                        className="flex items-center justify-between px-2 py-2.5 rounded-lg hover:bg-slate-50 transition"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-bold shrink-0">
                            {getInitials(name)}
                          </div>

                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-slate-700 truncate">
                              {name}
                            </p>

                            <p className="text-[10px] text-slate-400 truncate">
                              {student.email}
                            </p>
                          </div>
                        </div>

                        <span className="text-xs font-bold text-red-500 ml-3">
                          {student.attendance ?? 0}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* =========================
            RECENT SUBMISSIONS
            + UPCOMING DEADLINES
        ========================== */}

        <section className="grid grid-cols-1 xl:grid-cols-2 gap-5 mt-5">
          {/* Recent Submissions */}

          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100">
              <h2 className="font-bold text-slate-900">Recent Submissions</h2>

              <p className="text-xs text-slate-400 mt-1">
                Latest student assignment submissions
              </p>
            </div>

            {recentSubmissions.length === 0 ? (
              <div className="p-8">
                <EmptyState
                  icon={<ClipboardCheck size={22} />}
                  message="No submissions yet."
                />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-140">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <TableHead>Student</TableHead>

                      <TableHead>Assignment</TableHead>

                      <TableHead>Status</TableHead>

                      <TableHead>Submitted</TableHead>
                    </tr>
                  </thead>

                  <tbody>
                    {recentSubmissions.map((submission) => {
                      const studentName =
                        submission.student?.name ||
                        submission.student?.fullname ||
                        "Unknown Student";

                      const graded =
                        submission.grade !== undefined &&
                        submission.grade !== null &&
                        submission.grade !== "";

                      return (
                        <tr
                          key={submission._id}
                          className="border-b border-slate-50 last:border-0 hover:bg-slate-50"
                        >
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[9px] font-bold">
                                {getInitials(studentName)}
                              </div>

                              <span className="text-xs font-semibold text-slate-700">
                                {studentName}
                              </span>
                            </div>
                          </td>

                          <td className="px-5 py-3">
                            <span className="text-xs text-slate-600">
                              {submission.assignment?.title || "Assignment"}
                            </span>
                          </td>

                          <td className="px-5 py-3">
                            <span
                              className={`inline-flex px-2 py-1 rounded-md text-[10px] font-bold ${
                                graded
                                  ? "bg-emerald-50 text-emerald-600"
                                  : "bg-amber-50 text-amber-600"
                              }`}
                            >
                              {graded ? "Graded" : "Pending"}
                            </span>
                          </td>

                          <td className="px-5 py-3">
                            <span className="text-[11px] text-slate-400">
                              {formatDate(submission.createdAt)}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Upcoming Deadlines */}

          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100">
              <h2 className="font-bold text-slate-900">Upcoming Deadlines</h2>

              <p className="text-xs text-slate-400 mt-1">
                Assignments coming up
              </p>
            </div>

            <div className="p-4">
              {upcomingAssignments.length === 0 ? (
                <EmptyState
                  icon={<CalendarDays size={22} />}
                  message="No upcoming assignments."
                />
              ) : (
                <div className="space-y-2">
                  {upcomingAssignments.map((assignment, index) => {
                    const days = getDaysRemaining(assignment.dueDate);

                    return (
                      <div
                        key={assignment._id}
                        className="flex items-center justify-between gap-3 px-3 py-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                              index % 3 === 0
                                ? "bg-amber-50 text-amber-500"
                                : index % 3 === 1
                                  ? "bg-blue-50 text-blue-500"
                                  : "bg-red-50 text-red-500"
                            }`}
                          >
                            <BookOpen size={17} />
                          </div>

                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-700 truncate">
                              {assignment.title}
                            </p>

                            <p className="text-[10px] text-slate-400 mt-1">
                              {formatDate(assignment.dueDate)}
                            </p>
                          </div>
                        </div>

                        <span className="text-[10px] font-bold text-slate-500 whitespace-nowrap">
                          {days}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

/* =================================
   STAT CARD
================================= */

const StatCard = ({
  title,
  value,
  icon,
  iconBg,
  iconColor,
  valueColor = "text-slate-900",
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl px-5 py-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-slate-400">{title}</p>

          <p className={`text-2xl md:text-3xl font-bold mt-1 ${valueColor}`}>
            {value}
          </p>
        </div>

        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg} ${iconColor}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};

/* =================================
   TABLE HEAD
================================= */

const TableHead = ({ children }) => {
  return (
    <th className="text-left px-5 py-3 text-[10px] uppercase tracking-wide font-bold text-slate-400">
      {children}
    </th>
  );
};

/* =================================
   EMPTY STATE
================================= */

const EmptyState = ({ icon, message }) => {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center">
        {icon}
      </div>

      <p className="text-xs text-slate-400 mt-2">{message}</p>
    </div>
  );
};

/* =================================
   HELPERS
================================= */

const getInitials = (name = "") => {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
};

const formatDate = (date) => {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const getDaysRemaining = (date) => {
  if (!date) return "";

  const now = new Date();
  const deadline = new Date(date);

  const difference = deadline.getTime() - now.getTime();

  const days = Math.ceil(difference / (1000 * 60 * 60 * 24));

  if (days < 0) {
    return "Overdue";
  }

  if (days === 0) {
    return "Today";
  }

  if (days === 1) {
    return "Tomorrow";
  }

  return `${days} days`;
};

export default MentorDashboard;
