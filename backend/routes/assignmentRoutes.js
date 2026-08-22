const express = require("express");
const {verifyToken,restrictTo} = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");
const {
  createAssignment,
  getAssignments,
  updateAssignment,
  deleteAssignment,
} = require("../controllers/assignmentController");
const {
  submitAssignment,
  getSubmissionsForAssignment,
  getMySubmissions,
  gradeSubmission,
} = require("../controllers/submissionController");

const router = express.Router();

router.post("/", verifyToken, restrictTo("Admin", "Mentor"), createAssignment);
router.get("/", verifyToken, getAssignments);
router.put("/:id", verifyToken, restrictTo("Admin", "Mentor"), updateAssignment);
router.delete("/:id", verifyToken, restrictTo("Admin", "Mentor"), deleteAssignment);

router.post("/submit", verifyToken, restrictTo("Student"), submitAssignment);
router.get("/:assignmentId/submissions", verifyToken, restrictTo("Admin", "Mentor"), getSubmissionsForAssignment);
router.get("/my-submissions", verifyToken, restrictTo("Student"), getMySubmissions);
router.put("/submissions/:id/grade", verifyToken, restrictTo("Admin", "Mentor"), gradeSubmission);

module.exports = router;