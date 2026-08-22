const express = require("express");
const router = express.Router();

const {
  markAttendance,
  getAttendance,
  getStudentAttendanceStats, deleteAllAttendance, 
} = require("../controllers/attendanceController");

const { verifyToken, restrictTo } = require("../middlewares/authMiddleware");

<<<<<<< HEAD
router.post("/attender",verifyToken, restrictTo("Mentor", "Admin"), markAttendance);
router.get("/", getAttendance);
router.get("/stats/:studentId",verifyToken, restrictTo("Mentor", "Admin", "Student"), getStudentAttendanceStats);
=======
router.post("/attender", restrictTo("Mentor", "Admin"), markAttendance);
router.get("/", restrictTo("Mentor", "Admin","Student"), getAttendance);
router.get("/stats/:studentId", restrictTo("Mentor", "Admin", "Student"), getStudentAttendanceStats);
>>>>>>> update-registration

module.exports = router;