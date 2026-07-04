import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL;
import toast from "react-hot-toast";

export default function VerifyOTP() {
    const navigate = useNavigate();
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [loading, setLoading] = useState(false);
    const [timer, setTimer] = useState(60);
    const [canResend, setCanResend] = useState(false);
    const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

    useEffect(() => {
        const email = localStorage.getItem("resetEmail");
        if (!email) {
            navigate("/forgot-password");
        }
    }, [navigate]);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;

        if (timer > 0 && !canResend) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        } else if (timer === 0) {
            setCanResend(true);
        }

        return () => clearInterval(interval);
    }, [timer, canResend]);

    const handleChange = (index: number, value: string) => {
        if (value.length > 1) return; // Only allow single digit
        
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value !== "" && index < 5) {
            const nextInput = document.getElementById(`otp-${index + 1}`);
            nextInput?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === "Backspace" && otp[index] === "" && index > 0) {
            const prevInput = document.getElementById(`otp-${index - 1}`);
            prevInput?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').slice(0, 6).split('');
        const newOtp: any = [...otp];
        
        pastedData.forEach((value, index) => {
            if (index < 6 && /^\d$/.test(value)) {
                newOtp[index] = value;
            }
        });
        
        setOtp(newOtp);
        
        // Focus last filled or first empty
        const lastFilledIndex = newOtp?.findLastIndex((val: any) => val !== "");
        const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
        document.getElementById(`otp-${focusIndex}`)?.focus();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const otpString = otp.join("");
        
        if (otpString.length !== 6) {
            toast.error("Please enter complete OTP");
            return;
        }

        setLoading(true);

        try {
            const email = localStorage.getItem("resetEmail");
            const response = await axios.post(
                `${API_URL}/users/verifyotp`,
                { email, otp: otpString }
            );

            if (response.data?.success) {
                toast.success("OTP verified successfully");
                // Store verification token if needed
                if (response.data.token) {
                    localStorage.setItem("resetToken", response.data.token);
                }
                navigate("/reset-password");
            } else {
                toast.error(response.data?.message || "Invalid OTP");
            }
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Verification failed");
        } finally {
            setLoading(false);
        }
    };

    const handleResendOTP = async () => {
        setCanResend(false);
        setTimer(60);
        
        try {
            const email = localStorage.getItem("resetEmail");
            await axios.post(`${API_URL}/users/forgotpassword`, { email });
            toast.success("New OTP sent");
        } catch (err: any) {
            toast.error("Failed to resend OTP");
            setCanResend(true);
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
                {/* LEFT SIDE - School branding */}
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
                            Verify your identity to reset your password.
                        </p>
                        
                        {/* Security steps */}
                        <div className="mt-8 space-y-3">
                            <div className="flex items-center gap-3 text-sm">
                                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
                                    1
                                </div>
                                <span className="text-white/80">Enter your email</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <div className="w-6 h-6 rounded-full bg-blue-400 text-gray-900 flex items-center justify-center text-xs font-bold">
                                    2
                                </div>
                                <span className="text-white font-semibold">Verify OTP</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
                                    3
                                </div>
                                <span className="text-white/80">Reset password</span>
                            </div>
                        </div>
                    </div>

                    {/* Security info */}
                    <div className="mt-12 lg:mt-0 relative z-10">
                        <div className="flex items-center gap-4 p-4 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 transition-all duration-300 hover:bg-white/20 cursor-default">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-2xl font-semibold">
                                🔐
                            </div>
                            <div>
                                <p className="font-semibold text-white text-lg">2-Step Verification</p>
                                <p className="text-sm text-white/80">Enhanced Security</p>
                            </div>
                        </div>
                        <p className="text-sm text-white/80 mt-4 italic p-3 rounded-lg bg-white/5 border border-white/10">
                            "Enter the 6-digit verification code sent to your email."
                        </p>
                    </div>
                </div>

                {/* RIGHT SIDE - OTP Form */}
                <div className="lg:w-1/2 p-8 md:p-12 bg-gray-900/50 backdrop-blur-sm">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent transition-all duration-300 hover:scale-105">
                            Verify OTP
                        </h2>
                        <div className="flex items-center gap-2">
                            <svg className="w-8 h-8 text-blue-400 animate-pulse" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 3L1 9l11 6 11-6-11-6zM1 15l11 6 11-6M1 12l11 6 11-6" />
                            </svg>
                        </div>
                    </div>

                    <p className="text-gray-400 mb-6 p-3 rounded-lg transition-all duration-300 hover:bg-gray-800/50 hover:text-gray-300 border border-gray-700 break-all">
                        We've sent a 6-digit verification code to <span className="text-blue-500 font-medium">{localStorage.getItem("resetEmail")}</span>
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* OTP Input Fields */}
                        <div className="flex justify-between gap-2">
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    id={`otp-${index}`}
                                    type="text"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    onPaste={index === 0 ? handlePaste : undefined}
                                    onFocus={() => setFocusedIndex(index)}
                                    onBlur={() => setFocusedIndex(null)}
                                    className={`w-12 h-12 text-center text-xl font-semibold border rounded-lg 
                                    transition-all duration-200 outline-none
                                    hover:border-blue-500 hover:ring-2 hover:ring-blue-500/20
                                    focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
                                    ${focusedIndex === index ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-gray-700'}
                                    ${digit ? 'bg-gray-800 border-blue-500 text-blue-500' : 'bg-gray-800 text-white'}
                                    text-white`}
                                    required
                                />
                            ))}
                        </div>

                        {/* Verify Button */}
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
                                        Verifying...
                                    </span>
                                ) : (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                        </svg>
                                        Verify & Continue
                                    </span>
                                )}
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                        </button>
                    </form>

                    {/* Resend OTP Section */}
                    <div className="text-center mt-6">
                        {canResend ? (
                            <button
                                onClick={handleResendOTP}
                                className="text-blue-500 hover:text-blue-400 font-medium 
                                transition-all duration-200 hover:scale-105 
                                hover:underline inline-block"
                            >
                                Resend OTP
                            </button>
                        ) : (
                            <p className="text-gray-400 transition-all duration-300 hover:text-gray-300">
                                Resend OTP in <span className="font-semibold text-blue-500">{timer}</span> seconds
                            </p>
                        )}
                    </div>

                    {/* Try different email link */}
                    <p className="text-center text-sm text-gray-400 mt-8">
                        <a 
                            href="/forgot-password" 
                            className="text-blue-500 hover:text-blue-400 font-medium 
                            transition-all duration-200 hover:scale-105 
                            hover:underline inline-block"
                        >
                            Try different email
                        </a>
                    </p>

                    {/* Security note */}
                    <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-500">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6-4h12a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6a2 2 0 012-2zm10-4a4 4 0 00-8 0v4h8v-4z" />
                        </svg>
                        <span>OTP expires in 5 minutes | For security, never share your code</span>
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