const mongoose = require("mongoose");
const progress = require("../models/progress");
const User = require("../models/userModel");
const Batch = require("../models/Batches"); 
const AppError = require("../utils/AppError");
exports.createTopic = async (req, res) => {
    try {
        const { topic } = req.body;
        const batches = await Batch.find({});

        for (const batch of batches) {
            await progress.create({
                topic: topic,
                batch: batch._id
            });
        }

        res.status(201).json({
            success: true,
            message: "Topic progress created for all batches successfully!",
        });
    } catch (error) {
        next(error);
    }
};

exports.updateProgress = async (req, res) => {
    try {
        const StudentId = req.params.StudentId || req.params.studentId || req.params.id;
        const { status } = req.body; 
        let batchQuery = {};
        if (req.user.role === "Mentor") {
            const mentorBatch = await Batch.findOne({ mentors: req.user.id });
            if (!mentorBatch) {
                return res.status(403).json({
                    success: false,
                    message: "Access denied. You are not assigned to any active batch.",
                });
            }
            batchQuery.batch = mentorBatch._id;
        }
        let updatedProgress = await progress.findOneAndUpdate(
            { student: StudentId, ...batchQuery },
            { status },
            { new: true, runValidators: true }
        );
        if (!updatedProgress) {
            updatedProgress = await progress.findOneAndUpdate(
                { ...batchQuery, $or: [{ student: null }, { student: { $exists: false } }] },
                { status, student: StudentId },
                { new: true, runValidators: true }
            );
        }

        if (!updatedProgress) {
            return res.status(404).json({
                success: false,
                message: "Progress record not found or student is not in your assigned batch",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Progress updated successfully",
            data: updatedProgress,
        });
    } catch (error) {
        next(error);
    }
};

exports.getProgress = async (req, res) => {
    try {
        const { StudentId } = req.params;
        let query = {};
        if (StudentId) {
            query.student = StudentId;
        } else {
            const { topic, status, batch ,name} = req.query;
            if (topic) query.topic = topic;
            if (status) query.status = status;
            if (batch) query.batch = batch;
            if(name) query.name=name;
        }

        const getProgresses = await progress.find(query);

        res.status(200).json({
            success: true,
            message: "Progress retrieved successfully",
            data: getProgresses,
        });
    } catch (error) {
        next(error);
    }
};
exports.getMentorStudentsProgress = async (req, res) => {
    try {
        const mentorBatch = await Batch.findOne({ mentors: req.user.id });

        if (!mentorBatch) {
            return res.status(403).json({
                success: false,
                message: "Access denied. You are not assigned to any batch.",
            });
        }
        const progresses = await progress.find({ batch: mentorBatch._id })
            .populate("student", "name email")
            .populate("batch", "name");

        return res.status(200).json({
            success: true,
            count: progresses.length,
            data: progresses,
        });
    } catch (error) {
       next(error);
    }
};