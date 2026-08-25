const express = require("express");

const router = express.Router();

const {
  verifyToken,
  restrictTo,
} = require("../middlewares/authMiddleware");

const studentController = require(
  "../controllers/studentController"
);

router.use(
  verifyToken,
  restrictTo("Student")
);

router.get(
  "/overview",
  studentController.getStudentOverview
);

router.get(
  "/attendance",
  studentController.getMyAttendance
);

router.get(
  "/progress",
  studentController.getMyProgress
);

router.get(
  "/assignments",
  studentController.getMyAssignments
);

router.post(
  "/assignments/submit",
  studentController.submitAssignment
);

router.get(
  "/announcements",
  studentController.getMyAnnouncements
);

router.patch(
  "/profile",
  studentController.updateMyProfile
);

router.patch(
  "/profile",
  verifyToken,
  restrictTo("Student"),
  async (req, res) => {
    try {
      const User = require("../models/userModel");

      const allowed = [
        "fullname",
        "phoneNumber",
        "githubAccount",
        "leetcodeAccount",
        "codeforcesAccount",
        "telegramUsername",
      ];

      const updates = {};

      allowed.forEach((field) => {
        if (req.body[field] !== undefined) {
          updates[field] =
            req.body[field];
        }
      });

      const user =
        await User.findByIdAndUpdate(
          req.user.id,
          updates,
          {
            new: true,
            runValidators: true,
          }
        ).select("-password");

      if (!user) {
        return res.status(404).json({
          message: "Student not found",
        });
      }

      res.json({
        success: true,
        message:
          "Profile updated successfully",
        data: user,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message:
          "Unable to update profile",
      });
    }
  }
);

module.exports = router;