// models/user.model.js

const mongoose = require('mongoose');


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
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please provide a valid email address'
        ]
    },
    
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long'],
        // select: false // By default password fetch nahi hoga queries mein
    },
    phoneNumber: {
        type: String,
        validate: {
            validator: function(v) {
                return /\d{10}/.test(v); // Basic validation - 10 digits
            },
            message: props => `${props.value} is not a valid phone number!`
        }
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