const mongoose = require("mongoose");

const assignmentSchema =
  new mongoose.Schema(
    {
      title: {
        type: String,
        required: true,
        trim: true,
      },

      description: {
        type: String,
        required: true,
        trim: true,
      },

      instructions: {
        type: String,
        default: "",
      },

      dueDate: {
        type: Date,
        required: true,
      },

      maxScore: {
        type: Number,
        default: 100,
        min: 0,
      },

      batch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Batch",
        default: null,
      },

      group: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
      },

      createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
      },

      pdfUrl: {
        type: String,
        default: "",
        trim: true,
      },

      pdfOriginalName: {
        type: String,
        default: "",
        trim: true,
      },

      pdfData: {
        type: String,
        default: "",
      },
    },

    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.models.Assignment ||
  mongoose.model(
    "Assignment",
    assignmentSchema
  );
