const Assignment = require("../models/assignmentModel");
const Submission = require("../models/submissionModel");

const createAssignment = async (req, res) => {
  try {
    const { title, description, dueDate } = req.body;
    const assignment = new Assignment({
      title,
      description,
      dueDate,
      createdBy: req.user.id,
    });
    await assignment.save();
    res.status(201).json({ message: "Assignment created", assignment });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const getAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find().populate("createdBy", "username role");
    res.status(200).json(assignments);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const updateAssignment = async (req, res) => {
  try {
    const { title, description, dueDate } = req.body;
    const updates = {};
    if (title) updates.title = title;
    if (description) updates.description = description;
    if (dueDate) updates.dueDate = dueDate;

    const assignment = await Assignment.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }
    res.status(200).json({ message: "Assignment updated", assignment });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const deleteAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findByIdAndDelete(req.params.id);
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }
    await Submission.deleteMany({ assignment: req.params.id });
    res.status(200).json({ message: "Assignment deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = { createAssignment, getAssignments, updateAssignment, deleteAssignment };