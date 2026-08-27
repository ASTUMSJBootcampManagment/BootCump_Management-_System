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
      const [announcementResponse, batchResponse] =
        await Promise.all([
          API.get("/announcement/get"),
          API.get("/batches"),
        ]);

      setAnnouncements(
        announcementResponse.data?.data ||
          announcementResponse.data ||
          []
      );

      setBatches(
        batchResponse.data?.data || []
      );
    } catch (error) {
      console.error(error);
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
      await API.post("/announcement/create", {
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
      await API.delete(
        `/announcement/${id}`
      );

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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] font-black text-[#08ad81]">
            Communication
          </p>

          <h1 className="text-2xl sm:text-3xl font-black text-[#062a5c]">
            Announcements
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Publish updates and important information.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={loadData}
            className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 font-bold text-sm flex items-center gap-2"
          >
            <RefreshCw size={17} />
            Refresh
          </button>

          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2.5 rounded-xl bg-[#08c98b] hover:bg-emerald-600 text-white font-black text-sm flex items-center gap-2"
          >
            <Plus size={18} />
            New Announcement
          </button>
        </div>
      </div>

      {/* List */}
      <section className="space-y-4">
        {loading ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center text-slate-400">
            Loading announcements...
          </div>
        ) : announcements.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center">
            <Megaphone
              size={40}
              className="mx-auto text-slate-300"
            />

            <h3 className="font-black text-slate-700 mt-4">
              No announcements
            </h3>

            <p className="text-sm text-slate-400 mt-1">
              Create an announcement to communicate with bootcamp members.
            </p>
          </div>
        ) : (
          announcements.map((item) => (
            <article
              key={item._id}
              className="bg-white border border-slate-200 rounded-2xl p-5"
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex gap-4">
                  <div className="w-11 h-11 rounded-xl bg-[#e8faf5] text-[#08ad81] grid place-items-center shrink-0">
                    <Megaphone size={20} />
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-black">
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

                    <h2 className="font-black text-lg text-[#062a5c] mt-2">
                      {item.title}
                    </h2>

                    <p className="text-sm text-slate-600 mt-1 leading-6">
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
                  className="p-2 rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-500"
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
              <h2 className="font-black text-lg text-[#062a5c]">
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
              className="p-5 space-y-4"
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
                  className="w-full mt-1 px-3 py-2.5 border border-slate-200 rounded-xl text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                    className="w-full mt-1 px-3 py-2.5 border border-slate-200 rounded-xl text-sm bg-white"
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
                    className="w-full mt-1 px-3 py-2.5 border border-slate-200 rounded-xl text-sm bg-white"
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
                  className="w-full mt-1 px-3 py-2.5 border border-slate-200 rounded-xl text-sm resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() =>
                    setShowModal(false)
                  }
                  className="px-4 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>

                <button
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl bg-[#08c98b] text-white font-black text-sm flex items-center gap-2 disabled:opacity-50"
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