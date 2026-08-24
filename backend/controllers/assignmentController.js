const Assignment = require("../models/assignmentModel");
const Submission = require("../models/submissionModel");
const Announcement = require("../models/announcement");

const createAssignment = async (req, res) => {
  try {
    const { title, description, dueDate, batch } = req.body;
    const assignment = new Assignment({
      title,
      description,
      dueDate,
      batch,
      createdBy: req.user._id || req.user.id,
    });
    await assignment.save();
    const formattedDueDate = dueDate ? new Date(dueDate).toLocaleDateString() : "N/A";
    await Announcement.create({
      title: `📢 New Assignment: ${title}`,
      content: `A new assignment "${title}" has been posted. Due Date: ${formattedDueDate}.`,
      announcedTo: "Student",
      batch: batch || null,
      createdBy: req.user._id || req.user.id,
    });

    res.status(201).json({ message: "Assignment created and students notified", assignment });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong", error: err.message });
  }
};

const getAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find().populate("createdBy", "username role");
    res.status(200).json(assignments);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong", error: err.message });
  }
};

const updateAssignment = async (req, res) => {
  try {
    const { title, description, dueDate, batch } = req.body;
    const updates = {};
    if (title) updates.title = title;
    if (description) updates.description = description;
    if (dueDate) updates.dueDate = dueDate;
    if (batch) updates.batch = batch;

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
    res.status(500).json({ message: "Something went wrong", error: err.message });
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
    res.status(500).json({ message: "Something went wrong", error: err.message });
  }
};

module.exports = { 
  createAssignment, 
  getAssignments, 
  updateAssignment, 
  deleteAssignment 
};