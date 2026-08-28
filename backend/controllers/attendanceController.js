const mongoose = require("mongoose");
const Attendance = require("../models/attendance");
const User = require("../models/userModel");
const { getMentorGroups, mentorCanAccessStudent } = require("../utils/groupAccess");

const STATUSES = ["present", "absent", "late", "excused"];

exports.getMentorStudents = async (req, res, next) => {
  try {
    const { batch, groups } = await getMentorGroups(req.user._id);
    if (!batch || !groups.length) return res.json({ success: true, data: [] });

    // Map all student IDs across assigned groups
    const groupMap = new Map();
    const allStudentIds = [];

    groups.forEach((group) => {
      (group.students || []).forEach((studentId) => {
        const idStr = String(studentId);
        allStudentIds.push(studentId);
        groupMap.set(idStr, { _id: group._id, name: group.name });
      });
    });

    if (!allStudentIds.length) return res.json({ success: true, data: [] });

    // Batch query all students at once instead of per-item queries
    const studentDocs = await User.find({ _id: { $in: allStudentIds } })
      .select("fullname email assignedBatch appliedBatch")
      .lean();

    const students = studentDocs.map((student) => ({
      ...student,
      batch: { _id: batch._id, name: batch.name },
      group: groupMap.get(String(student._id)) || null,
    }));

    res.json({ success: true, data: students });
  } catch (error) {
    next(error);
  }
};

exports.getAttendanceHistory = async (req, res, next) => {
  try {
    const query = {};

    if (req.query.date) {
      const date = String(req.query.date).slice(0, 10);
      query.date = {
        $gte: new Date(`${date}T00:00:00.000Z`),
        $lte: new Date(`${date}T23:59:59.999Z`),
      };
    }

    if (req.user.role === "Admin") {
      if (req.query.batch) query.batch = req.query.batch;
      if (req.query.group) query.group = req.query.group;
    } else {
      const { batch, groups } = await getMentorGroups(req.user._id);
      if (!batch) return res.json({ success: true, data: [] });

      const groupIds = groups.map((group) => group._id).filter(Boolean);
      if (
        req.query.group &&
        !groupIds.some((id) => String(id) === String(req.query.group))
      ) {
        return res
          .status(403)
          .json({
            success: false,
            message: "You can only view your assigned groups.",
          });
      }

      query.batch = batch._id;
      query.group = req.query.group || { $in: groupIds };
    }

    const rows = await Attendance.find(query)
      .populate("student", "fullname email")
      .sort({ date: -1, createdAt: -1 });

    res.json({ success: true, data: rows });
  } catch (error) {
    next(error);
  }
};

exports.markAttendance = async (req, res, next) => {
  try {
    const { date, group, records } = req.body;

    if (!date || !Array.isArray(records) || !records.length) {
      return res.status(400).json({
        success: false,
        message: "Date and attendance records are required.",
      });
    }

    const { batch, groups } = await getMentorGroups(req.user._id);
    let targetGroup = null;

    if (group) {
      targetGroup = groups.find((item) => String(item._id) === String(group));
    } else if (groups.length > 0) {
      targetGroup = groups[0]; // Fallback to first mentor group if group ID omitted
    }

    if (!batch || !targetGroup) {
      return res.status(403).json({
        success: false,
        message: "You can only manage attendance for your assigned group.",
      });
    }

    const studentIds = new Set((targetGroup.students || []).map(String));
    const sessionDate = new Date(
      `${String(date).slice(0, 10)}T12:00:00.000Z`
    );

    const operations = records
      .map(({ student, status }) => {
        const normalized = String(status || "").toLowerCase();
        if (!studentIds.has(String(student)) || !STATUSES.includes(normalized)) {
          return null;
        }
        return {
          updateOne: {
            filter: {
              student,
              batch: batch._id,
              group: targetGroup._id,
              date: sessionDate,
            },
            update: {
              $set: {
                student,
                batch: batch._id,
                group: targetGroup._id,
                date: sessionDate,
                status: normalized,
              },
            },
            upsert: true,
          },
        };
      })
      .filter(Boolean);

    if (operations.length === 0) {
      return res.status(400).json({
        success: false,
        message:
          "No valid attendance records matching your group students were provided.",
      });
    }

    await Attendance.bulkWrite(operations);

    const saved = await Attendance.find({
      batch: batch._id,
      group: targetGroup._id,
      date: sessionDate,
    }).populate("student", "fullname email");

    res.json({
      success: true,
      message: "Attendance saved successfully.",
      data: saved,
    });
  } catch (error) {
    next(error);
  }
};

exports.getStudentAttendanceStats = async (req, res, next) => {
  try {
    const studentId =
      req.user.role === "Student" ? req.user._id : req.params.studentId;

    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid student ID." });
    }

    if (
      req.user.role === "Mentor" &&
      !(await mentorCanAccessStudent(req.user._id, studentId))
    ) {
      return res.status(403).json({
        success: false,
        message: "You can only view attendance for students in your groups.",
      });
    }

    const records = await Attendance.find({ student: studentId }).lean();
    const total = records.length;
    const present = records.filter((item) => item.status === "present").length;

    res.json({
      success: true,
      data: {
        total,
        present,
        absent: records.filter((item) => item.status === "absent").length,
        late: records.filter((item) => item.status === "late").length,
        excused: records.filter((item) => item.status === "excused").length,
        percentage: total
          ? Math.round((present / total) * 10000) / 100
          : 0,
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
      message: "All attendance records deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};