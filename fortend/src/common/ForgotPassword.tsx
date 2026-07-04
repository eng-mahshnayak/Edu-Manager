import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from "react-hot-toast";

export default function ForgotPassword() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const API_URL = import.meta.env.VITE_API_URL;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validation
        if (!email || email === '') {
            toast.error("Please enter your email address");
            return;
        }
        
        setLoading(true);

        try {
            const response = await axios.post(
                `${API_URL}/users/forgotpassword`,
                { email }
            );

            console.log(response, 'hello check point');

            if (response.data?.success) {
                toast.success("OTP sent to your email");
                // Email ko state mein save karo ya localStorage mein
                localStorage.setItem("resetEmail", email);
                navigate("/verify-otp");
            } else {
                toast.error(response.data?.message || "Failed to send OTP");
            }
        } catch (err: any) {
            console.log(err);
            toast.error(err.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-indigo-800 to-purple-900 p-4 relative overflow-hidden">
            {/* Animated background elements - School themed */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
            </div>

            {/* Main card */}
            <div className="w-full max-w-5xl flex flex-col lg:flex-row rounded-2xl shadow-2xl overflow-hidden bg-gray-900/80 backdrop-blur-xl border border-gray-700 transform transition-all duration-300 hover:shadow-3xl relative z-10">
                {/* LEFT SIDE - School branding and support info */}
                <div className="lg:w-1/2 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-8 md:p-12 flex flex-col justify-between relative overflow-hidden">
                    {/* Animated education icons */}
                    <div className="absolute top-4 right-4 opacity-20">
                        <svg className="w-24 h-24 animate-pulse" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 3L1 9l11 6 11-6-11-6zM1 15l11 6 11-6M1 12l11 6 11-6" />
                        </svg>
                    </div>
                    
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                                <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 3L1 9l11 6 11-6-11-6zM1 15l11 6 11-6M1 12l11 6 11-6" />
                                </svg>
                            </div>
                            <h1 className="text-4xl font-bold text-white">
                                Edu<span className="text-blue-300">Manager</span>
                            </h1>
                        </div>
                        <p className="text-lg text-white/90 max-w-sm">
                            Reset your password securely and regain access to your school management dashboard.
                        </p>
                        
                        {/* Support info */}
                        <div className="mt-8 space-y-3">
                            <div className="flex items-center gap-3 text-sm">
                                <svg className="w-5 h-5 text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6-4h12a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6a2 2 0 012-2zm10-4a4 4 0 00-8 0v4h8v-4z" />
                                </svg>
                                <span className="text-white/80">Secure OTP verification</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <svg className="w-5 h-5 text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <span className="text-white/80">Instant email delivery</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <svg className="w-5 h-5 text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                                <span className="text-white/80">Bank-level security</span>
                            </div>
                        </div>
                    </div>

                    {/* Testimonial */}
                    <div className="mt-12 lg:mt-0 relative z-10">
                        <div className="flex items-center gap-4 p-4 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 transition-all duration-300 hover:bg-white/20 cursor-default">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-2xl font-semibold">
                                🔐
                            </div>
                            <div>
                                <p className="font-semibold text-white text-lg">Secure Recovery</p>
                                <p className="text-sm text-white/80">2-Step Verification</p>
                            </div>
                        </div>
                        <p className="text-sm text-white/80 mt-4 italic p-3 rounded-lg bg-white/5 border border-white/10">
                            "We'll send you a verification code to reset your password securely."
                        </p>
                    </div>
                </div>

                {/* RIGHT SIDE - Forgot Password Form */}
                <div className="lg:w-1/2 p-8 md:p-12 bg-gray-900/50 backdrop-blur-sm">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent transition-all duration-300 hover:scale-105">
                            Reset Password
                        </h2>
                        <div className="flex items-center gap-2">
                            <svg className="w-8 h-8 text-blue-400 animate-pulse" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 3L1 9l11 6 11-6-11-6zM1 15l11 6 11-6M1 12l11 6 11-6" />
                            </svg>
                        </div>
                    </div>

                    <p className="text-gray-400 mb-6 p-3 rounded-lg transition-all duration-300 hover:bg-gray-800/50 hover:text-gray-300 border border-gray-700">
                        Enter your registered email address and we'll send you an OTP to reset your password.
                    </p>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {/* Email Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1 transition-colors duration-200 hover:text-blue-400">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="principal@school.edu"
                                    className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500
                                    transition-all duration-200 hover:border-blue-500 hover:bg-gray-750
                                    focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-3 px-4 rounded-lg 
                            transition-all duration-200 hover:from-blue-600 hover:to-indigo-700 hover:shadow-lg hover:shadow-blue-500/25 hover:scale-[1.02] 
                            active:scale-[0.98] focus:ring-4 focus:ring-blue-500/50 
                            disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 relative overflow-hidden group"
                        >
                            <span className="relative z-10">
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Sending OTP...
                                    </span>
                                ) : (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        Send Reset OTP
                                    </span>
                                )}
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                        </button>
                    </form>

                    {/* Back to Login Link */}
                    <p className="text-center text-sm text-gray-400 mt-8">
                        Remember your password?{" "}
                        <a 
                            href="/" 
                            className="text-blue-500 hover:text-blue-400 font-medium 
                            transition-all duration-200 hover:scale-105 inline-block"
                        >
                            Back to Login
                        </a>
                    </p>

                    {/* Security badge */}
                    <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-500">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6-4h12a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6a2 2 0 012-2zm10-4a4 4 0 00-8 0v4h8v-4z" />
                        </svg>
                        <span>Secure OTP verification | 5 minutes expiry</span>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes blob {
                    0% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                    100% { transform: translate(0px, 0px) scale(1); }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
            `}</style>
        </div>
    );
}