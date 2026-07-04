import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL;
import toast from "react-hot-toast";

export default function ResetPassword() {
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [passwordFocused, setPasswordFocused] = useState(false);
    const [confirmFocused, setConfirmFocused] = useState(false);

    useEffect(() => {
        const email = localStorage.getItem("resetEmail");
        // const token = localStorage.getItem("resetToken"); // If using token
        if (!email) {
            navigate("/forgot-password");
        }
    }, [navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        if (password.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        setLoading(true);

        try {
            const email = localStorage.getItem("resetEmail");
            // const token = localStorage.getItem("resetToken"); // If using token
            
            const response = await axios.post(
                `${API_URL}/users/reset-password`,
                { 
                    email, 
                    newPassword: password,
                    // token // If using token
                }
            );

            if (response.data?.success) {
                toast.success("Password reset successfully");
                
                // Clean up storage
                localStorage.removeItem("resetEmail");
                localStorage.removeItem("resetToken");
                
                // Redirect to login
                setTimeout(() => navigate("/"), 2000);
            } else {
                toast.error(response.data?.message || "Failed to reset password");
            }
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    // Calculate password strength
    const getPasswordStrength = () => {
        if (!password) return { level: 0, text: "", color: "" };
        if (password.length < 6) return { level: 1, text: "Too Short", color: "bg-red-500" };
        if (password.length < 8) return { level: 2, text: "Weak", color: "bg-red-500" };
        if (password.length < 10) return { level: 3, text: "Medium", color: "bg-yellow-500" };
        return { level: 4, text: "Strong", color: "bg-green-500" };
    };

    const strength = getPasswordStrength();

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
                            Create a strong password to secure your school management account.
                        </p>
                        
                        {/* Security tips */}
                        <div className="mt-8 space-y-3">
                            <div className="flex items-center gap-3 text-sm">
                                <svg className="w-5 h-5 text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                                <span className="text-white/80">Use 8+ characters</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <svg className="w-5 h-5 text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                                <span className="text-white/80">Mix uppercase & lowercase</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <svg className="w-5 h-5 text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                                <span className="text-white/80">Include numbers & symbols</span>
                            </div>
                        </div>
                    </div>

                    {/* Testimonial */}
                    <div className="mt-12 lg:mt-0 relative z-10">
                        <div className="flex items-center gap-4 p-4 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 transition-all duration-300 hover:bg-white/20 cursor-default">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-2xl font-semibold">
                                🔒
                            </div>
                            <div>
                                <p className="font-semibold text-white text-lg">Secure Account</p>
                                <p className="text-sm text-white/80">2FA Recommended</p>
                            </div>
                        </div>
                        <p className="text-sm text-white/80 mt-4 italic p-3 rounded-lg bg-white/5 border border-white/10">
                            "Choose a strong password that you haven't used on other platforms."
                        </p>
                    </div>
                </div>

                {/* RIGHT SIDE - Reset Password Form */}
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

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {/* New Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1 transition-colors duration-200 hover:text-blue-400">
                                New Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6-4h12a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6a2 2 0 012-2zm10-4a4 4 0 00-8 0v4h8v-4z" />
                                    </svg>
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    onFocus={() => setPasswordFocused(true)}
                                    onBlur={() => setPasswordFocused(false)}
                                    placeholder="••••••••"
                                    required
                                    className={`w-full pl-10 pr-12 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-500
                                    transition-all duration-200 outline-none
                                    hover:border-blue-500 hover:ring-2 hover:ring-blue-500/20
                                    focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
                                    ${passwordFocused ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-gray-700'}`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 
                                    transition-all duration-200 hover:text-blue-400 hover:scale-110 
                                    active:scale-95 focus:outline-none"
                                >
                                    {showPassword ? (
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1 transition-colors duration-200 hover:text-blue-400">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6-4h12a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6a2 2 0 012-2zm10-4a4 4 0 00-8 0v4h8v-4z" />
                                    </svg>
                                </div>
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    onFocus={() => setConfirmFocused(true)}
                                    onBlur={() => setConfirmFocused(false)}
                                    placeholder="••••••••"
                                    required
                                    className={`w-full pl-10 pr-12 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-500
                                    transition-all duration-200 outline-none
                                    hover:border-blue-500 hover:ring-2 hover:ring-blue-500/20
                                    focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
                                    ${confirmFocused ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-gray-700'}`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 
                                    transition-all duration-200 hover:text-blue-400 hover:scale-110 
                                    active:scale-95 focus:outline-none"
                                >
                                    {showConfirmPassword ? (
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Password strength indicator */}
                        <div className="text-sm bg-gray-800/50 p-4 rounded-lg border border-gray-700 transition-all duration-300 hover:bg-gray-800/70">
                            <p className="text-gray-300 font-medium mb-2">Password requirements:</p>
                            <ul className="text-gray-400 space-y-2">
                                <li className="flex items-center gap-2 transition-all duration-200 hover:translate-x-1">
                                    <span className={`flex items-center justify-center w-5 h-5 rounded-full text-xs ${
                                        password.length >= 6 
                                            ? "text-green-400 bg-green-400/20" 
                                            : "text-gray-500 bg-gray-700"
                                    }`}>
                                        {password.length >= 6 ? "✓" : "○"}
                                    </span>
                                    <span className={password.length >= 6 ? "text-green-400" : "text-gray-500"}>
                                        At least 6 characters
                                    </span>
                                </li>
                                <li className="flex items-center gap-2 transition-all duration-200 hover:translate-x-1">
                                    <span className={`flex items-center justify-center w-5 h-5 rounded-full text-xs ${
                                        password === confirmPassword && password !== "" 
                                            ? "text-green-400 bg-green-400/20" 
                                            : "text-gray-500 bg-gray-700"
                                    }`}>
                                        {password === confirmPassword && password !== "" ? "✓" : "○"}
                                    </span>
                                    <span className={password === confirmPassword && password !== "" ? "text-green-400" : "text-gray-500"}>
                                        Passwords match
                                    </span>
                                </li>
                            </ul>
                            
                            {/* Password strength meter */}
                            {password && (
                                <div className="mt-4">
                                    <div className="flex gap-1 h-1.5">
                                        {[1, 2, 3, 4].map((level) => (
                                            <div
                                                key={level}
                                                className={`flex-1 h-full rounded-full transition-all duration-300 ${
                                                    level <= strength.level ? strength.color : 'bg-gray-700'
                                                }`}
                                            />
                                        ))}
                                    </div>
                                    <p className={`text-xs mt-2 ${strength.level >= 3 ? 'text-green-400' : strength.level >= 2 ? 'text-yellow-400' : 'text-red-400'}`}>
                                        {strength.text} Password
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Reset Password Button */}
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
                                        Resetting Password...
                                    </span>
                                ) : (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                        </svg>
                                        Update Password
                                    </span>
                                )}
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                        </button>
                    </form>

                    {/* Back to Login Link */}
                    <p className="text-center text-sm text-gray-400 mt-8">
                        <a 
                            href="/" 
                            className="text-blue-500 hover:text-blue-400 font-medium 
                            transition-all duration-200 hover:scale-105 
                            hover:underline inline-block"
                        >
                            Back to Login
                        </a>
                    </p>

                    {/* Security note */}
                    <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-500">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6-4h12a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6a2 2 0 012-2zm10-4a4 4 0 00-8 0v4h8v-4z" />
                        </svg>
                        <span>Strong passwords help protect your account</span>
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