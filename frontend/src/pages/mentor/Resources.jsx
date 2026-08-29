import { useEffect, useState } from "react";
import {
  BookOpen,
  Plus,
  Edit3,
  Trash2,
  ExternalLink,
  X,
  RefreshCw,
} from "lucide-react";
import MentorLayout from "../../components/mentor/MentorLayout";
import Toast from "../../components/common/Toast";
import API from "../../api/axios";

const initial = {
  title: "",
  description: "",
  url: "",
  category: "General",
  batch: "",
  visible: true,
};

export default function Resources() {
  const [resources, setResources] = useState([]);
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
      const response = await API.get("/resources");

      setResources(response.data.data || []);
    } catch (error) {
      setToast({
        message:
          error.response?.data?.message ||
          "Unable to load resources.",
        type: "error",
      });
    }

    try {
      const response = await API.get("/batches");
      setBatches(response.data.data || []);
    } catch {
      // Resources remain visible.
    }

    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (event) => {
    event.preventDefault();

    if (
      !form.title.trim() ||
      !form.url.trim()
    ) {
      setToast({
        message: "Title and resource URL are required.",
        type: "error",
      });

      return;
    }

    setSaving(true);

    try {
      if (editing) {
        await API.put(
          `/resources/${editing._id}`,
          form
        );

        setToast({
          message: "Resource updated.",
          type: "success",
        });
      } else {
        await API.post("/resources", form);

        setToast({
          message: "Resource added.",
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
          "Unable to save resource.",
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
      description: item.description || "",
      url: item.url || "",
      category: item.category || "General",
      batch: item.batch?._id || item.batch || "",
      visible: item.visible !== false,
    });

    setShow(true);
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this resource?")) {
      return;
    }

    try {
      await API.delete(`/resources/${id}`);

      setToast({
        message: "Resource deleted.",
        type: "success",
      });

      await load();
    } catch (error) {
      setToast({
        message:
          error.response?.data?.message ||
          "Unable to delete resource.",
        type: "error",
      });
    }
  };

  return (
    <MentorLayout title="Resources">
      <Toast
        {...toast}
        onClose={() => setToast(null)}
      />

      <div className="mb-6 flex flex-wrap justify-between items-end gap-4">
        <div>
          
          <p className="text-slate-500 mt-2">
            Share useful learning materials with your students.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={load}
            className="px-4 py-2.5 bg-white border rounded-xl font-bold flex gap-2 items-center"
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
            className="px-4 py-2.5 bg-[#08c98b] text-white rounded-xl font-black flex gap-2 items-center"
          >
            <Plus size={17} />
            Add resource
          </button>
        </div>
      </div>

      {show && (
        <div className="bg-white border rounded-2xl p-6 mb-6">
          <div className="flex justify-between mb-5">
            <h3 className="text-xl font-black text-[#062a5c]">
              {editing
                ? "Edit resource"
                : "Add resource"}
            </h3>

            <button
              onClick={() => setShow(false)}
              className="w-9 h-9 bg-slate-100 rounded-lg grid place-items-center"
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
              Category

              <input
                value={form.category}
                onChange={(e) =>
                  setForm({
                    ...form,
                    category: e.target.value,
                  })
                }
                className="w-full mt-2 border rounded-xl px-3 py-3 font-normal"
                placeholder="React, GitHub, Backend..."
              />
            </label>

            <label className="font-bold text-sm md:col-span-2">
              Resource URL

              <input
                required
                type="url"
                value={form.url}
                onChange={(e) =>
                  setForm({
                    ...form,
                    url: e.target.value,
                  })
                }
                placeholder="https://..."
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

            <label className="font-bold text-sm">
              Visibility

              <select
                value={String(form.visible)}
                onChange={(e) =>
                  setForm({
                    ...form,
                    visible: e.target.value === "true",
                  })
                }
                className="w-full mt-2 border rounded-xl px-3 py-3 font-normal"
              >
                <option value="true">
                  Visible to students
                </option>

                <option value="false">
                  Hidden
                </option>
              </select>
            </label>

            <label className="font-bold text-sm md:col-span-2">
              Description

              <textarea
                rows="4"
                value={form.description}
                onChange={(e) =>
                  setForm({
                    ...form,
                    description: e.target.value,
                  })
                }
                className="w-full mt-2 border rounded-xl px-3 py-3 font-normal"
              />
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
                  ? "Update resource"
                  : "Add resource"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
        {resources.map((resource) => (
          <article
            key={resource._id}
            className={`bg-white border rounded-2xl p-5 ${
              resource.visible === false
                ? "opacity-60"
                : ""
            }`}
          >
            <div className="flex justify-between">
              <div className="w-11 h-11 rounded-xl bg-[#e8faf5] text-[#08ad81] grid place-items-center">
                <BookOpen size={20} />
              </div>

              <div className="flex gap-1">
                <button
                  onClick={() => edit(resource)}
                  className="w-9 h-9 rounded-lg bg-slate-100 grid place-items-center"
                >
                  <Edit3 size={15} />
                </button>

                <button
                  onClick={() =>
                    remove(resource._id)
                  }
                  className="w-9 h-9 rounded-lg bg-red-50 text-red-700 grid place-items-center"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>

            <div className="mt-4 text-[10px] uppercase tracking-widest font-black text-[#08ad81]">
              {resource.category || "General"}
            </div>

            <h3 className="font-black text-lg text-[#062a5c] mt-1">
              {resource.title}
            </h3>

            <p className="text-sm text-slate-500 mt-2 line-clamp-3">
              {resource.description}
            </p>

            <div className="text-xs text-slate-400 mt-3">
              {resource.batch?.name ||
                "All applicable batches"}
            </div>

            <a
              href={resource.url}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 bg-[#062a5c] text-white rounded-xl text-xs font-black"
            >
              Open resource
              <ExternalLink size={13} />
            </a>
          </article>
        ))}
      </div>

      {!loading && !resources.length && (
        <div className="bg-white border rounded-2xl p-12 text-center text-slate-400">
          No resources have been shared yet.
        </div>
      )}
    </MentorLayout>
  );
}