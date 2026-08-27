const express = require("express");

const router = express.Router();

const {
  createResource,
  getResources,
  deleteResource,
} = require("../controllers/resourceController");

const {
  verifyToken,
  restrictTo,
} = require("../middlewares/authMiddleware");

router.use(verifyToken);

router.get(
  "/",
  restrictTo(
    "Admin",
    "Mentor",
    "Student"
  ),
  getResources
);

router.post(
  "/",
  restrictTo(
    "Admin",
    "Mentor"
  ),
  createResource
);

router.delete(
  "/:id",
  restrictTo("Admin", "Mentor"),
  deleteResource
);

module.exports = router;