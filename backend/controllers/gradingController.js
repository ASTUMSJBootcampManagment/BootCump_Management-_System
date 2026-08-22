const Submission = require("../models/submissionModel");
const gradeSubmission = async (req, res) => {
  try {
    const { grade, feedback } = req.body;

    const submission = await Submission.findByIdAndUpdate(
      req.params.id,
      { grade, feedback, status: "Graded" },
      { new: true, runValidators: true }
    );

    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    res.status(200).json({ message: "Submission graded", submission });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = { gradeSubmission };