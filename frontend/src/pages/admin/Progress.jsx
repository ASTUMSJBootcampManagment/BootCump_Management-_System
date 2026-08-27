import React, { useEffect, useState } from "react";
import {
  Plus,
  RefreshCw,
  BookOpen,
  CheckCircle2,
  Clock3,
  AlertCircle,
  Users,
} from "lucide-react";
import API from "../../api/axios";

const statusConfig = {
  Completed: {
    label: "Completed",
    className: "bg-emerald-50 text-emerald-700",
    icon: CheckCircle2,
  },
  InProgress: {
    label: "In Progress",
    className: "bg-blue-50 text-blue-700",
    icon: Clock3,
  },
  NeedsImprovement: {
    label: "Needs Improvement",
    className: "bg-amber-50 text-amber-700",
    icon: AlertCircle,
  },
  NotStarted: {
    label: "Not Started",
    className: "bg-slate-100 text-slate-600",
    icon: Clock3,
  },
};

export default function Progress() {
  const [batches, setBatches] = useState([]);
  const [students, setStudents] = useState([]);

  const [selectedBatch, setSelectedBatch] = useState("");
  const [topic, setTopic] = useState("");

  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [message, setMessage] = useState("");

  const loadData = async () => {
    setLoading(true);

    try {
      const [batchResponse, studentResponse] =
        await Promise.all([
          API.get("/batches"),
          API.get("/admin/users?role=Student"),
        ]);

      setBatches(batchResponse.data?.data || []);
      setStudents(studentResponse.data?.data || []);
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Unable to load progress data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const createTopic = async (e) => {
    e.preventDefault();

    if (!topic.trim()) {
      setMessage("Enter a topic name.");
      return;
    }

    setCreating(true);
    setMessage("");

    try {
      const response = await API.post("/progress/create", {
        topic: topic.trim(),
        batchId: selectedBatch || undefined,
      });

      setMessage(response.data.message);
      setTopic("");
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Unable to create progress topic."
      );
    } finally {
      setCreating(false);
    }
  };

  const loadStudentProgress = async (studentId) => {
    try {
      const response = await API.get(
        `/progress/get-one/${studentId}`
      );

      setProgress((previous) => ({
        ...previous,
        [studentId]: response.data,
      }));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    students.forEach((student) => {
      loadStudentProgress(student._id);
    });
  }, [students]);

  const visibleStudents = selectedBatch
    ? students.filter(
        (student) =>
          student.assignedBatch?._id === selectedBatch ||
          student.appliedBatch?._id === selectedBatch
      )
    : students;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] font-black text-[#08ad81]">
            Learning Management
          </p>

          <h1 className="text-2xl sm:text-3xl font-black text-[#062a5c]">
            Progress
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Create learning topics and monitor student progress.
          </p>
        </div>

        <button
          onClick={loadData}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white font-bold text-sm"
        >
          <RefreshCw size={17} />
          Refresh
        </button>
      </div>

      {message && (
        <div className="bg-white border border-slate-200 rounded-xl p-4 text-sm font-semibold text-slate-700">
          {message}
        </div>
      )}

      {/* Create topic */}
      <section className="bg-white border border-slate-200 rounded-2xl p-5">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-xl bg-[#e8faf5] text-[#08ad81] grid place-items-center">
            <BookOpen size={20} />
          </div>

          <div>
            <h2 className="font-black text-[#062a5c]">
              Create Progress Topic
            </h2>

            <p className="text-xs text-slate-400">
              The topic will be added to students in the selected batch.
            </p>
          </div>
        </div>

        <form
          onSubmit={createTopic}
          className="grid grid-cols-1 md:grid-cols-[1fr_260px_auto] gap-3"
        >
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. React Hooks"
            className="px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#08c98b]/20"
          />

          <select
            value={selectedBatch}
            onChange={(e) => setSelectedBatch(e.target.value)}
            className="px-4 py-3 border border-slate-200 rounded-xl text-sm bg-white"
          >
            <option value="">All active batches</option>

            {batches.map((batch) => (
              <option key={batch._id} value={batch._id}>
                {batch.name}
              </option>
            ))}
          </select>

          <button
            disabled={creating}
            className="px-5 py-3 rounded-xl bg-[#08c98b] text-white font-black text-sm disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Plus size={17} />

            {creating ? "Creating..." : "Create Topic"}
          </button>
        </form>
      </section>

      {/* Student progress */}
      <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center gap-3">
          <Users size={20} className="text-[#08ad81]" />

          <div>
            <h2 className="font-black text-[#062a5c]">
              Student Progress
            </h2>

            <p className="text-xs text-slate-400">
              {visibleStudents.length} student
              {visibleStudents.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="p-10 text-center text-slate-400">
            Loading students...
          </div>
        ) : visibleStudents.length === 0 ? (
          <div className="p-10 text-center text-slate-400">
            No students found.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {visibleStudents.map((student) => {
              const studentProgress =
                progress[student._id];

              const records =
                studentProgress?.data || [];

              const completion =
                studentProgress?.completion || 0;

              const studentName =
                student.fullname ||
                student.name ||
                "Unnamed Student";

              return (
                <div
                  key={student._id}
                  className="p-5"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#e8faf5] text-[#08ad81] grid place-items-center font-black">
                        {studentName
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <div>
                        <p className="font-bold text-slate-800">
                          {studentName}
                        </p>

                        <p className="text-xs text-slate-400">
                          {student.email}
                        </p>
                      </div>
                    </div>

                    <div className="w-full lg:w-64">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-bold text-slate-500">
                          Completion
                        </span>

                        <span className="font-black text-[#08ad81]">
                          {completion}%
                        </span>
                      </div>

                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#08c98b] rounded-full"
                          style={{
                            width: `${completion}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {records.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {records.map((record) => {
                        const config =
                          statusConfig[
                            record.status
                          ] ||
                          statusConfig.NotStarted;

                        const Icon = config.icon;

                        return (
                          <span
                            key={record._id}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold ${config.className}`}
                          >
                            <Icon size={13} />

                            {record.topic}:{" "}
                            {config.label}
                          </span>
                        );
                      })}
                    </div>
                  )}

                  {records.length === 0 && (
                    <p className="text-xs text-slate-400 mt-4">
                      No progress records yet.
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}