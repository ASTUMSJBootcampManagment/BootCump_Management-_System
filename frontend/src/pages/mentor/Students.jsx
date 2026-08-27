import { useEffect, useState } from "react";

import MentorStudents from "../../components/MentorStudents";

import { getMentorDashboard } from "../../services/dashboardService";
import Sidebar from "../../components/Sidebar";

const Students = () => {
  const [students, setStudents] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const fetchStudents = async () => {
    try {
      setLoading(true);

      setError("");

      const response = await getMentorDashboard();

      setStudents(response?.data?.students || []);
    } catch (error) {
      console.error("Error fetching mentor students:", error);

      setError(error?.response?.data?.message || "Failed to load students.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f9fc] flex items-center justify-center">
        <div className="text-center">
          <div className="w-9 h-9 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />

          <p className="mt-3 text-sm text-slate-500">Loading students...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f7f9fc] flex items-center justify-center">
        <div className="bg-white border border-red-100 rounded-xl p-8 text-center max-w-md">
          <h2 className="text-lg font-bold text-red-600">
            Unable to load students
          </h2>

          <p className="text-sm text-slate-500 mt-2">{error}</p>

          <button
            onClick={fetchStudents}
            className="mt-5 px-5 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="flex-1 overflow-y-auto">
        <MentorStudents students={students} />
      </main>
    </div>
  );
};

export default Students;
