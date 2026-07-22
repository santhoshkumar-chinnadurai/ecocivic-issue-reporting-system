import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Mail, Lock, Phone, Eye, EyeOff } from 'lucide-react';
import AuthLayout from '../../layouts/AuthLayout';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import api from '../../api/axios';

const Signup: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/auth/register', {
                email,
                password,
                phone,
                role: 'CITIZEN'
            });
            alert('🎉 Registration complete! Welcome to Coimbatore CivicConnect.');
            navigate('/login');
        } catch (error: any) {
            console.error('Registration failed', error);
            alert(`Registration failed: ${error.response?.data?.message || 'Check connection'}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout>
            <div className="space-y-6 text-left animate-in fade-in duration-300">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <span className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                            <UserPlus size={18} />
                        </span>
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                            Enroll Account
                        </h2>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-medium pt-1">
                        Register a new citizen profile entity to start reporting defects & earning XP.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Email Address"
                        type="email"
                        placeholder="resident@civic.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        icon={<Mail size={16} />}
                    />

                    <Input
                        label="Mobile Phone Number"
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        icon={<Phone size={16} />}
                    />

                    <div className="space-y-1.5">
                        <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                            Access Password
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
                        <UserPlus size={15} /> Complete Registration
                    </Button>
                </form>

                <div className="text-center pt-2">
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                        Already enrolled? <Link to="/login" className="text-blue-600 dark:text-blue-400 font-extrabold hover:underline">Log In Here</Link>
                    </p>
                </div>
            </div>
        </AuthLayout>
    );
};

export default Signup;
