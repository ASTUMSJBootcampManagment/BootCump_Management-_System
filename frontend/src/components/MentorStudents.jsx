import {
  Search,
  SlidersHorizontal,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Trash2,
  Users,
} from "lucide-react";

import { useMemo, useState } from "react";

const MentorStudents = ({ students = [] }) => {
  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("All Status");

  const [currentPage, setCurrentPage] = useState(1);

  const studentsPerPage = 5;

  // ============================================
  // FILTER
  // ============================================

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const name = student.name?.toLowerCase() || "";

      const email = student.email?.toLowerCase() || "";

      const searchValue = search.toLowerCase();

      const matchesSearch =
        name.includes(searchValue) || email.includes(searchValue);

      const matchesStatus =
        statusFilter === "All Status" || student.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [students, search, statusFilter]);

  // ============================================
  // PAGINATION
  // ============================================

  const totalPages = Math.max(
    1,
    Math.ceil(filteredStudents.length / studentsPerPage),
  );

  const safePage = Math.min(currentPage, totalPages);

  const startIndex = (safePage - 1) * studentsPerPage;

  const displayedStudents = filteredStudents.slice(
    startIndex,
    startIndex + studentsPerPage,
  );

  // ============================================
  // SEARCH HANDLER
  // ============================================

  const handleSearch = (value) => {
    setSearch(value);

    setCurrentPage(1);
  };

  // ============================================
  // STATUS FILTER
  // ============================================

  const handleStatus = (value) => {
    setStatusFilter(value);

    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-[#f7f9fc]">
      {/* ========================================
          MAIN
      ======================================== */}

      <main className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-362.5 mx-auto">
          {/* ======================================
              CARD
          ====================================== */}

          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            {/* ====================================
                TITLE
            ==================================== */}

            <div className="px-5 sm:px-6 py-5 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center">
                  <Users size={18} className="text-slate-600" />
                </div>

                <div>
                  <h1 className="text-lg font-bold text-slate-900">
                    My Students
                  </h1>

                  <p className="text-xs text-slate-400 mt-0.5">
                    {students.length} students in your batch
                  </p>
                </div>
              </div>
            </div>

            {/* ====================================
                FILTER BAR
            ==================================== */}

            <div className="px-5 sm:px-6 py-4 border-b border-slate-100">
              <div className="flex flex-col sm:flex-row gap-3">
                {/* SEARCH */}

                <div className="relative w-full sm:w-75">
                  <Search
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="text"
                    value={search}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Search students..."
                    className="w-full h-10 pl-9 pr-3 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 placeholder:text-slate-400"
                  />
                </div>

                {/* STATUS */}

                <div className="relative">
                  <SlidersHorizontal
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  />

                  <select
                    value={statusFilter}
                    onChange={(e) => handleStatus(e.target.value)}
                    className="appearance-none h-10 w-full sm:w-37.5 pl-9 pr-8 rounded-lg border border-slate-200 bg-white text-sm text-slate-600 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  >
                    <option>All Status</option>

                    <option value="Good">Good</option>

                    <option value="Warning">Warning</option>

                    <option value="At Risk">At Risk</option>
                  </select>

                  <ChevronDown
                    size={15}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  />
                </div>
              </div>
            </div>

            {/* ====================================
                TABLE
            ==================================== */}

            <div className="overflow-x-auto">
              <table className="w-full min-w-225 border-collapse">
                <thead>
                  <tr className="bg-[#fbfcfe] border-b border-slate-200">
                    <th className="text-left px-6 py-3.5 text-[11px] font-bold text-slate-500">
                      Name
                    </th>

                    <th className="text-left px-5 py-3.5 text-[11px] font-bold text-slate-500">
                      Email
                    </th>

                    <th className="text-left px-5 py-3.5 text-[11px] font-bold text-slate-500">
                      Attendance
                    </th>

                    <th className="text-left px-5 py-3.5 text-[11px] font-bold text-slate-500">
                      <div className="flex items-center gap-1">
                        Progress
                        <ChevronDown size={12} />
                      </div>
                    </th>

                    <th className="text-left px-5 py-3.5 text-[11px] font-bold text-slate-500">
                      Status
                    </th>

                    <th className="text-center px-5 py-3.5 text-[11px] font-bold text-slate-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {displayedStudents.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-16 text-center">
                        <div className="flex flex-col items-center">
                          <div className="w-11 h-11 rounded-full bg-slate-100 flex items-center justify-center">
                            <Users size={20} className="text-slate-400" />
                          </div>

                          <p className="mt-3 text-sm font-medium text-slate-600">
                            No students found
                          </p>

                          <p className="text-xs text-slate-400 mt-1">
                            Try changing your search or filter.
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    displayedStudents.map((student) => {
                      const name = student.name || "Unknown Student";

                      return (
                        <tr
                          key={student._id}
                          className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition"
                        >
                          {/* NAME */}

                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-bold shrink-0">
                                {getInitials(name)}
                              </div>

                              <span className="text-xs sm:text-sm font-semibold text-slate-700 whitespace-nowrap">
                                {name}
                              </span>
                            </div>
                          </td>

                          {/* EMAIL */}

                          <td className="px-5 py-4">
                            <span className="text-xs sm:text-sm text-slate-500">
                              {student.email || "-"}
                            </span>
                          </td>

                          {/* ATTENDANCE */}

                          <td className="px-5 py-4">
                            <span
                              className={`
                                  text-xs sm:text-sm font-medium
                                  ${
                                    student.attendance < 75
                                      ? "text-red-500"
                                      : student.attendance < 85
                                        ? "text-amber-500"
                                        : "text-slate-600"
                                  }
                                `}
                            >
                              {student.attendance ?? 0}%
                            </span>
                          </td>

                          {/* PROGRESS */}

                          <td className="px-5 py-4">
                            <span className="text-xs sm:text-sm font-medium text-slate-600">
                              {student.progress ?? 0}%
                            </span>
                          </td>

                          {/* STATUS */}

                          <td className="px-5 py-4">
                            <StatusBadge status={student.status} />
                          </td>

                          {/* ACTIONS */}

                          <td className="px-5 py-4">
                            <div className="flex items-center justify-center gap-2">
                              {/* Edit */}

                              <button
                                type="button"
                                title="Edit student"
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-amber-600 hover:bg-amber-50 transition"
                                onClick={() =>
                                  console.log("Edit student:", student._id)
                                }
                              >
                                <Pencil size={15} />
                              </button>

                              {/* Delete */}

                              <button
                                type="button"
                                title="Delete student"
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-red-500 hover:bg-red-50 transition"
                                onClick={() =>
                                  console.log("Delete student:", student._id)
                                }
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* ====================================
                PAGINATION
            ==================================== */}

            <div className="px-5 sm:px-6 py-3.5 border-t border-slate-100 flex items-center justify-between">
              <p className="text-xs text-slate-400">
                Showing{" "}
                <span className="font-semibold text-slate-600">
                  {filteredStudents.length === 0 ? 0 : startIndex + 1}
                </span>{" "}
                to{" "}
                <span className="font-semibold text-slate-600">
                  {Math.min(
                    startIndex + studentsPerPage,
                    filteredStudents.length,
                  )}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-slate-600">
                  {filteredStudents.length}
                </span>
              </p>

              <div className="flex items-center gap-1">
                {/* PREVIOUS */}

                <button
                  disabled={safePage === 1}
                  onClick={() =>
                    setCurrentPage((page) => Math.max(1, page - 1))
                  }
                  className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 disabled:opacity-30 hover:bg-slate-50"
                >
                  <ChevronLeft size={15} />
                </button>

                {/* PAGE NUMBERS */}

                {Array.from(
                  {
                    length: totalPages,
                  },
                  (_, index) => index + 1,
                )
                  .slice(0, 5)
                  .map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`
                        w-8 h-8 rounded-lg text-xs font-semibold
                        ${
                          safePage === page
                            ? "bg-blue-600 text-white"
                            : "text-slate-500 hover:bg-slate-50"
                        }
                      `}
                    >
                      {page}
                    </button>
                  ))}

                {/* NEXT */}

                <button
                  disabled={safePage === totalPages}
                  onClick={() =>
                    setCurrentPage((page) => Math.min(totalPages, page + 1))
                  }
                  className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 disabled:opacity-30 hover:bg-slate-50"
                >
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ========================================
          FOOTER
      ======================================== */}

      <footer className="text-center py-8">
        <p className="text-[10px] font-semibold text-teal-700">
          ASTUMS | BOOTCAMP • Mentor Students
        </p>
      </footer>
    </div>
  );
};

// ============================================
// STATUS BADGE
// ============================================

const StatusBadge = ({ status }) => {
  if (status === "At Risk") {
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-red-50 text-red-500 text-[10px] font-bold">
        At Risk
      </span>
    );
  }

  if (status === "Warning") {
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-amber-50 text-amber-600 text-[10px] font-bold">
        Warning
      </span>
    );
  }

  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold">
      Good
    </span>
  );
};

// ============================================
// INITIALS
// ============================================

const getInitials = (name = "") => {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
};

export default MentorStudents;
