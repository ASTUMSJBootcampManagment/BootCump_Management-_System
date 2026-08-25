import React, { useEffect, useState } from 'react';
import API from "../../api/axios";
import { Plus, Layers, Calendar, User, X } from 'lucide-react';

export default function BatchManagement() {
  const [batches, setBatches] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', track: 'Full-Stack MERN' });

  const fetchBatches = async () => {
    try {
      const { data } = await API.get('/batches');
      setBatches(data);
    } catch (err) {
      console.error('Error fetching batches:', err);
    }
  };

  useEffect(() => {
    fetchBatches();
  }, []);

  const handleCreateBatch = async (e) => {
    e.preventDefault();
    try {
      await API.post('/batches', formData);
      setShowModal(false);
      setFormData({ name: '', track: 'Full-Stack MERN' });
      fetchBatches();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create batch');
    }
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Batch Management</h1>
          <p className="text-slate-500 text-sm">Organize bootcamp cohorts and assigned track programs.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-[#00C896] hover:bg-emerald-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-sm transition"
        >
          <Plus size={18} /> Create New Batch
        </button>
      </div>

      {/* Batch Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {batches.map((batch) => (
          <div key={batch._id} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
                  {batch.track || 'MERN Track'}
                </span>
                <h3 className="text-lg font-bold text-slate-800 mt-2">{batch.name}</h3>
              </div>
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <User size={16} className="text-slate-400" />
                <span>Students Enrolled: <strong className="text-slate-800">{batch.students?.length || 0}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Layers size={16} className="text-slate-400" />
                <span>Mentors Assigned: <strong className="text-slate-800">{batch.mentors?.length || 0}</strong></span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Batch Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-slate-800 text-lg">Add New Batch</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreateBatch} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-600">Batch Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Summer 2026 - Batch A"
                  className="w-full mt-1 p-2.5 border border-slate-200 rounded-xl text-sm focus:outline-emerald-500"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600">Track</label>
                <input
                  type="text"
                  required
                  className="w-full mt-1 p-2.5 border border-slate-200 rounded-xl text-sm focus:outline-emerald-500"
                  value={formData.track}
                  onChange={(e) => setFormData({ ...formData, track: e.target.value })}
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
                  className="px-4 py-2 bg-[#00C896] text-white text-sm font-semibold rounded-xl hover:bg-emerald-600"
                >
                  Save Batch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}