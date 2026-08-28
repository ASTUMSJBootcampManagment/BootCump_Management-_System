const Announcement = require("../models/announcement");
const Batch = require("../models/Batches");

async function mentorCanAccessBatch(req, batchId) {
  if (req.user.role !== "Mentor") {
    return true;
  }

  if (!batchId) return false;

  return Boolean(
    await Batch.exists({
      _id: batchId,
      mentors: req.user._id,
    })
  );
}

exports.createAnnouncement = async (req, res, next) => {
  try {
    const {
      title,
      content,
      announcementDate,
      announcedTo = "Student",
      batch = null,
    } = req.body;

    if (!title?.trim() || !content?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Title and content are required.",
      });
    }

    if (
      req.user.role === "Mentor" &&
      !(await mentorCanAccessBatch(req, batch))
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You are not assigned to this batch.",
      });
    }

    if (req.user.role === "Mentor" && !batch) {
      return res.status(400).json({ success: false, message: "Mentors must select one of their assigned batches." });
    }

    if (req.user.role === "Mentor" && announcedTo !== "Student") {
      return res.status(400).json({ success: false, message: "Mentor announcements can only target students in their batch." });
    }

    const announcement =
      await Announcement.create({
        title: title.trim(),
        content: content.trim(),
        announcementDate:
          announcementDate || new Date(),
        announcedTo,
        batch: batch || null,
        createdBy: req.user._id,
      });

    res.status(201).json({
      success: true,
      data: announcement,
    });
  } catch (error) {
    next(error);
  }
};

exports.getAnnouncements = async (
  req,
  res,
  next
) => {
  try {
    let query = {};

    if (req.user.role === "Student") {
      query = {
        $and: [
          {
            announcedTo: {
              $in: ["All", "Student"],
            },
          },
          {
            $or: [
              {
                batch: req.user.assignedBatch,
              },
              {
                batch: null,
              },
            ],
          },
        ],
      };
    }

    if (req.user.role === "Mentor") {
      const mentorBatches =
        await Batch.find({
          mentors: req.user._id,
        }).distinct("_id");

      query = {
        $and: [
          {
            $or: [
              {
                announcedTo: {
                  $in: ["All", "Mentor"],
                },
              },
              {
                announcedTo: "Student",
              },
            ],
          },
          {
            $or: [
              {
                batch: {
                  $in: mentorBatches,
                },
              },
              {
                batch: null,
              },
            ],
          },
        ],
      };
    }

    const rows = await Announcement.find(
      query
    )
      .populate("batch", "name year")
      .populate(
        "createdBy",
        "fullname role"
      )
      .sort({
        announcementDate: -1,
      });

    res.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateAnnouncement = async (
  req,
  res,
  next
) => {
  try {
    const announcement =
      await Announcement.findById(
        req.params.id
      );

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message:
          "Announcement not found.",
      });
    }

    if (
      req.user.role === "Mentor" &&
      String(announcement.createdBy) !== String(req.user._id)
    ) {
      return res.status(403).json({ success: false, message: "You can only edit announcements you created." });
    }

    if (
      req.user.role === "Mentor" &&
      !(await mentorCanAccessBatch(
        req,
        announcement.batch
      ))
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied.",
      });
    }

    const allowed = [
      "title",
      "content",
      "batch",
      "announcedTo",
      "announcementDate",
    ];

    for (const key of allowed) {
      if (req.body[key] !== undefined) {
        announcement[key] =
          req.body[key];
      }
    }

    if (
      req.user.role === "Mentor" &&
      req.body.batch !== undefined &&
      !(await mentorCanAccessBatch(
        req,
        req.body.batch
      ))
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You are not assigned to the selected batch.",
      });
    }

    await announcement.save();

    res.json({
      success: true,
      data: announcement,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteAnnouncement = async (
  req,
  res,
  next
) => {
  try {
    const announcement =
      await Announcement.findById(
        req.params.id
      );

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message:
          "Announcement not found.",
      });
    }

    if (
      req.user.role === "Mentor" &&
      String(announcement.createdBy) !== String(req.user._id)
    ) {
      return res.status(403).json({ success: false, message: "You can only delete announcements you created." });
    }

    if (req.user.role === "Mentor" && req.body.announcedTo !== undefined && req.body.announcedTo !== "Student") {
      return res.status(400).json({ success: false, message: "Mentor announcements can only target students in their batch." });
    }

    if (
      req.user.role === "Mentor" &&
      !(await mentorCanAccessBatch(
        req,
        announcement.batch
      ))
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied.",
      });
    }

    await announcement.deleteOne();

    res.json({
      success: true,
      message:
        "Announcement deleted.",
    });
  } catch (error) {
    next(error);
  }
};
