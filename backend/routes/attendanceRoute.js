const express = require("express");
const router = express.Router();

const {
  markAttendance,
  getAttendance,
  getStudentAttendanceStats, deleteAllAttendance, 
} = require("../controllers/attendanceController");

const { verifyToken, restrictTo } = require("../middlewares/authMiddleware");

router.post("/attender", verifyToken, restrictTo("Mentor"), markAttendance);
router.get("/", verifyToken, restrictTo("Mentor"), getAttendance);
router.get("/stats/:studentId",verifyToken, restrictTo("Mentor", "Admin", "Student"), getStudentAttendanceStats);

module.exports = router;
