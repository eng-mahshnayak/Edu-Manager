
const nodemailer = require('nodemailer');

// Send OTP email
const sendOTPEmail = async (email, otp) => {
    try {

        // Create transporter
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        console.log(transporter, transporter);
        
        const mailOptions = {
            from: `"CryptoTrade Support" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: '🔐 Password Reset OTP - CryptoTrade',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>CryptoTrade - Password Reset</title>
                    <style>
                        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
                    </style>
                </head>
                <body style="margin: 0; padding: 0; font-family: 'Inter', Arial, sans-serif; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);">
                    <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
                        <!-- Main Card -->
                        <div style="background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(10px); border-radius: 20px; border: 1px solid rgba(255, 255, 255, 0.1); overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);">
                            
                            <!-- Header with Crypto Gradient -->
                            <div style="background: linear-gradient(135deg, #f59e0b 0%, #f97316 50%, #ef4444 100%); padding: 40px 30px; text-align: center;">
                                <div style="display: inline-flex; align-items: center; gap: 12px; margin-bottom: 20px;">
                                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" fill="white" stroke="white" stroke-width="1"/>
                                    </svg>
                                    <h1 style="color: white; font-size: 32px; font-weight: 700; margin: 0; letter-spacing: -0.5px;">
                                        Crypto<span style="color: #fbbf24;">Trade</span>
                                    </h1>
                                </div>
                                <h2 style="color: white; font-size: 24px; font-weight: 600; margin: 0; opacity: 0.95;">
                                    Password Reset Request
                                </h2>
                                <p style="color: rgba(255, 255, 255, 0.9); font-size: 16px; margin-top: 12px;">
                                    Secure your account with one-time verification
                                </p>
                            </div>
                            
                            <!-- Content Area -->
                            <div style="padding: 40px 30px; background: rgba(255, 255, 255, 0.03);">
                                <div style="text-align: center;">
                                    <div style="display: inline-block; background: rgba(245, 158, 11, 0.1); border-radius: 12px; padding: 8px 16px; margin-bottom: 24px;">
                                        <p style="color: #f59e0b; font-size: 14px; font-weight: 500; margin: 0;">
                                            🔐 Verification Required
                                        </p>
                                    </div>
                                    
                                    <p style="color: #e2e8f0; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                                        We received a request to reset your password for your CryptoTrade account. 
                                        Use the verification code below to complete the process.
                                    </p>
                                    
                                    <!-- OTP Box -->
                                    <div style="background: rgba(0, 0, 0, 0.4); border-radius: 16px; padding: 30px; margin: 30px 0; border: 1px solid rgba(245, 158, 11, 0.3);">
                                        <p style="color: #94a3b8; font-size: 14px; margin-bottom: 15px; letter-spacing: 1px;">
                                            YOUR VERIFICATION CODE
                                        </p>
                                        <div style="font-size: 48px; font-weight: 800; color: #f59e0b; letter-spacing: 8px; background: linear-gradient(135deg, #f59e0b, #f97316); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; margin: 20px 0;">
                                            ${otp}
                                        </div>
                                        <div style="display: inline-block; background: rgba(245, 158, 11, 0.2); border-radius: 8px; padding: 6px 12px;">
                                            <p style="color: #f59e0b; font-size: 13px; margin: 0;">
                                                ⏰ Expires in 10 minutes
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <!-- Security Tips -->
                                    <div style="background: rgba(245, 158, 11, 0.05); border-radius: 12px; padding: 20px; margin: 30px 0; border-left: 3px solid #f59e0b;">
                                        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
                                            <span style="font-size: 20px;">🔒</span>
                                            <p style="color: #f59e0b; font-weight: 600; margin: 0;">Security Tips</p>
                                        </div>
                                        <ul style="color: #cbd5e1; font-size: 13px; line-height: 1.8; margin: 0; padding-left: 20px;">
                                            <li>Never share this OTP with anyone</li>
                                            <li>CryptoTrade will never ask for your password or OTP</li>
                                            <li>This code is valid for single use only</li>
                                        </ul>
                                    </div>
                                    
                                    <p style="color: #64748b; font-size: 13px; margin-top: 30px;">
                                        If you didn't request this password reset, please ignore this email or 
                                        <a href="#" style="color: #f59e0b; text-decoration: none; font-weight: 500;">contact support</a> immediately.
                                    </p>
                                </div>
                            </div>
                            
                            <!-- Footer -->
                            <div style="padding: 30px; text-align: center; border-top: 1px solid rgba(255, 255, 255, 0.1); background: rgba(0, 0, 0, 0.2);">
                                <div style="display: flex; justify-content: center; gap: 24px; margin-bottom: 20px;">
                                    <a href="#" style="color: #94a3b8; text-decoration: none; font-size: 12px;">Security</a>
                                    <a href="#" style="color: #94a3b8; text-decoration: none; font-size: 12px;">Privacy Policy</a>
                                    <a href="#" style="color: #94a3b8; text-decoration: none; font-size: 12px;">Terms of Service</a>
                                </div>
                                <p style="color: #64748b; font-size: 12px; margin: 0;">
                                    &copy; 2024 CryptoTrade. All rights reserved.<br>
                                    Secure Trading Platform
                                </p>
                                <p style="color: #475569; font-size: 11px; margin-top: 16px;">
                                    This is an automated message, please do not reply to this email.
                                </p>
                            </div>
                        </div>
                        
                        <!-- Additional Info -->
                        <div style="text-align: center; margin-top: 24px;">
                            <p style="color: #64748b; font-size: 12px;">
                                Need help? Contact our support team at 
                                <a href="mailto:support@cryptotrade.com" style="color: #f59e0b; text-decoration: none;">support@cryptotrade.com</a>
                            </p>
                        </div>
                    </div>
                </body>
                </html>
            `,
            // Alternative plain text version for email clients that don't support HTML
            text: `
CryptoTrade - Password Reset Request

Hello,

We received a request to reset your password for your CryptoTrade account.

Your OTP for password reset is: ${otp}

This OTP will expire in 10 minutes.

Security Tips:
- Never share this OTP with anyone
- CryptoTrade will never ask for your password or OTP
- This code is valid for single use only

If you didn't request this password reset, please ignore this email or contact support immediately.

© 2024 CryptoTrade. All rights reserved.
Secure Trading Platform
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`OTP email sent to ${email}`);
        return true;
    } catch (error) {
        console.error('Email sending error:', error);
        throw new Error('Failed to send email');
    }
};

module.exports = { sendOTPEmail };