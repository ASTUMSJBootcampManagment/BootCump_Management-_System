import { useEffect, useState } from "react";
import {
  Megaphone,
  Plus,
  Edit3,
  Trash2,
  X,
  RefreshCw,
} from "lucide-react";
import MentorLayout from "../../components/mentor/MentorLayout";
import Toast from "../../components/common/Toast";
import API from "../../api/axios";

const initial = {
  title: "",
  content: "",
  batch: "",
  announcedTo: "Student",
};

export default function Announcements() {
  const [items, setItems] = useState([]);
  const [batches, setBatches] = useState([]);
  const [form, setForm] = useState(initial);
  const [editing, setEditing] = useState(null);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const load = async () => {
    setLoading(true);

    try {
      const response = await API.get("/announcement");
      setItems(response.data.data || []);
    } catch (error) {
      setToast({
        message:
          error.response?.data?.message ||
          "Unable to load announcements.",
        type: "error",
      });
    }

    try {
      const response = await API.get("/batches");
      setBatches(response.data.data || []);
    } catch {
      // Keep announcements usable.
    }

    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (event) => {
    event.preventDefault();

    if (!form.title.trim() || !form.content.trim()) {
      setToast({
        message: "Title and content are required.",
        type: "error",
      });
      return;
    }

    setSaving(true);

    try {
      if (editing) {
        await API.put(
          `/announcement/${editing._id}`,
          form
        );

        setToast({
          message: "Announcement updated.",
          type: "success",
        });
      } else {
        await API.post("/announcement", form);

        setToast({
          message: "Announcement published.",
          type: "success",
        });
      }

      setForm(initial);
      setEditing(null);
      setShow(false);
      await load();
    } catch (error) {
      setToast({
        message:
          error.response?.data?.message ||
          "Unable to save announcement.",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  const edit = (item) => {
    setEditing(item);

    setForm({
      title: item.title || "",
      content: item.content || "",
      batch: item.batch?._id || item.batch || "",
      announcedTo: item.announcedTo || "Student",
    });

    setShow(true);
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this announcement?")) {
      return;
    }

    try {
      await API.delete(`/announcement/${id}`);

      setToast({
        message: "Announcement deleted.",
        type: "success",
      });

      await load();
    } catch (error) {
      setToast({
        message:
          error.response?.data?.message ||
          "Unable to delete announcement.",
        type: "error",
      });
    }
  };

  return (
    <MentorLayout title="Announcements">
      <Toast
        {...toast}
        onClose={() => setToast(null)}
      />

      <div className="mb-6 flex flex-wrap justify-between items-end gap-4">
        <div>
          <h2 className="text-3xl font-black text-[#062a5c]">
            Announcements
          </h2>

          <p className="text-slate-500 mt-2">
            Publish important updates for your students.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={load}
            className="px-4 py-2.5 rounded-xl bg-white border font-bold flex items-center gap-2"
          >
            <RefreshCw
              size={16}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>

          <button
            onClick={() => {
              setEditing(null);
              setForm(initial);
              setShow(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-[#08c98b] text-white font-black flex items-center gap-2"
          >
            <Plus size={17} />
            New announcement
          </button>
        </div>
      </div>

      {show && (
        <div className="bg-white border rounded-2xl p-6 mb-6">
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-xl font-black text-[#062a5c]">
              {editing
                ? "Edit announcement"
                : "Create announcement"}
            </h3>

            <button
              onClick={() => setShow(false)}
              className="w-9 h-9 rounded-lg bg-slate-100 grid place-items-center"
            >
              <X size={18} />
            </button>
          </div>

          <form
            onSubmit={submit}
            className="grid md:grid-cols-2 gap-4"
          >
            <label className="font-bold text-sm">
              Title

              <input
                required
                value={form.title}
                onChange={(e) =>
                  setForm({
                    ...form,
                    title: e.target.value,
                  })
                }
                className="w-full mt-2 border rounded-xl px-3 py-3 font-normal"
              />
            </label>

            <label className="font-bold text-sm">
              Batch

              <select
                value={form.batch}
                onChange={(e) =>
                  setForm({
                    ...form,
                    batch: e.target.value,
                  })
                }
                className="w-full mt-2 border rounded-xl px-3 py-3 font-normal"
              >
                <option value="">
                  All applicable batches
                </option>

                {batches.map((batch) => (
                  <option
                    key={batch._id}
                    value={batch._id}
                  >
                    {batch.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="font-bold text-sm md:col-span-2">
              Message

              <textarea
                required
                rows="6"
                value={form.content}
                onChange={(e) =>
                  setForm({
                    ...form,
                    content: e.target.value,
                  })
                }
                className="w-full mt-2 border rounded-xl px-3 py-3 font-normal"
              />
            </label>

            <label className="font-bold text-sm">
              Audience

              <select
                value={form.announcedTo}
                onChange={(e) =>
                  setForm({
                    ...form,
                    announcedTo: e.target.value,
                  })
                }
                className="w-full mt-2 border rounded-xl px-3 py-3 font-normal"
              >
                <option value="Student">
                  Students
                </option>
                <option value="All">
                  Everyone
                </option>
              </select>
            </label>

            <div className="md:col-span-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShow(false)}
                className="px-5 py-3 bg-slate-100 rounded-xl font-bold"
              >
                Cancel
              </button>

              <button
                disabled={saving}
                className="px-5 py-3 bg-[#08c98b] text-white rounded-xl font-black"
              >
                {saving
                  ? "Saving..."
                  : editing
                  ? "Update"
                  : "Publish"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {items.map((item) => (
          <article
            key={item._id}
            className="bg-white border border-slate-200 rounded-2xl p-5"
          >
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-[#e8faf5] text-[#08ad81] grid place-items-center shrink-0">
                <Megaphone size={19} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap justify-between gap-3">
                  <div>
                    <h3 className="font-black text-lg text-[#062a5c]">
                      {item.title}
                    </h3>

                    <div className="text-xs text-slate-400 mt-1">
                      {item.batch?.name || "All applicable batches"}
                      {" · "}
                      {item.announcementDate
                        ? new Date(
                            item.announcementDate
                          ).toLocaleString()
                        : ""}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => edit(item)}
                      className="w-9 h-9 rounded-lg bg-slate-100 grid place-items-center"
                    >
                      <Edit3 size={15} />
                    </button>

                    <button
                      onClick={() => remove(item._id)}
                      className="w-9 h-9 rounded-lg bg-red-50 text-red-700 grid place-items-center"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                <p className="text-sm text-slate-600 mt-4 whitespace-pre-wrap">
                  {item.content}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>

      {!loading && !items.length && (
        <div className="bg-white border rounded-2xl p-12 text-center text-slate-400">
          No announcements yet.
        </div>
      )}
    </MentorLayout>
  );
}