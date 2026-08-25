const express = require("express");
<<<<<<< HEAD
const {verifyToken} = require("../middlewares/authMiddleware");
=======
const { verifyToken } = require("../middlewares/authMiddleware");
>>>>>>> origin/dashboard
const authorizeRoles = require("../middlewares/roleMiddleware");
const { gradeSubmission } = require("../controllers/gradingController");

const router = express.Router();

<<<<<<< HEAD
router.put("/:id", verifyToken, authorizeRoles("Admin", "Mentor"), gradeSubmission);

module.exports = router;
=======
router.put(
  "/:id",
  verifyToken,
  authorizeRoles("Admin", "Mentor"),
  gradeSubmission,
);

module.exports = router;
>>>>>>> origin/dashboard
