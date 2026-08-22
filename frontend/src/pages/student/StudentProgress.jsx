import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StudentProgress = () => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/progress/my-progress', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTopics(res.data);
      } catch (err) {
        console.error('Error fetching progress:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProgress();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed':
        return <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">Completed</span>;
      case 'In Progress':
        return <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">In Progress</span>;
      case 'Needs Improvement':
        return <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full">Needs Improvement</span>;
      default:
        return <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-full">Not Started</span>;
    }
  };

  if (loading) return <div className="p-6 text-slate-600">Loading progress...</div>;

  return (
    <div className="p-6 space-y-6 bg-[#F8FAFC] min-h-screen">
      <h1 className="text-2xl font-bold text-[#0F172A]">Topic Progress & Summary</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {topics.map((item) => (
          <div key={item._id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-3">
                <span className="text-xs font-bold text-[#14B8A6] uppercase tracking-wide">
                  {item.category || 'General'}
                </span>
                {getStatusBadge(item.status)}
              </div>
              <h3 className="text-lg font-bold text-[#0F172A]">{item.topicName}</h3>
              <p className="text-sm text-slate-600 mt-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                {item.notes || 'No mentor notes provided yet.'}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-400">
              Last updated: {new Date(item.updatedAt).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentProgress;