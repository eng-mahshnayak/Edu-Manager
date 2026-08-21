const mongoose = require("mongoose");

// -------------------------------
// Staff Schema
// -------------------------------
const staffSchema = new mongoose.Schema(
  {
    // Staff ID (e.g., STF001)
    staffId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    // Personal Information
    name: {
      type: String,
      required: [true, "Staff name is required"],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },

    // Role & Department
    role: {
      type: String,
       uppercase: true,
      required: true,
    },
    department: {
      type: String,
      trim: true,
      default: undefined, // Optional; only used for TEACHER
    },

    // Employment Details
    joiningDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    salaryType: {
      type: String,
      enum: ["MONTHLY", "DAILY", "HOURLY"],
      required: true,
    },
    salary: {
      type: Number,
      required: true,
      min: 0,
    },

    // Status
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);



// Compile and export
module.exports = mongoose.model("Staff", staffSchema);