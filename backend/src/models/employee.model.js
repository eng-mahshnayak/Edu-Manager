const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  // Basic Information
  employeeId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  alternatePhone: {
    type: String,
    trim: true
  },
  
  // Personal Information
  dateOfBirth: {
    type: Date,
    required: true
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: true
  },
  maritalStatus: {
    type: String,
    enum: ['Single', 'Married', 'Divorced', 'Widowed'],
    default: 'Single'
  },
  // Address Information
  presentAddress: {
    street: String,
    city: String,
    state: String,
    postalCode: String,
    country: { type: String, default: 'India' }
  },
  permanentAddress: {
    street: String,
    city: String,
    state: String,
    postalCode: String,
    country: { type: String, default: 'India' }
  },
  
  // Employment Details
  department: {
    type: String,
    required: true,
    enum: ['IT', 'HR', 'Finance', 'Sales', 'Marketing', 'Operations', 'Admin']
  },
  designation: {
    type: String,
    required: true
  },
  joiningDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  employeeType: {
    type: String,
    enum: ['Permanent', 'Contract', 'Probation', 'Intern', 'Temporary'],
    required: true
  },
  
  
  // Salary & Bank Details
  salary: {
    type: Number,
    required: true
  },
  bankDetails: {
    accountNumber: String,
    ifscCode: String,
    bankName: String,
    branchName: String,
    accountHolderName: String
  },
  panNumber: {
    type: String,
    uppercase: true,
    trim: true
  },
  aadharNumber: {
    type: String,
    trim: true
  },
  // Emergency Contact
  emergencyContact: {
    name: String,
    relationship: String,
    phone: String,
    address: String
  },
  
  // Leave & Attendance Settings
  leaveBalance: {
    casualLeave: { type: Number, default: 12 },
    sickLeave: { type: Number, default: 12 },
    earnedLeave: { type: Number, default: 0 },
    compensatoryLeave: { type: Number, default: 0 }
  },
  shiftTiming: {
    start: { type: String, default: '09:00' },
    end: { type: String, default: '18:00' },
    workingDays: [{ type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] }]
  },
  
  // Status
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Suspended', 'Resigned', 'Terminated'],
    default: 'Active'
  },
  resignationDate: Date,
  lastWorkingDay: Date,
  
  // Metadata
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

// Virtual for full name
employeeSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Index for search
employeeSchema.index({ 
  firstName: 'text', 
  lastName: 'text', 
  email: 'text', 
  employeeId: 'text',
  phone: 'text',
  department: 'text',
  designation: 'text'
});

module.exports = mongoose.model('Employee', employeeSchema);