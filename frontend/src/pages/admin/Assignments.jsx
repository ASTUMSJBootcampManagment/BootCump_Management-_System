import React, { useEffect, useState, useRef } from "react";
import {
  Plus,
  Trash2,
  X,
  ClipboardList,
  CalendarDays,
  RefreshCw,
  FileText,
  Download,
  Paperclip,
} from "lucide-react";
import API from "../../api/axios";
import { downloadPdfFile } from "../../utils/downloadFile";

export default function Assignments() {
  const [assignments, setAssignments] = useState([]);
  const [batches, setBatches] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pdfFile, setPdfFile] = useState(null);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    batch: "",
  });

  const loadData = async () => {
    setLoading(true);

    try {
      const [assignmentResponse, batchResponse] = await Promise.all([
        API.get("/assignments"),
        API.get("/batches"),
      ]);

      // Normalize assignment data extraction based on API response structure
      const assignmentData =
        assignmentResponse.data?.data?.assignments ||
        assignmentResponse.data?.data ||
        assignmentResponse.data ||
        [];
      setAssignments(Array.isArray(assignmentData) ? assignmentData : []);

      // Normalize batch data extraction
      const batchData =
        batchResponse.data?.data?.batches ||
        batchResponse.data?.data ||
        batchResponse.data ||
        [];
      setBatches(Array.isArray(batchData) ? batchData : []);
    } catch (error) {
      console.error("Failed to load assignments or batches:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenModal = () => {
    setFormData({
      title: "",
      description: "",
      dueDate: "",
      batch: "",
    });
    setPdfFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setShowModal(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (
        file.type !== "application/pdf" &&
        !file.name.toLowerCase().endsWith(".pdf")
      ) {
        alert("Please select a valid PDF file.");
        e.target.value = "";
        setPdfFile(null);
        return;
      }
      setPdfFile(file);
    } else {
      setPdfFile(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const submitData = new FormData();
      submitData.append("title", formData.title.trim());
      submitData.append("description", formData.description.trim());
      if (formData.dueDate) {
        submitData.append("dueDate", new Date(formData.dueDate).toISOString());
      }
      if (formData.batch) {
        submitData.append("batch", formData.batch);
      }
      if (pdfFile) {
        submitData.append("pdfFile", pdfFile);
      }

      await API.post("/assignments", submitData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setShowModal(false);
      setFormData({
        title: "",
        description: "",
        dueDate: "",
        batch: "",
      });
      setPdfFile(null);

      await loadData();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          error.message ||
          "Unable to create assignment.",
      );
    } finally {
      setSaving(false);
    }
  };

  const deleteAssignment = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this assignment?",
    );

    if (!confirmed) return;

    try {
      await API.delete(`/assignments/${id}`);
      await loadData();
    } catch (error) {
      alert(
        error.response?.data?.message ||
        error.message ||
        "Unable to delete assignment.",
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#062a5c]">Assignments</h1>
          <p className="text-sm text-slate-500 mt-1">
            Create and manage bootcamp assignments.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={loadData}
            className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 font-bold text-sm flex items-center gap-2 hover:bg-slate-50 transition"
          >
            <RefreshCw size={17} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>

          <button
            onClick={handleOpenModal}
            className="px-4 py-2.5 rounded-xl bg-[#08c98b] hover:bg-emerald-600 text-white font-black text-sm flex items-center gap-2 transition"
          >
            <Plus size={18} />
            New Assignment
          </button>
        </div>
      </div>

      {/* Assignments List */}
      <section className="space-y-4">
        {loading ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center text-slate-400">
            Loading assignments...
          </div>
        ) : assignments.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center">
            <ClipboardList size={40} className="mx-auto text-slate-300" />
            <h3 className="font-black text-slate-700 mt-4">
              No assignments yet
            </h3>
            <p className="text-sm text-slate-400 mt-1">
              Create the first assignment for your students.
            </p>
          </div>
        ) : (
          assignments.map((assignment) => (
            <article
              key={assignment._id}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition"
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex gap-4">
                  <div className="w-11 h-11 rounded-xl bg-[#e8faf5] text-[#08ad81] grid place-items-center shrink-0">
                    <ClipboardList size={20} />
                  </div>

                  <div>
                    <h2 className="font-black text-lg text-[#062a5c]">
                      {assignment.title}
                    </h2>

                    <p className="text-sm text-slate-500 mt-1 whitespace-pre-line">
                      {assignment.description || "No description provided."}
                    </p>

                    <div className="flex flex-wrap gap-3 mt-3 text-xs text-slate-400 font-semibold">
                      {assignment.dueDate && (
                        <span className="flex items-center gap-1">
                          <CalendarDays size={14} />
                          Due{" "}
                          {new Date(assignment.dueDate).toLocaleDateString(
                            undefined,
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </span>
                      )}

                      <span>
                        Batch:{" "}
                        {assignment.batch?.name
                          ? assignment.batch.name
                          : typeof assignment.batch === "string"
                            ? assignment.batch
                            : "All Students"}
                      </span>

                      {(assignment.pdfUrl || assignment.pdfOriginalName) && (
                        <button
                          type="button"
                          onClick={() =>
                            downloadPdfFile(
                              assignment._id,
                              assignment.pdfOriginalName || `${assignment.title}.pdf`
                            )
                          }
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 text-[#08ad81] hover:bg-emerald-100 font-bold transition cursor-pointer"
                          title="Download Assignment PDF"
                        >
                          <FileText size={13} />
                          <span>{assignment.pdfOriginalName || "Download PDF"}</span>
                          <Download size={13} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => deleteAssignment(assignment._id)}
                  className="self-start p-2 rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition"
                  title="Delete Assignment"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </article>
          ))
        )}
      </section>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="font-black text-lg text-[#062a5c]">
                  Create Assignment
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Students will be notified automatically.
                </p>
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="p-2 text-slate-400 hover:text-slate-700"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="text-xs font-black text-slate-600">
                  Title
                </label>
                <input
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      title: e.target.value,
                    })
                  }
                  placeholder="e.g. React Todo Application"
                  className="w-full mt-1 px-3 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-[#08c98b]"
                />
              </div>

              <div>
                <label className="text-xs font-black text-slate-600">
                  Description
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      description: e.target.value,
                    })
                  }
                  placeholder="Describe the assignment details..."
                  className="w-full mt-1 px-3 py-2.5 border border-slate-200 rounded-xl text-sm resize-none outline-none focus:border-[#08c98b]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-black text-slate-600">
                    Due Date
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.dueDate}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        dueDate: e.target.value,
                      })
                    }
                    className="w-full mt-1 px-3 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-[#08c98b]"
                  />
                </div>

                <div>
                  <label className="text-xs font-black text-slate-600">
                    Batch
                  </label>
                  <select
                    value={formData.batch}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        batch: e.target.value,
                      })
                    }
                    className="w-full mt-1 px-3 py-2.5 border border-slate-200 rounded-xl text-sm bg-white outline-none focus:border-[#08c98b]"
                  >
                    <option value="">All students</option>
                    {batches.map((batch) => (
                      <option key={batch._id} value={batch._id}>
                        {batch.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-black text-slate-600 block mb-1">
                  Upload PDF Material (Cloudinary)
                </label>
                <div className="border border-dashed border-slate-300 hover:border-[#08c98b] rounded-xl p-3 bg-slate-50/50 transition">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="application/pdf,.pdf"
                    onChange={handleFileChange}
                    className="hidden"
                    id="assignment-pdf-upload"
                  />
                  <label
                    htmlFor="assignment-pdf-upload"
                    className="cursor-pointer flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2 text-sm text-slate-600 truncate">
                      <Paperclip size={16} className="text-[#08c98b] shrink-0" />
                      <span className="truncate">
                        {pdfFile ? pdfFile.name : "Choose a PDF file to attach..."}
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

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl bg-[#08c98b] hover:bg-emerald-600 text-white font-black text-sm disabled:opacity-50 transition"
                >
                  {saving ? "Uploading & Creating..." : "Create Assignment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
