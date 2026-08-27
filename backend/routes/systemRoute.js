const express = require("express");

const router = express.Router();

const {
  openRegistration,
  closeRegistration,
} = require("../controllers/systemController");

const {
  verifyToken,
  restrictTo,
} = require("../middlewares/authMiddleware");

router.use(
  verifyToken,
  restrictTo("Admin")
);

router.post(
  "/registration/open",
  openRegistration
);

router.post(
  "/registration/close",
  closeRegistration
);

module.exports = router;