const mongoose = require("mongoose");

const classAssignmentSchema = new mongoose.Schema(
  {
    className: {
      type: String,
      required: [true, "Class name is required"],
      trim: true,
    },
    section: {
      type: String,
      required: [true, "Section is required"],
      enum: ["A", "B", "C", "D"],
    },
    staffId: {
      type: String,
      required: [true, "Staff ID is required"],
      trim: true,
    },
    staffName: {
      type: String,
      required: [true, "Staff name is required"],
      trim: true,
    },
    subject: {
      type: String,
      required: [true, "Subject is required"],
      trim: true,
    },
    timings: {
      startTime: { type: String, required: true },
      endTime: { type: String, required: true },
    },
    daysOfWeek: {
      type: [String],
      required: true,
      enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    },
    roomNumber: {
      type: String,
      required: [true, "Room number is required"],
      trim: true,
    },
    academicYear: {
      type: String,
      required: [true, "Academic year is required"],
      default: "2024-2025",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);



module.exports = mongoose.model("ClassAssignment", classAssignmentSchema);