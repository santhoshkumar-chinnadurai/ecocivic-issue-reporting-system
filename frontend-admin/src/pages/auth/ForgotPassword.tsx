import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, HelpCircle, Send, KeyRound } from 'lucide-react';
import AuthLayout from '../../layouts/AuthLayout';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setTimeout(() => {
            setSubmitting(false);
            setSent(true);
        }, 1000);
    };

    return (
        <AuthLayout>
            <div className="space-y-6 text-left animate-in fade-in duration-300">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <span className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                            <KeyRound size={18} />
                        </span>
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                            Recover Key
                        </h2>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-medium pt-1">
                        Request password reset dispatch token to your verified municipal email inbox.
                    </p>
                </div>

                {sent ? (
                    <div className="text-center py-6 space-y-4">
                        <Send className="h-10 w-10 text-emerald-500 mx-auto animate-bounce" />
                        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                            A reset dispatch token link has been issued to <span className="font-mono text-slate-900 dark:text-white font-bold">{email}</span>. Please verify your inbox folders.
                        </p>
                        <Link to="/login" className="block pt-2">
                            <Button size="sm" variant="outline" className="w-full font-bold">Return to Citizen Gate</Button>
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            label="Account Email Address"
                            type="email"
                            placeholder="citizen@civic.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            icon={<Mail size={16} />}
                        />
                        <Button type="submit" loading={submitting} className="w-full py-3 flex items-center justify-center gap-2 font-extrabold shadow-[0_0_20px_rgba(59,130,246,0.25)] rounded-2xl">
                            <Send size={15} /> Dispatch Reset Token
                        </Button>
                    </form>
                )}

                {!sent && (
                    <div className="text-center pt-2 border-t border-slate-200 dark:border-slate-900">
                        <Link to="/login" className="text-xs text-slate-600 dark:text-slate-400 font-bold hover:text-slate-900 dark:hover:text-white transition-colors">
                            ← Return to Citizen Gate
                        </Link>
                    </div>
                )}
            </div>
        </AuthLayout>
    );
};

export default ForgotPassword;
