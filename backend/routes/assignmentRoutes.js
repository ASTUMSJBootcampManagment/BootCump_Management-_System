const express = require("express");
const router = express.Router();

const {
  createAssignment,
  getAssignments,
  updateAssignment,
  deleteAssignment,
  downloadAssignmentPdf,
} = require("../controllers/assignmentController");

const {
  submitAssignment,
  getMySubmissions,
  getAssignmentSubmissions,
  gradeSubmission, // <-- Import here
} = require("../controllers/submissionController");

const { verifyToken, restrictTo } = require("../middlewares/authMiddleware");
const uploadPdf = require("../middlewares/uploadMiddleware");

// Protect all routes
router.use(verifyToken);

// --- STATIC ROUTES (Must come BEFORE /:id routes) ---
router.get("/my-submissions", restrictTo("Student"), getMySubmissions);
router.post("/submit", restrictTo("Student"), submitAssignment);

// --- BASE ASSIGNMENT ROUTES ---
router
  .route("/")
  .get(getAssignments)
  .post(restrictTo("Admin", "Mentor"), uploadPdf.single("pdfFile"), createAssignment);

// --- SPECIFIC ASSIGNMENT SUB-ROUTES ---
router.get("/:id/download", downloadAssignmentPdf);
router.get("/:id/submissions", restrictTo("Mentor"), getAssignmentSubmissions);
router.patch("/submissions/:id/grade", restrictTo("Mentor"), gradeSubmission);

// --- PARAMETERIZED ID ROUTES (Must come LAST) ---
router
  .route("/:id")
  .put(restrictTo("Admin", "Mentor"), uploadPdf.single("pdfFile"), updateAssignment)
  .delete(restrictTo("Admin", "Mentor"), deleteAssignment);

module.exports = router;
