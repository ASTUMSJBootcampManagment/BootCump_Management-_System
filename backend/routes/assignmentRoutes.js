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
} = require("../controllers/submissionController");
const{
  gradeSubmission
}=require("../controllers/gradingController")

const router = express.Router();

router.post("/", verifyToken, restrictTo("Admin", "Mentor"), createAssignment);
router.get("/", verifyToken, getAssignments);
router.put("/:id", verifyToken, restrictTo("Admin", "Mentor"), updateAssignment);
router.delete("/:id", verifyToken, restrictTo("Admin", "Mentor"), deleteAssignment);
router.post("/submit", verifyToken, authorizeRoles("Student"), submitAssignment);
router.get("/:assignmentId/submissions", verifyToken, authorizeRoles("Admin", "Mentor"), getSubmissionsForAssignment);
router.get("/my-submissions", verifyToken, authorizeRoles("Student"), getMySubmissions);
router.post("/submit", verifyToken, restrictTo("Student"), submitAssignment);
router.get("/:assignmentId/submissions", verifyToken, restrictTo("Admin", "Mentor"), getSubmissionsForAssignment);
router.get("/my-submissions", verifyToken, restrictTo("Student"), getMySubmissions);
router.put("/submissions/:id/grade", verifyToken, restrictTo("Admin", "Mentor"), gradeSubmission);

module.exports = router;