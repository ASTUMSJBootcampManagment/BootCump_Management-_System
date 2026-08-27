const express = require("express");

const router = express.Router();

const {
  getNotifications,
  markNotificationAsRead,
} = require(
  "../controllers/notificationController"
);

const {
  verifyToken,
} = require(
  "../middlewares/authMiddleware"
);

router.get(
  "/",
  verifyToken,
  getNotifications
);

router.patch(
  "/:id/read",
  verifyToken,
  markNotificationAsRead
);

module.exports = router;