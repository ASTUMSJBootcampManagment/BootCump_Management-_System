import AttendanceStatus from "../../components/attendance/AttendanceStatus";
import Sidebar from "../../components/Sidebar";

function Attendance() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="flex-1 overflow-y-auto">
        <AttendanceStatus />
      </main>
    </div>
  );
}

export default Attendance;
