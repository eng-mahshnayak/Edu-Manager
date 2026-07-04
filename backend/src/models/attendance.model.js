const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  employeeId: {
    type: String,
    required: true
  },
  employeeName: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  
  // Check-in/Check-out Times
  checkIn: Date,
  
  checkOut: Date,
  // Working Hours
  totalWorkingHours: {
    type: Number, // in hours
    default: 0
  },
  overtime: {
    type: Number, // in hours
    default: 0
  },
  

  
  // Status & Type
  status: {
    type: String,
    enum: ['Present', 'Absent','Half Day', 'Holiday', 'Leave', 'Week Off',],
    required: true
  },
  attendanceType: {
    type: String,
    enum: ['Regular', 'Overtime', 'Holiday Work', 'Weekend Work'],
    default: 'Regular'
  },
  // Additional Info
  remarks: String,
  
  // Audit
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Compound index to ensure one attendance record per employee per day
attendanceSchema.index({ employee: 1, date: 1 }, { unique: true });

// Index for search
attendanceSchema.index({ 
  employeeId: 'text', 
  employeeName: 'text',
  status: 'text'
});

module.exports = mongoose.model('Attendance', attendanceSchema);