import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight, Building2 } from 'lucide-react';
import AuthLayout from '../../layouts/AuthLayout';
import Button from '../../components/ui/Button';
import api from '../../api/axios';

const GovernmentLogin: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [tapCount, setTapCount] = useState(0);

    const handleTap = () => {
        const next = tapCount + 1;
        setTapCount(next);
        if (next >= 3) {
            setEmail('official@civic.com');
            setPassword('official123');
            setErrorMsg(null);
            setTapCount(0);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg(null);

        try {
            const response = await api.post('/auth/login', { email, password });
            const data = response.data;
            const token = data.access_token || data.token;
            const role = data.user?.role?.toUpperCase();

            if (data.user && (role === 'OFFICIAL' || role === 'ADMIN')) {
                localStorage.setItem('user', JSON.stringify(data.user));
                if (token) {
                    localStorage.setItem('token', token);
                }
                navigate('/government/dashboard');
            } else {
                setErrorMsg('Access Denied: Official or Officer role clearance is required for this portal.');
            }
        } catch (error: any) {
            console.error('Official Login Error', error);
            if (error.code === 'ERR_NETWORK') {
                setErrorMsg('Network Connection Error: Unable to connect to municipal authentication servers.');
            } else {
                setErrorMsg(error.response?.data?.message || 'Authentication Failed: The email or password entered is incorrect.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout>
            <div className="space-y-6 text-left">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h1 
                        onClick={handleTap}
                        className="text-2xl font-black tracking-tight text-slate-900 dark:text-white cursor-pointer select-none"
                    >
                        Official Sign In
                    </h1>
                    <button
                        type="button"
                        onClick={handleTap}
                        className="p-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/30 rounded-xl transition-all cursor-pointer flex items-center justify-center active:scale-95 shrink-0"
                        title="Tap 3 times for secret auto-fill"
                    >
                        <Building2 size={18} />
                    </button>
                </div>

                {/* Inline Error Alert */}
                {errorMsg && (
                    <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-2xl text-rose-800 dark:text-rose-300 text-xs font-medium flex items-start gap-3">
                        <AlertCircle size={18} className="shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
                        <div>
                            <span className="block font-extrabold text-rose-900 dark:text-rose-200 uppercase tracking-wider text-[10px]">Access Verification Failed</span>
                            <span className="block mt-0.5 leading-relaxed">{errorMsg}</span>
                        </div>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                            Official Email Address
                        </label>
                        <div className="relative">
                            <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="email"
                                required
                                placeholder=""
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 h-11 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
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
                                className="w-full pl-10 pr-10 h-11 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer p-1"
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    {/* Options Row */}
                    <div className="flex items-center justify-between text-xs font-semibold">
                        <label className="flex items-center gap-2 text-slate-600 dark:text-slate-400 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4 cursor-pointer"
                            />
                            <span>Remember credentials</span>
                        </label>

                        <Link to="/forgot-password" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">
                            Forgot Password?
                        </Link>
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        loading={loading}
                        className="w-full h-11 text-xs font-extrabold uppercase tracking-wider rounded-xl shadow-sm flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white transition-all cursor-pointer mt-2"
                    >
                        {loading ? 'Authenticating...' : 'Sign In'} <ArrowRight size={14} />
                    </Button>
                </form>

                {/* Footer Link */}
                <div className="pt-2 text-center text-xs font-medium text-slate-600 dark:text-slate-400">
                    Not a municipal official?{' '}
                    <Link to="/login" className="text-blue-600 dark:text-blue-400 font-extrabold hover:underline">
                        Citizen Portal Sign In
                    </Link>
                </div>
            </div>
        </AuthLayout>
    );
};

export default GovernmentLogin;
