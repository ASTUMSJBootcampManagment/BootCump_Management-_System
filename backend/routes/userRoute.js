const express = require("express");

const router = express.Router();

const {
  getUsers,
  searchUsers,
  createUser,
  deleteUser,
  updateUserRole,
  getMentorStudents,
} = require("../controllers/userController");

const { verifyToken } = require("../middlewares/authMiddleware");

const authorizeRoles = require("../middlewares/roleMiddleware");

// --------------------------------------------------
// ALL USER ROUTES REQUIRE AUTHENTICATION
// --------------------------------------------------

router.use(verifyToken);

// --------------------------------------------------
// ADMIN USER MANAGEMENT
// --------------------------------------------------

// Get all users
router.get("/", authorizeRoles("Admin"), getUsers);

// Search / filter users
router.get("/search", authorizeRoles("Admin"), searchUsers);

// Create user
router.post("/", authorizeRoles("Admin"), createUser);

// Change user role
router.patch("/:id/role", authorizeRoles("Admin"), updateUserRole);

// Delete user
router.delete("/:id", authorizeRoles("Admin"), deleteUser);
router.get(
  "/my-students",
  verifyToken,
  authorizeRoles("Mentor"),
  getMentorStudents,
);
module.exports = router;
