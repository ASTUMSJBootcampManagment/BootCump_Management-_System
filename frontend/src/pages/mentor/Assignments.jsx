import { useEffect, useState, useRef } from "react";
import {
  ClipboardList,
  Plus,
  Trash2,
  Edit3,
  Eye,
  X,
  RefreshCw,
  FileText,
  Download,
  Paperclip,
} from "lucide-react";
import MentorLayout from "../../components/mentor/MentorLayout";
import Toast from "../../components/common/Toast";
import API from "../../api/axios";
import { downloadPdfFile } from "../../utils/downloadFile";

const emptyForm = {
  title: "",
  description: "",
  instructions: "",
  dueDate: "",
  maxScore: 100,
  group: "",
};

export default function Assignments() {
  const [assignments, setAssignments] = useState([]);
  const [groups, setGroups] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [selected, setSelected] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [grade, setGrade] = useState({});
  const [feedback, setFeedback] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const fileInputRef = useRef(null);

  const load = async () => {
    setLoading(true);

    try {
      const assignmentsResponse = await API.get("/assignments");

      setAssignments(assignmentsResponse.data.data || []);
    } catch (error) {
      setToast({
        message: error.response?.data?.message || "Unable to load assignments.",
        type: "error",
      });
    }

    try {
      const groupsResponse = await API.get("/batches/my-groups");

      setGroups(groupsResponse.data.data || []);
      if (!(groupsResponse.data.data || []).length) {
        setToast({
          type: "error",
          message:
            "No group is assigned to you in the active batch. Ask an admin to create a group and add you to it.",
        });
      }
    } catch {
      // Assignments can still be displayed if batches fail.
    }

    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (
        file.type !== "application/pdf" &&
        !file.name.toLowerCase().endsWith(".pdf")
      ) {
        setToast({
          message: "Please select a valid PDF file.",
          type: "error",
        });
        e.target.value = "";
        setPdfFile(null);
        return;
      }
      setPdfFile(file);
    } else {
      setPdfFile(null);
    }
  };

  const submit = async (event) => {
    event.preventDefault();

    if (
      !form.title.trim() ||
      !form.description.trim() ||
      !form.dueDate ||
      !form.group
    ) {
      setToast({
        message: "Title, description, due date and group are required.",
        type: "error",
      });

      return;
    }

    setSaving(true);

    try {
      const submitData = new FormData();
      submitData.append("title", form.title.trim());
      submitData.append("description", form.description.trim());
      submitData.append("instructions", form.instructions || "");
      submitData.append("dueDate", new Date(form.dueDate).toISOString());
      submitData.append("maxScore", form.maxScore || 100);
      submitData.append("group", form.group);
      if (pdfFile) {
        submitData.append("pdfFile", pdfFile);
      }

      if (editing) {
        await API.put(`/assignments/${editing._id}`, submitData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        setToast({
          message: "Assignment updated successfully.",
          type: "success",
        });
      } else {
        await API.post("/assignments", submitData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        setToast({
          message: "Assignment created successfully.",
          type: "success",
        });
      }

      setForm(emptyForm);
      setPdfFile(null);
      setEditing(null);
      setShowForm(false);
      await load();
    } catch (error) {
      setToast({
        message: error.response?.data?.message || "Unable to save assignment.",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  const edit = (assignment) => {
    setEditing(assignment);

    setForm({
      title: assignment.title || "",
      description: assignment.description || "",
      instructions: assignment.instructions || "",
      dueDate: assignment.dueDate
        ? new Date(assignment.dueDate).toISOString().slice(0, 16)
        : "",
      maxScore: assignment.maxScore || 100,
      group: assignment.group || "",
    });

    setShowForm(true);
  };

  const remove = async (id) => {
    if (
      !window.confirm("Delete this assignment? This action cannot be undone.")
    ) {
      return;
    }

    try {
      await API.delete(`/assignments/${id}`);

      setToast({
        message: "Assignment deleted.",
        type: "success",
      });

      await load();
    } catch (error) {
      setToast({
        message:
          error.response?.data?.message || "Unable to delete assignment.",
        type: "error",
      });
    }
  };

  const viewSubmissions = async (assignment) => {
    setSelected(assignment);
    setSubmissions([]);

    try {
      const response = await API.get(
        `/assignments/${assignment._id}/submissions`,
      );

      setSubmissions(response.data.data || []);
    } catch (error) {
      setToast({
        message: error.response?.data?.message || "Unable to load submissions.",
        type: "error",
      });
    }
  };

  const gradeSubmission = async (submission, requestResubmission = false) => {
    const value = Number(grade[submission._id]);

    if (
      !requestResubmission &&
      (!Number.isFinite(value) ||
        value < 0 ||
        value > Number(selected?.maxScore || 100))
    ) {
      setToast({
        message: "Enter a valid grade.",
        type: "error",
      });

      return;
    }

    try {
      await API.patch(`/assignments/submissions/${submission._id}/grade`, {
        grade: value,
        feedback: feedback[submission._id] || "",
        requestResubmission,
      });

      setToast({
        message: "Submission graded successfully.",
        type: "success",
      });

      await viewSubmissions(selected);
    } catch (error) {
      setToast({
        message: error.response?.data?.message || "Unable to grade submission.",
        type: "error",
      });
    }
  };

  return (
    <MentorLayout title="Assignments">
      <Toast {...toast} onClose={() => setToast(null)} />

      <div className="mb-6 flex flex-wrap justify-between items-end gap-4">
        <div>
          <h2 className="text-3xl font-black text-[#062a5c]">Assignments</h2>

          <p className="text-slate-500 mt-2">
            Create assignments and review student submissions.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={load}
            className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl font-bold flex items-center gap-2"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>

          <button
            onClick={() => {
              setEditing(null);
              setForm(emptyForm);
              setShowForm(true);
            }}
            className="px-4 py-2.5 bg-[#08c98b] text-white rounded-xl font-black flex items-center gap-2"
          >
            <Plus size={17} />
            New assignment
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-6">
          <div className="flex justify-between items-center mb-5">
            <div>
              <h3 className="text-xl font-black text-[#062a5c]">
                {editing ? "Edit assignment" : "Create assignment"}
              </h3>
            </div>

            <button
              onClick={() => setShowForm(false)}
              className="w-9 h-9 rounded-lg bg-slate-100 grid place-items-center"
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={submit} className="grid md:grid-cols-2 gap-4">
            <label className="font-bold text-sm">
              Title
              <input
                value={form.title}
                onChange={(e) =>
                  setForm({
                    ...form,
                    title: e.target.value,
                  })
                }
                className="w-full mt-2 border rounded-xl px-3 py-3 font-normal"
                required
              />
            </label>

            <label className="font-bold text-sm">
              Group
              <select
                value={form.group}
                onChange={(e) =>
                  setForm({
                    ...form,
                    group: e.target.value,
                  })
                }
                className="w-full mt-2 border rounded-xl px-3 py-3 font-normal"
                required
              >
                <option value="">Select group</option>

                {groups.map((group) => (
                  <option key={group._id} value={group._id}>
                    {group.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="font-bold text-sm md:col-span-2">
              Description
              <textarea
                rows="3"
                value={form.description}
                onChange={(e) =>
                  setForm({
                    ...form,
                    description: e.target.value,
                  })
                }
                className="w-full mt-2 border rounded-xl px-3 py-3 font-normal"
                required
              />
            </label>

            <label className="font-bold text-sm md:col-span-2">
              Instructions
              <textarea
                rows="3"
                value={form.instructions}
                onChange={(e) =>
                  setForm({
                    ...form,
                    instructions: e.target.value,
                  })
                }
                className="w-full mt-2 border rounded-xl px-3 py-3 font-normal"
              />
            </label>

            <label className="font-bold text-sm">
              Due date
              <input
                type="datetime-local"
                value={form.dueDate}
                onChange={(e) =>
                  setForm({
                    ...form,
                    dueDate: e.target.value,
                  })
                }
                className="w-full mt-2 border rounded-xl px-3 py-3 font-normal"
                required
              />
            </label>

            <label className="font-bold text-sm">
              Maximum score
              <input
                type="number"
                min="1"
                value={form.maxScore}
                onChange={(e) =>
                  setForm({
                    ...form,
                    maxScore: Number(e.target.value),
                  })
                }
                className="w-full mt-2 border rounded-xl px-3 py-3 font-normal"
              />
            </label>

            <div className="md:col-span-2">
              <label className="font-bold text-sm block mb-2">
                Upload PDF Material (Cloudinary)
              </label>
              <div className="border border-dashed border-slate-300 hover:border-[#08c98b] rounded-xl p-3 bg-slate-50/50 transition">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf,.pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  id="mentor-assignment-pdf"
                />
                <label
                  htmlFor="mentor-assignment-pdf"
                  className="cursor-pointer flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2 text-sm text-slate-600 truncate">
                    <Paperclip size={16} className="text-[#08c98b] shrink-0" />
                    <span className="truncate">
                      {pdfFile
                        ? pdfFile.name
                        : editing?.pdfUrl
                          ? "Current PDF attached (click to replace)"
                          : "Choose a PDF file to attach..."}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-[#08ad81] px-2.5 py-1 bg-[#e8faf5] rounded-lg shrink-0">
                    {pdfFile ? "Change" : "Browse"}
                  </span>
                </label>
                {pdfFile && (
                  <div className="mt-2 flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-200">
                    <span>{(pdfFile.size / 1024).toFixed(1)} KB</span>
                    <button
                      type="button"
                      onClick={() => {
                        setPdfFile(null);
                        if (fileInputRef.current) fileInputRef.current.value = "";
                      }}
                      className="text-rose-500 hover:text-rose-700 font-bold"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="md:col-span-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-5 py-3 rounded-xl bg-slate-100 font-bold"
              >
                Cancel
              </button>

              <button
                disabled={saving}
                className="px-5 py-3 rounded-xl bg-[#08c98b] text-white font-black disabled:opacity-50"
              >
                {saving
                  ? "Saving..."
                  : editing
                    ? "Update assignment"
                    : "Create assignment"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
        {assignments.map((assignment) => (
          <article
            key={assignment._id}
            className="bg-white border border-slate-200 rounded-2xl p-5"
          >
            <div className="flex justify-between gap-3">
              <div className="w-11 h-11 rounded-xl bg-[#e8faf5] text-[#08ad81] grid place-items-center">
                <ClipboardList size={20} />
              </div>

              <div className="text-xs font-black text-slate-400">
                {assignment.maxScore || 100} pts
              </div>
            </div>

            <h3 className="font-black text-lg text-[#062a5c] mt-4">
              {assignment.title}
            </h3>

            <p className="text-sm text-slate-500 mt-2 line-clamp-3">
              {assignment.description}
            </p>

            <div className="mt-4 text-xs text-slate-400">
              Group:{" "}
              <span className="font-bold text-slate-600">
                {groups.find(
                  (group) => String(group._id) === String(assignment.group),
                )?.name || "—"}
              </span>
            </div>

            <div className="mt-1 text-xs text-slate-400">
              Due:{" "}
              {assignment.dueDate
                ? new Date(assignment.dueDate).toLocaleString()
                : "—"}
            </div>

            {(assignment.pdfUrl || assignment.pdfOriginalName) && (
              <div className="mt-3">
                <button
                  type="button"
                  onClick={() =>
                    downloadPdfFile(
                      assignment._id,
                      assignment.pdfOriginalName || `${assignment.title}.pdf`
                    )
                  }
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-[#08ad81] hover:bg-emerald-100 font-bold text-xs transition cursor-pointer"
                  title="Download Assignment PDF"
                >
                  <FileText size={13} />
                  <span className="truncate max-w-[150px]">
                    {assignment.pdfOriginalName || "Download PDF"}
                  </span>
                  <Download size={13} />
                </button>
              </div>
            )}

            <div className="border-t border-slate-100 mt-5 pt-4 flex flex-wrap gap-2">
              <button
                onClick={() => viewSubmissions(assignment)}
                className="px-3 py-2 rounded-lg bg-[#062a5c] text-white text-xs font-black flex items-center gap-1"
              >
                <Eye size={13} />
                Submissions
              </button>

              <button
                onClick={() => edit(assignment)}
                className="px-3 py-2 rounded-lg bg-slate-100 text-xs font-black flex items-center gap-1"
              >
                <Edit3 size={13} />
                Edit
              </button>

              <button
                onClick={() => remove(assignment._id)}
                className="px-3 py-2 rounded-lg bg-red-50 text-red-700 text-xs font-black flex items-center gap-1"
              >
                <Trash2 size={13} />
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>

      {!loading && !assignments.length && (
        <div className="bg-white border rounded-2xl p-12 text-center">
          <ClipboardList size={42} className="mx-auto text-slate-300" />

          <h3 className="font-black mt-3">No assignments yet</h3>

          <p className="text-sm text-slate-400 mt-1">
            Create the first assignment for your students.
          </p>
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 p-4 overflow-y-auto">
          <div className="max-w-4xl mx-auto mt-8 bg-white rounded-2xl shadow-2xl">
            <div className="p-6 border-b flex justify-between items-center">
              <div>
                <div className="text-xs uppercase tracking-wider text-[#08ad81] font-black">
                  Submission review
                </div>

                <h3 className="text-xl font-black text-[#062a5c] mt-1">
                  {selected.title}
                </h3>
              </div>

              <button
                onClick={() => setSelected(null)}
                className="w-10 h-10 rounded-xl bg-slate-100 grid place-items-center"
              >
                <X />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {!submissions.length && (
                <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-xl">
                  No submissions yet.
                </div>
              )}

              {submissions.map((submission) => (
                <article
                  key={submission._id}
                  className="border border-slate-200 rounded-xl p-5"
                >
                  <div className="flex flex-wrap justify-between gap-3">
                    <div>
                      <div className="font-black">
                        {submission.student?.fullname || "Student"}
                      </div>

                      <div className="text-xs text-slate-400">
                        {submission.student?.email}
                      </div>
                    </div>

                    <div className="text-xs text-slate-400">
                      Submitted{" "}
                      {submission.submittedAt
                        ? new Date(submission.submittedAt).toLocaleString()
                        : ""}
                    </div>
                  </div>

                  <div className="mt-4 bg-slate-50 rounded-xl p-4 text-sm whitespace-pre-wrap wap-break-word">
                    {submission.content}
                  </div>

                  <div className="mt-4 grid md:grid-cols-[140px_1fr_auto] gap-3">
                    <input
                      type="number"
                      min="0"
                      max={selected.maxScore || 100}
                      placeholder={`Grade / ${selected.maxScore || 100}`}
                      value={grade[submission._id] ?? submission.grade ?? ""}
                      onChange={(e) =>
                        setGrade({
                          ...grade,
                          [submission._id]: e.target.value,
                        })
                      }
                      className="border rounded-xl px-3 py-3"
                    />

                    <input
                      placeholder="Feedback for student"
                      value={
                        feedback[submission._id] ?? submission.feedback ?? ""
                      }
                      onChange={(e) =>
                        setFeedback({
                          ...feedback,
                          [submission._id]: e.target.value,
                        })
                      }
                      className="border rounded-xl px-3 py-3"
                    />

                    <button
                      onClick={() => gradeSubmission(submission)}
                      className="px-4 py-3 bg-[#08c98b] text-white rounded-xl font-black"
                    >
                      Save grade
                    </button>

                    <button
                      onClick={() => gradeSubmission(submission, true)}
                      className="px-4 py-3 bg-amber-50 text-amber-800 rounded-xl font-black text-sm"
                    >
                      Request resubmission
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      )}
    </MentorLayout>
  );
}
