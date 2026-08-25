const mongoose = require("mongoose");
const Announcement = require("../models/announcement");
const User = require("../models/userModel");

exports.createAnnouncement = async (req, res, next) => {
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
    next(error);
  }
};

exports.getAnnouncements = async (req, res, next) => {
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
    next(error);
  }
};

exports.updateAnnouncement = async (req, res, next) => {
  try {
    const { id } = req.params;

    const {
      title,
      content,
      batch,
      announcedTo,
      announcementDate,
    } = req.body;

    const announcement = await Announcement.findById(id);

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: "Announcement not found.",
      });
    }

    if (title !== undefined) announcement.title = title;
    if (content !== undefined) announcement.content = content;
    if (batch !== undefined) announcement.batch = batch;
    if (announcedTo !== undefined) announcement.announcedTo = announcedTo;
    if (announcementDate !== undefined) announcement.announcementDate = announcementDate;

    await announcement.save();

    res.status(200).json({
      success: true,
      message: "Announcement updated successfully.",
      announcement,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteAnnouncement = async (req, res, next) => {
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
    next(error);
  }
};