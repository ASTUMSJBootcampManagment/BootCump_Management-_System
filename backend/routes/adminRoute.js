const express = require("express");

const router = express.Router();

const { approveStudent } = require("../controllers/adminController");

const { verifyToken, restrictTo } = require("../middleware/authMiddleware");

router.patch(
  "/students/:id/approve",
  verifyToken,
  restrictTo("Admin"),
  approveStudent,
);

module.exports = router;
