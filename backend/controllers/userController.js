const User = require("../models/userModel");

// =====================================================
// GET USERS
// GET /api/users
// Admin only
// =====================================================
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    next(error);
  }
};

// =====================================================
// SEARCH / FILTER USERS
// GET /api/users/search?q=&role=
// Admin only
// =====================================================
const searchUsers = async (req, res, next) => {
  try {
    const { q = "", role } = req.query;

    const filter = {};

    if (q.trim()) {
      filter.$or = [
        {
          name: {
            $regex: q.trim(),
            $options: "i",
          },
        },
        {
          email: {
            $regex: q.trim(),
            $options: "i",
          },
        },
      ];
    }

    if (role) {
      filter.role = role;
    }

    const users = await User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    next(error);
  }
};

// =====================================================
// DELETE USER
// DELETE /api/users/:id
// Admin only
// =====================================================
const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (
      req.user &&
      req.user._id &&
      req.user._id.toString() === id
    ) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own account.",
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    await User.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "User deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};

// =====================================================
// UPDATE USER ROLE
// PATCH /api/users/:id/role
// Admin only
// =====================================================
const updateUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const allowedRoles = [
      "Admin",
      "Mentor",
      "Student",
    ];

    if (!role || !allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid role. Allowed roles are Admin, Mentor and Student.",
      });
    }

    if (
      req.user &&
      req.user._id &&
      req.user._id.toString() === id &&
      role !== "Admin"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "You cannot remove your own Admin role.",
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    user.role = role;

    await user.save();

    res.status(200).json({
      success: true,
      message: "User role updated successfully.",
      user: {
        ...user.toObject(),
        password: undefined,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  searchUsers,
  deleteUser,
  updateUserRole,
};