const Submission = require("../models/submissionModel");
const Announcement = require("../models/announcement");
const user=require("../models/userModel"); 

const gradeSubmission = async (req, res) => {
  try {
    const { grade, feedback } = req.body;
    const submission = await Submission.findByIdAndUpdate(
      req.params.id,
      { grade, feedback, status: "Graded" },
      { new: true, runValidators: true }
    )
      .populate("student")
      .populate("assignment", "title");

    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }
    const assignmentTitle = submission.assignment ? submission.assignment.title : "your submission";
    await Announcement.create({
      title: `📝 Grade Released: ${assignmentTitle}`,
      content: `Your work for "${assignmentTitle}" has been graded. Grade: ${grade}.`,
      announcedTo: "Student",
      batch: submission.student?.batch || null,
      createdBy: req.user._id || req.user.id,
    });

    res.status(200).json({ message: "Submission graded and notification sent", submission });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong", error: err.message });
  }
};

module.exports = { gradeSubmission };