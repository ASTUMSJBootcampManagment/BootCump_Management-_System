const mongoose = require("mongoose");
const Attendance = require("../models/attendance");
const User = require("../models/userModel");

exports.markAttendance = async (req, res, next) => {
  try {
    const { student, status, date, batch } = req.body;

    if (!student || !status) {
      return res.status(400).json({
        success: false,
        message: "Student ID and status are required.",
      });
    }

    // Normalize date to start of day to prevent duplicate records for the same day
    const targetDate = date ? new Date(date) : new Date();
    targetDate.setHours(0, 0, 0, 0);

    const filter = {
      student,
      date: targetDate,
    };

    const update = {
      student,
      status,
      date: targetDate,
      ...(batch && { batch }),
    };

    // Upsert updates existing attendance or creates a new one
    const newAttendance = await Attendance.findOneAndUpdate(filter, update, {
      new: true,
      upsert: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Attendance marked successfully",
      data: newAttendance,
    });
  } catch (error) {
    next(error);
  }
};

exports.getAttendance = async (req, res, next) => {
  try {
    const attendance = await Attendance.find()
      .populate("student", "name email")
      .populate("batch", "batchName name");

    res.status(200).json({
      success: true,
      count: attendance.length,
      data: attendance,
    });
  } catch (error) {
    next(error);
  }
};

exports.getStudentAttendanceStats = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Student ID format",
      });
    }

    const stats = await Attendance.aggregate([
      {
        $match: {
          student: new mongoose.Types.ObjectId(studentId),
        },
      },
      {
        $group: {
          _id: "$student",
          totalClasses: { $sum: 1 },
          totalPresent: {
            $sum: {
              $cond: [
                { $eq: [{ $toLower: "$status" }, "present"] },
                1,
                0,
              ],
            },
          },
          totalAbsent: {
            $sum: {
              $cond: [
                { $eq: [{ $toLower: "$status" }, "absent"] },
                1,
                0,
              ],
            },
          },
          totalLate: {
            $sum: {
              $cond: [
                { $eq: [{ $toLower: "$status" }, "late"] },
                1,
                0,
              ],
            },
          },
        },
      },
      {
        $project: {
          _id: 1,
          totalClasses: 1,
          totalPresent: 1,
          totalAbsent: 1,
          totalLate: 1,
          percentage: {
            $round: [
              {
                $multiply: [
                  { $divide: ["$totalPresent", "$totalClasses"] },
                  100,
                ],
              },
              2,
            ],
          },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: stats[0] || {
        _id: studentId,
        totalClasses: 0,
        totalPresent: 0,
        totalAbsent: 0,
        totalLate: 0,
        percentage: 0,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteAllAttendance = async (req, res, next) => {
  try {
    await Attendance.deleteMany({});
    res.status(200).json({
      success: true,
      message: "All attendance records deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};