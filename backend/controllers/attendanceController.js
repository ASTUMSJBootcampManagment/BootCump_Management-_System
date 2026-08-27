const mongoose = require("mongoose");
const Attendance = require("../models/attendance");
const User = require("../models/userModel");
const Batch = require("../models/Batches");

exports.markAttendance = async (req, res, next) => {
  try {
    const { student, status, date } = req.body;
    const batch = await Batch.findOne({ mentors: req.user.id, status: "Active" });
    if (!batch) {
      return res.status(403).json({ success: false, message: "You are not assigned to an active batch." });
    }
    if (!batch.students.some((studentId) => studentId.equals(student))) {
      return res.status(403).json({ success: false, message: "This student is not assigned to your batch." });
    }

    const attendanceDate = new Date(date || Date.now());
    attendanceDate.setHours(0, 0, 0, 0);
    const newAttendance = await Attendance.findOneAndUpdate(
      { student, batch: batch._id, date: attendanceDate },
      { status, date: attendanceDate },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true },
    );

    res.status(201).json({
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
    const batch = await Batch.findOne({ mentors: req.user.id, status: "Active" });
    if (!batch) {
      return res.status(403).json({ success: false, message: "You are not assigned to an active batch." });
    }
    const attendance = await Attendance.find({ batch: batch._id })
      .populate("student", "name email")
      .populate("batch", "name");

    res.status(200).json({
      success: true,
      count: attendance.length,
      data: attendance,
    });
  } catch (error) {
   next(error);
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
    next(error);
  }
};
