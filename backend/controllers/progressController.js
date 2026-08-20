const mongoose = require("mongoose");
const progress = require("../models/progress");
const User = require("../models/UserModel");
const Batch = require("../models/Batches"); 

exports.createTopic = async (req, res) => {
    try {
        const { topic } = req.body;
        const students = await User.find({ role: "Student" });

        for (const student of students) {
            const studentBatch = await Batch.findOne({ students: student._id });

            await progress.create({
                topic: topic,
                student: student._id,
                batch: studentBatch ? studentBatch._id : null
            });
        }

        res.status(201).json({
            success: true,
            message: "Progress created for all students successfully!",
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
exports.updateProgress = async (req, res) => {
    try {
        const { StudentId } = req.params;
        const { status, topic } = req.body; 
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
        const updatedProgress = await progress.findOneAndUpdate(
            { student: StudentId, ...batchQuery },
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
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

exports.getProgress = async (req, res) => {
    try {
        const { StudentId } = req.params;
        let query = {};
        if (StudentId) {
            query.student = StudentId;
        } else {
            const { topic, status, batch } = req.query;
            if (topic) query.topic = topic;
            if (status) query.status = status;
            if (batch) query.batch = batch;
        }

        const getProgresses = await progress.find(query);

        res.status(200).json({
            success: true,
            message: "Progress retrieved successfully",
            data: getProgresses,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
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
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};