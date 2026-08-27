const Submission = require("../models/submissionModel");
const Assignment = require("../models/assignmentModel");
const Batch = require("../models/Batches");

exports.submitAssignment = async (req, res) => {
  try {
    const { assignmentId, content } = req.body;
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) return res.status(404).json({ success: false, message: "Assignment not found." });
    const enrolled = await Batch.exists({ _id: assignment.batch, students: req.user.id });
    if (!enrolled) return res.status(403).json({ success: false, message: "This assignment is not for your batch." });
    const submission = await Submission.create({ assignment: assignmentId, student: req.user.id, content });
    res.status(201).json({ success: true, data: submission });
  } catch (error) {
    res.status(error.code === 11000 ? 409 : 400).json({ success: false, message: error.code === 11000 ? "You already submitted this assignment." : error.message });
  }
};

exports.getSubmissionsForAssignment = async (req, res) => {
  try {
    const batch = await Batch.findOne({ mentors: req.user.id, status: "Active" });
    const assignment = await Assignment.findOne({ _id: req.params.assignmentId, batch: batch?._id });
    if (!assignment) return res.status(404).json({ success: false, message: "Assignment not found." });
    const submissions = await Submission.find({ assignment: assignment._id }).populate("student", "name email").sort({ createdAt: -1 }).lean();
    res.json({ success: true, data: submissions });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getMySubmissions = async (req, res) => {
  const submissions = await Submission.find({ student: req.user.id }).populate("assignment", "title dueDate");
  res.json({ success: true, data: submissions });
};
