const express = require("express");
const { verifyToken, restrictTo } = require("../middlewares/authMiddleware");
const { gradeSubmission } = require("../controllers/gradingController");
const router = express.Router();
router.patch("/:id", verifyToken, restrictTo("Admin", "Mentor"), gradeSubmission);
module.exports = router;
