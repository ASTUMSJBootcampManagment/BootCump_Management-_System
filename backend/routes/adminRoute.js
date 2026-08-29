const express = require("express");

const router = express.Router();

const {
  verifyToken,
  restrictTo,
} = require("../middlewares/authMiddleware");

const admin = require("../controllers/adminControllers");
const system = require("../controllers/systemController");



router.use(verifyToken);
router.use(restrictTo("Admin"));



router.get(
  "/applications",
  admin.getApplications
);

router.get(
  "/applications/:id",
  admin.getApplication
);


router.patch(
  "/students/:id/approve",
  admin.approveStudent
);

router.patch(
  "/students/:id/reject",
  admin.rejectStudent
);


router.post(
  "/mentors",
  admin.createMentor
);

router.patch(
  "/students/:id/mentor",
  admin.assignMentorToStudent
);


router.patch(
  "/batches/:id/mentor",
  admin.assignMentorToBatch
);


router.post(
  "/batches/:id/complete",
  admin.completeBatch
);

router.post(
  "/registration/open",
  system.openRegistration
);

router.post(
  "/registration/close",
  system.closeRegistration
);



router.get(
  "/users",
  admin.getUsers
);

module.exports = router;