const Submission = require("../models/submissionModel");
const Assignment = require("../models/assignmentModel");
const AppError = require("../utils/AppError");

// Submit or Resubmit Assignment (Student)
const submitAssignment = async (req, res, next) => {
  try {
    const { assignmentId, content, githubLink, fileUrl } = req.body;
    const studentId = req.user._id || req.user.id;

    if (!assignmentId) {
      return next(new AppError("Assignment ID is required.", 400));
    }

    if (!content || !content.trim()) {
      return next(new AppError("Submission content is required.", 400));
    }

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return next(new AppError("Assignment not found.", 404));
    }

    // Check for existing submission
    let submission = await Submission.findOne({
      assignment: assignmentId,
      student: studentId,
    });

    if (submission) {
      // Update existing submission
      submission.content = content.trim();
      if (githubLink) submission.githubLink = githubLink;
      if (fileUrl) submission.fileUrl = fileUrl;
      submission.status = "Submitted";
      submission.submittedAt = new Date();
      await submission.save();
    } else {
      // Create new submission
      submission = await Submission.create({
        assignment: assignmentId,
        student: studentId,
        content: content.trim(),
        githubLink: githubLink || "",
        fileUrl: fileUrl || "",
        status: "Submitted",
        submittedAt: new Date(),
      });
    }

    res.status(200).json({
      status: "success",
      message: "Assignment submitted successfully.",
      data: submission,
    });
  } catch (err) {
    next(err);
  }
};

// Get Submissions for Current Student
const getMySubmissions = async (req, res, next) => {
  try {
    const studentId = req.user._id || req.user.id;

    // Select all submission fields
    const submissions = await Submission.find({ student: studentId })
      .populate("assignment", "title maxScore dueDate")
      .sort({ submittedAt: -1 });

    res.status(200).json({
      status: "success",
      results: submissions.length,
      data: submissions,
    });
  } catch (err) {
    next(err);
  }
};

// Get all submissions for a specific assignment (Mentor / Admin)
const getAssignmentSubmissions = async (req, res, next) => {
  try {
    const { id } = req.params;

    const submissions = await Submission.find({ assignment: id })
      .populate("student", "name email group")
      .sort({ submittedAt: -1 });

    res.status(200).json({
      status: "success",
      results: submissions.length,
      data: submissions,
    });
  } catch (err) {
    next(err);
  }
};

// Grade a student's submission (Mentor / Admin)
// Grade or Feedback Submission (Mentor / Admin)
const gradeSubmission = async (req, res, next) => {
  try {
    const { id } = req.params; // Submission ID
    const { grade, feedback, status } = req.body;

    const submission = await Submission.findById(id);
    if (!submission) {
      return next(new AppError("Submission not found.", 404));
    }

    // Save values directly matching submissionModel.js schema
    if (grade !== undefined && grade !== "") {
      submission.grade = Number(grade);
    }
    if (feedback !== undefined) {
      submission.feedback = feedback;
    }

    submission.status = status || "Graded";
    submission.gradedBy = req.user._id || req.user.id;
    submission.gradedAt = new Date();

    await submission.save();

    res.status(200).json({
      status: "success",
      message: "Submission graded successfully.",
      data: submission,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  submitAssignment,
  getMySubmissions,
  getAssignmentSubmissions,
  gradeSubmission, 
};
