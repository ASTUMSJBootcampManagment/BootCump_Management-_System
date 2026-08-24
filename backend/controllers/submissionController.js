const Submission = require("../models/submissionModel");
const Assignment = require("../models/assignmentModel");
const user=require("../models/userModel"); 

const submitAssignment = async (req, res) => {
  try {
    const { assignmentId, content } = req.body;

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    const submission = new Submission({
      assignment: assignmentId,
      student: req.user.id,
      content,
    });
    await submission.save();

    res.status(201).json({ message: "Assignment submitted", submission });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(409).json({ message: "You already submitted this assignment" });
    }
    res.status(500).json({ message: "Something went wrong" });
  }
};

const getSubmissionsForAssignment = async (req, res) => {
  try {
    const submissions = await Submission.find({ assignment: req.params.assignmentId })
      .populate("student", "username email");
    res.status(200).json(submissions);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const getMySubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ student: req.user.id })
      .populate("assignment", "title dueDate");
    res.status(200).json(submissions);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = { submitAssignment, getSubmissionsForAssignment, getMySubmissions };