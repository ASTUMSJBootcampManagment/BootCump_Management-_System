const Progress =
  require("../models/progress");

const Batch =
  require("../models/Batches");

const User =
  require("../models/userModel");
const { getMentorGroups, mentorCanAccessStudent } = require("../utils/groupAccess");

exports.createTopic = async (
  req,
  res
) => {
  try {
    const {
      topic,
      batchId,
    } = req.body;

    if (!topic) {
      return res.status(400).json({
        success: false,
        message:
          "Topic name is required.",
      });
    }

    const batches = batchId
      ? await Batch.find({
          _id: batchId,
        })
      : await Batch.find({
          status: {
            $ne: "Completed",
          },
        });

    let created = 0;

    for (const batch of batches) {
      const students =
        await User.find({
          _id: {
            $in: batch.students,
          },
          role: "Student",
        }).select("_id");

      for (const student of students) {
        const exists =
          await Progress.findOne({
            topic,
            batch: batch._id,
            student:
              student._id,
          });

        if (!exists) {
          await Progress.create({
            topic,
            batch: batch._id,
            group: batch.groups.find((group) => group.students.some((id) => String(id) === String(student._id)))?._id || null,
            student:
              student._id,
            status: "NotStarted",
          });

          created++;
        }
      }
    }

    return res.status(201).json({
      success: true,
      message:
        `Progress topic created for ${created} student records.`,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message:
        "Unable to create progress topic.",
    });
  }
};

exports.getProgress = async (
  req,
  res
) => {
  try {
    let studentId =
      req.params.StudentId;

    if (
      String(req.user.role) ===
      "Student"
    ) {
      studentId =
        req.user._id;
    }

    const records =
      await Progress.find({
        student: studentId,
      })
        .sort({
          createdAt: 1,
        })
        .lean();

    const completed =
      records.filter(
        (item) =>
          item.status ===
          "Completed"
      ).length;

    const completion =
      records.length
        ? Math.round(
            (completed /
              records.length) *
              100
          )
        : 0;

    return res.json({
      success: true,
      data: records,
      completion,
      completed,
      total: records.length,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message:
        "Unable to load progress.",
    });
  }
};

exports.updateProgress = async (
  req,
  res
) => {
  try {
    const studentId =
      req.params.StudentId;

    const {
      topic,
      status,
      notes,
    } = req.body;

    const statusMap = {
      "not started": "NotStarted",
      notstarted: "NotStarted",
      "in progress": "InProgress",
      inprogress: "InProgress",
      completed: "Completed",
      "needs improvement": "NeedsImprovement",
      needsimprovement: "NeedsImprovement",
    };
    const normalizedStatus = statusMap[String(status || "").toLowerCase()];

    if (!studentId || !normalizedStatus) {
      return res.status(400).json({
        success: false,
        message:
          "Student and status are required.",
      });
    }

    const student =
      await User.findById(
        studentId
      );

    if (!student) {
      return res.status(404).json({
        success: false,
        message:
          "Student not found.",
      });
    }

    if (
      req.user.role ===
      "Mentor" &&
      !(await mentorCanAccessStudent(req.user._id, studentId))
    ) {
      return res.status(403).json({
        success: false,
        message:
          "This student is not assigned to you.",
      });
    }

    let progress;

    if (topic) {
      progress =
        await Progress.findOneAndUpdate(
          {
            student:
              studentId,
            topic,
          },
          {
            status: normalizedStatus,
            notes:
              notes || "",
            updatedBy:
              req.user._id,
          },
          {
            new: true,
            upsert: false,
          }
        );
    } else {
      progress =
        await Progress.findOneAndUpdate(
          {
            student:
              studentId,
          },
          {
            status: normalizedStatus,
            notes:
              notes || "",
            updatedBy:
              req.user._id,
          },
          {
            new: true,
          }
        );
    }

    if (!progress) {
      return res.status(404).json({
        success: false,
        message:
          "Progress record not found.",
      });
    }

    return res.json({
      success: true,
      message:
        "Progress updated successfully.",
      data: progress,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message:
        "Unable to update progress.",
    });
  }
};

exports.getMentorStudentsProgress =
  async (req, res) => {
    try {
      const { batch, groups } = await getMentorGroups(req.user._id);
      const groupIds = groups.map((group) => group._id).filter(Boolean);

      if (!batch || !groupIds.length) {
        return res.json({
          success: true,
          data: [],
        });
      }

      const records =
        await Progress.find({
          batch: batch._id,
          group: { $in: groupIds },
          student: {
            $ne: null,
          },
        })
          .populate(
            "student",
            "fullname email"
          )
          .populate("batch", "name")
          .sort({
            student: 1,
            createdAt: 1,
          });

      return res.json({
        success: true,
        data: records,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message:
          "Unable to load student progress.",
      });
    }
  };
