const mongoose = require("mongoose");
const Announcement = require("../models/announcement");
const User = require("../models/UserModel");
exports.createAnnouncement = async (req, res) => {
  try {
    const { title, content, announcementDate, announcedTo, batch } = req.body;

    const newAnnouncement = await Announcement.create({
      title,
      content,
      announcementDate,
      announcedTo,
      batch: batch || null,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Announcement created successfully",
      data: newAnnouncement,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
exports.getAnnouncements = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === "Student") {
      query = {
        $and: [
          { announcedTo: { $in: ["All", "Student"] } },
          {
            $or: [
              { batch: req.user.batch },
              { batch: { $exists: false } },
              { batch: null },
            ],
          },
        ],
      };
    } else if (req.user.role === "Mentor") {
      query = {
        announcedTo: { $in: ["All", "Mentor"] },
      };
    }

    const announcements = await Announcement.find(query)
      .populate("batch", "name year")
      .populate("createdBy", "name role email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: announcements.length,
      data: announcements,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.updateAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedAnnouncement = await Announcement.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedAnnouncement) {
      return res.status(404).json({
        success: false,
        message: "Announcement not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Announcement updated successfully",
      data: updatedAnnouncement,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
exports.deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedAnnouncement = await Announcement.findByIdAndDelete(id);

    if (!deletedAnnouncement) {
      return res.status(404).json({
        success: false,
        message: "Announcement not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Announcement deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};