import React, { useEffect, useState } from "react";
import {
  Plus,
  Trash2,
  X,
  Send,
  RefreshCw,
  Megaphone,
} from "lucide-react";
import API from "../../api/axios";

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [batches, setBatches] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    announcedTo: "All",
    batch: "",
  });

  const loadData = async () => {
    setLoading(true);

    try {
      // Updated endpoint URL from /announcements/get to /announcements
      const [announcementResponse, batchResponse] = await Promise.all([
        API.get("/announcements"),
        API.get("/batches"),
      ]);

      setAnnouncements(
        announcementResponse.data?.data ||
          announcementResponse.data ||
          []
      );

      setBatches(
        batchResponse.data?.data || batchResponse.data || []
      );
    } catch (error) {
      console.error("Failed to fetch announcements:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const createAnnouncement = async (e) => {
    e.preventDefault();

    setSaving(true);

    try {
      // Updated endpoint URL to match /announcements REST API conventions
      await API.post("/announcements", {
        title: formData.title,
        content: formData.content,
        announcedTo: formData.announcedTo,
        batch: formData.batch || null,
      });

      setFormData({
        title: "",
        content: "",
        announcedTo: "All",
        batch: "",
      });

      setShowModal(false);

      await loadData();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Unable to publish announcement."
      );
    } finally {
      setSaving(false);
    }
  };

  const deleteAnnouncement = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this announcement?"
      )
    ) {
      return;
    }

    try {
      // Updated endpoint URL to plural route /announcements/:id
      await API.delete(`/announcements/${id}`);

      await loadData();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Unable to delete announcement."
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#062a5c]">Announcements</h1>
          <p className="mt-1 text-sm text-slate-500">
            Publish updates and important information.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={loadData}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700"
          >
            <RefreshCw size={17} />
            Refresh
          </button>

          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 rounded-xl bg-[#08c98b] px-4 py-2.5 text-sm font-black text-white hover:bg-emerald-600"
          >
            <Plus size={18} />
            New Announcement
          </button>
        </div>
      </div>

      {/* List */}
      <section className="space-y-4">
        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-400">
            Loading announcements...
          </div>
        ) : announcements.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
            <Megaphone
              size={40}
              className="mx-auto text-slate-300"
            />

            <h3 className="mt-4 font-black text-slate-700">
              No announcements
            </h3>

            <p className="mt-1 text-sm text-slate-400">
              Create an announcement to communicate with bootcamp members.
            </p>
          </div>
        ) : (
          announcements.map((item) => (
            <article
              key={item._id}
              className="rounded-2xl border border-slate-200 bg-white p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-4">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#e8faf5] text-[#08ad81]">
                    <Megaphone size={20} />
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-black text-emerald-700">
                        {item.announcedTo ||
                          item.targetAudience ||
                          "All"}
                      </span>

                      <span className="text-xs text-slate-400">
                        {new Date(
                          item.createdAt ||
                            item.publishDate ||
                            Date.now()
                        ).toLocaleDateString()}
                      </span>
                    </div>

                    <h2 className="mt-2 text-lg font-black text-[#062a5c]">
                      {item.title}
                    </h2>

                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      {item.content}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() =>
                    deleteAnnouncement(
                      item._id
                    )
                  }
                  className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-500"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 p-5">
              <h2 className="text-lg font-black text-[#062a5c]">
                Post Announcement
              </h2>

              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={createAnnouncement}
              className="space-y-4 p-5"
            >
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
                  placeholder="Announcement title"
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
                />
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-black text-slate-600">
                    Audience
                  </label>

                  <select
                    value={formData.announcedTo}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        announcedTo:
                          e.target.value,
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm"
                  >
                    <option value="All">
                      Everyone
                    </option>

                    <option value="Student">
                      Students
                    </option>

                    <option value="Mentor">
                      Mentors
                    </option>
                  </select>
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
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm"
                  >
                    <option value="">
                      All Batches
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
                </div>
              </div>

              <div>
                <label className="text-xs font-black text-slate-600">
                  Message
                </label>

                <textarea
                  required
                  rows={5}
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      content: e.target.value,
                    })
                  }
                  placeholder="Write your announcement..."
                  className="mt-1 w-full resize-none rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() =>
                    setShowModal(false)
                  }
                  className="rounded-xl px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>

                <button
                  disabled={saving}
                  className="flex items-center gap-2 rounded-xl bg-[#08c98b] px-5 py-2.5 text-sm font-black text-white disabled:opacity-50"
                >
                  <Send size={16} />

                  {saving
                    ? "Publishing..."
                    : "Publish"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}