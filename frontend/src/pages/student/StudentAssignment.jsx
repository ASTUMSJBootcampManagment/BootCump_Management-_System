import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StudentAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [githubUrl, setGithubUrl] = useState('');
  const [liveDemoUrl, setLiveDemoUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/assignments/my-assignments', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAssignments(res.data);
    } catch (err) {
      console.error('Error fetching assignments:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        '/api/submissions',
        {
          assignmentId: selectedAssignment._id,
          githubUrl,
          liveDemoUrl,
          notes,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSelectedAssignment(null);
      setGithubUrl('');
      setLiveDemoUrl('');
      setNotes('');
      fetchAssignments();
    } catch (err) {
      console.error('Submission failed:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 space-y-6 bg-[#F8FAFC] min-h-screen">
      <h1 className="text-2xl font-bold text-[#0F172A]">My Assignments</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {assignments.map((assignment) => (
          <div key={assignment._id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold text-slate-400">
                  Due: {new Date(assignment.deadline).toLocaleDateString()}
                </span>
                <span className="text-xs px-2.5 py-1 rounded-full font-semibold bg-slate-100 text-slate-700">
                  Max Score: {assignment.maxScore}
                </span>
              </div>
              <h3 className="text-lg font-bold text-[#0F172A]">{assignment.title}</h3>
              <p className="text-sm text-slate-600 mt-2">{assignment.description}</p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block">Status</span>
                <span className="text-sm font-semibold text-[#2563EB]">
                  {assignment.submissionStatus || 'Pending'}
                </span>
              </div>

              {/* Action CTA Button strictly adhering to Green palette */}
              <button
                onClick={() => setSelectedAssignment(assignment)}
                className="bg-[#22C55E] hover:bg-emerald-600 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all shadow-sm"
              >
                {assignment.submissionStatus ? 'Resubmit / Edit' : 'Submit Assignment'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Submission Modal */}
      {selectedAssignment && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl border border-slate-100">
            <h2 className="text-xl font-bold text-[#0F172A] mb-4">
              Submit: {selectedAssignment.title}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  GitHub Repository URL *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://github.com/username/repository"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-[#2563EB] text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Live Demo URL (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://my-app.vercel.app"
                  value={liveDemoUrl}
                  onChange={(e) => setLiveDemoUrl(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-[#2563EB] text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Submission Notes
                </label>
                <textarea
                  rows="3"
                  placeholder="Add details about implementation or deployment..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-[#2563EB] text-sm"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedAssignment(null)}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-[#22C55E] hover:bg-emerald-600 text-white text-sm font-semibold px-5 py-2 rounded-xl shadow-sm"
                >
                  {submitting ? 'Submitting...' : 'Submit Work'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentAssignments;