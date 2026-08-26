const mongoose = require("mongoose");

const batchSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    year: {
      type: Number,
      required: [true, "Year is required"],
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },
    endDate: {
      type: Date,
      required: [true, "End date is required"],
    },
    status: {
      type: String,
      enum: ["Upcoming", "Active", "Completed"],
      default: "Active",
    },
    mentors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Batch", batchSchema);