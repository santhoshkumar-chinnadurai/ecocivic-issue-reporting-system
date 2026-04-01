import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Shield, UserPlus, Eye, EyeOff, Activity, Globe, Fingerprint, MapPin } from 'lucide-react';
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
        <div className="min-h-screen bg-gray-50 dark:bg-[#050505] text-gray-900 dark:text-white font-sans selection:bg-fuchsia-500/30 overflow-hidden relative flex items-center justify-center transition-colors duration-500">
            {/* Theme Toggle (Absolute Top Right) */}
            <div className="absolute top-8 right-8 z-50">
                <ThemeToggle />
            </div>

            {/* Ambient Base Noise */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] dark:opacity-[0.05] mix-blend-overlay"></div>
            </div>

            <div className="relative z-10 w-full min-h-screen flex flex-col lg:flex-row">
                
                {/* Left Side: Glassmorphic Floating Form (order-2 on mobile, order-1 on desktop) */}
                <div className="order-2 lg:order-1 w-full lg:w-1/2 relative flex items-center justify-center p-6 lg:p-20 overflow-hidden bg-gray-50 dark:bg-[#0A0A0A]">
                    {/* Soft glowing orb behind form */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-[500px] bg-gradient-to-tr from-fuchsia-500/5 to-rose-500/5 dark:from-fuchsia-500/10 dark:to-rose-500/10 rounded-full blur-[100px] opacity-60"></div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, ease: "easeOut" }}
                        className="relative w-full max-w-md my-auto"
                    >
                        <div className="relative rounded-[2.5rem] p-8 sm:p-12 bg-white dark:bg-white/[0.02] backdrop-blur-2xl border border-gray-200 dark:border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-[0_0_50px_rgba(0,0,0,0.4)]">
                            <div className="lg:hidden flex justify-center mb-10">
                                <Link to="/" className="w-16 h-16 rounded-[1.25rem] bg-gradient-to-br from-fuchsia-500 to-rose-400 flex items-center justify-center shadow-lg hover:shadow-xl transition-all">
                                    <Shield size={32} className="text-white relative z-10" />
                                </Link>
                            </div>

                            <div className="flex flex-col items-center justify-center text-center gap-3 mb-10">
                                <div className="p-4 bg-fuchsia-50 dark:bg-white/5 rounded-2xl border border-fuchsia-100 dark:border-white/10 shadow-sm text-fuchsia-600 dark:text-fuchsia-400">
                                    <UserPlus size={32} />
                                </div>
                                <h2 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white mt-4">Join the Network</h2>
                                <p className="text-gray-500 dark:text-gray-400 font-medium text-sm">Empower your civic identity</p>
                            </div>

                            <form onSubmit={handleSignup} className="space-y-5">
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

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest pl-1">Email</label>
                                    <div className="relative group/input">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Mail className="h-5 w-5 text-gray-400 group-focus-within/input:text-fuchsia-600 dark:group-focus-within/input:text-fuchsia-400 transition-colors" />
                                        </div>
                                        <input
                                            type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                                            className="w-full bg-gray-50 dark:bg-black/60 border border-gray-200 dark:border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-medium focus:outline-none focus:border-fuchsia-500/50 focus:ring-4 focus:ring-fuchsia-500/10 transition-all text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 shadow-sm"
                                            placeholder="hello@example.com"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest pl-1">Phone</label>
                                    <div className="flex relative group/input">
                                        <div className="flex items-center justify-center pl-4 pr-3 bg-gray-100 dark:bg-black/80 border border-r-0 border-gray-200 dark:border-white/10 rounded-l-2xl text-gray-600 dark:text-gray-400 font-bold text-sm h-[50px]">
                                            +91
                                        </div>
                                        <input
                                            type="tel" required maxLength={10} pattern="[0-9]{10}" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                                            className="w-full h-[50px] bg-gray-50 dark:bg-black/60 border border-l-0 border-gray-200 dark:border-white/10 rounded-r-2xl py-3.5 pl-2 pr-4 text-sm font-medium focus:outline-none focus:border-fuchsia-500/50 focus:ring-4 focus:ring-fuchsia-500/10 transition-all text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 shadow-sm"
                                            placeholder="9876543210"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest pl-1">Passkey</label>
                                        <div className="relative group/input">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Lock className="h-4 w-4 text-gray-400 group-focus-within/input:text-fuchsia-600 dark:group-focus-within/input:text-fuchsia-400 transition-colors" />
                                            </div>
                                            <input
                                                type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)}
                                                className="w-full bg-gray-50 dark:bg-black/60 border border-gray-200 dark:border-white/10 rounded-2xl py-3.5 pl-10 pr-10 text-sm font-medium focus:outline-none focus:border-fuchsia-500/50 focus:ring-4 focus:ring-fuchsia-500/10 transition-all text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 shadow-sm"
                                                placeholder="••••••"
                                            />
                                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors">
                                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest pl-1">Confirm</label>
                                        <div className="relative group/input">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Lock className="h-4 w-4 text-gray-400 group-focus-within/input:text-fuchsia-600 dark:group-focus-within/input:text-fuchsia-400 transition-colors" />
                                            </div>
                                            <input
                                                type={showConfirmPassword ? "text" : "password"} required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                                                className="w-full bg-gray-50 dark:bg-black/60 border border-gray-200 dark:border-white/10 rounded-2xl py-3.5 pl-10 pr-10 text-sm font-medium focus:outline-none focus:border-fuchsia-500/50 focus:ring-4 focus:ring-fuchsia-500/10 transition-all text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 shadow-sm"
                                                placeholder="••••••"
                                            />
                                            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors">
                                                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit" disabled={loading}
                                    className="w-full relative group py-5 bg-black dark:bg-white text-white dark:text-black rounded-2xl font-bold text-base shadow-[0_10px_30px_rgba(0,0,0,0.1)] dark:shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all overflow-hidden flex items-center justify-center gap-3 mt-6 disabled:opacity-75"
                                >
                                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-fuchsia-500 to-rose-400 dark:from-white dark:via-gray-200 dark:to-white group-hover:bg-[length:200%_auto] bg-[length:100%_auto] transition-all duration-500" />
                                    {loading ? (
                                        <div className="h-5 w-5 border-2 border-white/20 dark:border-black/20 border-t-white dark:border-t-black rounded-full animate-spin relative z-10"></div>
                                    ) : (
                                        <span className="relative z-10 flex items-center gap-2">Create Account <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></span>
                                    )}
                                </button>
                            </form>

                            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-white/10 text-center">
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    Already a member?{' '}
                                    <Link to="/login" className="text-black dark:text-white font-bold tracking-wide hover:text-fuchsia-600 dark:hover:text-fuchsia-400 transition-colors uppercase ml-2 text-xs">Sign In</Link>
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Right Side: Premium Branding (Hidden on Mobile, order-2 on desktop) */}
                <div className="hidden lg:flex w-1/2 relative bg-white dark:bg-[#050505] items-center overflow-hidden border-l border-gray-200/50 dark:border-white/5 order-1 lg:order-2">
                    {/* Abstract Rose/Fuchsia Glows */}
                    <motion.div
                        animate={{ scale: [1, 1.3, 1], rotate: [0, -45, 0] }}
                        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute bottom-[20%] right-[-10%] w-[80%] h-[60%] bg-rose-500/10 dark:bg-rose-600/20 rounded-[4rem] blur-[120px] dark:mix-blend-screen overflow-hidden"
                    />
                    <motion.div
                        animate={{ scale: [1, 1.1, 1], rotate: [0, 30, 0] }}
                        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-[-10%] left-[10%] w-[70%] h-[50%] bg-fuchsia-500/10 dark:bg-fuchsia-600/20 rounded-full blur-[100px] dark:mix-blend-screen"
                    />

                    <div className="relative z-10 p-20 flex flex-col justify-between h-full w-full items-end text-right">
                        <Link to="/" className="inline-flex items-center gap-4 group w-max flex-row-reverse">
                            <div className="w-16 h-16 rounded-[1.25rem] bg-gradient-to-bl from-fuchsia-500 to-rose-400 flex items-center justify-center shadow-lg group-hover:shadow-[0_0_30px_rgba(244,63,94,0.4)] transition-all overflow-hidden relative">
                                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity blur-md" />
                                <Shield size={32} className="text-white relative z-10" />
                            </div>
                            <span className="text-3xl font-black tracking-tight text-gray-900 dark:text-white flex items-center justify-end">CivicConnect</span>
                        </Link>

                        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="max-w-xl flex flex-col items-end text-right">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-fuchsia-50 dark:bg-fuchsia-500/10 text-fuchsia-700 dark:text-fuchsia-400 font-bold uppercase tracking-widest text-xs mb-8 border border-fuchsia-100 dark:border-fuchsia-500/20 shadow-sm flex-row-reverse">
                                <Globe size={14} className="animate-pulse" /> Community First
                            </div>
                            <h1 className="text-6xl xl:text-8xl font-black tracking-tighter leading-[0.95] text-gray-900 dark:text-white mb-8">
                                Shape the <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-l from-fuchsia-600 to-rose-500 dark:from-fuchsia-400 dark:to-rose-400">Future.</span>
                            </h1>
                            <p className="text-xl text-gray-600 dark:text-gray-400 font-medium leading-relaxed max-w-md">
                                Empower your voice. Create an account to report issues, suggest improvements, and drive tangible change.
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-2 gap-6 w-full max-w-md mt-12 pr-0">
                            {[
                                { label: 'Verified', icon: Fingerprint, color: 'text-fuchsia-600 dark:text-fuchsia-400 bg-fuchsia-50 dark:bg-fuchsia-500/10 border-fuchsia-100 dark:border-fuchsia-500/20' },
                                { label: 'Automated', icon: Activity, color: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 border-rose-100 dark:border-rose-500/20' },
                                { label: 'Hyper-Local', icon: MapPin, color: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10 border-purple-100 dark:border-purple-500/20' },
                                { label: 'Impactful', icon: Globe, color: 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-500/10 border-orange-100 dark:border-orange-500/20' },
                            ].map((stat, i) => (
                                <div key={i} className="p-4 rounded-3xl bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 flex flex-col gap-4 group hover:bg-white dark:hover:bg-white/[0.05] hover:shadow-lg transition-all items-end text-right">
                                    <div className={`p-3 rounded-xl border ${stat.color} group-hover:scale-110 transition-transform`}>
                                        <stat.icon size={20} />
                                    </div>
                                    <span className="text-base font-bold text-gray-900 dark:text-white">{stat.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Signup;
