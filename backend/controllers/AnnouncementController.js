const mongoose=require("mongoose")
const Announcement=require("../models/announcement");
const User = require("../models/userModel"); 

exports.createAnnouncement=async (req,res)=>{
    try{
        const {title,content,announcementDate,announcedTo,batch}=req.body
        const newBatch = await Announcement.create({
            title,
            content,
            announcementDate,
            announcedTo,
            batch
        });
        res.status(201).json({
            success: true,
            message: "Announcement created successfully",
            
         });
        } catch (error) {
            res.status(400).json({
                 success: false,
                 message: error.message,
    });
  }

    }
exports.getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find().populate("batch", "name year");
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
exports.updateAnnouncement =
  async (req, res, next) => {
    try {
      const { id } = req.params;

      const {
        title,
        content,
        batch,
        announcedTo,
        announcementDate,
      } = req.body;

      const announcement =
        await Announcement.findById(
          id
        );

      if (!announcement) {
        return res.status(404).json({
          success: false,
          message:
            "Announcement not found.",
        });
      }

      if (title !== undefined) {
        announcement.title =
          title;
      }

      if (content !== undefined) {
        announcement.content =
          content;
      }

      if (batch !== undefined) {
        announcement.batch =
          batch;
      }

      if (
        announcedTo !== undefined
      ) {
        announcement.announcedTo =
          announcedTo;
      }

      if (
        announcementDate !==
        undefined
      ) {
        announcement.announcementDate =
          announcementDate;
      }

      await announcement.save();

      res.status(200).json({
        success: true,
        message:
          "Announcement updated successfully.",
        announcement,
      });
    } catch (error) {
      next(error);
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
