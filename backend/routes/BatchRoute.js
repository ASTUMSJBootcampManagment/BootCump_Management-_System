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
  setBatchGroups,
  getMyGroups,
} = require("../controllers/BatchController");

const {
  verifyToken,
  restrictTo,
} = require("../middlewares/authMiddleware");

router.use(verifyToken);

router.get("/my-groups", restrictTo("Mentor"), getMyGroups);

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

router.put("/:id/groups", restrictTo("Admin"), setBatchGroups);

module.exports = router;
