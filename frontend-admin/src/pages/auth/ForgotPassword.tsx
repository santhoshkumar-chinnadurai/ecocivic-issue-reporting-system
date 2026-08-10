import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2, AlertCircle, Send } from 'lucide-react';
import AuthLayout from '../../layouts/AuthLayout';
import Button from '../../components/ui/Button';

const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate real email request submission
        setTimeout(() => {
            setLoading(false);
            setSubmitted(true);
        }, 800);
    };

    if (submitted) {
        return (
            <AuthLayout>
                <div className="space-y-6 text-left py-4">
                    <div className="h-12 w-12 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-2xl flex items-center justify-center">
                        <CheckCircle2 size={24} />
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-2xl font-black text-slate-900 dark:text-white">
                            Check Your Email
                        </h1>
                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                            If an account associated with <span className="font-bold text-slate-900 dark:text-white">{email}</span> exists, password recovery instructions have been sent.
                        </p>
                    </div>

                    <Link to="/login" className="block">
                        <Button
                            className="w-full py-3 text-xs font-black uppercase tracking-wider rounded-xl shadow-md flex items-center justify-center gap-2"
                        >
                            <ArrowLeft size={14} /> Back to Sign In
                        </Button>
                    </Link>
                </div>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout>
            <div className="space-y-6 text-left">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                        Reset Your Password
                    </h1>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
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
                        {loading ? 'Sending Instructions...' : 'Send Reset Link'} <Send size={14} />
                    </Button>
                </form>

                {/* Back to sign in */}
                <div className="pt-2 text-center text-xs font-semibold">
                    <Link to="/login" className="text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center gap-1">
                        <ArrowLeft size={13} /> Back to Sign In
                    </Link>
                </div>
            </div>
        </AuthLayout>
    );
};

export default ForgotPassword;
