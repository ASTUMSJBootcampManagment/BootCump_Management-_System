const express = require("express");
const router = express.Router();

const {
  getUsers,
  searchUsers,
  deleteUser,
  updateUserRole,
} = require("../controllers/userController");

const { verifyToken } = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");

// Apply authentication middleware globally to all routes below
router.use(verifyToken);

// =====================================================
// ADMIN USER MANAGEMENT
// =====================================================

// Get all users
router.get("/", authorizeRoles("Admin"), getUsers);

// Search / filter users
router.get("/search", authorizeRoles("Admin"), searchUsers);

// Change user role
router.patch("/:id/role", authorizeRoles("Admin"), updateUserRole);

// Delete user
router.delete("/:id", authorizeRoles("Admin"), deleteUser);

module.exports = router;