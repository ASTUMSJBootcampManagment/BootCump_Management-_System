const express = require("express");
const protect = require("../middlewares/authMiddleware");
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
} = require("../controllers/submissionController");

const router = express.Router();

// Assignments
router.post("/", protect, authorizeRoles("Admin", "Mentor"), createAssignment);
router.get("/", protect, getAssignments);
router.put("/:id", protect, authorizeRoles("Admin", "Mentor"), updateAssignment);
router.delete("/:id", protect, authorizeRoles("Admin", "Mentor"), deleteAssignment);

// Submissions
router.post("/submit", protect, authorizeRoles("Student"), submitAssignment);
router.get("/:assignmentId/submissions", protect, authorizeRoles("Admin", "Mentor"), getSubmissionsForAssignment);
router.get("/my-submissions", protect, authorizeRoles("Student"), getMySubmissions);

module.exports = router;