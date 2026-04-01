import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Mail, Lock, ArrowRight, Shield, Fingerprint, Eye, EyeOff, Activity, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from '../components/ThemeToggle';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/auth/login`, { email, password });
            const user = res.data.user;

            if (user.role === 'ADMIN') {
                setError('Admins must use the Admin portal.');
                return;
            }

            localStorage.setItem('token', res.data.access_token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Authentication Failed. Check credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#050505] text-gray-900 dark:text-white font-sans selection:bg-indigo-500/30 overflow-hidden relative flex items-center justify-center transition-colors duration-500">
            {/* Theme Toggle (Absolute Top Right) */}
            <div className="absolute top-8 right-8 z-50">
                <ThemeToggle />
            </div>

            {/* Ambient Base Noise */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] dark:opacity-[0.05] mix-blend-overlay"></div>
            </div>

            <div className="relative z-10 w-full min-h-screen flex">
                
                {/* Left Side: Premium Immersive Branding (Hidden on Mobile) */}
                <div className="hidden lg:flex w-1/2 relative bg-white dark:bg-[#050505] items-center overflow-hidden border-r border-gray-200/50 dark:border-white/5">
                    {/* Abstract Geometric Glows */}
                    <motion.div
                        animate={{ scale: [1, 1.3, 1], rotate: [0, 45, 0] }}
                        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-[20%] right-[-10%] w-[80%] h-[60%] bg-indigo-500/10 dark:bg-indigo-600/20 rounded-[4rem] blur-[120px] dark:mix-blend-screen overflow-hidden"
                    />
                    <motion.div
                        animate={{ scale: [1, 1.1, 1], rotate: [0, -30, 0] }}
                        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute bottom-[-10%] left-[10%] w-[70%] h-[50%] bg-cyan-500/10 dark:bg-cyan-600/20 rounded-full blur-[100px] dark:mix-blend-screen"
                    />

                    <div className="relative z-10 p-20 flex flex-col justify-between h-full w-full">
                        <Link to="/" className="inline-flex items-center gap-4 group w-max">
                            <div className="w-16 h-16 rounded-[1.25rem] bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg group-hover:shadow-[0_0_30px_rgba(99,102,241,0.4)] transition-all overflow-hidden relative">
                                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity blur-md" />
                                <Shield size={32} className="text-white relative z-10" />
                            </div>
                            <span className="text-3xl font-black tracking-tight text-gray-900 dark:text-white">CivicConnect</span>
                        </Link>

                        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-xl">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-50 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 font-bold uppercase tracking-widest text-xs mb-8 border border-cyan-100 dark:border-cyan-500/20 shadow-sm">
                                <Activity size={14} className="animate-pulse" /> Citizen Portal
                            </div>
                            <h1 className="text-6xl xl:text-8xl font-black tracking-tighter leading-[0.95] text-gray-900 dark:text-white mb-8">
                                Welcome <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500 dark:from-indigo-400 dark:to-cyan-400">Back.</span>
                            </h1>
                            <p className="text-xl text-gray-600 dark:text-gray-400 font-medium leading-relaxed">
                                Access your dashboard to track ongoing reports, interact with local officials, and monitor the progress of your community improvements.
                            </p>
                        </motion.div>

                        <div className="flex items-center gap-6">
                            <div className="flex -space-x-4">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className={`w-12 h-12 rounded-full border-2 border-white dark:border-[#0A0A0A] bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-xs font-bold shadow-md z-${10-i}`}>
                                        <Users size={16} className="text-gray-400" />
                                    </div>
                                ))}
                            </div>
                            <p className="text-sm font-bold text-gray-500">Join 10k+ active citizens</p>
                        </div>
                    </div>
                </div>

                {/* Right Side: Glassmorphic Floating Form */}
                <div className="w-full lg:w-1/2 relative flex items-center justify-center p-6 lg:p-20 overflow-hidden bg-gray-50 dark:bg-[#0A0A0A]">
                    {/* Soft Center Glow behind form */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-[500px] bg-gradient-to-tr from-indigo-500/5 to-cyan-500/5 dark:from-indigo-500/10 dark:to-cyan-500/10 rounded-full blur-[100px] opacity-60"></div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, ease: "easeOut" }}
                        className="relative w-full max-w-md"
                    >
                        <div className="relative rounded-[2.5rem] p-8 sm:p-12 bg-white dark:bg-white/[0.02] backdrop-blur-2xl border border-gray-200 dark:border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-[0_0_50px_rgba(0,0,0,0.4)]">
                            <div className="lg:hidden flex justify-center mb-10">
                                <Link to="/" className="w-16 h-16 rounded-[1.25rem] bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg hover:shadow-xl transition-all">
                                    <Shield size={32} className="text-white relative z-10" />
                                </Link>
                            </div>

                            <div className="flex flex-col items-center justify-center text-center gap-3 mb-10">
                                <div className="p-4 bg-indigo-50 dark:bg-white/5 rounded-2xl border border-indigo-100 dark:border-white/10 shadow-sm text-indigo-600 dark:text-indigo-400">
                                    <Fingerprint size={32} />
                                </div>
                                <h2 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white mt-4">Secure Sign In</h2>
                                <p className="text-gray-500 dark:text-gray-400 font-medium text-sm">Authenticate your identity to continue</p>
                            </div>

                            <form onSubmit={handleLogin} className="space-y-6">
                                <AnimatePresence>
                                    {error && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm font-medium flex items-center gap-3 shadow-sm">
                                                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shrink-0"></div>
                                                {error}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest pl-1">Email Space</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors" />
                                        </div>
                                        <input
                                            type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                                            className="w-full bg-gray-50 dark:bg-black/60 border border-gray-200 dark:border-white/10 rounded-2xl py-4 pl-12 pr-4 text-base font-medium focus:outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 shadow-sm"
                                            placeholder="name@example.com"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between items-center pr-1">
                                         <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest pl-1">Passkey</label>
                                         <a href="#" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300">Forgot?</a>
                                    </div>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors" />
                                        </div>
                                        <input
                                            type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)}
                                            className="w-full bg-gray-50 dark:bg-black/60 border border-gray-200 dark:border-white/10 rounded-2xl py-4 pl-12 pr-12 text-base font-medium focus:outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 shadow-sm"
                                            placeholder="••••••••"
                                        />
                                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors">
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>

                                <button
                                    type="submit" disabled={loading}
                                    className="w-full relative group py-5 bg-black dark:bg-white text-white dark:text-black rounded-2xl font-bold text-lg shadow-[0_10px_30px_rgba(0,0,0,0.1)] dark:shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all overflow-hidden flex items-center justify-center gap-3 mt-4 disabled:opacity-75"
                                >
                                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-indigo-600 to-cyan-500 dark:from-white dark:via-gray-200 dark:to-white group-hover:bg-[length:200%_auto] bg-[length:100%_auto] transition-all duration-500" />
                                    {loading ? (
                                        <div className="h-6 w-6 border-2 border-white/20 dark:border-black/20 border-t-white dark:border-t-black rounded-full animate-spin relative z-10"></div>
                                    ) : (
                                        <span className="relative z-10 flex items-center gap-2">Sign In <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" /></span>
                                    )}
                                </button>
                            </form>

                            <div className="mt-10 pt-8 border-t border-gray-200 dark:border-white/10 text-center flex flex-col gap-4">
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    New to CivicConnect?{' '}
                                    <Link to="/signup" className="text-black dark:text-white font-bold tracking-wide hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors uppercase ml-2 text-xs">Create Account</Link>
                                </p>
                                <div className="flex justify-center mt-2">
                                    <Link to="/admin/login" className="text-xs text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1.5 font-bold uppercase tracking-widest">
                                        Admin Portal <ArrowRight size={14} />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Login;
