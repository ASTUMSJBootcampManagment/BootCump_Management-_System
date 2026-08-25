import React, { useEffect, useState } from 'react';
import API from "../../api/axios";
import { Megaphone, Plus, Trash2, X, Send } from 'lucide-react';

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [batches, setBatches] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    targetAudience: 'All',
    batch: '',
  });

  const fetchData = async () => {
    try {
      const [annRes, batchRes] = await Promise.all([
        API.get('/announcements'),
        API.get('/batches'),
      ]);
      setAnnouncements(annRes.data);
      setBatches(batchRes.data);
    } catch (err) {
      console.error('Failed to load announcements data', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    try {
      await API.post('/announcements', formData);
      setShowModal(false);
      setFormData({ title: '', content: '', targetAudience: 'All', batch: '' });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to post announcement');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this announcement?')) return;
    try {
      await API.delete(`/announcements/${id}`);
      fetchData();
    } catch (err) {
      alert('Failed to delete announcement');
    }
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Announcements</h1>
          <p className="text-slate-500 text-sm">Publish updates and broadcasts for students and mentors.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-[#00C896] hover:bg-emerald-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-sm transition"
        >
          <Plus size={18} /> New Announcement
        </button>
      </div>

      {/* List View */}
      <div className="space-y-4">
        {announcements.map((item) => (
          <div key={item._id} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex justify-between items-start">
            <div className="space-y-2 max-w-3xl">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
                  {item.targetAudience}
                </span>
                <span className="text-xs text-slate-400">
                  {new Date(item.createdAt || item.publishDate).toLocaleDateString()}
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-800">{item.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{item.content}</p>
            </div>
            <button
              onClick={() => handleDelete(item._id)}
              className="text-slate-400 hover:text-rose-500 p-2 rounded-lg transition"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-slate-800 text-lg">Post Announcement</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreateAnnouncement} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-600">Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Schedule Update for Workshop"
                  className="w-full mt-1 p-2.5 border border-slate-200 rounded-xl text-sm focus:outline-emerald-500"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-600">Target Audience</label>
                  <select
                    className="w-full mt-1 p-2.5 border border-slate-200 rounded-xl text-sm focus:outline-emerald-500 bg-white"
                    value={formData.targetAudience}
                    onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                  >
                    <option value="All">All Users</option>
                    <option value="Student">Students Only</option>
                    <option value="Mentor">Mentors Only</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600">Specific Batch (Optional)</label>
                  <select
                    className="w-full mt-1 p-2.5 border border-slate-200 rounded-xl text-sm focus:outline-emerald-500 bg-white"
                    value={formData.batch}
                    onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                  >
                    <option value="">All Batches</option>
                    {batches.map((b) => (
                      <option key={b._id} value={b._id}>{b.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600">Content</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Write message content here..."
                  className="w-full mt-1 p-2.5 border border-slate-200 rounded-xl text-sm focus:outline-emerald-500"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-slate-600 text-sm font-semibold rounded-xl hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#00C896] text-white text-sm font-semibold rounded-xl hover:bg-emerald-600 flex items-center gap-2"
                >
                  <Send size={16} /> Publish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}