const mongoose = require("mongoose");
const progress = require("../models/progress");
const User = require("../models/userModel");
const Batch = require("../models/Batches"); 
const AppError = require("../utils/AppError");
exports.createTopic = async (req, res, next) => {
    try {
        const { topic } = req.body;
        const batches = await Batch.find({});

        for (const batch of batches) {
            await progress.insertMany(
                batch.students.map((student) => ({
                    topic,
                    student,
                    batch: batch._id,
                    status: "NotStarted",
                })),
                { ordered: false },
            );
        }

        res.status(201).json({
            success: true,
            message: "Topic progress created for all batches successfully!",
        });
    } catch (error) {
        next(error);
    }
};

exports.updateProgress = async (req, res, next) => {
    try {
        const StudentId = req.params.StudentId || req.params.studentId || req.params.id;
        const { status, topic } = req.body;
        const mentorBatch = await Batch.findOne({ mentors: req.user.id, students: StudentId, status: "Active" });
        if (!mentorBatch) {
            return res.status(403).json({
                success: false,
                message: "This student is not assigned to your active batch.",
            });
        }
        if (!topic) {
            return res.status(400).json({ success: false, message: "A progress topic is required." });
        }
        const updatedProgress = await progress.findOneAndUpdate(
            { student: StudentId, batch: mentorBatch._id, topic },
            { status },
            { new: true, runValidators: true }
        );

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

exports.getProgress = async (req, res, next) => {
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
exports.getMentorStudentsProgress = async (req, res, next) => {
    try {
        const mentorBatch = await Batch.findOne({ mentors: req.user.id, status: "Active" });

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
