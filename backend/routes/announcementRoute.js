const express = require("express");
const router = express.Router();

const {
  createAnnouncement,
  getAnnouncements,
  deleteAnnouncement,
} = require("../controllers/AnnouncementController");

const { verifyToken, restrictTo } = require("../middlewares/authMiddleware");
router.use(verifyToken);
router.post("/create", restrictTo("Admin","Mentor"), createAnnouncement);
router.get("/get", restrictTo("Admin", "Mentor","Student"), getAnnouncements);
router.delete("/:id",restrictTo("Admin","Mentor"),deleteAnnouncement )
module.exports = router;