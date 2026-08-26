import { useEffect, useState } from "react";
import MentorDashboard from "../../components/MentorDashboard";
import { getMentorDashboard } from "../../services/dashboardService";
import Sidebar from "../../components/Sidebar";

const Dashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getMentorDashboard();

      setDashboard(response.data);
    } catch (error) {
      console.error("Mentor dashboard error:", error);

      setError(
        error.response?.data?.message || "Failed to load mentor dashboard.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f9fc] flex items-center justify-center">
        <div className="text-center">
          <div className="h-10 w-10 rounded-full border-4 border-blue-600 border-t-transparent animate-spin mx-auto" />

          <p className="mt-4 text-sm text-slate-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f7f9fc] flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center max-w-md w-full">
          <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto text-xl">
            !
          </div>

          <h2 className="mt-4 text-lg font-bold text-slate-800">
            Unable to load dashboard
          </h2>

          <p className="mt-2 text-sm text-slate-500">{error}</p>

          <button
            onClick={fetchDashboard}
            className="mt-5 px-5 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition"
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
        <MentorDashboard dashboard={dashboard} />
      </main>
    </div>
  );
};

export default Dashboard;
