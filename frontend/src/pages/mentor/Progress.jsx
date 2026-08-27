import ProgressStatus from "../../components/progress/ProgressStatus";
import Sidebar from "../../components/Sidebar";

function Progress() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="flex-1 overflow-y-auto">
        <ProgressStatus />
      </main>
    </div>
  );
}

export default Progress;
