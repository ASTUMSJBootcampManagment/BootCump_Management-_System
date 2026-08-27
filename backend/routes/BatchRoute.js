const express = require("express");

const router = express.Router();

const {
  createBatch,
  getAllBatches,
  getBatchById,
  updateBatch,
  deleteBatch,
  assignMentorToBatch,
  enrollStudentInBatch,
  completeBatch,
} = require("../controllers/BatchController");

const {
  verifyToken,
  restrictTo,
} = require("../middlewares/authMiddleware");

router.use(verifyToken);

router
  .route("/")
  .post(
    restrictTo("Admin"),
    createBatch
  )
  .get(
    restrictTo(
      "Admin",
      "Mentor"
    ),
    getAllBatches
  );

router
  .route("/:id")
  .get(
    restrictTo(
      "Admin",
      "Mentor",
      "Student"
    ),
    getBatchById
  )
  .put(
    restrictTo("Admin"),
    updateBatch
  )
  .delete(
    restrictTo("Admin"),
    deleteBatch
  );

router.post(
  "/:id/mentors",
  restrictTo("Admin"),
  assignMentorToBatch
);

router.post(
  "/:id/enroll",
  restrictTo("Admin"),
  enrollStudentInBatch
);

router.post(
  "/:id/complete",
  restrictTo("Admin"),
  completeBatch
);

module.exports = router;