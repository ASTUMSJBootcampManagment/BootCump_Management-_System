const Batch = require("../models/Batches");
const User = require("../models/userModel");
const createBatch = async (req, res, next) => {
  try {
    const { name, year, startDate, endDate, status } = req.body;

    const newBatch = await Batch.create({
      name,
      year,
      startDate,
      endDate,
      status: status || "Active",
    });

    res.status(201).json({
      success: true,
      message: "Batch created successfully.",
      data: newBatch,
    });
  } catch (error) {
    next(error);
  }
};
const getAllBatches = async (req, res, next) => {
  try {
    const batches = await Batch.find()
      .populate("mentors", "name email role")
      .populate("students", "name email role");

    res.status(200).json({
      success: true,
      count: batches.length,
      data: batches,
    });
  } catch (error) {
    next(error);
  }
};
const getBatchById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const batch = await Batch.findById(id)
      .populate("mentors", "name email role")
      .populate("students", "name email role");

    if (!batch) {
      return res.status(404).json({
        success: false,
        message: "Batch not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: batch,
    });
  } catch (error) {
    next(error);
  }
};
const updateBatch = async (req, res, next) => {
  try {
    const { id } = req.params;
    const allowedFields = ["name", "year", "startDate", "endDate", "status"];

    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields provided for update.",
      });
    }

    const batch = await Batch.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!batch) {
      return res.status(404).json({
        success: false,
        message: "Batch not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Batch updated successfully.",
      data: batch,
    });
  } catch (error) {
    next(error);
  }
};
const deleteBatch = async (req, res, next) => {
  try {
    const { id } = req.params;
    const batch = await Batch.findByIdAndDelete(id);

    if (!batch) {
      return res.status(404).json({
        success: false,
        message: "Batch not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Batch deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};
const assignMentorToBatch = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { mentorId } = req.body;

    if (!mentorId) {
      return res.status(400).json({
        success: false,
        message: "mentorId is required.",
      });
    }

    const batch = await Batch.findById(id);
    if (!batch) {
      return res.status(404).json({
        success: false,
        message: "Batch not found.",
      });
    }

    if (batch.status !== "Active") {
      return res.status(400).json({
        success: false,
        message: "Cannot assign mentor. Batch status must be Active.",
      });
    }

    const mentor = await User.findById(mentorId);
    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: "Mentor user not found.",
      });
    }

    if (mentor.role !== "Mentor") {
      return res.status(400).json({
        success: false,
        message: "Selected user does not have the Mentor role.",
      });
    }

    const existingActiveBatch = await Batch.findOne({
      mentors: mentorId,
      status: "Active",
      _id: { $ne: id },
    });

    if (existingActiveBatch) {
      return res.status(400).json({
        success: false,
        message: `Mentor is already assigned to active batch: ${existingActiveBatch.name}`,
      });
    }

    const updatedBatch = await Batch.findByIdAndUpdate(
      id,
      { $addToSet: { mentors: mentorId } },
      { new: true }
    )
      .populate("mentors", "name email role")
      .populate("students", "name email role");

    res.status(200).json({
      success: true,
      message: "Mentor assigned to batch successfully.",
      data: updatedBatch,
    });
  } catch (error) {
    next(error);
  }
};
const enrollStudentInBatch = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { studentId } = req.body;

    if (!studentId) {
      return res.status(400).json({
        success: false,
        message: "studentId is required.",
      });
    }

    const batch = await Batch.findById(id);
    if (!batch) {
      return res.status(404).json({
        success: false,
        message: "Batch not found.",
      });
    }

    if (batch.status !== "Active") {
      return res.status(400).json({
        success: false,
        message: "Cannot enroll student. Batch status must be Active.",
      });
    }

    const student = await User.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student user not found.",
      });
    }

    if (student.role !== "Student") {
      return res.status(400).json({
        success: false,
        message: "Selected user does not have the Student role.",
      });
    }

    if (student.status && student.status !== "accepted") {
      return res.status(400).json({
        success: false,
        message: "Student account status must be 'accepted' to enroll.",
      });
    }

    const existingBatch = await Batch.findOne({
      students: studentId,
      status: "Active",
    });

    if (existingBatch) {
      return res.status(400).json({
        success: false,
        message: `Student is already enrolled in active batch: ${existingBatch.name}`,
      });
    }

    const updatedBatch = await Batch.findByIdAndUpdate(
      id,
      { $addToSet: { students: studentId } },
      { new: true }
    )
      .populate("mentors", "name email role")
      .populate("students", "name email role");

    res.status(200).json({
      success: true,
      message: "Student enrolled successfully.",
      data: updatedBatch,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBatch,
  getAllBatches,
  getBatchById,
  updateBatch,
  deleteBatch,
  assignMentorToBatch,
  enrollStudentInBatch,
};