const Assignment = require("../models/assignmentModel");
const Submission = require("../models/submissionModel");
const Batch = require("../models/Batches");
const Announcement = require("../models/announcement");

async function getMentorGroup(user, groupId) {
  const batch = await Batch.findOne({ status: "Active", "groups._id": groupId });
  const group = batch?.groups.id(groupId);
  if (!group) return null;
  if (user.role === "Admin" || group.mentors.some((id) => String(id) === String(user._id))) return { batch, group };
  return null;
}

exports.createAssignment = async (req, res, next) => {
  try {
    const { title, description, instructions = "", dueDate, maxScore = 100, group } = req.body;
    if (!title?.trim() || !description?.trim() || !dueDate || !group) return res.status(400).json({ success: false, message: "Title, description, deadline and group are required." });
    if (!Number.isFinite(Number(maxScore)) || Number(maxScore) <= 0) return res.status(400).json({ success: false, message: "Maximum score must be greater than zero." });
    const groupData = await getMentorGroup(req.user, group);
    if (req.user.role === "Mentor" && !groupData) return res.status(403).json({ success: false, message: "You can only create assignments for your assigned groups in the active batch." });
    if (!groupData) return res.status(400).json({ success: false, message: "Select a group from the active batch." });
    const assignment = await Assignment.create({ title: title.trim(), description: description.trim(), instructions: instructions.trim(), dueDate, maxScore: Number(maxScore), batch: groupData.batch._id, group, createdBy: req.user._id });
    await Announcement.create({ title: `New assignment: ${assignment.title}`, content: `A new assignment is available. Deadline: ${new Date(assignment.dueDate).toLocaleString()}.`, announcedTo: "Student", batch: groupData.batch._id, group, createdBy: req.user._id });
    res.status(201).json({ success: true, message: "Assignment created and students notified.", data: assignment });
  } catch (error) { next(error); }
};

exports.getAssignments = async (req, res, next) => {
  try {
    let query = {};
    if (req.user.role === "Student") {
      const batch = await Batch.findOne({ status: "Active", "groups.students": req.user._id });
      const groupIds = batch ? batch.groups.filter((group) => group.students.some((id) => String(id) === String(req.user._id))).map((group) => group._id) : [];
      query = { batch: batch?._id, group: { $in: groupIds } };
    }
    if (req.user.role === "Mentor") query = { createdBy: req.user._id };
    const assignments = await Assignment.find(query).populate("batch", "name").populate("createdBy", "fullname role").sort({ dueDate: 1 });
    res.json({ success: true, data: assignments });
  } catch (error) { next(error); }
};

exports.updateAssignment = async (req, res, next) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) return res.status(404).json({ success: false, message: "Assignment not found." });
    if (req.user.role === "Mentor" && String(assignment.createdBy) !== String(req.user._id)) return res.status(403).json({ success: false, message: "You can only edit assignments you created." });
    const allowed = ["title", "description", "instructions", "dueDate", "maxScore", "group"];
    for (const key of allowed) if (req.body[key] !== undefined) assignment[key] = req.body[key];
    const groupData = await getMentorGroup(req.user, assignment.group);
    if (req.user.role === "Mentor" && !groupData) return res.status(403).json({ success: false, message: "You can only assign work to your groups in the active batch." });
    assignment.batch = groupData.batch._id;
    await assignment.save();
    res.json({ success: true, message: "Assignment updated.", data: assignment });
  } catch (error) { next(error); }
};

exports.deleteAssignment = async (req, res, next) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) return res.status(404).json({ success: false, message: "Assignment not found." });
    if (req.user.role === "Mentor" && String(assignment.createdBy) !== String(req.user._id)) return res.status(403).json({ success: false, message: "You can only delete assignments you created." });
    await Submission.deleteMany({ assignment: assignment._id }); await assignment.deleteOne();
    res.json({ success: true, message: "Assignment deleted." });
  } catch (error) { next(error); }
};
