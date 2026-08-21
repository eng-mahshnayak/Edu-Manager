const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  question: { type: String, required: true },
  options: { type: [String], default: [] },
  correctAnswer: { type: String },
  answer: { type: String }, // for non-MCQ
});

const sectionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  marksPerQuestion: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  totalMarks: { type: Number, required: true },
  questions: [questionSchema],
});

const questionPaperSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    language: { type: String, enum: ["english", "hindi"], default: "english" },
    metadata: {
      className: { type: String, required: true },
      subject: { type: String, required: true },
      chapter: { type: String, default: "General" },
      difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], default: "Medium" },
      totalMarks: { type: Number, required: true },
      generatedDate: { type: Date, default: Date.now },
    },
    sections: {
      sectionA: sectionSchema,
      sectionB: sectionSchema,
      sectionC: sectionSchema,
      sectionD: sectionSchema,
    },
    answerKey: {
      sectionA: { type: [String], default: [] },
      sectionB: { type: [String], default: [] },
      sectionC: { type: [String], default: [] },
      sectionD: { type: [String], default: [] },
    },
    // Optional: store the prompt or user reference
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("QuestionPaper", questionPaperSchema);