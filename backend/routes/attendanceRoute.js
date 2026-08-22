const express = require("express");
const router = express.Router();

const {
  markAttendance,
  getAttendance,
  getStudentAttendanceStats, deleteAllAttendance, // Import function
} = require("../controllers/attendanceController");

const { verifyToken, restrictTo } = require("../middlewares/authMiddleware");

router.post("/attender",verifyToken, restrictTo("Mentor", "Admin"), markAttendance);
router.get("/", getAttendance);
router.get("/stats/:studentId",verifyToken, restrictTo("Mentor", "Admin", "Student"), getStudentAttendanceStats);

module.exports = router;