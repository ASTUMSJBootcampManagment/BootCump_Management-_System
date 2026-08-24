const express = require("express");
const router = express.Router();

const {
  createAnnouncement,
  getAnnouncements,
  deleteAnnouncement,
  updateAnnouncement
} = require("../controllers/AnnouncementController");

const { verifyToken, restrictTo } = require("../middlewares/authMiddleware");
router.use(verifyToken);
router.post("/create", restrictTo("Admin","Mentor"), createAnnouncement);
router.get("/get", restrictTo("Admin", "Mentor","Student"), getAnnouncements);
router.delete("/:id",restrictTo("Admin","Mentor"),deleteAnnouncement )
router.put("/:id", restrictTo("Admin", "Mentor"), updateAnnouncement);
module.exports = router;