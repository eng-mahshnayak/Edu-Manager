const mongoose = require("mongoose");

const basicKnowledgeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },

    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
      lowercase: true,
    },

    imageURL: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const BasicKnowledge = mongoose.model(
  "BasicKnowledge",
  basicKnowledgeSchema
);

module.exports = BasicKnowledge;