const mongoose=require("mongoose")
const Batch=require("../models/Batches");
const User = require("../models/UserModel"); 

exports.createBatch=async (req,res)=>{
    try{
        const {name,year,startDate,endDate}=req.body
        const newBatch = await Batch.create({
            name,
            year,
            startDate,
            endDate,
        });
        res.status(201).json({
            success: true,
            message: "Batch created successfully",
            data: newBatch,
         });
        } catch (error) {
            res.status(400).json({
                 success: false,
                 message: error.message,
    });
  }

    }
exports.getAllBatches= async (req,res)=>{
    try{
        const getAll= await Batch.find()
        .populate("mentors", "name email")
        .populate("students", "name email");
        res.status(200).json({
            success: true,
            count: getAll.length,
            data: getAll,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.assignMentor = async (req, res) => {
  try {
    const { batchId } = req.params; 
    const { mentorId } = req.body; 
    const batch = await Batch.findById(batchId);

    if (!batch) {
      return res.status(404).json({
        success: false,
        message: "Batch not found",
      });
    }

    if (batch.status !== "Active") {
      return res.status(400).json({
        success: false,
        message: "Cannot assign mentor. Batch status must be Active"
      });
    }
    const existingBatch = await Batch.findOne({ mentors: mentorId, status: "Active" });
    if (existingBatch && existingBatch._id.toString() !== batchId) {
       return res.status(400).
       json({ message: "This mentor is already assigned to another active batch" });
}
    const updatedBatch = await Batch.findByIdAndUpdate(
      batchId,
      { $addToSet: { mentors: mentorId } },
      { new: true } 
    ).populate("mentors", "name email");

    res.status(200).json({
      success: true,
      message: "Mentor assigned to active batch successfully",
      data: updatedBatch,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.enrollStudents = async (req, res) => {
  try {
    const { batchId } = req.params; 
    const { studentId } = req.body; 
    const batch = await Batch.findById(batchId);
    if (!batch) {
      return res.status(404).json({ message: "Batch not found" });
    }

    if (batch.status !== "Active") {
      return res.status(400).json({ 
        message: "Cannot enroll student. Batch status must be active" 
      });
    }
    const student = await User.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student user doesn't exist" });
    }
    const existingBatch = await Batch.findOne({ students: studentId });
    if (existingBatch) {
      return res.status(400)
      .json({ message: `Student is already enrolled in batch: ${existingBatch.name}` 
    });
}
    const updatedBatch = await Batch.findByIdAndUpdate(
      batchId,
      { $addToSet: { students: studentId } },
      { new: true }
    ).populate("students", "name email");

    res.status(200).json({
      success: true,
      message: "Student enrolled successfully",
      data: updatedBatch,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



