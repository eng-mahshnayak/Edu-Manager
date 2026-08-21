const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    staffId: {
      type: String,
      required: true,
      trim: true,
    },
    staffName: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["present", "absent", "late", "half-day"],
      default: "absent",
    },
    checkInTime: {
      type: String, // e.g., "09:00"
      default: "",
    },
    checkOutTime: {
      type: String,
      default: "",
    },
    remarks: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for unique staff per day
attendanceSchema.index({ staffId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("Attendance", attendanceSchema);