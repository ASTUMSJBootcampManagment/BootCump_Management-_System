import { Routes, Route } from "react-router-dom";
import StudentAttendance from "../pages/student/StudentAttendnce"; // Check exact file spelling
import StudentProgress from "../pages/student/StudentProgress";
import StudentAssignments from "../pages/student/StudentAssignment";

function AppRoutes() {
  return (
    <Routes>
      {/* Do NOT put "/student" here — use relative paths! */}
      <Route path="attendance" element={<StudentAttendance />} />
      <Route path="progress" element={<StudentProgress />} />
      <Route path="assignments" element={<StudentAssignments />} />
    </Routes>
  );
}

export default AppRoutes;