const express = require("express");
const router = express.Router();

const { register } = require("../controllers/registrationController");
const { login } = require("../controllers/loginController");
const { getRegistrationStatus } = require("../controllers/systemController");
const { verifyToken, restrictTo } = require("../middlewares/authMiddleware");

// Public auth and status routes
router.get("/registration-status", getRegistrationStatus);
router.post("/register", register);
router.post("/login", login);

// Admin-only registration routes (commented out until needed)
// router.post("/updateRegistration/:id", verifyToken, restrictTo("Admin"), UpdateRegistrationStatus);

console.log("Register Controller:", register);
console.log("Login Controller:", login);

module.exports = router;