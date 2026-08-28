import React, { useEffect, useState } from "react";
import {
  Plus,
  Trash2,
  X,
  Send,
  RefreshCw,
  BookOpen,
  Link as LinkIcon,
  Video,
  FileText,
  Folder,
  ExternalLink,
} from "lucide-react";
import API from "../../api/axios";

export default function Resources() {
  const [resources, setResources] = useState([]);
  const [batches, setBatches] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "Link",
    url: "",
    batch: "",
  });

  const loadData = async () => {
    setLoading(true);

    try {
      const [resourcesResponse, batchResponse] = await Promise.all([
        API.get("/resources"),
        API.get("/batches"),
      ]);

      setResources(
        resourcesResponse.data?.data || resourcesResponse.data || []
      );
      setBatches(
        batchResponse.data?.data || batchResponse.data || []
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

  const createResource = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await API.post("/resources", {
        title: formData.title,
        description: formData.description,
        type: formData.type,
        url: formData.url,
        batch: formData.batch || null,
      });

      setFormData({
        title: "",
        description: "",
        type: "Link",
        url: "",
        batch: "",
      });

      setShowModal(false);
      await loadData();
    } catch (error) {
      alert(
        error.response?.data?.message || "Unable to publish resource."
      );
    } finally {
      setSaving(false);
    }
  };

  const deleteResource = async (id) => {
    if (!window.confirm("Are you sure you want to delete this resource?")) {
      return;
    }

    try {
      await API.delete(`/resources/${id}`);
      await loadData();
    } catch (error) {
      alert(
        error.response?.data?.message || "Unable to delete resource."
      );
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "Video":
        return <Video size={20} />;
      case "Document":
        return <FileText size={20} />;
      case "Other":
        return <Folder size={20} />;
      case "Link":
      default:
        return <LinkIcon size={20} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Actions Toolbar */}
      <div className="flex justify-between items-center gap-4">
        <p className="text-sm text-slate-500">
          Manage and publish learning materials for bootcamp participants.
        </p>

        <div className="flex gap-2">
          <button
            onClick={loadData}
            className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 font-bold text-sm flex items-center gap-2 hover:bg-slate-50"
          >
            <RefreshCw size={17} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>

          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2.5 rounded-xl bg-[#08c98b] hover:bg-emerald-600 text-white font-black text-sm flex items-center gap-2"
          >
            <Plus size={18} />
            New Resource
          </button>
        </div>
      </div>

      {/* Resource List */}
      <section className="space-y-4">
        {loading ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center text-slate-400 font-medium">
            Loading resources...
          </div>
        ) : resources.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center">
            <BookOpen size={40} className="mx-auto text-slate-300" />
            <h3 className="font-black text-slate-700 mt-4">
              No resources available
            </h3>
            <p className="text-sm text-slate-400 mt-1">
              Add links, documents, or videos to share with students.
            </p>
          </div>
        ) : (
          resources.map((item) => (
            <article
              key={item._id}
              className="bg-white border border-slate-200 rounded-2xl p-5"
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex gap-4">
                  <div className="w-11 h-11 rounded-xl bg-[#e8faf5] text-[#08ad81] grid place-items-center shrink-0">
                    {getTypeIcon(item.type)}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-black">
                        {item.type || "Link"}
                      </span>

                      <span className="text-xs text-slate-400 font-medium">
                        {item.batch?.name || "All Batches"}
                      </span>

                      <span className="text-xs text-slate-400">
                        • {new Date(item.createdAt || Date.now()).toLocaleDateString()}
                      </span>
                    </div>

                    <h2 className="font-black text-lg text-[#062a5c] mt-2">
                      {item.title}
                    </h2>

                    {item.description && (
                      <p className="text-sm text-slate-600 mt-1 leading-6">
                        {item.description}
                      </p>
                    )}

                    <div className="mt-3">
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-black text-[#08ad81] hover:underline"
                      >
                        Open Resource
                        <ExternalLink size={13} />
                      </a>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => deleteResource(item._id)}
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
                Add Resource
              </h2>

              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={createResource} className="p-5 space-y-4">
              <div>
                <label className="text-xs font-black text-slate-600">
                  Title
                </label>
                <input
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Resource title"
                  className="w-full mt-1 px-3 py-2.5 border border-slate-200 rounded-xl text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-black text-slate-600">
                    Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                    className="w-full mt-1 px-3 py-2.5 border border-slate-200 rounded-xl text-sm bg-white"
                  >
                    <option value="Link">Link</option>
                    <option value="Video">Video</option>
                    <option value="Document">Document</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-black text-slate-600">
                    Batch
                  </label>
                  <select
                    value={formData.batch}
                    onChange={(e) =>
                      setFormData({ ...formData, batch: e.target.value })
                    }
                    className="w-full mt-1 px-3 py-2.5 border border-slate-200 rounded-xl text-sm bg-white"
                  >
                    <option value="">All Batches</option>
                    {batches.map((batch) => (
                      <option key={batch._id} value={batch._id}>
                        {batch.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-black text-slate-600">
                  Resource URL
                </label>
                <input
                  required
                  type="url"
                  value={formData.url}
                  onChange={(e) =>
                    setFormData({ ...formData, url: e.target.value })
                  }
                  placeholder="https://..."
                  className="w-full mt-1 px-3 py-2.5 border border-slate-200 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-black text-slate-600">
                  Description
                </label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Write a brief description..."
                  className="w-full mt-1 px-3 py-2.5 border border-slate-200 rounded-xl text-sm resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>

                <button
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl bg-[#08c98b] text-white font-black text-sm flex items-center gap-2 disabled:opacity-50"
                >
                  <Send size={16} />
                  {saving ? "Publishing..." : "Publish"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}