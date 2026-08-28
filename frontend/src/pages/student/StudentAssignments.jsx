import { useEffect, useMemo, useState } from "react";
import {
  ClipboardList,
  Send,
  RefreshCw,
  X,
  CheckCircle2,
  Clock3,
  AlertCircle,
  Award,
} from "lucide-react";

import API from "../../api/axios";
import StudentLayout from "../../components/student/StudentLayout";
import "../../components/student/student.css";

export default function StudentAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [content, setContent] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");

    try {
      const [assignmentRes, submissionRes] = await Promise.allSettled([
        API.get("/assignments"),
        API.get("/assignments/my-submissions"),
      ]);

      if (assignmentRes.status === "fulfilled") {
        const rawData = assignmentRes.value.data;
        const fetchedAssignments = Array.isArray(rawData)
          ? rawData
          : rawData?.data?.assignments ||
            rawData?.data ||
            rawData?.assignments ||
            [];
        setAssignments(fetchedAssignments);
      } else {
        console.error("Assignments fetch failed:", assignmentRes.reason);
        setError("Failed to fetch assignments list.");
      }

      if (submissionRes.status === "fulfilled") {
        const rawSubData = submissionRes.value.data;
        const fetchedSubmissions = Array.isArray(rawSubData)
          ? rawSubData
          : rawSubData?.data?.submissions ||
            rawSubData?.data ||
            rawSubData?.submissions ||
            [];
        setSubmissions(fetchedSubmissions);
      } else {
        console.error("Submissions fetch failed:", submissionRes.reason);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to load assignment details.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const getSubmission = (assignmentId) => {
    return submissions.find((submission) => {
      const subAssignmentId =
        submission.assignment?._id ||
        submission.assignmentId ||
        submission.assignment;
      return String(subAssignmentId) === String(assignmentId);
    });
  };

  const getStatus = (assignment) => {
    const submission = getSubmission(assignment._id);

    if (submission?.status === "Resubmission Requested") {
      return "resubmit";
    }

    if (
      submission &&
      submission.grade !== null &&
      submission.grade !== undefined
    ) {
      return "graded";
    }

    if (submission) {
      return "submitted";
    }

    if (assignment.dueDate && new Date(assignment.dueDate) < new Date()) {
      return "overdue";
    }

    return "pending";
  };

  const filtered = useMemo(() => {
    if (filter === "all") return assignments;
    return assignments.filter((assignment) => getStatus(assignment) === filter);
  }, [assignments, submissions, filter]);

  const submit = async () => {
    if (!selected) return;

    const trimmedContent = content.trim();

    if (!trimmedContent) {
      setMessage("Please enter your submission content.");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      await API.post("/assignments/submit", {
        assignmentId: selected._id,
        content: trimmedContent,
      });

      setMessage("Assignment submitted successfully.");
      setSelected(null);
      setContent("");
      await load();
    } catch (err) {
      setMessage(err.response?.data?.message || "Unable to submit assignment.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <StudentLayout title="Assignments">
        <div className="student-card student-empty">Loading assignments...</div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout title="Assignments">
      {error && <div className="student-banner">{error}</div>}
      {message && !selected && <div className="student-banner">{message}</div>}

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-5">
        <div className="student-card p-5">
          <div className="text-xs text-slate-400 font-bold uppercase">
            Total
          </div>
          <div className="text-3xl font-black text-[#062a5c] mt-2">
            {assignments.length}
          </div>
        </div>

        <div className="student-card p-5">
          <div className="text-xs text-slate-400 font-bold uppercase">
            Pending
          </div>
          <div className="text-3xl font-black text-[#062a5c] mt-2">
            {assignments.filter((x) => getStatus(x) === "pending").length}
          </div>
        </div>

        <div className="student-card p-5">
          <div className="text-xs text-slate-400 font-bold uppercase">
            Submitted
          </div>
          <div className="text-3xl font-black text-[#062a5c] mt-2">
            {assignments.filter((x) => getStatus(x) === "submitted").length}
          </div>
        </div>

        <div className="student-card p-5">
          <div className="text-xs text-slate-400 font-bold uppercase">
            Graded
          </div>
          <div className="text-3xl font-black text-[#062a5c] mt-2">
            {assignments.filter((x) => getStatus(x) === "graded").length}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {[
          ["all", "All"],
          ["pending", "Pending"],
          ["submitted", "Submitted"],
          ["graded", "Graded"],
          ["overdue", "Overdue"],
        ].map(([value, label]) => (
          <button
            key={value}
            className={`student-filter ${filter === value ? "active" : ""}`}
            onClick={() => setFilter(value)}
          >
            {label}
          </button>
        ))}

        <button className="student-filter" onClick={load}>
          <RefreshCw size={13} />
          Refresh
        </button>
      </div>

      <div className="space-y-4">
        {filtered.map((assignment) => {
          const submission = getSubmission(assignment._id);
          const status = getStatus(assignment);

          return (
            <article
              key={assignment._id}
              className="student-card student-panel"
            >
              <div className="student-panel-header">
                <div>
                  <h3>{assignment.title}</h3>
                  <span>
                    Due{" "}
                    {assignment.dueDate
                      ? new Date(assignment.dueDate).toLocaleString()
                      : "No deadline"}
                  </span>
                </div>
                <span className="student-status">{status}</span>
              </div>

              <p className="text-sm text-slate-600 mt-4 leading-6">
                {assignment.description}
              </p>

              {assignment.instructions && (
                <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="text-xs uppercase font-black text-slate-400 mb-2">
                    Instructions
                  </div>
                  <div className="text-sm text-slate-600 whitespace-pre-wrap">
                    {assignment.instructions}
                  </div>
                </div>
              )}

              {submission && (
                <div className="mt-4 p-4 rounded-xl bg-[#f8fafc] border border-slate-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-[#08ad81]" />
                      <span className="font-bold text-sm">Your submission</span>
                    </div>

                    {/* Render Grade Badge if grade exists or status is Graded */}
                    {submission.grade !== null &&
                      submission.grade !== undefined && (
                        <span className="inline-flex items-center gap-1 font-black text-[#062a5c] text-lg">
                          <Award size={18} className="text-[#08c98b]" />
                          {submission.grade}/{assignment.maxScore || 100}
                        </span>
                      )}
                  </div>

                  {/* Submission Text Content */}
                  {submission.content && (
                    <p className="text-sm text-slate-600 mt-3 whitespace-pre-wrap">
                      {submission.content}
                    </p>
                  )}

                  {/* Mentor Feedback Container */}
                  {submission.feedback && (
                    <div className="mt-4 rounded-xl bg-white border p-4 shadow-sm">
                      <div className="text-xs font-black uppercase tracking-wider text-slate-400 mb-1">
                        Mentor Feedback
                      </div>
                      <p className="text-sm text-slate-700 font-medium whitespace-pre-wrap">
                        {submission.feedback}
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-end mt-5">
                {(status === "pending" || status === "resubmit") && (
                  <button
                    className="student-btn"
                    onClick={() => {
                      setSelected(assignment);
                      setContent(submission ? submission.content : "");
                      setMessage("");
                    }}
                  >
                    <Send size={14} />
                    {status === "resubmit"
                      ? "Resubmit work"
                      : "Submit assignment"}
                  </button>
                )}

                {status === "overdue" && (
                  <span className="inline-flex items-center gap-2 text-sm font-bold text-red-600">
                    <AlertCircle size={15} />
                    Deadline passed
                  </span>
                )}

                {status === "submitted" && (
                  <span className="inline-flex items-center gap-2 text-sm font-bold text-slate-500">
                    <Clock3 size={15} />
                    Waiting for mentor review
                  </span>
                )}
              </div>
            </article>
          );
        })}
      </div>

      {!filtered.length && (
        <div className="student-card student-empty">
          No assignments match this filter.
        </div>
      )}

      {/* Submission modal */}
      {selected && (
        <div className="fixed inset-0 z-50 bg-black/50 p-4 flex items-center justify-center">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl">
            <div className="p-5 border-b flex justify-between items-start">
              <div>
                <h2 className="text-xl font-black text-[#062a5c]">
                  Submit assignment
                </h2>
                <p className="text-sm text-slate-400 mt-1">{selected.title}</p>
              </div>

              <button
                onClick={() => {
                  setSelected(null);
                  setContent("");
                  setMessage("");
                }}
                className="w-9 h-9 rounded-lg bg-slate-100 grid place-items-center"
              >
                <X size={17} />
              </button>
            </div>

            <div className="p-5">
              <label className="student-label">Your submission</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={10}
                placeholder="Paste your solution, explanation, GitHub link, or other required work here..."
                className="student-input resize-none w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#08c98b]"
              />

              {message && (
                <div className="mt-3 text-sm font-semibold text-red-600">
                  {message}
                </div>
              )}
            </div>

            <div className="p-5 border-t flex justify-end gap-2">
              <button
                className="student-filter"
                onClick={() => {
                  setSelected(null);
                  setContent("");
                  setMessage("");
                }}
              >
                Cancel
              </button>

              <button
                className="student-btn"
                disabled={saving}
                onClick={submit}
              >
                <Send size={14} />
                {saving ? "Submitting..." : "Submit work"}
              </button>
            </div>
          </div>
        </div>
      )}
    </StudentLayout>
  );
}
