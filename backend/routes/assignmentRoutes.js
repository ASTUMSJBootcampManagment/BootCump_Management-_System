const express = require("express");
<<<<<<< HEAD
const {verifyToken,restrictTo} = require("../middlewares/authMiddleware");
=======
const { verifyToken, restrictTo } = require("../middlewares/authMiddleware");
>>>>>>> origin/dashboard
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
<<<<<<< HEAD
const{
  gradeSubmission
}=require("../controllers/gradingController")
=======
>>>>>>> origin/dashboard

const router = express.Router();

router.post("/", verifyToken, restrictTo("Admin", "Mentor"), createAssignment);
router.get("/", verifyToken, getAssignments);
<<<<<<< HEAD
router.put("/:id", verifyToken, restrictTo("Admin", "Mentor"), updateAssignment);
router.delete("/:id", verifyToken, restrictTo("Admin", "Mentor"), deleteAssignment);
router.post("/submit", verifyToken, restrictTo("Student"), submitAssignment);
router.get("/:assignmentId/submissions", verifyToken, authorizeRoles("Admin", "Mentor"), getSubmissionsForAssignment);
router.get("/my-submissions", verifyToken, authorizeRoles("Student"), getMySubmissions);
router.post("/submit", verifyToken, restrictTo("Student"), submitAssignment);
router.get("/:assignmentId/submissions", verifyToken, restrictTo("Admin", "Mentor"), getSubmissionsForAssignment);
router.get("/my-submissions", verifyToken, restrictTo("Student"), getMySubmissions);
router.put("/submissions/:id/grade", verifyToken, restrictTo("Admin", "Mentor"), gradeSubmission);

module.exports = router;
=======
router.put(
  "/:id",
  verifyToken,
  restrictTo("Admin", "Mentor"),
  updateAssignment,
);
router.delete(
  "/:id",
  verifyToken,
  restrictTo("Admin", "Mentor"),
  deleteAssignment,
);

// Submissions
router.post(
  "/submit",
  verifyToken,
  authorizeRoles("Student"),
  submitAssignment,
);
router.get(
  "/:assignmentId/submissions",
  verifyToken,
  authorizeRoles("Admin", "Mentor"),
  getSubmissionsForAssignment,
);
router.get(
  "/my-submissions",
  verifyToken,
  authorizeRoles("Student"),
  getMySubmissions,
);
router.post("/submit", verifyToken, restrictTo("Student"), submitAssignment);
router.get(
  "/:assignmentId/submissions",
  verifyToken,
  restrictTo("Admin", "Mentor"),
  getSubmissionsForAssignment,
);
router.get(
  "/my-submissions",
  verifyToken,
  restrictTo("Student"),
  getMySubmissions,
);
//router.put(
  //"/submissions/:id/grade",
  //verifyToken,
  //restrictTo("Admin", "Mentor"),
  //gradeSubmission,
//);

module.exports = router;
>>>>>>> origin/dashboard
