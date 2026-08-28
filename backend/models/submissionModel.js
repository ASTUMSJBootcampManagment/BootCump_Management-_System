const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema(
  {
    assignment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assignment",
      required: true,
    },

    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    content: {
      type: String,
      required: true,
      trim: true,
    },

    githubUrl: { type: String, default: "", trim: true },
    liveUrl: { type: String, default: "", trim: true },
    notes: { type: String, default: "", trim: true },
    status: { type: String, enum: ["Submitted", "Graded", "ResubmissionRequested"], default: "Submitted" },
    resubmissionRequested: { type: Boolean, default: false },

    submittedAt: {
      type: Date,
      default: Date.now,
    },

    grade: {
      type: Number,
      min: 0,
      default: null,
    },

    feedback: {
      type: String,
      default: "",
      trim: true,
    },

    gradedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      default: null,
    },

    gradedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

submissionSchema.index(
  {
    assignment: 1,
    student: 1,
  },
  {
    unique: true,
  }
);

module.exports =
  mongoose.models.Submission ||
  mongoose.model(
    "Submission",
    submissionSchema
  );
