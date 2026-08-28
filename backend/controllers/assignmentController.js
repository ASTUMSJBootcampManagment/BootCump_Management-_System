const Assignment = require("../models/assignmentModel");
const Submission = require("../models/submissionModel");
const Announcement = require("../models/announcement");
const User = require("../models/userModel");
const Batches = require("../models/Batches");
const AppError = require("../utils/AppError");

// Create Assignment (Admin or Mentor)
const createAssignment = async (req, res, next) => {
  try {
    const { title, description, dueDate, maxScore, instructions, group } = req.body;

    // Default to active batch if not provided
    const activeBatch = await Batches.findOne({ status: "Active" });
    const targetBatch = activeBatch ? activeBatch._id : null;

    const assignment = new Assignment({
      title,
      description,
      instructions: instructions || "",
      dueDate,
      batch: targetBatch,
      group: group || null,
      maxScore: maxScore || 100,
      createdBy: req.user._id || req.user.id,
    });

    await assignment.save();

    const formattedDueDate = dueDate
      ? new Date(dueDate).toLocaleDateString()
      : "N/A";

    await Announcement.create({
      title: `New Assignment: ${title}`,
      content: `A new assignment "${title}" has been posted. Due Date: ${formattedDueDate}.`,
      announcedTo: "Student",
      batch: targetBatch,
      createdBy: req.user._id || req.user.id,
    });

    res.status(201).json({
      status: "success",
      message: "Assignment created successfully",
      data: assignment,
    });
  } catch (err) {
    next(err);
  }
};

// Get Assignments
const getAssignments = async (req, res, next) => {
  try {
    let query = {};

    if (req.user.role === "Mentor") {
      const mentor = await User.findById(req.user._id);
      if (mentor?.group) {
        query.group = mentor.group;
      }
    } else if (req.user.role === "Student") {
      const student = await User.findById(req.user._id);
      if (student?.group) {
        query.group = student.group;
      }
    }

    const assignments = await Assignment.find(query)
      .populate("createdBy", "name email role")
      .populate("batch", "name status")
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: "success",
      results: assignments.length,
      data: assignments,
    });
  } catch (err) {
    next(err);
  }
};

// Update Assignment
const updateAssignment = async (req, res, next) => {
  try {
    const { title, description, dueDate, maxScore, instructions, group } = req.body;
    const updates = {};
    if (title) updates.title = title;
    if (description) updates.description = description;
    if (dueDate) updates.dueDate = dueDate;
    if (maxScore) updates.maxScore = maxScore;
    if (group !== undefined) updates.group = group;
    if (instructions !== undefined) updates.instructions = instructions;

    const assignment = await Assignment.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    if (!assignment) {
      return next(new AppError("Assignment not found", 404));
    }

    res.status(200).json({
      status: "success",
      message: "Assignment updated successfully",
      data: assignment,
    });
  } catch (err) {
    next(err);
  }
};

// Delete Assignment
const deleteAssignment = async (req, res, next) => {
  try {
    const assignment = await Assignment.findByIdAndDelete(req.params.id);
    if (!assignment) {
      return next(new AppError("Assignment not found", 404));
    }
    await Submission.deleteMany({ assignment: req.params.id });

    res.status(200).json({
      status: "success",
      message: "Assignment deleted",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createAssignment,
  getAssignments,
  updateAssignment,
  deleteAssignment,
};