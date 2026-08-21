const mongoose = require("mongoose");
const Attendance = require("../models/attendance");
const User = require("../models/UserModel");

exports.markAttendance = async (req, res) => {
  try {
    const { student, batch, status, date } = req.body;
    const newAttendance = await Attendance.create({
      student,
      batch,
      status,
      date: date || Date.now(),
    });

    res.status(201).json({
      success: true,
      message: "Attendance marked successfully",
      data: newAttendance,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find()
      .populate("student", "name email")
      .populate("batch", "batchName");

    res.status(200).json({
      success: true,
      count: attendance.length,
      data: attendance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getStudentAttendanceStats = async (req, res) => {
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
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
