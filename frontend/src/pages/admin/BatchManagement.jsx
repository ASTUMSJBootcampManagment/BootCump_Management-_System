import { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  RefreshCw,
  UserPlus,
  GraduationCap,
} from "lucide-react";

import API from "../../api/axios";
import Toast from "../../components/common/Toast";

function arrayData(response) {
  const data = response?.data;

  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;

  return [];
}

function errorMessage(error) {
  return error?.response?.data?.message || error?.message || "Request failed.";
}

const initialForm = {
  name: "",
  year: new Date().getFullYear(),
  track: "Full-Stack MERN Development",
  startDate: "",
  endDate: "",
  status: "Upcoming",
};

export default function BatchManagement() {
  const [batches, setBatches] = useState([]);

  // Used for assigning users to a batch
  const [students, setStudents] = useState([]);
  const [mentors, setMentors] = useState([]);

  // Used inside the Groups modal
  const [groupStudents, setGroupStudents] = useState([]);
  const [groupMentors, setGroupMentors] = useState([]);

  const [form, setForm] = useState(initialForm);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [groupBatch, setGroupBatch] = useState(null);
  const [groupDraft, setGroupDraft] = useState([]);

  const [selectedMentors, setSelectedMentors] = useState({});
  const [selectedStudents, setSelectedStudents] = useState({});

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const load = async () => {
    setLoading(true);

    try {
      const [batchResponse, studentResponse, mentorResponse] =
        await Promise.all([
          API.get("/batches"),
          API.get("/users/search?role=Student"),
          API.get("/users/search?role=Mentor"),
        ]);

      setBatches(arrayData(batchResponse));
      setStudents(arrayData(studentResponse));
      setMentors(arrayData(mentorResponse));
    } catch (error) {
      setToast({
        message: errorMessage(error),
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const saveBatch = async (event) => {
    event.preventDefault();
    setSaving(true);

    try {
      let response;

      if (editing) {
        response = await API.put(`/batches/${editing._id}`, form);
      } else {
        response = await API.post("/batches", form);
      }

      setToast({
        message: response.data?.message || "Batch saved successfully.",
        type: "success",
      });

      setShowForm(false);
      setEditing(null);
      setForm(initialForm);

      await load();
    } catch (error) {
      setToast({
        message: errorMessage(error),
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  const deleteBatch = async (id) => {
    try {
      const response = await API.delete(`/batches/${id}`);

      setToast({
        message: response.data?.message || "Batch deleted successfully.",
        type: "success",
      });

      await load();
    } catch (error) {
      setToast({
        message: errorMessage(error),
        type: "error",
      });
    }
  };

  const assignMentor = async (batchId) => {
    const mentorId = selectedMentors[batchId];
    if (!mentorId) {
      setToast({
        message: "Select a mentor first.",
        type: "error",
      });
      return;
    }

    try {
      const response = await API.post(`/batches/${batchId}/mentors`, {
        mentorId,
      });

      setToast({
        message: response.data?.message || "Mentor assigned successfully.",
        type: "success",
      });

      // Clear selected mentor
      setSelectedMentors((current) => ({
        ...current,
        [batchId]: "",
      }));

      await load();
    } catch (error) {
      setToast({
        message: errorMessage(error),
        type: "error",
      });
    }
  };

  const enrollStudent = async (batchId) => {
    const studentId = selectedStudents[batchId];

    if (!studentId) {
      setToast({
        message: "Select a student first.",
        type: "error",
      });
      return;
    }

    try {
      const response = await API.post(`/batches/${batchId}/enroll`, {
        studentId,
      });

      setToast({
        message: response.data?.message || "Student enrolled successfully.",
        type: "success",
      });

      // Clear selected student
      setSelectedStudents((current) => ({
        ...current,
        [batchId]: "",
      }));

      await load();
    } catch (error) {
      setToast({
        message: errorMessage(error),
        type: "error",
      });
    }
  };

  const openEdit = (batch) => {
    setEditing(batch);

    setForm({
      name: batch.name || "",
      year: batch.year || new Date().getFullYear(),
      track: batch.track || "Full-Stack MERN Development",
      startDate: batch.startDate ? batch.startDate.slice(0, 10) : "",
      endDate: batch.endDate ? batch.endDate.slice(0, 10) : "",
      status: batch.status || "Upcoming",
    });

    setShowForm(true);
  };

  const openGroups = (batch) => {
    setGroupBatch(batch);

    setGroupStudents(batch.students || []);
    setGroupMentors(batch.mentors || []);

    setGroupDraft(
      (batch.groups || []).map((group) => ({
        name: group.name || "",

        mentors: (group.mentors || []).map((mentor) => mentor._id || mentor),

        students: (group.students || []).map(
          (student) => student._id || student,
        ),
      })),
    );
  };

  const saveGroups = async () => {
    if (!groupBatch) return;

    if (groupDraft.length === 0) {
      setToast({
        message: "Add at least one group.",
        type: "error",
      });
      return;
    }

    // Validate group names
    const invalidGroup = groupDraft.some((group) => !group.name?.trim());

    if (invalidGroup) {
      setToast({
        message: "Every group needs a name.",
        type: "error",
      });
      return;
    }

    setSaving(true);

    try {
      const response = await API.put(`/batches/${groupBatch._id}/groups`, {
        groups: groupDraft,
      });

      setToast({
        message: response.data?.message || "Groups saved successfully.",
        type: "success",
      });

      setGroupBatch(null);
      setGroupDraft([]);
      setGroupStudents([]);
      setGroupMentors([]);
      await load();
    } catch (error) {
      setToast({
        message: errorMessage(error),
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  const addGroup = () => {
    setGroupDraft((current) => [
      ...current,
      {
        name: "",
        mentors: [],
        students: [],
      },
    ]);
  };

  const removeGroup = (index) => {
    setGroupDraft((current) =>
      current.filter((_, itemIndex) => itemIndex !== index),
    );
  };
  const updateGroupName = (index, name) => {
    setGroupDraft((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              name,
            }
          : item,
      ),
    );
  };

  const updateGroupMentors = (index, event) => {
    const selected = Array.from(
      event.target.selectedOptions,
      (option) => option.value,
    );

    setGroupDraft((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              mentors: selected,
            }
          : item,
      ),
    );
  };

  const updateGroupStudents = (index, event) => {
    const selected = Array.from(
      event.target.selectedOptions,
      (option) => option.value,
    );

    setGroupDraft((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              students: selected,
            }
          : item,
      ),
    );
  };

  return (
    <>
      <Toast
        message={toast?.message}
        type={toast?.type}
        onClose={() => setToast(null)}
      />

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-[#062a5c]">
              Batch Management
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Keep one batch active, then create groups and assign their mentors
              and students.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={load}
              className="px-4 py-2.5 rounded-xl border border-slate-200 flex items-center justify-center"
            >
              <RefreshCw size={16} />
            </button>

            <button
              type="button"
              onClick={() => {
                setEditing(null);
                setForm(initialForm);
                setShowForm(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-[#08c98b] text-white font-black text-sm flex items-center gap-2"
            >
              <Plus size={17} />
              Create Batch
            </button>
          </div>
        </div>
        <div className="space-y-4">
          {loading ? (
            <div className="p-10 text-center text-slate-400">
              Loading batches...
            </div>
          ) : batches.length === 0 ? (
            <div className="bg-white rounded-2xl border p-10 text-center text-slate-400">
              No batches found.
            </div>
          ) : (
            batches.map((batch) => (
              <div
                key={batch._id}
                className="bg-white border border-slate-200 rounded-2xl p-5"
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-black text-[#062a5c]">
                        {batch.name}
                      </h3>

                      <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] font-black">
                        {batch.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 mt-1">
                      {batch.track} · {batch.year}
                    </p>

                    <p className="text-xs text-slate-400 mt-1">
                      {batch.startDate
                        ? new Date(batch.startDate).toLocaleDateString()
                        : "—"}{" "}
                      →{" "}
                      {batch.endDate
                        ? new Date(batch.endDate).toLocaleDateString()
                        : "—"}
                    </p>
                  </div>

                  {/* ACTION BUTTONS */}

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => openGroups(batch)}
                      className="px-3 py-2 rounded-xl bg-[#e8faf5] text-[#078b68] text-xs font-black"
                    >
                      Groups ({batch.groups?.length || 0})
                    </button>

                    <button
                      type="button"
                      onClick={() => openEdit(batch)}
                      className="p-2.5 rounded-xl bg-slate-100"
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteBatch(batch._id)}
                      className="p-2.5 rounded-xl bg-red-50 text-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4 mt-6">
                  <div className="p-4 rounded-xl bg-slate-50">
                    <div className="flex items-center gap-2">
                      <GraduationCap size={17} className="text-[#08ad81]" />

                      <p className="font-black text-sm">Students</p>

                      <span className="ml-auto text-xs text-slate-400">
                        {batch.students?.length || 0}
                      </span>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <select
                        value={selectedStudents[batch._id] || ""}
                        onChange={(e) =>
                          setSelectedStudents((current) => ({
                            ...current,
                            [batch._id]: e.target.value,
                          }))
                        }
                        className="flex-1 border border-slate-200 rounded-xl px-3 py-2 bg-white text-xs"
                      >
                        <option value="">Select student</option>

                        {students.map((student) => (
                          <option key={student._id} value={student._id}>
                            {student.fullname}
                          </option>
                        ))}
                      </select>

                      <button
                        type="button"
                        onClick={() => enrollStudent(batch._id)}
                        className="px-3 rounded-xl bg-[#062a5c] text-white flex items-center justify-center"
                      >
                        <GraduationCap size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50">
                    <div className="flex items-center gap-2">
                      <UserPlus size={17} className="text-[#08ad81]" />

                      <p className="font-black text-sm">Mentors</p>

                      <span className="ml-auto text-xs text-slate-400">
                        {batch.mentors?.length || 0}
                      </span>
                    </div>

                    <div className="flex gap-2 mt-3">
                      <select
                        value={selectedMentors[batch._id] || ""}
                        onChange={(e) =>
                          setSelectedMentors((current) => ({
                            ...current,
                            [batch._id]: e.target.value,
                          }))
                        }
                        className="flex-1 border border-slate-200 rounded-xl px-3 py-2 bg-white text-xs"
                      >
                        <option value="">Select mentor</option>

                        {mentors.map((mentor) => (
                          <option key={mentor._id} value={mentor._id}>
                            {mentor.fullname}
                          </option>
                        ))}
                      </select>

                      <button
                        type="button"
                        onClick={() => assignMentor(batch._id)}
                        className="px-3 rounded-xl bg-[#08c98b] text-white flex items-center justify-center"
                      >
                        <UserPlus size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {groupBatch && (
        <div className="fixed inset-0 z-100 bg-slate-900/40 backdrop-blur-sm overflow-y-auto p-5">
          <div className="bg-white rounded-2xl p-6 w-full max-w-4xl mx-auto my-8">
            <div className="flex justify-between gap-4 items-start">
              <div>
                <h3 className="text-xl font-black text-[#062a5c]">
                  {groupBatch.name} groups
                </h3>

                <p className="text-sm text-slate-500 mt-1">
                  Assign every student to one group and assign mentors to that
                  group.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setGroupBatch(null)}
                className="px-3 py-2 rounded-xl bg-slate-100"
              >
                Close
              </button>
            </div>

            <div className="rounded-xl bg-[#e8faf5] text-[#066b52] px-4 py-3 text-sm mt-5">
              Add a group, enter its name, then select the mentors and students
              who belong to it. A student can be in only one group; a mentor may
              lead more than one group.
            </div>

            <div className="space-y-4 mt-4">
              {groupDraft.length === 0 ? (
                <div className="border border-dashed border-slate-300 rounded-xl p-8 text-center text-slate-400">
                  No groups created yet.
                  <br />
                  Click "Add group" below.
                </div>
              ) : (
                groupDraft.map((group, index) => (
                  <div
                    key={index}
                    className="border border-slate-200 rounded-xl p-4 grid md:grid-cols-3 gap-3"
                  >
                    <label className="text-xs font-bold">
                      Group name
                      <input
                        value={group.name}
                        onChange={(e) => updateGroupName(index, e.target.value)}
                        placeholder={`Group ${index + 1}`}
                        className="block w-full mt-1 border rounded-lg px-3 py-2"
                      />
                    </label>

                    <label className="text-xs font-bold">
                      Mentors{" "}
                      <span className="font-normal text-slate-400">
                        (Ctrl/Cmd-click for more than one)
                      </span>
                      <select
                        multiple
                        value={group.mentors}
                        onChange={(e) => updateGroupMentors(index, e)}
                        className="block w-full mt-1 border rounded-lg px-3 py-2 h-28"
                      >
                        {groupMentors.length === 0 ? (
                          <option disabled>
                            No mentors assigned to this batch
                          </option>
                        ) : (
                          groupMentors.map((mentor) => (
                            <option key={mentor._id} value={mentor._id}>
                              {mentor.fullname}
                            </option>
                          ))
                        )}
                      </select>
                    </label>

                    <label className="text-xs font-bold">
                      Students{" "}
                      <span className="font-normal text-slate-400">
                        (Ctrl/Cmd-click for more than one)
                      </span>
                      <select
                        multiple
                        value={group.students}
                        onChange={(e) => updateGroupStudents(index, e)}
                        className="block w-full mt-1 border rounded-lg px-3 py-2 h-28"
                      >
                        {groupStudents.length === 0 ? (
                          <option disabled>
                            No students assigned to this batch
                          </option>
                        ) : (
                          groupStudents.map((student) => (
                            <option key={student._id} value={student._id}>
                              {student.fullname}
                            </option>
                          ))
                        )}
                      </select>
                    </label>

                    <button
                      type="button"
                      onClick={() => removeGroup(index)}
                      className="text-xs font-bold text-red-600 text-left"
                    >
                      Remove group
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="flex flex-wrap justify-between gap-3 mt-6">
              <button
                type="button"
                onClick={addGroup}
                className="px-4 py-2.5 rounded-xl bg-slate-100 font-bold flex items-center gap-2"
              >
                <Plus size={16} />
                Add group
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setGroupBatch(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={saveGroups}
                  disabled={saving}
                  className="px-4 py-2.5 rounded-xl bg-[#08c98b] text-white font-bold disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save groups"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-100 bg-slate-900/40 backdrop-blur-sm grid place-items-center p-5">
          <form
            onSubmit={saveBatch}
            className="bg-white rounded-2xl p-6 w-full max-w-lg"
          >
            <h3 className="text-xl font-black text-[#062a5c]">
              {editing ? "Edit Batch" : "Create Batch"}
            </h3>

            <div className="grid sm:grid-cols-2 gap-4 mt-5">
              {/* Batch name */}

              <input
                required
                placeholder="Batch name"
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                  })
                }
                className="border rounded-xl px-4 py-3 text-sm"
              />

              {/* Year */}

              <input
                required
                type="number"
                placeholder="Year"
                value={form.year}
                onChange={(e) =>
                  setForm({
                    ...form,
                    year: Number(e.target.value),
                  })
                }
                className="border rounded-xl px-4 py-3 text-sm"
              />

              {/* Track */}

              <input
                placeholder="Track"
                value={form.track}
                onChange={(e) =>
                  setForm({
                    ...form,
                    track: e.target.value,
                  })
                }
                className="border rounded-xl px-4 py-3 text-sm sm:col-span-2"
              />

              {/* Start date */}

              <div>
                <label className="text-xs font-bold text-slate-500">
                  Start date
                </label>

                <input
                  required
                  type="date"
                  value={form.startDate}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      startDate: e.target.value,
                    })
                  }
                  className="w-full border rounded-xl px-4 py-3 text-sm mt-1"
                />
              </div>

              {/* End date */}

              <div>
                <label className="text-xs font-bold text-slate-500">
                  End date
                </label>

                <input
                  required
                  type="date"
                  value={form.endDate}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      endDate: e.target.value,
                    })
                  }
                  className="w-full border rounded-xl px-4 py-3 text-sm mt-1"
                />
              </div>

              {/* Status */}

              {editing && (
                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      status: e.target.value,
                    })
                  }
                  className="sm:col-span-2 border rounded-xl px-4 py-3 text-sm bg-white"
                >
                  <option value="Upcoming">Upcoming</option>

                  <option value="Active">Active</option>

                  <option value="Completed">Completed</option>
                </select>
              )}
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditing(null);
                }}
                className="px-4 py-2.5 rounded-xl bg-slate-100 font-bold"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2.5 rounded-xl bg-[#08c98b] text-white font-bold disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Batch"}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
