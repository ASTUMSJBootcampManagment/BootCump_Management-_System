const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema(
  {
    assignment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assignment",
      required: [true, "Assignment ID is required"],
    },

    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user", // Updated to capitalized "User" to match standard model registration
      required: [true, "Student ID is required"],
    },

    content: {
      type: String,
      required: [true, "Submission content is required"],
      trim: true,
    },

    githubUrl: {
      type: String,
      default: "",
      trim: true,
    },

    liveUrl: {
      type: String,
      default: "",
      trim: true,
    },

    notes: {
      type: String,
      default: "",
      trim: true,
    },

    status: {
      type: String,
      enum: ["Submitted", "Graded", "ResubmissionRequested"],
      default: "Submitted",
    },

    resubmissionRequested: {
      type: Boolean,
      default: false,
    },

    submittedAt: {
      type: Date,
      default: Date.now,
    },

    grade: {
      type: Number,
      min: [0, "Grade cannot be negative"],
      default: null,
    },

    feedback: {
      type: String,
      default: "",
      trim: true,
    },

    gradedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Updated to capitalized "User"
      default: null,
    },

    gradedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

// Prevent duplicate submissions by the same student for a single assignment
submissionSchema.index(
  {
    assignment: 1,
    student: 1,
  },
  {
    unique: true,
  },
);

module.exports =
  mongoose.models.Submission || mongoose.model("Submission", submissionSchema);
