const express = require("express");
const {verifyToken} = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");
const { gradeSubmission } = require("../controllers/gradingController");

const router = express.Router();

router.put("/:id", verifyToken, authorizeRoles("Admin", "Mentor"), gradeSubmission);

module.exports = router;