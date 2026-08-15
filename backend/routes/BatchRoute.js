const express = require("express");
const router = express.Router();

const {
  createBatch,
  getAllBatches,
  assignMentor,
  enrollStudents,
} = require("../controllers/BatchController");

const { verifyToken, restrictTo } = require("../middlewares/authMiddleware");
router.use(verifyToken);
router.post("/", restrictTo("Admin"), createBatch);
router.get("/", restrictTo("Admin", "Mentor"), getAllBatches);
router.put("/:batchId/assign-mentor", restrictTo("Admin"), assignMentor);
router.put("/:batchId/enroll-student", restrictTo("Admin"), enrollStudents);

module.exports = router;