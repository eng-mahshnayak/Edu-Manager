const User = require('../models/user.model.js');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const { sendOTPEmail } = require ('../services/emailService.js');
const { generateToken } = require('../middleware/jwtTokenVerify.middleware.js');


// Generate random 6-digit OTP
const generateOTP = () => {
    // Generate 6 digit random number
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// @desc    Request password reset (send OTP)
// @route   POST /api/users/forgot-password
// @access  Public
const  forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        console.log(email,'emailemail');
        

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required'
            });
        }

        // Find user by email
        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'No account found with this email address'
            });
        }

        // Generate OTP
        const otp = generateOTP();
        
        // Hash OTP before storing (optional but recommended)
        // const hashedOTP = crypto.createHash('sha256').update(otp).digest('hex');
        
        // Save OTP and expiry to user document
        user.resetPasswordOTP = otp; // Store hashed OTP if you hash it
        user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
        
        await user.save();

        // Send OTP via email
        try {
            await sendOTPEmail(email, otp);
        } catch (emailError) {
            // If email fails, clear OTP from database
            user.resetPasswordOTP = null;
            user.resetPasswordExpires = null;
            await user.save();
            
            return res.status(500).json({
                success: false,
                message: 'Failed to send OTP email. Please try again.'
            });
        }

        res.status(200).json({
            success: true,
            message: 'OTP sent successfully to your email',
            // In production, don't send OTP in response
            // For testing only - remove in production
            // debug: { otp } 
        });

    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// @desc    Verify OTP
// @route   POST /api/users/verify-otp
// @access  Public
const  verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: 'Email and OTP are required'
            });
        }

        // Find user by email
        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Check if OTP exists and is valid
        if (!user.resetPasswordOTP || !user.resetPasswordExpires) {
            return res.status(400).json({
                success: false,
                message: 'No OTP request found. Please request a new OTP.'
            });
        }

        // Check if OTP has expired
        if (user.resetPasswordExpires < Date.now()) {
            // Clear expired OTP
            user.resetPasswordOTP = null;
            user.resetPasswordExpires = null;
            await user.save();
            
            return res.status(400).json({
                success: false,
                message: 'OTP has expired. Please request a new one.'
            });
        }

        // Verify OTP
        // If you hashed the OTP, compare hash
        // const hashedOTP = crypto.createHash('sha256').update(otp).digest('hex');
        // if (user.resetPasswordOTP !== hashedOTP) {
        
        if (user.resetPasswordOTP !== otp) {
            return res.status(400).json({
                success: false,
                message: 'Invalid OTP'
            });
        }

        // OTP is valid - generate temporary token for password reset
        // This token will be used in reset password step
        const resetToken = jwt.sign(
            { 
                email: user.email,
                purpose: 'password-reset'
            },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );

        // Don't clear OTP yet - wait until password is actually reset
        // This allows retry if something goes wrong in reset step

        res.status(200).json({
            success: true,
            message: 'OTP verified successfully',
            token: resetToken // Send token for next step
        });

    } catch (error) {
        console.error('Verify OTP error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// @desc    Reset password
// @route   POST /api/users/reset-password
// @access  Public
const  resetPassword = async (req, res) => {
    try {
        const { email, newPassword, token } = req.body;

        // Either email + OTP approach OR token approach
        if (token) {
            // Token-based verification (from verify-otp step)
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                
                if (decoded.purpose !== 'password-reset') {
                    return res.status(400).json({
                        success: false,
                        message: 'Invalid reset token'
                    });
                }

                // Find user by email from token
                const user = await User.findOne({ email: decoded.email });
                
                if (!user) {
                    return res.status(404).json({
                        success: false,
                        message: 'User not found'
                    });
                }

                // Update password
                user.password = newPassword;
                
                // Clear OTP fields
                user.resetPasswordOTP = null;
                user.resetPasswordExpires = null;
                
                await user.save();

                return res.status(200).json({
                    success: true,
                    message: 'Password reset successfully'
                });

            } catch (jwtError) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid or expired reset token'
                });
            }
        } 
        else if (email) {
            // Email + OTP approach (verify OTP again)
            const user = await User.findOne({ email: email.toLowerCase() });

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            // Check if OTP is still valid (optional - you can require OTP verification first)
            if (!user.resetPasswordOTP || user.resetPasswordExpires < Date.now()) {
                return res.status(400).json({
                    success: false,
                    message: 'OTP has expired. Please request a new one.'
                });
            }

            // Update password
            user.password = newPassword;
            
            // Clear OTP fields
            user.resetPasswordOTP = null;
            user.resetPasswordExpires = null;
            
            await user.save();

            res.status(200).json({
                success: true,
                message: 'Password reset successfully'
            });
        }
        else {
            return res.status(400).json({
                success: false,
                message: 'Email or token is required'
            });
        }

    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// // 🔐 Generate JWT Token
