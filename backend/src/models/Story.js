// const mongoose = require("mongoose");

// const storySchema = new mongoose.Schema(
//   {
//     title: {
//       type: String,
//       required: true,
//     },

//     language: {
//       type: String,
//       enum: ["en", "hi"],
//       required: true,
//     },

//     lineCount: {
//       type: Number,
//       enum: [4, 8, 12],
//       required: true,
//     },

//     lines: [
//       {
//         id: Number,
//         text: String,
//         emoji: String,
//       },
//     ],

//     moral: {
//       type: String,
//       required: true,
//     },

//     subhVichar: {
//       type: String,
//       default: "",
//     },

//     vocabulary: {
//       type: [String],
//       default: [],
//     },

//     funFact: {
//       type: String,
//       default: "",
//     },

//     category: {
//       type: String,
//       default: "General",
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// module.exports = mongoose.model("Story", storySchema);


const mongoose = require("mongoose");

const storySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    language: { type: String, enum: ["en", "hi"], required: true },
    lineCount: { type: Number, enum: [4, 8, 12], required: true },
    lines: [{ id: Number, text: String, emoji: String }],
    moral: { type: String, required: true },
    subhVichar: { type: String, default: "" },
    vocabulary: { type: [String], default: [] },
    funFact: { type: String, default: "" },
    category: { type: String, default: "General" },
    theme: { type: String, default: "" }, // NEW: e.g., Kindness, Honesty
  },
  { timestamps: true }
);

module.exports = mongoose.model("Story", storySchema);