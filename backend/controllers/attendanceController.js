const mongoose = require("mongoose");
const Attendance = require("../models/attendance");
const { getActiveBatch, getMentorGroups, mentorCanAccessStudent, groupContains } = require("../utils/groupAccess");

const STATUSES = ["present", "absent", "late", "excused"];

exports.getMentorStudents = async (req, res, next) => {
  try {
    const { batch, groups } = await getMentorGroups(req.user._id);
    if (!batch) return res.json({ success: true, data: [] });
    const students = await Promise.all(groups.flatMap((group) => (group.students || []).map(async (studentId) => {
      const student = await require("../models/userModel").findById(studentId).select("fullname email").lean();
      return student && { ...student, batch: { _id: batch._id, name: batch.name }, group: { _id: group._id, name: group.name } };
    })));
    res.json({ success: true, data: students.filter(Boolean) });
  } catch (error) { next(error); }
};

exports.getAttendanceHistory = async (req, res, next) => {
  try {
    const query = {};
    if (req.query.date) { const date = String(req.query.date).slice(0, 10); query.date = { $gte: new Date(`${date}T00:00:00.000Z`), $lte: new Date(`${date}T23:59:59.999Z`) }; }
    const { batch, groups } = await getMentorGroups(req.user._id);
    if (!batch) return res.json({ success: true, data: [] });
    const groupIds = groups.map((group) => group._id).filter(Boolean);
    if (req.query.group && !groupIds.some((id) => String(id) === String(req.query.group))) return res.status(403).json({ success: false, message: "You can only view your assigned groups." });
    query.batch = batch._id;
    query.group = req.query.group || { $in: groupIds };
    const rows = await Attendance.find(query).populate("student", "fullname email").sort({ date: -1, createdAt: -1 });
    res.json({ success: true, data: rows });
  } catch (error) { next(error); }
};

exports.markAttendance = async (req, res, next) => {
  try {
    const { date, group, records } = req.body;
    if (!date || !group || !Array.isArray(records) || !records.length) return res.status(400).json({ success: false, message: "Date, group and attendance records are required." });
    const { batch, groups } = await getMentorGroups(req.user._id);
    const assignedGroup = groups.find((item) => String(item._id) === String(group));
    if (!batch || !assignedGroup) return res.status(403).json({ success: false, message: "You can only manage attendance for your assigned group." });
    const studentIds = new Set((assignedGroup.students || []).map(String));
    const sessionDate = new Date(`${String(date).slice(0, 10)}T12:00:00.000Z`);
    const operations = records.map(({ student, status }) => {
      const normalized = String(status || "").toLowerCase();
      if (!studentIds.has(String(student)) || !STATUSES.includes(normalized)) return null;
      return { updateOne: { filter: { student, batch: batch._id, group, date: sessionDate }, update: { $set: { student, batch: batch._id, group, date: sessionDate, status: normalized } }, upsert: true } };
    });
    if (operations.some((operation) => !operation)) return res.status(400).json({ success: false, message: "Each record needs a student from this group and a valid status." });
    await Attendance.bulkWrite(operations);
    const saved = await Attendance.find({ batch: batch._id, group, date: sessionDate }).populate("student", "fullname email");
    res.json({ success: true, message: "Attendance saved successfully.", data: saved });
  } catch (error) { next(error); }
};

exports.getStudentAttendanceStats = async (req, res, next) => {
  try {
    const studentId = req.user.role === "Student" ? req.user._id : req.params.studentId;
    if (!mongoose.Types.ObjectId.isValid(studentId)) return res.status(400).json({ success: false, message: "Invalid student ID." });
    if (req.user.role === "Mentor" && !(await mentorCanAccessStudent(req.user._id, studentId))) return res.status(403).json({ success: false, message: "You can only view attendance for students in your groups." });
    const records = await Attendance.find({ student: studentId }).lean(); const total = records.length; const present = records.filter((item) => item.status === "present").length;
    res.json({ success: true, data: { total, present, absent: records.filter((item) => item.status === "absent").length, late: records.filter((item) => item.status === "late").length, excused: records.filter((item) => item.status === "excused").length, percentage: total ? Math.round((present / total) * 10000) / 100 : 0 } });
  } catch (error) { next(error); }
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