import React, { useEffect, useState } from 'react';
import API from "../../api/axios";
import { Users, Search, Trash2, UserCheck, Shield, GraduationCap, X, Check } from 'lucide-react';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [batches, setBatches] = useState([]);
  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedBatchId, setSelectedBatchId] = useState('');
  const [showBatchModal, setShowBatchModal] = useState(false);

  const fetchUsersAndBatches = async () => {
    try {
      const [userRes, batchRes] = await Promise.all([
        API.get('/users'),
        API.get('/batches'),
      ]);
      setUsers(userRes.data);
      setBatches(batchRes.data);
    } catch (err) {
      console.error('Failed to load user or batch data', err);
    }
  };

  useEffect(() => {
    fetchUsersAndBatches();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await API.patch(`/users/${userId}`, { role: newRole });
      fetchUsersAndBatches();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update user role');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await API.delete(`/users/${userId}`);
      fetchUsersAndBatches();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleAssignBatch = async (e) => {
    e.preventDefault();
    if (!selectedUser || !selectedBatchId) return;

    try {
      // Endpoint to add student/mentor to a batch
      await API.patch(`/batches/${selectedBatchId}/assign`, {
        userId: selectedUser._id,
        role: selectedUser.role,
      });
      setShowBatchModal(false);
      setSelectedUser(null);
      setSelectedBatchId('');
      fetchUsersAndBatches();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to assign user to batch');
    }
  };

  // Filter users based on search string and selected role tab
  const filteredUsers = users.filter((u) => {
    const matchesRole = activeTab === 'All' || u.role === activeTab;
    const matchesSearch =
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase());
    return matchesRole && matchesSearch;
  });

  return (
    <div className="p-6 bg-slate-50 min-h-screen space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">User Directory</h1>
          <p className="text-slate-500 text-sm">
            Manage user authorization roles, accounts, and batch assignments.
          </p>
        </div>
      </div>

      {/* Control Bar: Tabs & Search Input */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Role Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-xl w-full md:w-auto">
          {['All', 'Student', 'Mentor', 'Admin'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition ${
                activeTab === tab
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab}s
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-emerald-500"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-xs text-slate-500 uppercase font-semibold">
              <th className="p-4">User Details</th>
              <th className="p-4">Role</th>
              <th className="p-4">Assigned Batch</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-slate-400">
                  No users found matching the criteria.
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-slate-50/50 transition">
                  {/* User Name & Email */}
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-600 font-bold flex items-center justify-center text-xs">
                        {user.name ? user.name[0] : 'U'}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">{user.name}</p>
                        <p className="text-xs text-slate-400">{user.email}</p>
                      </div>
                    </div>
                  </td>

                  {/* Dynamic Role Change */}
                  <td className="p-4">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user._id, e.target.value)}
                      className="bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold px-2.5 py-1.5 focus:outline-emerald-500"
                    >
                      <option value="Student">Student</option>
                      <option value="Mentor">Mentor</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </td>

                  {/* Batch Info & Trigger Modal */}
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-600 font-medium">
                        {user.batch?.name || user.batchName || 'Unassigned'}
                      </span>
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setShowBatchModal(true);
                        }}
                        className="text-xs text-emerald-600 hover:underline font-semibold"
                      >
                        Change
                      </button>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleDeleteUser(user._id)}
                      className="p-2 text-slate-400 hover:text-rose-500 rounded-lg transition"
                      title="Delete User"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Assign Batch Modal */}
      {showBatchModal && selectedUser && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-slate-800 text-lg">Assign Batch</h3>
              <button
                onClick={() => setShowBatchModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={20} />
              </button>
            </div>
            <p className="text-xs text-slate-500">
              Assigning cohort batch for <strong>{selectedUser.name}</strong> ({selectedUser.role}).
            </p>
            <form onSubmit={handleAssignBatch} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-600">Select Batch</label>
                <select
                  required
                  value={selectedBatchId}
                  onChange={(e) => setSelectedBatchId(e.target.value)}
                  className="w-full mt-1 p-2.5 border border-slate-200 rounded-xl text-sm focus:outline-emerald-500 bg-white"
                >
                  <option value="">Select a batch...</option>
                  {batches.map((b) => (
                    <option key={b._id} value={b._id}>
                      {b.name} ({b.track})
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowBatchModal(false)}
                  className="px-4 py-2 text-slate-600 text-sm font-semibold rounded-xl hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#00C896] text-white text-sm font-semibold rounded-xl hover:bg-emerald-600 flex items-center gap-1"
                >
                  <Check size={16} /> Confirm Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}