const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  duration: { type: String, required: true },
}, { _id: false });

const examCenterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  roomNo: { type: String, required: true },
}, { _id: false });

const examAdmitCardSchema = new mongoose.Schema({
  // Auto-generated ID (ADM001) – optional, we can use _id
  admitCardId: {
    type: String,
    unique: true,
    trim: true,
  },
  studentId: { type: String, required: true },
  studentName: { type: String, required: true },
  fatherName: { type: String, required: true },
  className: { type: String, required: true },
  section: { type: String, required: true },
  rollNo: { type: String, required: true },
  enrollmentNo: { type: String, required: true },
  examName: { type: String, required: true },
  examYear: { type: String, required: true },
  examDates: {
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
  },
  examCenter: { type: examCenterSchema, required: true },
  subjects: { type: [subjectSchema], required: true },
  instructions: { type: [String], required: true },
  generatedDate: { type: String, required: true },
}, {
  timestamps: true,
});

// Indexes for faster filtering
examAdmitCardSchema.index({ className: 1, examName: 1 });
examAdmitCardSchema.index({ studentId: 1 });
examAdmitCardSchema.index({ rollNo: 1 });

// Pre-save hook to auto-generate admitCardId (e.g., ADM001)
examAdmitCardSchema.pre("save", async function (next) {
  if (this.admitCardId) return next();
  const lastCard = await this.constructor.findOne().sort({ admitCardId: -1 });
  let num = 1;
  if (lastCard && lastCard.admitCardId) {
    const lastNum = parseInt(lastCard.admitCardId.slice(3));
    if (!isNaN(lastNum)) num = lastNum + 1;
  }
  this.admitCardId = "ADM" + String(num).padStart(3, "0");
  next();
});

module.exports = mongoose.model("ExamAdmitCard", examAdmitCardSchema);