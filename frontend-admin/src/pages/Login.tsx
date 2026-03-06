import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Mail, Lock, ArrowRight, Shield, Fingerprint, Eye, EyeOff, Activity } from 'lucide-react';
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
        } catch {
            setError('Authentication Failed. Check credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0A0A0A] text-gray-900 dark:text-white font-sans selection:bg-indigo-500/30 overflow-hidden relative flex items-center justify-center transition-colors duration-300">
            {/* Theme Toggle (Absolute Top Right) */}
            <div className="absolute top-6 right-6 z-50">
                <ThemeToggle />
            </div>
            {/* Parallax Background Noise & Blobs */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay"></div>
                <motion.div
                    animate={{ x: [0, -30, 0], y: [0, 30, 0] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[10%] left-[10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[100px]"
                />
                <motion.div
                    animate={{ x: [0, 40, 0], y: [0, -20, 0] }}
                    transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-[10%] right-[10%] w-[40%] h-[40%] bg-cyan-600/20 rounded-full blur-[100px]"
                />
            </div>

            <div className="relative z-10 w-full max-w-5xl px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                {/* Left Side: Branding */}
                <motion.div
                    initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}
                    className="hidden lg:flex flex-col space-y-8"
                >
                    <Link to="/" className="inline-flex items-center gap-3 group">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center group-hover:scale-105 transition-transform shadow-lg shadow-indigo-500/20">
                            <Shield size={24} className="text-white" />
                        </div>
                        <span className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">CivicConnect</span>
                    </Link>

                    <h1 className="text-5xl lg:text-7xl font-bold tracking-tighter leading-[1.1] text-gray-900 dark:text-white">
                        Welcome <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500 dark:from-indigo-400 dark:to-cyan-400">Back.</span>
                    </h1>

                    <p className="text-gray-600 dark:text-gray-400 text-lg max-w-md leading-relaxed">
                        Access your citizen dashboard to track reports, connect with local officials, and monitor community progress.
                    </p>

                    <div className="pt-8 flex items-center gap-4 text-sm text-gray-500 font-medium">
                        <Activity className="text-green-500 dark:text-green-400" size={16} /> Secure Encrypted Connection
                    </div>
                </motion.div>

                {/* Right Side: Glass Form */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.2 }}
                    className="relative"
                >
                    <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-cyan-500/20 rounded-[2rem] blur-xl opacity-50 dark:opacity-50 opacity-10"></div>

                    <div className="relative rounded-[2rem] p-8 md:p-10 bg-white/80 dark:bg-white/[0.03] backdrop-blur-2xl border border-gray-200 dark:border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_0_50px_rgba(0,0,0,0.3)]">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-3 bg-gray-100 dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/10">
                                <Fingerprint size={24} className="text-indigo-400" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Sign In</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Authenticate to continue</p>
                            </div>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-6">
                            <AnimatePresence>
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
                                        className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-3"
                                    >
                                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
                                        {error}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1">Email</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500 group-focus-within:text-indigo-500 dark:group-focus-within:text-indigo-400 transition-colors" />
                                    <input
                                        type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600"
                                        placeholder="name@example.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1">Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500 group-focus-within:text-indigo-500 dark:group-focus-within:text-indigo-400 transition-colors" />
                                    <input
                                        type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl py-4 pl-12 pr-12 text-sm focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600"
                                        placeholder="••••••••"
                                    />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-white transition-colors">
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit" disabled={loading}
                                className="w-full relative group py-4 bg-gray-900 dark:bg-white text-white dark:text-black rounded-xl font-semibold transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 overflow-hidden flex items-center justify-center gap-2"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-cyan-400 opacity-0 group-hover:opacity-100 dark:group-hover:opacity-10 transition-opacity"></div>
                                {loading ? (
                                    <div className="h-5 w-5 border-2 border-white/20 dark:border-black/20 border-t-white dark:border-t-black rounded-full animate-spin relative z-10"></div>
                                ) : (
                                    <>Sign In <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>
                                )}
                            </button>
                        </form>

                        <div className="mt-8 text-center pt-8 border-t border-gray-200 dark:border-white/5">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                New to CivicConnect?{' '}
                                <Link to="/signup" className="text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium">Create account</Link>
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;
