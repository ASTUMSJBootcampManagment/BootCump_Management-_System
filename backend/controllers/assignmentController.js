const Assignment = require("../models/assignmentModel");
const Submission = require("../models/submissionModel");
const Batch = require("../models/Batches");

const getMentorBatch = (mentorId) => Batch.findOne({ mentors: mentorId, status: "Active" });

exports.createAssignment = async (req, res) => {
  try {
    const { title, description, dueDate, batch: batchId } = req.body;
    const batch = await Batch.findById(batchId);
    if (!batch) return res.status(404).json({ success: false, message: "Batch not found." });
    const assignment = await Assignment.create({ title, description, dueDate, batch: batch._id, createdBy: req.user.id });
    res.status(201).json({ success: true, data: assignment });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getAssignments = async (req, res) => {
  try {
    const batch = req.user.role === "Mentor" ? await getMentorBatch(req.user.id) : null;
    if (req.user.role === "Mentor" && !batch) return res.status(403).json({ success: false, message: "You are not assigned to an active batch." });
    const assignments = await Assignment.find(req.user.role === "Mentor" ? { batch: batch._id } : {})
      .populate("batch", "name")
      .sort({ dueDate: 1 })
      .lean();
    res.json({ success: true, data: assignments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateAssignment = async (req, res) => {
  try {
    const { title, description, dueDate, batch } = req.body;
    const assignment = await Assignment.findOneAndUpdate(
      { _id: req.params.id }, { title, description, dueDate, batch }, { new: true, runValidators: true },
    );
    if (!assignment) return res.status(404).json({ success: false, message: "Assignment not found." });
    res.json({ success: true, data: assignment });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findByIdAndDelete(req.params.id);
    if (!assignment) return res.status(404).json({ success: false, message: "Assignment not found." });
    await Submission.deleteMany({ assignment: assignment._id });
    res.json({ success: true, message: "Assignment deleted." });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
