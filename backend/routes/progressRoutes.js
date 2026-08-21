const express = require("express");
const router = express.Router();

const {
  createTopic,
  getProgress,
  updateProgress,
  getMentorStudentsProgress
} = require("../controllers/progressController");

const { verifyToken, restrictTo } = require("../middlewares/authMiddleware");

router.use(verifyToken);
router.get("/get-one/:StudentId", restrictTo("Admin", "Mentor", "Student"), getProgress);
router.get("/get-all", restrictTo("Admin", "Mentor"), getProgress);
router.get("/get/mentor-students", restrictTo("Mentor"), getMentorStudentsProgress);
router.post("/create", restrictTo("Admin"), createTopic);
router.patch("/update-progress/:StudentId", restrictTo("Mentor"),updateProgress);

module.exports = router;