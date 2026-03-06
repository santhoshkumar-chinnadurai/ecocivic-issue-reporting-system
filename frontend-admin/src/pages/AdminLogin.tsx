import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Shield, Lock, User, ArrowRight, Activity, AlertCircle, Fingerprint, Terminal, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from '../components/ThemeToggle';

const AdminLogin = () => {
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

            if (user.role !== 'ADMIN' && user.role !== 'OFFICIAL' && user.role !== 'WORKER') {
                setError('ACCESS DENIED: Insufficient Clearance Levels.');
                return;
            }

            localStorage.setItem('token', res.data.access_token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            navigate('/dashboard');
        } catch {
            setError('VALIDATION FAILED: Invalid Command Credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#050505] text-gray-900 dark:text-white font-sans selection:bg-red-500/30 overflow-hidden relative flex items-center justify-center transition-colors duration-300">
            {/* Theme Toggle (Absolute Top Right) */}
            <div className="absolute top-6 right-6 z-50">
                <ThemeToggle />
            </div>

            {/* Parallax Background Noise & Blobs */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay"></div>
                <motion.div
                    animate={{ x: [0, -30, 0], y: [0, 30, 0] }}
                    transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[-10%] right-[10%] w-[50%] h-[50%] bg-red-900/10 rounded-full blur-[120px]"
                />
                <motion.div
                    animate={{ x: [0, 40, 0], y: [0, -20, 0] }}
                    transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-[-10%] left-[10%] w-[50%] h-[50%] bg-orange-900/10 rounded-full blur-[120px]"
                />
            </div>

            <div className="relative z-10 w-full max-w-lg px-6 flex flex-col items-center">

                {/* Security Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
                    className="mb-8"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-full text-red-400 text-xs font-semibold tracking-wide">
                        <AlertCircle size={14} className="animate-pulse" /> Secure Admin Portal
                    </div>
                </motion.div>

                {/* Glass Form */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.1 }}
                    className="w-full relative"
                >
                    <div className="absolute inset-0 bg-gradient-to-tr from-red-600/10 to-transparent rounded-[2rem] blur-xl opacity-20 dark:opacity-50"></div>

                    <div className="relative rounded-[2rem] p-8 md:p-10 bg-white dark:bg-[#0A0A0A] border border-gray-200 dark:border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden">

                        {/* Top Accents */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-[1px] bg-gradient-to-r from-transparent via-red-500/50 to-transparent"></div>

                        <div className="flex flex-col items-center text-center mb-10">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-600 to-red-900 flex items-center justify-center mb-6 shadow-lg shadow-red-500/20 border border-red-400/20">
                                <Shield size={32} className="text-white" />
                            </div>
                            <h2 className="text-3xl font-bold tracking-tight mb-2 text-gray-900 dark:text-white">Administrator</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Restricted Access Node</p>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-5">
                            <AnimatePresence>
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
                                        className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-start gap-3 text-left"
                                    >
                                        <div className="mt-1 w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse flex-shrink-0"></div>
                                        {error}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1 flex justify-between">
                                    <span>Command ID</span>
                                    <span className="text-gray-400 dark:text-white/30 lowercase">lvl_7</span>
                                </label>
                                <div className="relative group/input">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 group-focus-within/input:text-red-400 transition-colors" />
                                    <input
                                        type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-white/5 rounded-xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 transition-all text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 font-mono"
                                        placeholder="admin@civic.gov"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1 flex justify-between">
                                    <span>Passkey</span>
                                    <span className="text-gray-400 dark:text-white/30 lowercase">rsa_4096</span>
                                </label>
                                <div className="relative group/input">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 group-focus-within/input:text-red-400 transition-colors" />
                                    <input
                                        type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-white/5 rounded-xl py-4 pl-12 pr-12 text-sm focus:outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 transition-all text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 font-mono tracking-widest"
                                        placeholder="••••••••"
                                    />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-white transition-colors">
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit" disabled={loading}
                                className="w-full relative group py-4 bg-red-600 text-white rounded-xl font-semibold transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 overflow-hidden flex items-center justify-center gap-2 mt-8 border border-red-500"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-700 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <span className="relative flex items-center gap-2 z-10">
                                    {loading ? (
                                        <Activity size={20} className="animate-spin" />
                                    ) : (
                                        <>Authorize Access <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>
                                    )}
                                </span>
                            </button>
                        </form>

                        <div className="mt-8 flex items-center justify-between pt-6 border-t border-gray-200 dark:border-white/5">
                            <Link to="/login" className="text-xs text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center gap-1.5 font-medium">
                                <ArrowRight size={14} className="rotate-180" /> Standard Portal
                            </Link>
                            <div className="flex gap-3 text-gray-600">
                                <Fingerprint size={16} />
                                <Terminal size={16} />
                            </div>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                    className="mt-8 text-center"
                >
                    <p className="text-[10px] text-gray-500 dark:text-gray-600 uppercase tracking-widest leading-relaxed">
                        Activity Monitored & Logged.<br />
                        Unauthorized access triggers node isolation.
                    </p>
                </motion.div>

            </div>
        </div>
    );
};

export default AdminLogin;