// const generateToken = (id, role) => {
//     return jwt.sign(
//         { id, role }, 
//         process.env.JWT_SECRET, 
//         { expiresIn: process.env.JWT_EXPIRE || '1d' }
//     );
// };

// 📝 SIGNUP CONTROLLER
const signup = async (req, res) => {
    try {
        let { name, email, password, phoneNumber,role } = req.body;

       
        // Validation - Check required fields
        if (!name || !email || !password||!role) {
            return res.json({
                success: false,
                statusCode:400,
                message: 'Please provide name, email and password,role'
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.json({
                success: false,
                statusCode:400,
                message: 'User already exists with this email'
            });
        }

        // Create new user
        const user = await User.create({
            name,
            email,
            password,
            role:role,
            phoneNumber: phoneNumber || undefined // Optional field
        });

        // Generate token
        const token = generateToken(user._id, user.role);

        // Send response (excluding password)
        res.json({
            success: true,
            statusCode:201,
            message: 'User registered successfully',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                phoneNumber: user.phoneNumber,
                isActive: user.isActive,
                createdAt: user.createdAt
            }
        });

    } catch (error) {
        console.error('Signup Error:', error);
        
        // Handle mongoose validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.json({
                success: false,
                statusCode:400,
                message: 'Validation Error',
                errors: messages
            });
        }

        res.json({
            success: false,
            statusCode:500,
            message: 'Internal server error during signup'
        });
    }
};
// 📝 SIGNUP CONTROLLER
const signupMain = async (req, res) => {
    try {
        let { name, email, password, phoneNumber,role } = req.body;
        let isActive = true
       
    
        // Validation - Check required fields
        if (!name || !email || !password) {
            return res.json({
                success: false,
                statusCode:400,
                message: 'Please provide name, email and password'
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.json({
                success: false,
                statusCode:400,
                message: 'User already exists with this email'
            });
        }

        // Create new user
         await User.create({
            name,
            email,
            password,
            role:role,
            isActive:isActive,
            phoneNumber: phoneNumber || undefined // Optional field
        });

       
        // Send response (excluding password)
        res.json({
            success: true,
            statusCode:201,
            message: 'Registration successful.',
            data:null
        });

    } catch (error) {
        console.error('Signup Error:', error);
        
        // Handle mongoose validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.json({
                success: false,
                statusCode:400,
                message: 'Validation Error',
                errors: messages
            });
        }

        res.json({
            success: false,
            statusCode:500,
            message: 'Internal server error during signup'
        });
    }
};

// 🔑 SIGNIN CONTROLLER
const signin = async (req, res) => {
    try {

        const { email, password } = req.body;

        console.log(req.body,'============req.body;==========');
        
        
        // Validation - Check required fields
        if (!email || !password) {
            return res.json({
                success: false,
                statusCode:400,
                message: 'Please provide username and password'
            });
        }

        // Find user by email and explicitly select password
        const user = await User.findOne({ username:email })   
        
        if (!user) {
            return res.json({
                success: false,
                 statusCode:401,
                message: 'Invalid credentials'
            });
        }

        // Check if user is active
        if (!user.isActive) {
            return res.json({
                 success: false,
                 statusCode:403,
                message: 'Your account has been deactivated. Please contact admin.'
            });
        }


       

        // Compare password
        if (user.password!==password) {
            return res.json({
                success: false,
                statusCode:401,
                message: 'Invalid credentials'
            });
        }

        // Generate token
        const token = await generateToken({id:user._id, role:user.role,
            username: user.username,isActive: user.isActive});


       console.log(token,'=============token============');
            

        // Send response
        res.json({
            success: true,
            statusCode:200,
            message: 'Login successful',
            data:token,
            user: {
                id: user._id,
                name: user.name,
                username: user.username,
                role: user.role,
                isActive: user.isActive
            }
        });

    } catch (error) {
        console.error('Signin Error:', error);
        
        res.json({
            success: false,
            statusCode:500,
            message: 'Internal server error during signin'
        });
    }
};


module.exports = {signup,signupMain,signin,forgotPassword,verifyOTP,resetPassword}