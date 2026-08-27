const mongoose = require("mongoose");
const Announcement = require("../models/announcement");
const User = require("../models/userModel");
const Batch = require("../models/Batches");

exports.createAnnouncement = async (req, res, next) => {
  try {
    const { title, content, announcementDate, announcedTo, batch: requestedBatch } = req.body;
    const mentorBatch = req.user.role === "Mentor"
      ? await Batch.findOne({ mentors: req.user.id, status: "Active" })
      : null;
    if (req.user.role === "Mentor" && !mentorBatch) {
      return res.status(403).json({ success: false, message: "You are not assigned to an active batch." });
    }

    const newAnnouncement = await Announcement.create({
      title,
      content,
      announcementDate,
      announcedTo: req.user.role === "Mentor" ? "Student" : announcedTo || "All",
      batch: req.user.role === "Mentor" ? mentorBatch._id : requestedBatch || null,
      createdBy: req.user.id,
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
    const batch = req.user.role === "Mentor"
      ? await Batch.findOne({ mentors: req.user.id, status: "Active" })
      : null;
    if (req.user.role === "Mentor" && !batch) {
      return res.status(403).json({ success: false, message: "You are not assigned to an active batch." });
    }
    const query = req.user.role === "Mentor" ? { batch: batch._id, createdBy: req.user.id } : {};

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
      announcementDate,
    } = req.body;

    const mentorBatch = req.user.role === "Mentor" ? await Batch.findOne({ mentors: req.user.id, status: "Active" }) : null;
    const announcement = await Announcement.findOne(req.user.role === "Mentor"
      ? { _id: id, batch: mentorBatch?._id, createdBy: req.user.id }
      : { _id: id });

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: "Announcement not found.",
      });
    }

    if (title !== undefined) announcement.title = title;
    if (content !== undefined) announcement.content = content;
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

    const batch = req.user.role === "Mentor" ? await Batch.findOne({ mentors: req.user.id, status: "Active" }) : null;
    const deletedAnnouncement = await Announcement.findOneAndDelete(req.user.role === "Mentor"
      ? { _id: id, batch: batch?._id, createdBy: req.user.id }
      : { _id: id });

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
