import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Shield, UserPlus, Fingerprint, Eye, EyeOff, Activity, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from '../components/ThemeToggle';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        try {
            await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/auth/register`, {
                email,
                password,
                phone: `+91${phone}`
            });
            alert('Account created successfully! Please sign in.');
            navigate('/login');
        } catch (err: unknown) {
            if (axios.isAxiosError(err) && err.response?.data?.message) {
                setError(err.response.data.message);
            } else if (err instanceof Error && (err.message === 'Network Error')) {
                const demoUser = { email, phone: `+91${phone}`, role: 'CITIZEN', id: 'demo-new-user-' + Date.now() };
                localStorage.setItem('demo_pending_user', JSON.stringify({ ...demoUser, password }));
                alert('(Demo Mode) Offline Account Created. Authorized for Login.');
                navigate('/login');
            } else {
                setError('Registration failed. Please try again.');
            }
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

            <div className="relative z-10 w-full max-w-5xl px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center py-12">

                {/* Left Side: Right Side of Design (Form) */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, ease: "circOut" }}
                    className="order-2 lg:order-1 relative"
                >
                    <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-cyan-500/20 rounded-[2rem] blur-xl opacity-20 dark:opacity-50"></div>

                    <div className="relative rounded-[2rem] p-8 md:p-10 bg-white/80 dark:bg-white/[0.03] backdrop-blur-2xl border border-gray-200 dark:border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_0_50px_rgba(0,0,0,0.3)]">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-3 bg-gray-100 dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/10">
                                <UserPlus size={24} className="text-cyan-400" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Create Account</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Join the civic network</p>
                            </div>
                        </div>

                        <form onSubmit={handleSignup} className="space-y-5">
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

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1">Email</label>
                                <div className="relative group/input">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500 group-focus-within/input:text-cyan-500 dark:group-focus-within/input:text-cyan-400 transition-colors" />
                                    <input
                                        type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600"
                                        placeholder="name@example.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1">Phone Number</label>
                                <div className="flex relative group/input">
                                    <div className="flex items-center justify-center pl-4 pr-2 bg-gray-100 dark:bg-black/60 border border-r-0 border-gray-200 dark:border-white/10 rounded-l-xl text-gray-500 dark:text-gray-400 font-semibold text-sm">
                                        +91
                                    </div>
                                    <input
                                        type="tel" required maxLength={10} pattern="[0-9]{10}" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                                        className="w-full bg-gray-50 dark:bg-black/40 border border-l-0 border-gray-200 dark:border-white/10 rounded-r-xl py-3.5 pl-3 pr-4 text-sm focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600"
                                        placeholder="9876543210"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1">Password</label>
                                    <div className="relative group/input">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500 group-focus-within/input:text-cyan-500 dark:group-focus-within/input:text-cyan-400 transition-colors" />
                                        <input
                                            type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)}
                                            className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl py-3.5 pl-10 pr-10 text-sm focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600"
                                            placeholder="••••••"
                                        />
                                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-white transition-colors">
                                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1">Confirm</label>
                                    <div className="relative group/input">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500 group-focus-within/input:text-cyan-500 dark:group-focus-within/input:text-cyan-400 transition-colors" />
                                        <input
                                            type={showConfirmPassword ? "text" : "password"} required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl py-3.5 pl-10 pr-10 text-sm focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600"
                                            placeholder="••••••"
                                        />
                                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-white transition-colors">
                                            {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit" disabled={loading}
                                className="w-full relative group py-4 bg-gray-900 dark:bg-white text-white dark:text-black rounded-xl font-semibold transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 overflow-hidden flex items-center justify-center gap-2 mt-6"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-indigo-500 opacity-0 group-hover:opacity-100 dark:group-hover:opacity-10 transition-opacity"></div>
                                {loading ? (
                                    <div className="h-5 w-5 border-2 border-white/20 dark:border-black/20 border-t-white dark:border-t-black rounded-full animate-spin relative z-10"></div>
                                ) : (
                                    <>Create Account <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>
                                )}
                            </button>
                        </form>

                        <div className="mt-6 text-center pt-6 border-t border-gray-200 dark:border-white/5">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Already registered?{' '}
                                <Link to="/login" className="text-gray-900 dark:text-white hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors font-medium">Sign in</Link>
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Right Side: Branding Text */}
                <motion.div
                    initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
                    className="order-1 lg:order-2 flex flex-col space-y-8"
                >
                    <Link to="/" className="inline-flex items-center gap-3 group">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center group-hover:scale-105 transition-transform shadow-lg shadow-cyan-500/20">
                            <Shield size={24} className="text-white" />
                        </div>
                        <span className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">CivicConnect</span>
                    </Link>

                    <h1 className="text-5xl lg:text-7xl font-bold tracking-tighter leading-[1.1] text-gray-900 dark:text-white">
                        Join The <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-indigo-600 dark:from-cyan-400 dark:to-indigo-400">Network.</span>
                    </h1>

                    <p className="text-gray-600 dark:text-gray-400 text-lg max-w-md leading-relaxed">
                        Create an account to report local issues, track municipal responses, and help build a better community.
                    </p>

                    <div className="grid grid-cols-2 gap-4 pt-6">
                        {[
                            { label: 'Secure', icon: Fingerprint, color: 'text-indigo-600 dark:text-indigo-400' },
                            { label: 'Real-time', icon: Activity, color: 'text-cyan-600 dark:text-cyan-400' },
                            { label: 'Transparent', icon: Eye, color: 'text-purple-600 dark:text-purple-400' },
                            { label: 'Connected', icon: Globe, color: 'text-emerald-600 dark:text-emerald-400' },
                        ].map((stat, i) => (
                            <div key={i} className="p-4 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/5 flex flex-col gap-3 group hover:bg-gray-200 dark:hover:bg-white/10 text-gray-900 dark:text-white transition-colors">
                                <stat.icon size={20} className={`${stat.color} group-hover:scale-110 transition-transform`} />
                                <span className="text-sm font-semibold">{stat.label}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Signup;
