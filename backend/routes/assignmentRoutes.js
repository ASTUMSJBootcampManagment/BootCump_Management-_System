const express = require("express");
const { verifyToken, restrictTo } = require("../middlewares/authMiddleware");
const { createAssignment, getAssignments, updateAssignment, deleteAssignment } = require("../controllers/assignmentController");
const { submitAssignment, getSubmissionsForAssignment, getMySubmissions } = require("../controllers/submissionController");

const router = express.Router();
router.use(verifyToken);
router.get("/", restrictTo("Admin", "Mentor"), getAssignments);
router.post("/", restrictTo("Admin"), createAssignment);
router.put("/:id", restrictTo("Admin"), updateAssignment);
router.delete("/:id", restrictTo("Admin"), deleteAssignment);
router.get("/:assignmentId/submissions", restrictTo("Mentor"), getSubmissionsForAssignment);
router.post("/submit", restrictTo("Student"), submitAssignment);
router.get("/my-submissions", restrictTo("Student"), getMySubmissions);
module.exports = router;
