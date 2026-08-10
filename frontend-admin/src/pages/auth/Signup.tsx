import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Lock, Eye, EyeOff, UserPlus, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import AuthLayout from '../../layouts/AuthLayout';
import Button from '../../components/ui/Button';
import api from '../../api/axios';
import platformConfig from '../../config/platformConfig';

const Signup: React.FC = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);

    // Password strength logic
    const getPasswordStrength = (pass: string) => {
        if (!pass) return { label: '', color: '', percent: 0 };
        if (pass.length < 6) return { label: 'Weak', color: 'bg-rose-500', percent: 33 };
        if (pass.length < 10 || !/\d/.test(pass)) return { label: 'Medium', color: 'bg-amber-500', percent: 66 };
        return { label: 'Strong', color: 'bg-emerald-500', percent: 100 };
    };

    const strength = getPasswordStrength(password);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg(null);

        if (password !== confirmPassword) {
            setErrorMsg('Passwords do not match. Please verify both password fields.');
            return;
        }

        if (password.length < 6) {
            setErrorMsg('Password must be at least 6 characters long.');
            return;
        }

        setLoading(true);

        try {
            await api.post('/auth/register', {
                name,
                email,
                password,
                phone,
                role: 'CITIZEN'
            });
            setIsSuccess(true);
        } catch (error: any) {
            console.error('Registration failed', error);
            if (error.code === 'ERR_NETWORK') {
                setErrorMsg('Unable to connect to the registration service. Please verify your connection.');
            } else {
                setErrorMsg(error.response?.data?.message || 'Registration failed. Email may already be registered.');
            }
        } finally {
            setLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <AuthLayout>
                <div className="space-y-6 text-left py-4">
                    <div className="h-12 w-12 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-2xl flex items-center justify-center">
                        <CheckCircle2 size={24} />
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-2xl font-black text-slate-900 dark:text-white">
                            Account Created Successfully
                        </h1>
                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                            Your account is ready. Sign in to start reporting civic issues and tracking their progress in your community.
                        </p>
                    </div>

                    <Button
                        onClick={() => navigate('/login')}
                        className="w-full py-3 text-xs font-black uppercase tracking-wider rounded-xl shadow-md flex items-center justify-center gap-2"
                    >
                        Continue to Sign In <ArrowRight size={14} />
                    </Button>
                </div>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout>
            <div className="space-y-6 text-left">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                        Create Your Account
                    </h1>
                </div>

                {/* Inline Error Alert */}
                {errorMsg && (
                    <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-700 dark:text-rose-400 text-xs font-bold flex items-start gap-2.5">
                        <AlertCircle size={16} className="shrink-0 mt-0.5" />
                        <div>
                            <span className="block font-black uppercase">Registration Error</span>
                            <span className="font-medium text-[11px] leading-relaxed">{errorMsg}</span>
                        </div>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-3.5">
                    <div className="space-y-1">
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                            Full Name
                        </label>
                        <div className="relative">
                            <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                required
                                placeholder=""
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="email"
                                    required
                                    placeholder=""
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                                Phone Number (India)
                            </label>
                            <div className="relative flex items-center">
                                <div className="absolute left-3 flex items-center gap-1.5 pointer-events-none text-slate-500 font-extrabold text-xs">
                                    <Phone size={14} className="text-slate-400 shrink-0" />
                                    <span className="text-slate-900 dark:text-white font-mono font-bold">+91</span>
                                </div>
                                <input
                                    type="tel"
                                    required
                                    maxLength={10}
                                    placeholder=""
                                    value={phone.startsWith('+91 ') ? phone.replace('+91 ', '') : phone}
                                    onChange={(e) => {
                                        const raw = e.target.value.replace(/\D/g, '').slice(0, 10);
                                        setPhone(raw ? `+91 ${raw}` : '');
                                    }}
                                    className="w-full pl-16 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors font-mono tracking-wider"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                            Password
                        </label>
                        <div className="relative">
                            <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                required
                                placeholder=""
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-10 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>

                        {/* Password strength indicator */}
                        {password && (
                            <div className="pt-1.5 space-y-1">
                                <div className="flex justify-between items-center text-[10px] font-bold">
                                    <span className="text-slate-500">Strength</span>
                                    <span className="font-mono uppercase text-slate-700 dark:text-slate-300">{strength.label}</span>
                                </div>
                                <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                    <div className={`h-full transition-all duration-300 ${strength.color}`} style={{ width: `${strength.percent}%` }}></div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="space-y-1">
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                            Confirm Password
                        </label>
                        <div className="relative">
                            <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                required
                                placeholder=""
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        loading={loading}
                        className="w-full py-3 text-xs font-black uppercase tracking-wider rounded-xl shadow-md flex items-center justify-center gap-2 mt-2"
                    >
                        {loading ? 'Creating Account...' : 'Create Account'} <ArrowRight size={14} />
                    </Button>
                </form>

                {/* Footer link to sign in */}
                <div className="pt-2 text-center text-xs font-semibold text-slate-500">
                    Already have an account?{' '}
                    <Link to="/login" className="text-blue-600 dark:text-blue-400 font-extrabold hover:underline">
                        Sign In
                    </Link>
                </div>
            </div>
        </AuthLayout>
    );
};

export default Signup;
