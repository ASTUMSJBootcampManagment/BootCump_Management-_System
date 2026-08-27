const User = require("../models/userModel");
const Batch = require("../models/Batches");
const Attendance = require("../models/attendance");
const Progress = require("../models/progress");
const Assignment = require("../models/assignmentModel");
const Submission = require("../models/submissionModel");
const Announcement = require("../models/announcement");

exports.getAdminDashboard = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({
      role: "Student",
    });
    const totalMentors = await User.countDocuments({
      role: "Mentor",
    });
    const activeBatches = await Batch.countDocuments({
      status: "Active",
    });

    const attendanceStats = await Attendance.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },

          present: {
            $sum: {
              $cond: [
                {
                  $in: ["$status", ["present", "late"]],
                },
                1,
                0,
              ],
            },
          },
        },
      },
    ]);

    let attendancePercentage = 0;
    if (attendanceStats.length > 0 && attendanceStats[0].total > 0) {
      attendancePercentage = Math.round(
        (attendanceStats[0].present / attendanceStats[0].total) * 100,
      );
    }

    const pendingGrades = await Submission.countDocuments({
      $or: [{ grade: { $exists: false } }, { grade: null }, { grade: "" }],
    });

    const attendanceOverview = await Attendance.aggregate([
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$date",
            },
          },

          present: {
            $sum: {
              $cond: [
                {
                  $in: ["$status", ["present", "late"]],
                },
                1,
                0,
              ],
            },
          },

          absent: {
            $sum: {
              $cond: [
                {
                  $eq: ["$status", "absent"],
                },
                1,
                0,
              ],
            },
          },
        },
      },

      {
        $sort: {
          _id: 1,
        },
      },

      {
        $limit: 30,
      },
    ]);

    const assignmentStats = await Submission.aggregate([
      {
        $group: {
          _id: null,

          total: {
            $sum: 1,
          },

          graded: {
            $sum: {
              $cond: [
                {
                  $and: [{ $ne: ["$grade", null] }, { $ne: ["$grade", ""] }],
                },
                1,
                0,
              ],
            },
          },

          pending: {
            $sum: {
              $cond: [
                {
                  $or: [{ $eq: ["$grade", null] }, { $eq: ["$grade", ""] }],
                },
                1,
                0,
              ],
            },
          },
        },
      },
    ]);

    const assignmentStatus = {
      total: assignmentStats[0]?.total || 0,
      graded: assignmentStats[0]?.graded || 0,
      pending: assignmentStats[0]?.pending || 0,
    };

    const batches = await Batch.find()
      .populate("mentors", "name email")
      .select("name batchName track status startDate students mentors")
      .lean();

    const batchData = batches.map((batch) => ({
      id: batch._id,
      name: batch.name,
      track: batch.track || "-",

      mentor:
        batch.mentors?.length > 0 ? batch.mentors[0].name : "Not assigned",

      students: batch.students?.length || 0,
      startDate: batch.startDate,
      status: batch.status || "Active",
    }));

    res.status(200).json({
      success: true,

      data: {
        summary: {
          students: totalStudents,
          mentors: totalMentors,
          activeBatches,
          attendance: attendancePercentage,
          pendingGrades,
        },
        attendanceOverview,
        assignmentStatus,
        batches: batchData,
      },
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getMentorDashboard = async (req, res) => {
  try {
    const mentorId = req.user.id;

    const mentorBatch = await Batch.findOne({
      mentors: mentorId,
    }).populate("students", "name email");

    if (!mentorBatch) {
      return res.status(404).json({
        success: false,
        message: "You are not assigned to any batch.",
      });
    }

    const studentIds = mentorBatch.students.map((student) => student._id);
    const studentCount = studentIds.length;
    const attendanceStats = await Attendance.aggregate([
      {
        $match: {
          batch: mentorBatch._id,
        },
      },

      {
        $group: {
          _id: null,

          total: {
            $sum: 1,
          },

          attended: {
            $sum: {
              $cond: [
                {
                  $in: ["$status", ["present", "late"]],
                },
                1,
                0,
              ],
            },
          },
        },
      },
    ]);

    let attendancePercentage = 0;

    if (attendanceStats.length > 0) {
      const total = attendanceStats[0].total;

      if (total > 0) {
        attendancePercentage = Math.round(
          (attendanceStats[0].attended / total) * 100,
        );
      }
    }

    const progressStats = await Progress.aggregate([
      {
        $match: {
          batch: mentorBatch._id,
        },
      },

      {
        $group: {
          _id: "$topic",

          completed: {
            $sum: {
              $cond: [
                {
                  $eq: ["$status", "Completed"],
                },
                1,
                0,
              ],
            },
          },

          total: {
            $sum: 1,
          },
        },
      },

      {
        $project: {
          _id: 0,
          topic: "$_id",

          percentage: {
            $cond: [
              {
                $gt: ["$total", 0],
              },

              {
                $multiply: [
                  {
                    $divide: ["$completed", "$total"],
                  },
                  100,
                ],
              },

              0,
            ],
          },
        },
      },
    ]);

    const studentAttendance = await Attendance.aggregate([
      {
        $match: {
          batch: mentorBatch._id,
        },
      },

      {
        $group: {
          _id: "$student",

          total: {
            $sum: 1,
          },

          attended: {
            $sum: {
              $cond: [
                {
                  $in: ["$status", ["present", "late"]],
                },
                1,
                0,
              ],
            },
          },
        },
      },

      {
        $project: {
          student: "$_id",

          percentage: {
            $multiply: [
              {
                $divide: ["$attended", "$total"],
              },
              100,
            ],
          },
        },
      },
      {
        $match: {
          percentage: {
            $lt: 75,
          },
        },
      },
    ]);

    const atRiskIds = studentAttendance.map((student) => student.student);
    const atRiskStudents = await User.find({
      _id: { $in: atRiskIds },
    }).select("name email").lean();

    const attendanceByStudent = new Map(
      studentAttendance.map((item) => [item.student.toString(), Math.round(item.percentage)]),
    );
    const atRiskStudentsWithAttendance = atRiskStudents.map((student) => ({
      ...student,
      attendance: attendanceByStudent.get(student._id.toString()) || 0,
    }));
    const progressByStudent = await Progress.aggregate([
      { $match: { batch: mentorBatch._id, student: { $in: studentIds } } },
      {
        $group: {
          _id: "$student",
          total: { $sum: 1 },
          completed: { $sum: { $cond: [{ $eq: ["$status", "Completed"] }, 1, 0] } },
        },
      },
    ]);
    const progressLookup = new Map(
      progressByStudent.map((item) => [
        item._id.toString(),
        item.total ? Math.round((item.completed / item.total) * 100) : 0,
      ]),
    );
    const students = mentorBatch.students.map((student) => {
      const attendance = attendanceByStudent.get(student._id.toString()) || 0;
      const progress = progressLookup.get(student._id.toString()) || 0;
      return {
        _id: student._id,
        name: student.name,
        email: student.email,
        attendance,
        progress,
        status: attendance < 75 ? "At Risk" : attendance < 85 ? "Warning" : "Good",
      };
    });

    const pendingReviews = await Submission.countDocuments({
      student: { $in: studentIds },

      $or: [{ grade: { $exists: false } }, { grade: null }, { grade: "" }],
    });

    const recentSubmissions = await Submission.find({
      student: { $in: studentIds },
    })
      .populate("student", "name email")
      .populate("assignment", "title dueDate")
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    const upcomingAssignments = await Assignment.find({
      dueDate: {
        $gte: new Date(),
      },
    })
      .sort({ dueDate: 1 })
      .limit(5)
      .select("title dueDate")
      .lean();

    res.status(200).json({
      success: true,

      data: {
        summary: {
          students: studentCount,
          attendance: attendancePercentage,
          atRisk: atRiskStudents.length,
          pendingReviews,
        },

        studentProgress: progressStats,
        students,
        atRiskStudents: atRiskStudentsWithAttendance,
        recentSubmissions,
        upcomingAssignments,
        batch: {
          id: mentorBatch._id,
          name: mentorBatch.batchName || mentorBatch.name,
        },
      },
    });
  } catch (error) {
    console.error("Mentor dashboard error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getStudentDashboard = async (req, res) => {
  try {
    const studentId = req.user.id;
    const attendanceStats = await Attendance.aggregate([
      {
        $match: {
          student: studentId,
        },
      },

      {
        $group: {
          _id: null,

          total: {
            $sum: 1,
          },

          attended: {
            $sum: {
              $cond: [
                {
                  $in: ["$status", ["present", "late"]],
                },
                1,
                0,
              ],
            },
          },
        },
      },
    ]);

    let attendancePercentage = 0;

    if (attendanceStats.length > 0) {
      const total = attendanceStats[0].total;

      if (total > 0) {
        attendancePercentage = Math.round(
          (attendanceStats[0].attended / total) * 100,
        );
      }
    }

    const progressStats = await Progress.aggregate([
      {
        $match: {
          student: studentId,
        },
      },

      {
        $group: {
          _id: null,

          total: {
            $sum: 1,
          },

          completed: {
            $sum: {
              $cond: [
                {
                  $eq: ["$status", "Completed"],
                },
                1,
                0,
              ],
            },
          },
        },
      },
    ]);

    let progressPercentage = 0;

    if (progressStats.length > 0) {
      const total = progressStats[0].total;
      if (total > 0) {
        progressPercentage = Math.round(
          (progressStats[0].completed / total) * 100,
        );
      }
    }

    const submissions = await Submission.find({
      student: studentId,
    })
      .populate("assignment", "title dueDate")
      .sort({ createdAt: -1 })
      .lean();

    const submittedAssignmentIds = submissions
      .map((submission) => submission.assignment?._id?.toString())
      .filter(Boolean);

    const pendingAssignments = await Assignment.find({
      _id: {
        $nin: submittedAssignmentIds,
      },

      dueDate: {
        $gte: new Date(),
      },
    })
      .sort({ dueDate: 1 })
      .limit(5)
      .select("title dueDate")
      .lean();

    const gradedSubmissions = submissions.filter(
      (submission) =>
        submission.grade !== undefined &&
        submission.grade !== null &&
        submission.grade !== "",
    );

    let overallGrade = null;

    if (gradedSubmissions.length > 0) {
      const numericGrades = gradedSubmissions
        .map((submission) => Number(submission.grade))
        .filter((grade) => !Number.isNaN(grade));

      if (numericGrades.length > 0) {
        const average =
          numericGrades.reduce((sum, grade) => sum + grade, 0) /
          numericGrades.length;

        overallGrade = Math.round(average);
      }
    }

    const progressTrend = await Progress.find({
      student: studentId,
    })
      .sort({ _id: 1 })
      .select("topic status")
      .lean();

    const announcements = await Announcement.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    res.status(200).json({
      success: true,

      data: {
        summary: {
          attendance: attendancePercentage,
          progress: progressPercentage,
          assignmentsPending: pendingAssignments.length,
          overallGrade,
        },

        progressTrend,
        upcomingDeadlines: pendingAssignments,
        announcements,
        grades: gradedSubmissions,
      },
    });
  } catch (error) {
    console.error("Student dashboard error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
