const Submission = require("../models/submissionModel");
const Assignment = require("../models/assignmentModel");

exports.submitAssignment = async (req, res, next) => {
  try {
    const { assignmentId, content = "", githubUrl = "", liveUrl = "", notes = "" } = req.body;
    if (!assignmentId || (!content.trim() && !githubUrl.trim() && !notes.trim())) return res.status(400).json({ success: false, message: "Provide submission notes or a repository URL." });
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) return res.status(404).json({ success: false, message: "Assignment not found." });
    const batch = await require("../models/Batches").findOne({ status: "Active", "groups.students": req.user._id });
    const isAssigned = batch && String(assignment.batch) === String(batch._id) && batch.groups.some((group) => String(group._id) === String(assignment.group) && group.students.some((id) => String(id) === String(req.user._id)));
    if (!isAssigned) return res.status(403).json({ success: false, message: "This assignment is not assigned to your group." });
    const submission = await Submission.findOneAndUpdate({ assignment: assignmentId, student: req.user._id }, { assignment: assignmentId, student: req.user._id, content: content.trim() || notes.trim() || githubUrl.trim(), githubUrl: githubUrl.trim(), liveUrl: liveUrl.trim(), notes: notes.trim(), submittedAt: new Date(), status: "Submitted", resubmissionRequested: false, grade: null, feedback: "" }, { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true });
    res.status(201).json({ success: true, message: "Assignment submitted.", data: submission });
  } catch (error) { next(error); }
};

exports.getSubmissionsForAssignment = async (req, res, next) => {
  try {
    const assignment = await Assignment.findById(req.params.assignmentId);
    if (!assignment) return res.status(404).json({ success: false, message: "Assignment not found." });
    if (req.user.role === "Mentor" && String(assignment.createdBy) !== String(req.user._id)) return res.status(403).json({ success: false, message: "You can only view submissions for your assignments." });
    const submissions = await Submission.find({ assignment: assignment._id }).populate("student", "fullname email").sort({ submittedAt: -1 });
    res.json({ success: true, data: submissions });
  } catch (error) { next(error); }
};

exports.getMySubmissions = async (req, res, next) => {
  try {
    const submissions = await Submission.find({ student: req.user._id }).populate("assignment", "title dueDate maxScore").sort({ submittedAt: -1 });
    res.json({ success: true, data: submissions });
  } catch (error) { next(error); }
};
