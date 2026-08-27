const Submission = require("../models/submissionModel");
const Assignment = require("../models/assignmentModel");
const Batch = require("../models/Batches");

const gradeSubmission = async (req, res) => {
  try {
    const { grade, feedback } = req.body;
    if (!Number.isFinite(Number(grade)) || Number(grade) < 0 || Number(grade) > 100) {
      return res.status(400).json({ success: false, message: "Grade must be a number from 0 to 100." });
    }
    const mentorBatch = req.user.role === "Mentor"
      ? await Batch.findOne({ mentors: req.user.id, status: "Active" })
      : null;
    const submission = await Submission.findById(req.params.id);
    if (!submission || (req.user.role === "Mentor" && !mentorBatch)) return res.status(404).json({ success: false, message: "Submission not found." });
    const assignment = await Assignment.findOne(req.user.role === "Mentor"
      ? { _id: submission.assignment, batch: mentorBatch._id }
      : { _id: submission.assignment });
    if (!assignment) return res.status(403).json({ success: false, message: "This submission is not in your batch." });

    submission.grade = Number(grade);
    submission.feedback = feedback || "";
    submission.status = "Graded";
    await submission.save();
    res.json({ success: true, data: submission });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = { gradeSubmission };
