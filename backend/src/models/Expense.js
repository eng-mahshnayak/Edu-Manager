const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    // Auto‑generated expense ID (e.g., EXP001)
    expenseId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    date: {
      type: Date,
      required: [true, "Date is required"],
      default: Date.now,
    },

    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },

    subCategory: {
      type: String,
      trim: true,
      default: "",
    },

    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: 0,
    },

    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },

    paymentMethod: {
      type: String,
      enum: ["cash", "bank", "cheque", "online"],
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ["paid", "pending", "partial"],
      default: "paid",
    },

    billNumber: {
      type: String,
      trim: true,
      default: "",
    },

    vendorName: {
      type: String,
      trim: true,
      default: "",
    },

    vendorPhone: {
      type: String,
      trim: true,
      default: "",
    },

    attachment: {
      type: String, // Cloudinary/Base64 URL or file path
      default: "",
    },

    approvedBy: {
      type: String,
      trim: true,
      default: "",
    },

    remarks: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true, // adds createdAt, updatedAt
  }
);



module.exports = mongoose.model("Expense", expenseSchema);