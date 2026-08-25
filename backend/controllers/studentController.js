const mongoose = require("mongoose");

const User = require("../models/userModel");
const Batch = require("../models/Batches");
const Attendance = require("../models/attendance");
const Progress = require("../models/progress");
const Assignment = require("../models/assignmentModel");
const Submission = require("../models/submissionModel");
const Announcement = require("../models/announcement");

const getStudentBatch = async (studentId) => {
  return Batch.findOne({
    students: studentId,
  }).lean();
};

/*
|--------------------------------------------------------------------------
| Student Dashboard
|--------------------------------------------------------------------------
*/

exports.getStudentOverview = async (req, res, next) => {
  try {
    const studentId = req.user._id;

    const batch = await getStudentBatch(studentId);

    const [
      attendance,
      progress,
      submissions,
      assignments,
      announcements,
    ] = await Promise.all([
      Attendance.find({
        student: studentId,
      })
        .sort({ date: -1 })
        .lean(),

      Progress.find({
        student: studentId,
      })
        .sort({ topic: 1 })
        .lean(),

      Submission.find({
        student: studentId,
      })
        .populate("assignment", "title dueDate description")
        .sort({ createdAt: -1 })
        .lean(),

      Assignment.find({
        $or: [
          { batch: batch?._id },
          { batch: null },
          { batch: { $exists: false } },
        ],
      })
        .sort({ dueDate: 1 })
        .lean(),

      Announcement.find({
        $and: [
          {
            announcedTo: {
              $in: ["All", "Student"],
            },
          },

          {
            $or: [
              { batch: batch?._id },
              { batch: null },
              { batch: { $exists: false } },
            ],
          },
        ],
      })
        .populate("createdBy", "fullname name")
        .sort({ createdAt: -1 })
        .limit(6)
        .lean(),
    ]);

    const attended = attendance.filter((item) =>
      ["present", "late"].includes(
        String(item.status).toLowerCase()
      )
    ).length;

    const attendancePercentage = attendance.length
      ? Math.round((attended / attendance.length) * 100)
      : 0;

    const completed = progress.filter(
      (item) => item.status === "Completed"
    ).length;

    const progressPercentage = progress.length
      ? Math.round((completed / progress.length) * 100)
      : 0;

    const submissionMap = new Map(
      submissions.map((submission) => [
        String(submission.assignment?._id),
        submission,
      ])
    );

    const pendingAssignments = assignments.filter(
      (assignment) =>
        !submissionMap.has(String(assignment._id)) &&
        new Date(assignment.dueDate) >= new Date()
    );

    const graded = submissions.filter(
      (submission) =>
        submission.grade !== null &&
        submission.grade !== undefined &&
        submission.grade !== ""
    );

    const numericGrades = graded
      .map((submission) => Number(submission.grade))
      .filter(Number.isFinite);

    const averageGrade = numericGrades.length
      ? Math.round(
          numericGrades.reduce((a, b) => a + b, 0) /
            numericGrades.length
        )
      : null;

    res.json({
      success: true,

      data: {
        student: {
          id: req.user._id,
          name:
            req.user.fullname ||
            req.user.name ||
            "Student",
          email: req.user.email,
          role: req.user.role,
        },

        batch,

        summary: {
          attendance: attendancePercentage,
          progress: progressPercentage,
          pendingAssignments: pendingAssignments.length,
          averageGrade,

          attended,

          totalSessions: attendance.length,

          completedTopics: completed,

          totalTopics: progress.length,
        },

        progress,

        upcomingDeadlines:
          pendingAssignments.slice(0, 5),

        announcements,

        submissions:
          submissions.slice(0, 10),
      },
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| Attendance
|--------------------------------------------------------------------------
*/

exports.getMyAttendance = async (
  req,
  res,
  next
) => {
  try {
    const records = await Attendance.find({
      student: req.user._id,
    })
      .sort({ date: -1 })
      .lean();

    const present = records.filter(
      (item) => item.status === "present"
    ).length;

    const late = records.filter(
      (item) => item.status === "late"
    ).length;

    const excused = records.filter(
      (item) => item.status === "excused"
    ).length;

    const absent = records.filter(
      (item) => item.status === "absent"
    ).length;

    const percentage = records.length
      ? Math.round(
          ((present + late) / records.length) * 100
        )
      : 0;

    res.json({
      success: true,

      data: {
        records,

        stats: {
          present,
          late,
          excused,
          absent,
          total: records.length,
          percentage,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| Progress
|--------------------------------------------------------------------------
*/

exports.getMyProgress = async (
  req,
  res,
  next
) => {
  try {
    const records = await Progress.find({
      student: req.user._id,
    })
      .sort({ topic: 1 })
      .lean();

    const completed = records.filter(
      (item) => item.status === "Completed"
    ).length;

    const completion = records.length
      ? Math.round(
          (completed / records.length) * 100
        )
      : 0;

    res.json({
      success: true,

      data: {
        records,

        completion,

        completed,

        total: records.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| Assignments
|--------------------------------------------------------------------------
*/

exports.getMyAssignments = async (
  req,
  res,
  next
) => {
  try {
    const batch = await getStudentBatch(
      req.user._id
    );

    const [
      assignments,
      submissions,
    ] = await Promise.all([
      Assignment.find({
        $or: [
          { batch: batch?._id },
          { batch: null },
          { batch: { $exists: false } },
        ],
      })
        .populate(
          "createdBy",
          "fullname name email"
        )
        .sort({ dueDate: 1 })
        .lean(),

      Submission.find({
        student: req.user._id,
      })
        .sort({ createdAt: -1 })
        .lean(),
    ]);

    const submissionMap = new Map(
      submissions.map((submission) => [
        String(submission.assignment),
        submission,
      ])
    );

    const data = assignments.map(
      (assignment) => {
        const submission =
          submissionMap.get(
            String(assignment._id)
          );

        let status = "Pending Submission";

        if (submission) {
          status =
            submission.grade !== null &&
            submission.grade !== undefined
              ? "Graded"
              : "Under Review";
        } else if (
          new Date(assignment.dueDate) <
          new Date()
        ) {
          status = "Overdue";
        }

        return {
          ...assignment,

          submission: submission || null,

          status,
        };
      }
    );

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| Submit / Update Assignment
|--------------------------------------------------------------------------
*/

exports.submitAssignment = async (
  req,
  res,
  next
) => {
  try {
    const {
      assignmentId,
      githubUrl = "",
      liveUrl = "",
      notes = "",
    } = req.body;

    if (
      !mongoose.Types.ObjectId.isValid(
        assignmentId
      )
    ) {
      return res.status(400).json({
        message: "Invalid assignment ID",
      });
    }

    const assignment =
      await Assignment.findById(
        assignmentId
      ).lean();

    if (!assignment) {
      return res.status(404).json({
        message: "Assignment not found",
      });
    }

    const batch = await getStudentBatch(
      req.user._id
    );

    if (
      assignment.batch &&
      (
        !batch ||
        String(assignment.batch) !==
          String(batch._id)
      )
    ) {
      return res.status(403).json({
        message:
          "This assignment is not assigned to your batch",
      });
    }

    const content = JSON.stringify({
      githubUrl,
      liveUrl,
      notes,
    });

    const submission =
      await Submission.findOneAndUpdate(
        {
          assignment: assignmentId,
          student: req.user._id,
        },

        {
          assignment: assignmentId,

          student: req.user._id,

          content,

          githubUrl,

          liveUrl,

          notes,

          status: "Submitted",

          resubmissionRequested: false,
        },

        {
          upsert: true,

          new: true,

          setDefaultsOnInsert: true,

          runValidators: true,
        }
      );

    res.status(200).json({
      success: true,

      message:
        "Assignment submitted successfully",

      data: submission,
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| Announcements
|--------------------------------------------------------------------------
*/

exports.getMyAnnouncements = async (
  req,
  res,
  next
) => {
  try {
    const batch = await getStudentBatch(
      req.user._id
    );

    const announcements =
      await Announcement.find({
        announcedTo: {
          $in: ["All", "Student"],
        },

        $or: [
          { batch: batch?._id },
          { batch: null },
          { batch: { $exists: false } },
        ],
      })
        .populate(
          "createdBy",
          "fullname name role"
        )
        .sort({ createdAt: -1 })
        .lean();

    res.json({
      success: true,

      data: announcements,
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| Student Profile
|--------------------------------------------------------------------------
*/

exports.updateMyProfile = async (
  req,
  res,
  next
) => {
  try {
    const allowedFields = [
      "fullname",
      "phoneNumber",
      "githubAccount",
      "leetcodeAccount",
      "codeforcesAccount",
      "telegramUsername",
    ];

    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] =
          String(req.body[field]).trim();
      }
    });

    if (!Object.keys(updates).length) {
      return res.status(400).json({
        message:
          "No profile fields supplied",
      });
    }

    const student =
      await User.findByIdAndUpdate(
        req.user._id,
        updates,
        {
          new: true,
          runValidators: true,
        }
      ).select("-password");

    res.json({
      success: true,

      message:
        "Profile updated successfully",

      data: student,
    });
  } catch (error) {
    next(error);
  }
};