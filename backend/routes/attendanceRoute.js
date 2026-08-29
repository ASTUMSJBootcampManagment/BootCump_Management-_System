const express = require("express");
const router = express.Router();
const {
  getMentorStudents,
  getAttendanceHistory,
  markAttendance,
  getStudentAttendanceStats,
  getMyAttendance,
  deleteAllAttendance,
} = require("../controllers/attendanceController");
const { verifyToken, restrictTo } = require("../middlewares/authMiddleware");

router.use(verifyToken);

router.get("/mine", getMyAttendance);

router.get("/", restrictTo("Mentor", "Admin", "Student"), getAttendanceHistory);
router.post("/bulk", restrictTo("Mentor", "Admin"), markAttendance);
router.post("/attender", restrictTo("Mentor", "Admin"), markAttendance);

router.get("/students", restrictTo("Mentor", "Admin"), getMentorStudents);
router.get(
  "/history",
  restrictTo("Mentor", "Admin", "Student"),
  getAttendanceHistory,
);
router.get(
  "/stats/:studentId",
  restrictTo("Mentor", "Admin", "Student"),
  getStudentAttendanceStats,
);

router.delete("/all", restrictTo("Admin"), deleteAllAttendance);

module.exports = router;
