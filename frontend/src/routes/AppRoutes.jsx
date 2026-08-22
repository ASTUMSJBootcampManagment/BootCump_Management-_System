import { Routes, Route } from 'react-router-dom';
import StudentAttendance from './pages/student/StudentAttendance';
import StudentProgress from './pages/student/StudentProgress';
import StudentAssignments from './pages/student/StudentAssignments';

function AppRoutes() {
  return (
    <Routes>
      {/* Student Routes */}
      <Route path="/student/attendance" element={<StudentAttendance />} />
      <Route path="/student/progress" element={<StudentProgress />} />
      <Route path="/student/assignments" element={<StudentAssignments />} />
    </Routes>
  );
}

export default AppRoutes;