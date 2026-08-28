const Submission = require("../models/submissionModel");
const User = require("../models/userModel");
const AppError = require("../utils/AppError");

// Grade Submission (Admin / Mentor)
const gradeSubmission = async (req, res, next) => {
  try {
    const { id: submissionId } = req.params;
    const { grade, feedback, requestResubmission } = req.body;

    const submission = await Submission.findById(submissionId);
    if (!submission) {
      return next(new AppError("Submission not found", 404));
    }

    if (req.user.role === "Mentor") {
      const student = await User.findById(submission.student);
      const mentor = await User.findById(req.user._id);

      const isAssignedDirectly =
        student?.assignedMentor?.toString() === req.user._id.toString();
      const isSameGroup = mentor?.group && student?.group === mentor.group;

      if (!isAssignedDirectly && !isSameGroup) {
        return next(
          new AppError("Not authorized to grade this student's submission", 403)
        );
      }
    }

    if (requestResubmission) {
      submission.status = "Resubmission Requested";
    } else {
      if (grade !== undefined) submission.grade = grade;
      submission.status = "Graded";
    }

    if (feedback !== undefined) submission.feedback = feedback;

    await submission.save();

    res.status(200).json({
      status: "success",
      message: "Submission status updated successfully",
      data: submission,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  gradeSubmission,
};