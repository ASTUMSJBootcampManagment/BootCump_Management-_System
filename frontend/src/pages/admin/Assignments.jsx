import { useEffect, useMemo, useState } from "react";
import {
  ClipboardList,
  Plus,
  Pencil,
  Trash2,
  RefreshCw,
  X,
  Save,
  Eye,
  FileText,
  CheckCircle2,
} from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout";
import API from "../../api/axios";

function getData(response) {
  return response?.data?.data || response?.data || [];
}

const emptyForm = {
  title: "",
  description: "",
  instructions: "",
  dueDate: "",
  maxScore: 100,
  batch: "",
};

export default function AdminAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [batches, setBatches] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [showSubmissions, setShowSubmissions] = useState(false);

  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });

    window.setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const load = async () => {
    setLoading(true);

    try {
      const [assignmentsRes, batchesRes] = await Promise.all([
        API.get("/assignments"),
        API.get("/batches"),
      ]);

      setAssignments(getData(assignmentsRes));
      setBatches(getData(batchesRes));
    } catch (error) {
      showToast(
        error.response?.data?.message ||
          "Unable to load assignments.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const sortedAssignments = useMemo(() => {
    return [...assignments].sort(
      (a, b) =>
        new Date(a.dueDate || 0) -
        new Date(b.dueDate || 0)
    );
  }, [assignments]);

  const submit = async (e) => {
    e.preventDefault();

    if (!form.title.trim()) {
      showToast("Assignment title is required.", "error");
      return;
    }

    if (!form.description.trim()) {
      showToast("Assignment description is required.", "error");
      return;
    }

    if (!form.dueDate) {
      showToast("Due date is required.", "error");
      return;
    }

    if (!form.batch) {
      showToast("Please select a batch.", "error");
      return;
    }

    setSaving(true);

    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        instructions: form.instructions.trim(),
        dueDate: form.dueDate,
        maxScore: Number(form.maxScore) || 100,
        batch: form.batch,
      };

      if (editingId) {
        await API.put(`/assignments/${editingId}`, payload);
        showToast("Assignment updated.");
      } else {
        await API.post("/assignments", payload);
        showToast("Assignment created.");
      }

      setForm(emptyForm);
      setEditingId(null);
      setShowForm(false);

      await load();
    } catch (error) {
      showToast(
        error.response?.data?.message ||
          "Unable to save assignment.",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  const editAssignment = (assignment) => {
    setEditingId(assignment._id);

    setForm({
      title: assignment.title || "",
      description: assignment.description || "",
      instructions: assignment.instructions || "",
      dueDate: assignment.dueDate
        ? String(assignment.dueDate).slice(0, 16)
        : "",
      maxScore: assignment.maxScore || 100,
      batch:
        assignment.batch?._id ||
        assignment.batch ||
        "",
    });

    setShowForm(true);
  };

  const deleteAssignment = async (assignment) => {
    const confirmed = window.confirm(
      `Delete "${assignment.title}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      await API.delete(`/assignments/${assignment._id}`);
      showToast("Assignment deleted.");
      await load();
    } catch (error) {
      showToast(
        error.response?.data?.message ||
          "Unable to delete assignment.",
        "error"
      );
    }
  };

  const viewSubmissions = async (assignment) => {
    setSelectedAssignment(assignment);
    setShowSubmissions(true);
    setSubmissions([]);

    try {
      const response = await API.get(
        `/assignments/${assignment._id}/submissions`
      );

      setSubmissions(getData(response));
    } catch (error) {
      showToast(
        error.response?.data?.message ||
          "Unable to load submissions.",
        "error"
      );
    }
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  return (
    <AdminLayout title="Assignments">
      {toast && (
        <div
          className={`fixed right-5 top-5 z-[100] rounded-2xl border px-4 py-3 text-sm font-bold shadow-2xl ${
            toast.type === "error"
              ? "border-red-200 bg-red-50 text-red-700"
              : "border-emerald-200 bg-emerald-50 text-emerald-700"
          }`}
        >
          {toast.message}
        </div>
      )}

      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-[#e8faf5] px-3 py-1 text-xs font-black uppercase tracking-wider text-[#08ad81]">
            <ClipboardList size={14} />
            Academic management
          </div>

          <h2 className="text-2xl font-black text-[#062a5c]">
            Assignments
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Create, update and review bootcamp assignments.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={load}
            className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm hover:bg-slate-50"
          >
            <RefreshCw size={18} />
          </button>

          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-[#08c98b] px-4 py-3 text-sm font-black text-white hover:bg-[#07b97e]"
          >
            <Plus size={17} />
            New Assignment
          </button>
        </div>
      </div>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 p-5">
          <h3 className="font-black text-[#062a5c]">
            Assignment list
          </h3>
          <p className="mt-1 text-xs text-slate-400">
            {assignments.length} assignments
          </p>
        </div>

        {loading ? (
          <div className="p-10 text-center text-sm font-bold text-slate-400">
            Loading assignments...
          </div>
        ) : sortedAssignments.length === 0 ? (
          <div className="p-12 text-center">
            <ClipboardList
              size={38}
              className="mx-auto text-slate-300"
            />
            <div className="mt-3 font-black text-slate-600">
              No assignments yet
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px] text-left">
              <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-5 py-4">Assignment</th>
                  <th className="px-5 py-4">Batch</th>
                  <th className="px-5 py-4">Due</th>
                  <th className="px-5 py-4">Score</th>
                  <th className="px-5 py-4">Created by</th>
                  <th className="px-5 py-4">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {sortedAssignments.map((assignment) => (
                  <tr key={assignment._id}>
                    <td className="px-5 py-4">
                      <div className="font-black text-slate-700">
                        {assignment.title}
                      </div>
                      <div className="mt-1 max-w-xs truncate text-xs text-slate-400">
                        {assignment.description}
                      </div>
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-500">
                      {assignment.batch?.name || "—"}
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-500">
                      {assignment.dueDate
                        ? new Date(
                            assignment.dueDate
                          ).toLocaleString()
                        : "—"}
                    </td>

                    <td className="px-5 py-4 text-sm font-bold text-slate-600">
                      {assignment.maxScore ?? 100}
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-500">
                      {assignment.createdBy?.fullname || "—"}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            viewSubmissions(assignment)
                          }
                          className="rounded-lg bg-slate-100 p-2 text-slate-600 hover:bg-slate-200"
                          title="View submissions"
                        >
                          <Eye size={16} />
                        </button>

                        <button
                          onClick={() =>
                            editAssignment(assignment)
                          }
                          className="rounded-lg bg-[#e8faf5] p-2 text-[#08ad81] hover:bg-emerald-100"
                          title="Edit"
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          onClick={() =>
                            deleteAssignment(assignment)
                          }
                          className="rounded-lg bg-red-50 p-2 text-red-600 hover:bg-red-100"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {showForm && (
        <Modal
          title={
            editingId
              ? "Edit Assignment"
              : "Create Assignment"
          }
          onClose={closeForm}
        >
          <form onSubmit={submit} className="space-y-4">
            <Input
              label="Title"
              value={form.title}
              onChange={(value) =>
                setForm({ ...form, title: value })
              }
              required
            />

            <TextArea
              label="Description"
              value={form.description}
              onChange={(value) =>
                setForm({
                  ...form,
                  description: value,
                })
              }
              required
            />

            <TextArea
              label="Instructions"
              value={form.instructions}
              onChange={(value) =>
                setForm({
                  ...form,
                  instructions: value,
                })
              }
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Due date"
                type="datetime-local"
                value={form.dueDate}
                onChange={(value) =>
                  setForm({
                    ...form,
                    dueDate: value,
                  })
                }
                required
              />

              <Input
                label="Maximum score"
                type="number"
                min="1"
                value={form.maxScore}
                onChange={(value) =>
                  setForm({
                    ...form,
                    maxScore: value,
                  })
                }
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-black uppercase tracking-wider text-slate-500">
                Batch
              </label>

              <select
                value={form.batch}
                onChange={(e) =>
                  setForm({
                    ...form,
                    batch: e.target.value,
                  })
                }
                required
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#08c98b]"
              >
                <option value="">Select batch</option>

                {batches.map((batch) => (
                  <option key={batch._id} value={batch._id}>
                    {batch.name}
                    {batch.year ? ` — ${batch.year}` : ""}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#08c98b] py-3.5 text-sm font-black text-white hover:bg-[#07b97e] disabled:opacity-50"
            >
              <Save size={17} />
              {saving
                ? "Saving..."
                : editingId
                ? "Update Assignment"
                : "Create Assignment"}
            </button>
          </form>
        </Modal>
      )}

      {showSubmissions && (
        <Modal
          title={`Submissions — ${
            selectedAssignment?.title || ""
          }`}
          onClose={() => setShowSubmissions(false)}
          wide
        >
          {submissions.length === 0 ? (
            <div className="py-10 text-center">
              <FileText
                size={38}
                className="mx-auto text-slate-300"
              />
              <p className="mt-3 font-black text-slate-600">
                No submissions found
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {submissions.map((submission) => (
                <div
                  key={submission._id}
                  className="rounded-xl border border-slate-200 p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="font-black text-slate-700">
                        {submission.student?.fullname ||
                          submission.studentName ||
                          "Student"}
                      </div>

                      <div className="mt-1 text-xs text-slate-400">
                        Submitted{" "}
                        {submission.submittedAt
                          ? new Date(
                              submission.submittedAt
                            ).toLocaleString()
                          : "—"}
                      </div>
                    </div>

                    <div className="rounded-lg bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
                      {submission.grade ??
                        submission.score ??
                        "Not graded"}
                    </div>
                  </div>

                  <div className="mt-3 whitespace-pre-wrap rounded-lg bg-slate-50 p-3 text-sm text-slate-600">
                    {submission.content ||
                      submission.answer ||
                      submission.link ||
                      "No submission content."}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Modal>
      )}
    </AdminLayout>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
  required = false,
  min,
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-black uppercase tracking-wider text-slate-500">
        {label}
      </label>

      <input
        type={type}
        value={value}
        min={min}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#08c98b]"
      />
    </div>
  );
}

function TextArea({ label, value, onChange, required = false }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-black uppercase tracking-wider text-slate-500">
        {label}
      </label>

      <textarea
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        className="w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#08c98b]"
      />
    </div>
  );
}

function Modal({ title, children, onClose, wide = false }) {
  return (
    <div className="fixed inset-0 z-[90] grid place-items-center bg-black/50 p-4">
      <div
        className={`max-h-[90vh] w-full overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl ${
          wide ? "max-w-4xl" : "max-w-2xl"
        }`}
      >
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-xl font-black text-[#062a5c]">
            {title}
          </h3>

          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-100"
          >
            <X size={19} />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}