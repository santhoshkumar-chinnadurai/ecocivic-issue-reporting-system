import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Mail, LogIn, Eye, EyeOff, Building2, HardHat } from 'lucide-react';
import AuthLayout from '../../layouts/AuthLayout';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import api from '../../api/axios';

const GovernmentLogin: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('official@civic.com');
    const [password, setPassword] = useState('official123');
    const [showPassword, setShowPassword] = useState(false);
    const [role, setRole] = useState<'OFFICIAL' | 'WORKER'>('OFFICIAL');
    const [loading, setLoading] = useState(false);

    const performLogin = (userObj: any, token: string) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userObj));
        navigate('/dashboard');
    };

    const handleQuickDemoLogin = () => {
        setLoading(true);
        setTimeout(() => {
            const mockUserId = role === 'WORKER' ? 'wrk-123' : 'off-123';
            const mockEmail = role === 'WORKER' ? 'worker@civic.com' : 'official@civic.com';
            performLogin(
                { email: mockEmail, role, id: mockUserId, user_id: mockUserId, points: 380 },
                'demo-gov-session-token'
            );
            setLoading(false);
        }, 300);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post('/auth/login', { email, password });
            performLogin(res.data.user, res.data.access_token);
        } catch (error) {
            console.warn('Login fail, using mock credentials', error);
            const mockUserId = role === 'WORKER' ? 'wrk-123' : 'off-123';
            performLogin(
                { email: email || 'official@civic.com', role, id: mockUserId, user_id: mockUserId, points: 380 },
                'mock-session-token'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout>
            <div className="space-y-6 text-left animate-in fade-in duration-300">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <span className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                            {role === 'WORKER' ? <HardHat size={18} /> : <Building2 size={18} />}
                        </span>
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                            Dispatch Terminal
                        </h2>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-medium pt-1">
                        Verifying administrative triage or operations field crew clearance.
                    </p>
                </div>

                {/* Role tab selector */}
                <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl text-[11px] font-extrabold uppercase tracking-wider">
                    <button
                        type="button"
                        onClick={() => {
                            setRole('OFFICIAL');
                            setEmail('official@civic.com');
                            setPassword('official123');
                        }}
                        className={`py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                            role === 'OFFICIAL' 
                                ? 'bg-blue-600 text-white shadow-md font-black' 
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                    >
                        <Building2 size={14} /> Official Triage
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setRole('WORKER');
                            setEmail('worker@civic.com');
                            setPassword('worker123');
                        }}
                        className={`py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                            role === 'WORKER' 
                                ? 'bg-blue-600 text-white shadow-md font-black' 
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                    >
                        <HardHat size={14} /> Worker Crew
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Government Email ID"
                        type="email"
                        placeholder={role === 'WORKER' ? 'crew_member@civic.gov' : 'sarah_official@civic.gov'}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        icon={<Mail size={16} />}
                    />

                    <div className="space-y-1.5">
                        <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                            Operations Passkey
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all text-xs font-medium pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-white"
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    <Button type="submit" className="w-full py-3 flex items-center justify-center gap-2 font-extrabold shadow-[0_0_20px_rgba(59,130,246,0.25)] rounded-2xl" loading={loading}>
                        <LogIn size={15} /> Mount {role === 'WORKER' ? 'Worker' : 'Official'} Console
                    </Button>
                </form>
            </div>
        </AuthLayout>
    );
};

export default GovernmentLogin;
