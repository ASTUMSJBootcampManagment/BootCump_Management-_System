const User = require("../models/userModel");

// =====================================================
// GET USERS
// GET /api/users
// Admin only
// =====================================================

const getUsers = async (req, res, next) => {
  try {
    const filter = {};

    if (req.query.role) {
      filter.role = req.query.role;
    }

    if (req.query.status) {
      filter.status = req.query.status;
    }

    const users = await User.find(filter)
      .select("-password")
      .populate(
        "assignedBatch",
        "name year status track"
      )
      .populate(
        "assignedMentor",
        "fullname email"
      )
      .populate(
        "appliedBatch",
        "name year status track"
      )
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
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
// GET /api/users/search?q=&role=&status=
// Admin only
// =====================================================

const searchUsers = async (
  req,
  res,
  next
) => {
  try {
    const {
      q = "",
      role,
      status,
    } = req.query;

    const filter = {};

    const search = q.trim();

    if (search) {
      filter.$or = [
        {
          fullname: {
            $regex: search,
            $options: "i",
          },
        },
        {
          email: {
            $regex: search,
            $options: "i",
          },
        },
        {
          universityId: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    if (role) {
      filter.role = role;
    }

    if (status) {
      filter.status = status;
    }

    const users = await User.find(filter)
      .select("-password")
      .populate(
        "assignedBatch",
        "name year status track"
      )
      .populate(
        "assignedMentor",
        "fullname email"
      )
      .populate(
        "appliedBatch",
        "name year status track"
      )
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    next(error);
  }
};

// =====================================================
// CREATE USER
// POST /api/users
// Admin only
// =====================================================

const createUser = async (
  req,
  res,
  next
) => {
  try {
    const {
      fullname,
      email,
      password,
      role,
      status,
    } = req.body;

    const allowedRoles = [
      "Admin",
      "Mentor",
      "Student",
    ];

    const allowedStatuses = [
      "pending",
      "approved",
      "rejected",
    ];

    if (!fullname?.trim()) {
      return res.status(400).json({
        success: false,
        message:
          "Full name is required.",
      });
    }

    if (!email?.trim()) {
      return res.status(400).json({
        success: false,
        message:
          "Email is required.",
      });
    }

    if (!password) {
      return res.status(400).json({
        success: false,
        message:
          "Password is required.",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message:
          "Password must contain at least 8 characters.",
      });
    }

    if (
      !role ||
      !allowedRoles.includes(role)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid role. Allowed roles are Admin, Mentor and Student.",
      });
    }

    const normalizedEmail =
      email.trim().toLowerCase();

    const existingUser =
      await User.findOne({
        email: normalizedEmail,
      });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message:
          "An account already exists with this email.",
      });
    }

    const userStatus =
      status &&
      allowedStatuses.includes(status)
        ? status
        : "approved";

    const user = await User.create({
      fullname: fullname.trim(),
      email: normalizedEmail,
      password,
      role,
      status: userStatus,
      verified: userStatus === "approved",
      applicationStatus:
        userStatus === "approved"
          ? "approved"
          : "waiting",
    });

    const safeUser =
      await User.findById(user._id)
        .select("-password")
        .populate(
          "assignedBatch",
          "name year status track"
        );

    return res.status(201).json({
      success: true,
      message:
        "User account created successfully.",
      user: safeUser,
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

const updateUserRole = async (
  req,
  res,
  next
) => {
  try {
    const {
      id,
    } = req.params;

    const {
      role,
    } = req.body;

    const allowedRoles = [
      "Admin",
      "Mentor",
      "Student",
    ];

    if (
      !role ||
      !allowedRoles.includes(role)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid role. Allowed roles are Admin, Mentor and Student.",
      });
    }

    // Prevent an admin from accidentally
    // removing their own admin access.

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

    const user =
      await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "User not found.",
      });
    }

    user.role = role;

    await user.save();

    const updatedUser =
      await User.findById(id)
        .select("-password")
        .populate(
          "assignedBatch",
          "name year status track"
        )
        .populate(
          "assignedMentor",
          "fullname email"
        );

    return res.status(200).json({
      success: true,
      message:
        "User role updated successfully.",
      user: updatedUser,
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

const deleteUser = async (
  req,
  res,
  next
) => {
  try {
    const {
      id,
    } = req.params;

    if (
      req.user &&
      req.user._id &&
      req.user._id.toString() === id
    ) {
      return res.status(400).json({
        success: false,
        message:
          "You cannot delete your own account.",
      });
    }

    const user =
      await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "User not found.",
      });
    }

    await User.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message:
        "User deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};


const getMentorStudents = async (req, res, next) => {
  try {
    const mentorId = req.user._id || req.user.id;

    // Fetch students assigned to this mentor via `assignedMentor`
    const students = await User.find({
      role: "Student",
      assignedMentor: mentorId,
    })
      .select("-password")
      .populate("assignedBatch", "name year status track")
      .populate("assignedMentor", "fullname email")
      .sort({ fullname: 1 });

    return res.status(200).json({
      success: true,
      count: students.length,
      users: students, 
      data: students,  
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  searchUsers,
  createUser,
  updateUserRole,
  deleteUser,
  getMentorStudents, 
};