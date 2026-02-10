import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { User, Mail, Lock, Sparkles, ArrowRight, ShieldCheck, CheckCircle, Clock } from "lucide-react";

const Register = () => {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await axios.post("/api/auth/register", {
                username,
                email,
                password,
            });

            alert("✨ Success: " + res.data);
            navigate("/login");
        } catch (err) {
            console.error("Registration Error:", err);
            alert(err.response?.data?.message || "Registration failed. This email might already exist ❌");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">

            {/* LEFT SIDE - PURPLE GRADIENT BRANDING (MATCHES LOGIN) */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-700 via-purple-600 to-indigo-700 relative overflow-hidden">
                {/* Animated Background */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse delay-700"></div>

                {/* Content */}
                <div className="relative z-10 flex flex-col justify-center items-center text-center px-12 w-full">
                    {/* Logo styled like Login */}
                    <div className="w-24 h-24 bg-white/10 backdrop-blur-lg rounded-3xl flex items-center justify-center mb-8 shadow-2xl border border-white/20">
                        <Sparkles className="w-12 h-12 text-white" />
                    </div>

                    <h1 className="text-5xl font-black text-white mb-4 uppercase tracking-tighter">
                        Join the Legacy
                    </h1>
                    <p className="text-xl text-purple-100 mb-12 max-w-md italic font-light">
                        Create an account to begin your journey into the world of premium horology.
                    </p>

                    {/* Features Hub */}
                    <div className="grid grid-cols-1 gap-6 max-w-md w-full">
                        <div className="flex items-center gap-4 bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
                            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                <CheckCircle className="w-6 h-6 text-white" />
                            </div>
                            <div className="text-left">
                                <h3 className="font-bold text-white">Exclusive Access</h3>
                                <p className="text-sm text-purple-100">Be the first to see new arrivals</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
                            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                <ShieldCheck className="w-6 h-6 text-white" />
                            </div>
                            <div className="text-left">
                                <h3 className="font-bold text-white">Seamless Checkout</h3>
                                <p className="text-sm text-purple-100">Saved details for quick purchase</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
                            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Clock className="w-6 h-6 text-white" />
                            </div>
                            <div className="text-left">
                                <h3 className="font-bold text-white">Order History</h3>
                                <p className="text-sm text-purple-100">Track your timepiece portfolio</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* RIGHT SIDE - REGISTER FORM */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
                <div className="w-full max-w-md">

                    {/* Mobile Logo */}
                    <div className="lg:hidden flex items-center justify-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                            <Sparkles className="w-9 h-9 text-white" />
                        </div>
                    </div>

                    {/* Header */}
                    <div className="mb-10">
                        <h2 className="text-4xl font-black text-gray-900 mb-2 uppercase tracking-tighter">
                            Create Account
                        </h2>
                        <p className="text-gray-500 font-medium tracking-tight">
                            Join our community of watch enthusiasts today.
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleRegister} className="space-y-6">

                        {/* Username */}
                        <div>
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
                                Full Name
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <User className="w-5 h-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="The Watch Collector"
                                    className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-50/50 outline-none transition-all font-medium text-gray-900 bg-gray-50/30"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
                                Email Address
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="w-5 h-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                                </div>
                                <input
                                    type="email"
                                    placeholder="concierge@watchshop.com"
                                    className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-50/50 outline-none transition-all font-medium text-gray-900 bg-gray-50/30"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
                                Secure Password
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="w-5 h-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                                </div>
                                <input
                                    type="password"
                                    placeholder="••••••••••••"
                                    className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-50/50 outline-none transition-all font-medium text-gray-900 bg-gray-50/30"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {/* Terms checkbox - MEESHO STYLE TEXT ONLY */}
                        <div className="flex items-center gap-3 py-2">
                            <input
                                type="checkbox"
                                id="terms"
                                required
                                className="w-5 h-5 rounded-lg border-gray-300 text-purple-600 focus:ring-purple-500 transition-all cursor-pointer"
                            />
                            <label htmlFor="terms" className="text-xs font-bold text-gray-500 uppercase tracking-tight cursor-pointer">
                                I agree to the <span className="text-purple-600 italic underline">terms of service</span> & excellence.
                            </label>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-5 rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs hover:from-purple-700 hover:to-indigo-700 transition-all shadow-xl shadow-purple-100 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                    Processing...
                                </>
                            ) : (
                                <>
                                    Create Account
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer Info */}
                    <div className="mt-10 text-center">
                        <p className="text-sm text-gray-500 font-medium">
                            Joined the legacy already?{" "}
                            <Link to="/login" className="text-purple-600 font-black italic hover:text-indigo-700 hover:underline underline-offset-4 decoration-purple-200">
                                Sign In
                            </Link>
                        </p>
                    </div>

                    {/* Back to Home */}
                    <div className="text-center mt-8">
                        <Link to="/" className="text-[10px] font-black text-gray-300 hover:text-gray-900 uppercase tracking-[0.3em] flex items-center justify-center gap-2 transition-colors">
                            <ArrowRight size={12} className="rotate-180" /> Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
