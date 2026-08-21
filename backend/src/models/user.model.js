// models/user.model.js

const mongoose = require('mongoose');
require('dotenv').config(); // Environment variables ke liye

// User Schema
const userSchema = new mongoose.Schema({
    // Basic Information
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minlength: [2, 'Name must be at least 2 characters long'],
        maxlength: [50, 'Name cannot exceed 50 characters']
    },
    username: {
        type: String,
        required: [true, 'username is required'],
        unique: true,
        uppercase: true,
        trim: true
    },
    
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long'],
        // select: false // By default password fetch nahi hoga queries mein
    },
    // Role based access
    role: {
        type: String,
        enum: ['admin', 'deliveryboy', 'sellman'],
        default: 'deliveryboy'
    },
     // OTP fields for password reset
    resetPasswordOTP: {
        type: String,
        default: null
    },
    resetPasswordExpires: {
        type: Date,
        default: null
    },
    // Account Status
    isActive: {
        type: Boolean,
        default: true
    },

}, {
    timestamps: true // Automatically adds createdAt and updatedAt
});


const User = mongoose.model('User', userSchema);

module.exports = User;