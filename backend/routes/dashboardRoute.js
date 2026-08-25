const express = require("express");

const router = express.Router();

const {
  getAdminDashboard,
  getMentorDashboard,
  getStudentDashboard,
} = require("../controllers/DashboardController");

const { verifyToken, restrictTo } = require("../middlewares/authMiddleware");

router.get("/admin", verifyToken, restrictTo("Admin"), getAdminDashboard);

router.get("/mentor", verifyToken, restrictTo("Mentor"), getMentorDashboard);

router.get("/student", verifyToken, restrictTo("Student"), getStudentDashboard);

module.exports = router;
