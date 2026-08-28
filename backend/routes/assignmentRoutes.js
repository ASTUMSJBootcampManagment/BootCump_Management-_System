const express = require("express");
const router = express.Router();

const {
  createAssignment,
  getAssignments,
  updateAssignment,
  deleteAssignment,
} = require("../controllers/assignmentController");

const {
  submitAssignment,
  getMySubmissions,
  getAssignmentSubmissions,
  gradeSubmission, // <-- Import here
} = require("../controllers/submissionController");

const { verifyToken, restrictTo } = require("../middlewares/authMiddleware");

// Protect all routes
router.use(verifyToken);

// --- STATIC ROUTES (Must come BEFORE /:id routes) ---
router.get("/my-submissions", restrictTo("Student"), getMySubmissions);
router.post("/submit", restrictTo("Student"), submitAssignment);

// --- BASE ASSIGNMENT ROUTES ---
router
  .route("/")
  .get(getAssignments)
  .post(restrictTo("Admin", "Mentor"), createAssignment);

router.get("/:id/submissions", restrictTo("Mentor"), getAssignmentSubmissions);
router.patch("/submissions/:id/grade", restrictTo("Mentor"), gradeSubmission);

router
  .route("/:id")
  .put(restrictTo("Admin", "Mentor"), updateAssignment)
  .delete(restrictTo("Admin", "Mentor"), deleteAssignment);

module.exports = router;
