import { useEffect, useState } from "react";
import {
  TrendingUp,
  RefreshCw,
  Save,
  AlertCircle,
} from "lucide-react";
import API from "../../api/axios";
import MentorLayout from "../../components/mentor/MentorLayout";

const statuses = [
  "NotStarted",
  "InProgress",
  "Completed",
  "NeedsImprovement",
];

export default function Progress() {
  const [students, setStudents] = useState([]);
  const [selected, setSelected] = useState("");
  const [topics, setTopics] = useState([]);
  const [topic, setTopic] = useState("");
  const [status, setStatus] = useState("NotStarted");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadStudents = async () => {
    setLoading(true);

    try {
      const response = await API.get(
        "/admin/users?role=Student"
      );

      setStudents(response.data.data || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load students."
      );
    } finally {
      setLoading(false);
    }
  };

  const loadProgress = async (studentId) => {
    if (!studentId) {
      setTopics([]);
      return;
    }

    try {
      const response = await API.get(
        `/progress/student/${studentId}`
      );

      setTopics(response.data.data || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load progress."
      );
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  useEffect(() => {
    loadProgress(selected);
  }, [selected]);

  const save = async (e) => {
    e.preventDefault();

    if (!selected || !topic.trim()) {
      setError("Select a student and enter a topic.");
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");

    try {
      await API.post("/progress/create", {
        studentId: selected,
        topic: topic.trim(),
        status,
        notes,
      });

      setMessage("Progress updated successfully.");

      setTopic("");
      setNotes("");

      await loadProgress(selected);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to update progress."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <MentorLayout title="Student Progress">
      <div className="grid lg:grid-cols-[.7fr_1.3fr] gap-5">
        <section className="bg-white border rounded-2xl p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="font-black text-[#062a5c]">
                Update Progress
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Update a student's learning status.
              </p>
            </div>

            <button
              onClick={loadStudents}
              className="p-2 border rounded-xl"
            >
              <RefreshCw size={15} />
            </button>
          </div>

          {error && (
            <div className="mt-5 bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 flex gap-2 text-sm">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {message && (
            <div className="mt-5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl p-3 text-sm">
              {message}
            </div>
          )}

          <form onSubmit={save} className="mt-6 space-y-4">
            <div>
              <label className="text-xs font-black text-slate-500 uppercase">
                Student
              </label>

              <select
                value={selected}
                onChange={(e) => setSelected(e.target.value)}
                className="w-full mt-2 border rounded-xl px-3 py-3"
              >
                <option value="">
                  Select student
                </option>

                {students.map((student) => (
                  <option
                    key={student._id}
                    value={student._id}
                  >
                    {student.fullname}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-black text-slate-500 uppercase">
                Topic
              </label>

              <input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Example: React Hooks"
                className="w-full mt-2 border rounded-xl px-3 py-3"
              />
            </div>

            <div>
              <label className="text-xs font-black text-slate-500 uppercase">
                Status
              </label>

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full mt-2 border rounded-xl px-3 py-3"
              >
                {statuses.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-black text-slate-500 uppercase">
                Mentor Notes
              </label>

              <textarea
                rows="4"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add feedback or notes..."
                className="w-full mt-2 border rounded-xl px-3 py-3 resize-none"
              />
            </div>

            <button
              disabled={saving}
              className="w-full bg-[#08c98b] text-white rounded-xl py-3 font-black flex justify-center items-center gap-2 disabled:opacity-50"
            >
              <Save size={16} />
              {saving ? "Saving..." : "Save Progress"}
            </button>
          </form>
        </section>

        <section className="bg-white border rounded-2xl p-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#e8faf5] text-[#08ad81] grid place-items-center">
              <TrendingUp size={20} />
            </div>

            <div>
              <h2 className="font-black text-[#062a5c]">
                Progress History
              </h2>

              <p className="text-sm text-slate-500">
                {selected
                  ? "Selected student's recorded progress."
                  : "Select a student to view progress."}
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {topics.map((item) => (
              <div
                key={item._id}
                className="border rounded-xl p-4"
              >
                <div className="flex justify-between gap-3">
                  <div>
                    <div className="font-bold">
                      {item.topic}
                    </div>

                    {item.notes && (
                      <p className="text-sm text-slate-500 mt-2">
                        {item.notes}
                      </p>
                    )}
                  </div>

                  <span className="text-xs font-black bg-slate-100 px-3 py-1 rounded-full h-fit">
                    {item.status}
                  </span>
                </div>
              </div>
            ))}

            {selected && !topics.length && (
              <div className="text-center text-slate-500 py-10">
                No progress records yet.
              </div>
            )}
          </div>
        </section>
      </div>
    </MentorLayout>
  );
}