const express = require("express");

const router = express.Router();

const {
  verifyToken,
  restrictTo,
} = require("../middlewares/authMiddleware");

const studentController =
  require("../controllers/studentController");

const {
  getResources,
} = require("../controllers/resourceController");

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

router.get(
  "/resources",
  getResources
);

router.patch(
  "/profile",
  studentController.updateMyProfile
);

module.exports = router;