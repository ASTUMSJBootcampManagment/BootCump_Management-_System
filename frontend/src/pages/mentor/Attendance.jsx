import AttendanceStatus from "../../components/attendance/AttendanceStatus";
import Sidebar from "../../components/Sidebar";

function Attendance() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />

      <main className="lg:ml-64">
        <AttendanceStatus />
      </main>
    </div>
  );
}

export default Attendance;
