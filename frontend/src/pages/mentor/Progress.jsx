import ProgressStatus from "../../components/progress/ProgressStatus";
import Sidebar from "../../components/Sidebar";

function Progress() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />

      <main className="lg:ml-64">
        <ProgressStatus />
      </main>
    </div>
  );
}

export default Progress;
