import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import AuthLayout from '../../layouts/AuthLayout';
import Button from '../../components/ui/Button';

const ResetPassword: React.FC = () => {
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);

    const getPasswordStrength = (pass: string) => {
        if (!pass) return { label: '', color: '', percent: 0 };
        if (pass.length < 6) return { label: 'Weak', color: 'bg-rose-500', percent: 33 };
        if (pass.length < 10 || !/\d/.test(pass)) return { label: 'Medium', color: 'bg-amber-500', percent: 66 };
        return { label: 'Strong', color: 'bg-emerald-500', percent: 100 };
    };

    const strength = getPasswordStrength(password);

    const handleSubmit = (e: React.FormEvent) => {
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

        setTimeout(() => {
            setLoading(false);
            setIsSuccess(true);
        }, 800);
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
                            Password Reset Complete
                        </h1>
                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                            Your password has been updated successfully. You can now sign in with your new credentials.
                        </p>
                    </div>

                    <Button
                        onClick={() => navigate('/login')}
                        className="w-full py-3 text-xs font-black uppercase tracking-wider rounded-xl shadow-md flex items-center justify-center gap-2"
                    >
                        Sign In Now <ArrowRight size={14} />
                    </Button>
                </div>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout>
            <div className="space-y-6 text-left">
                {/* Header */}
                <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                        <ShieldCheck size={20} />
                        <span className="text-xs font-black uppercase tracking-wider">Password Reset</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                        Set New Password
                    </h1>
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                        Create a strong password for your account.
                    </p>
                </div>

                {/* Inline Error Alert */}
                {errorMsg && (
                    <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-700 dark:text-rose-400 text-xs font-bold flex items-start gap-2.5">
                        <AlertCircle size={16} className="shrink-0 mt-0.5" />
                        <div>
                            <span className="block font-black uppercase">Validation Error</span>
                            <span className="font-medium text-[11px] leading-relaxed">{errorMsg}</span>
                        </div>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                            New Password
                        </label>
                        <div className="relative">
                            <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                required
                                placeholder="Create new password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
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
                            Confirm New Password
                        </label>
                        <div className="relative">
                            <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                required
                                placeholder="Re-enter new password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        loading={loading}
                        className="w-full py-3 text-xs font-black uppercase tracking-wider rounded-xl shadow-md flex items-center justify-center gap-2"
                    >
                        {loading ? 'Updating Password...' : 'Reset Password'} <ArrowRight size={14} />
                    </Button>
                </form>

                <div className="pt-2 text-center text-xs font-semibold">
                    <Link to="/login" className="text-slate-500 hover:text-slate-900 dark:hover:text-white font-bold">
                        Back to Sign In
                    </Link>
                </div>
            </div>
        </AuthLayout>
    );
};

export default ResetPassword;
