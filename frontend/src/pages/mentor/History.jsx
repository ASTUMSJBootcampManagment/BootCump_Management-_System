import AttendanceHistory from "../../components/attendance/AttendanceHistory";
import Sidebar from "../../components/Sidebar";

function History() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />

      <main className="lg:ml-64">
        <AttendanceHistory />
      </main>
    </div>
  );
}

export default History;
