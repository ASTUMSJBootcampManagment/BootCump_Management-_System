const express = require("express");

const router = express.Router();

const {
  getDashboardStats,
} = require("../controllers/adminStatsControllers");

const {
  verifyToken,
} = require("../middlewares/authMiddleware");

const restrictTo = require("../middlewares/roleMiddleware");

router.get(
  "/dashboard-stats",
  verifyToken,
  restrictTo("Admin"),
  getDashboardStats
);

module.exports = router;