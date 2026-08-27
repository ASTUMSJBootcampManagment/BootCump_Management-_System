import AttendanceHistory from "../../components/attendance/AttendanceHistory";
import Sidebar from "../../components/Sidebar";

function History() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="flex-1 overflow-y-auto">
        <AttendanceHistory />
      </main>
    </div>
  );
}

export default History;
