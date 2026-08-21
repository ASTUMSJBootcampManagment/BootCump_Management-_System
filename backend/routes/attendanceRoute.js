const express = require("express");
const router = express.Router();

const {
  markAttendance,
  getAttendance,
  getStudentAttendanceStats, deleteAllAttendance, 
} = require("../controllers/attendanceController");

const { verifyToken, restrictTo } = require("../middlewares/authMiddleware");
router.use(verifyToken);

router.post("/attender", restrictTo("Mentor", "Admin"), markAttendance);
router.get("/", restrictTo("Mentor", "Admin","Student"), getAttendance);
router.get("/stats/:studentId", restrictTo("Mentor", "Admin", "Student"), getStudentAttendanceStats);

module.exports = router;