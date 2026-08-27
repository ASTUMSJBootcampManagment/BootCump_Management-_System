const express = require("express");
const { createAnnouncement, getAnnouncements, deleteAnnouncement, updateAnnouncement } = require("../controllers/AnnouncementController");
const { verifyToken, restrictTo } = require("../middlewares/authMiddleware");

const router = express.Router();
router.use(verifyToken, restrictTo("Admin", "Mentor"));
router.post("/create", createAnnouncement);
router.get("/get", getAnnouncements);
router.put("/:id", updateAnnouncement);
router.delete("/:id", deleteAnnouncement);
module.exports = router;
