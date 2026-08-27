const express = require("express");

const router = express.Router();

const {
  verifyToken,
  restrictTo,
} = require("../middlewares/authMiddleware");

const admin = require("../controllers/adminControllers");
const system = require("../controllers/systemController");

/*
|--------------------------------------------------------------------------
| ADMIN PROTECTION
|--------------------------------------------------------------------------
*/

router.use(verifyToken);
router.use(restrictTo("Admin"));

/*
|--------------------------------------------------------------------------
| APPLICATIONS
|--------------------------------------------------------------------------
*/

router.get(
  "/applications",
  admin.getApplications
);

router.get(
  "/applications/:id",
  admin.getApplication
);

/*
|--------------------------------------------------------------------------
| STUDENT APPLICATION DECISIONS
|--------------------------------------------------------------------------
*/

router.patch(
  "/students/:id/approve",
  admin.approveStudent
);

router.patch(
  "/students/:id/reject",
  admin.rejectStudent
);

/*
|--------------------------------------------------------------------------
| MENTOR MANAGEMENT
|--------------------------------------------------------------------------
*/

router.post(
  "/mentors",
  admin.createMentor
);

router.patch(
  "/students/:id/mentor",
  admin.assignMentorToStudent
);

/*
|--------------------------------------------------------------------------
| BATCH / MENTOR RELATIONSHIPS
|--------------------------------------------------------------------------
*/

router.patch(
  "/batches/:id/mentor",
  admin.assignMentorToBatch
);

/*
|--------------------------------------------------------------------------
| BATCH COMPLETION
|--------------------------------------------------------------------------
*/

router.post(
  "/batches/:id/complete",
  admin.completeBatch
);

/*
|--------------------------------------------------------------------------
| REGISTRATION CONTROL
|--------------------------------------------------------------------------
*/

router.post(
  "/registration/open",
  system.openRegistration
);

router.post(
  "/registration/close",
  system.closeRegistration
);

/*
|--------------------------------------------------------------------------
| ADMIN USERS
|--------------------------------------------------------------------------
|
| The frontend uses:
|
| /admin/users?role=Mentor
| /admin/users?role=Student
|
*/

router.get(
  "/users",
  admin.getUsers
);

module.exports = router;