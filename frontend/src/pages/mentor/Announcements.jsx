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
  announcementDate: new Date().toISOString().slice(0, 16),
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
      // Updated endpoint URL to /announcements
      const response = await API.get("/announcements");
      setItems(response.data?.data || response.data || []);
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
      setBatches(response.data?.data || response.data || []);
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
        // Updated endpoint URL to /announcements/:id
        await API.put(
          `/announcements/${editing._id}`,
          form
        );

        setToast({
          message: "Announcement updated.",
          type: "success",
        });
      } else {
        // Updated endpoint URL to /announcements
        await API.post("/announcements", form);

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
      announcementDate: item.announcementDate
        ? new Date(item.announcementDate).toISOString().slice(0, 16)
        : new Date().toISOString().slice(0, 16),
    });

    setShow(true);
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this announcement?")) {
      return;
    }

    try {
      // Updated endpoint URL to /announcements/:id
      await API.delete(`/announcements/${id}`);

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

      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mt-2 text-slate-500">
            Publish important updates for your students.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={load}
            className="flex items-center gap-2 rounded-xl border bg-white px-4 py-2.5 font-bold"
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
            className="flex items-center gap-2 rounded-xl bg-[#08c98b] px-4 py-2.5 font-black text-white"
          >
            <Plus size={17} />
            New announcement
          </button>
        </div>
      </div>

      {show && (
        <div className="mb-6 rounded-2xl border bg-white p-6">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-xl font-black text-[#062a5c]">
              {editing
                ? "Edit announcement"
                : "Create announcement"}
            </h3>

            <button
              onClick={() => setShow(false)}
              className="grid h-9 w-9 place-items-center rounded-lg bg-slate-100"
            >
              <X size={18} />
            </button>
          </div>

          <form
            onSubmit={submit}
            className="grid gap-4 md:grid-cols-2"
          >
            <label className="text-sm font-bold">
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
                className="mt-2 w-full rounded-xl border px-3 py-3 font-normal"
              />
            </label>

            <label className="text-sm font-bold">
              Batch

              <select
                value={form.batch}
                onChange={(e) =>
                  setForm({
                    ...form,
                    batch: e.target.value,
                  })
                }
                className="mt-2 w-full rounded-xl border px-3 py-3 font-normal"
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

            <label className="text-sm font-bold md:col-span-2">
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
                className="mt-2 w-full rounded-xl border px-3 py-3 font-normal"
              />
            </label>

            <label className="text-sm font-bold">
              Audience

              <select
                value={form.announcedTo}
                onChange={(e) =>
                  setForm({
                    ...form,
                    announcedTo: e.target.value,
                  })
                }
                className="mt-2 w-full rounded-xl border px-3 py-3 font-normal"
              >
                <option value="Student">
                  Students
                </option>
              </select>
            </label>

            <label className="text-sm font-bold">
              Publish date

              <input
                type="datetime-local"
                value={form.announcementDate}
                onChange={(e) => setForm({ ...form, announcementDate: e.target.value })}
                className="mt-2 w-full rounded-xl border px-3 py-3 font-normal"
              />
            </label>

            <div className="flex justify-end gap-2 md:col-span-2">
              <button
                type="button"
                onClick={() => setShow(false)}
                className="rounded-xl bg-slate-100 px-5 py-3 font-bold"
              >
                Cancel
              </button>

              <button
                disabled={saving}
                className="rounded-xl bg-[#08c98b] px-5 py-3 font-black text-white disabled:opacity-50"
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
            className="rounded-2xl border border-slate-200 bg-white p-5"
          >
            <div className="flex items-start gap-4">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#e8faf5] text-[#08ad81]">
                <Megaphone size={19} />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-black text-[#062a5c]">
                      {item.title}
                    </h3>

                    <div className="mt-1 text-xs text-slate-400">
                      {item.batch?.name || "All applicable batches"}
                      {" · "}
                      {item.announcementDate || item.createdAt
                        ? new Date(
                            item.announcementDate || item.createdAt
                          ).toLocaleString()
                        : ""}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => edit(item)}
                      className="grid h-9 w-9 place-items-center rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200"
                    >
                      <Edit3 size={15} />
                    </button>

                    <button
                      onClick={() => remove(item._id)}
                      className="grid h-9 w-9 place-items-center rounded-lg bg-red-50 text-red-700 hover:bg-red-100"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                <p className="mt-4 whitespace-pre-wrap text-sm text-slate-600">
                  {item.content}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>

      {!loading && !items.length && (
        <div className="rounded-2xl border bg-white p-12 text-center text-slate-400">
          No announcements yet.
        </div>
      )}
    </MentorLayout>
  );
}