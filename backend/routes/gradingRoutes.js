const express = require("express");
const protect = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");
const { gradeSubmission } = require("../controllers/gradingController");

const router = express.Router();

router.put("/:id", protect, authorizeRoles("Admin", "Mentor"), gradeSubmission);

module.exports = router;