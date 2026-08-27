const express = require("express");

const router = express.Router();

const {
  register,
} = require("../controllers/registrationController");

const {
  login,
} = require("../controllers/loginController");

const {
  getRegistrationStatus,
} = require("../controllers/systemController");

const {
  changePassword,
} = require("../controllers/authController");

const {
  verifyToken,
} = require("../middlewares/authMiddleware");

router.get(
  "/registration-status",
  getRegistrationStatus
);

router.post(
  "/register",
  register
);

router.post(
  "/login",
  login
);

router.patch(
  "/change-password",
  verifyToken,
  changePassword
);

module.exports = router;