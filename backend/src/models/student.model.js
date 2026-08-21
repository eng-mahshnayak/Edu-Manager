const mongoose = require("mongoose");

// Monthly Fee Subdocument
const monthlyFeeSchema = new mongoose.Schema(
  {
    month: { type: String, required: true },
    amount: { type: Number, required: true, min: 0 },
    dueDate: { type: Date, required: true },
    paid: { type: Boolean, default: false },
    paidDate: { type: Date, default: null },
  },
  { _id: false }
);

// Main Student Schema
const studentSchema = new mongoose.Schema(
  {
    studentId: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    fatherName: { type: String, required: true, trim: true },
    motherName: { type: String, required: true, trim: true },
    dateOfBirth: { type: Date, required: true },
    gender: { type: String, enum: ["male", "female", "other"], required: true },
    class: {
      type: String,
      required: true,
      enum: ["Nursery", "LKG", "UKG", "1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th"],
    },
    section: { type: String, required: true, enum: ["A", "B", "C", "D"] },
    rollNumber: { type: String, required: true, trim: true },
    admissionDate: { type: Date, required: true, default: Date.now },
    admissionType: { type: String, enum: ["online", "offline"], required: true },
    phone: { type: String, required: true, trim: true },
    alternatePhone: { type: String, trim: true, default: "" },
    email: { type: String, required: true, trim: true, lowercase: true },
    address: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    pincode: { type: String, required: true, trim: true },
    feeStructure: {
      admissionFee: { type: Number, required: true, min: 0, default: 5000 },
      feeStatus: { type: Boolean, default: false },          // true if admission fee paid
      admissionPaidDate: { type: Date, default: null },      // when admission fee was paid
      monthlyFees: { type: [monthlyFeeSchema], default: [] },
    },
    status: { type: String, enum: ["active", "inactive", "transferred"], default: "active" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);