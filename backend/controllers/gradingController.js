const Submission = require("../models/submissionModel");
const Assignment = require("../models/assignmentModel");
const Announcement = require("../models/announcement");

exports.gradeSubmission = async (req, res, next) => {
  try {
    const { grade, feedback = "", requestResubmission = false } = req.body;
    const submission = await Submission.findById(req.params.id).populate("assignment").populate("student", "assignedBatch");
    if (!submission) return res.status(404).json({ success: false, message: "Submission not found." });
    const assignment = submission.assignment;
    if (req.user.role === "Mentor" && String(assignment.createdBy) !== String(req.user._id)) return res.status(403).json({ success: false, message: "You can only review submissions for your assignments." });
    if (!requestResubmission && (!Number.isFinite(Number(grade)) || Number(grade) < 0 || Number(grade) > assignment.maxScore)) return res.status(400).json({ success: false, message: `Grade must be between 0 and ${assignment.maxScore}.` });
    submission.feedback = feedback.trim(); submission.gradedBy = req.user._id; submission.gradedAt = new Date();
    submission.resubmissionRequested = Boolean(requestResubmission); submission.status = requestResubmission ? "ResubmissionRequested" : "Graded";
    submission.grade = requestResubmission ? null : Number(grade);
    await submission.save();
    await Announcement.create({ title: requestResubmission ? `Resubmission requested: ${assignment.title}` : `Grade released: ${assignment.title}`, content: requestResubmission ? "Your mentor requested a resubmission. Review the feedback and submit again." : "Your grade and feedback are now available.", announcedTo: "Student", batch: assignment.batch, createdBy: req.user._id });
    res.json({ success: true, message: requestResubmission ? "Resubmission requested." : "Submission graded.", data: submission });
  } catch (error) { next(error); }
};
