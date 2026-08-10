import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Mail, Phone, Calendar, Shield, MapPin, Trash2, Cpu, Award, Zap, CheckCircle2 } from 'lucide-react';
import api from '../../api/axios';
import DashboardLayout from '../../layouts/DashboardLayout';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import Spinner from '../../components/ui/Spinner';
import platformConfig from '../../config/platformConfig';

const UserProfile: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [userData, setUserData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const loggedInUser = (() => {
        try {
            const raw = localStorage.getItem('user');
            return raw && raw !== 'undefined' ? JSON.parse(raw) : {};
        } catch {
            return {};
        }
    })();
    const userRole = loggedInUser.role;

    useEffect(() => {
        fetchProfile();
    }, [id]);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const targetId = id || loggedInUser.user_id || loggedInUser.id;
            const res = await api.get(`/users/${targetId}`);
            setUserData(res.data);
        } catch (error) {
            console.error('API error user profile', error);
            if (!id && loggedInUser.email) {
                setUserData(loggedInUser);
            } else {
                setUserData(null);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const targetId = userData.user_id || id;
            await api.patch(`/users/${targetId}`, {
                email: userData.email,
                phone_number: userData.phone_number,
                points: userData.points
            });
            alert('Profile updated successfully!');
            if (!id) {
                localStorage.setItem('user', JSON.stringify({ ...loggedInUser, ...userData }));
            }
            fetchProfile();
        } catch (error) {
            console.error('Failed to update profile', error);
            alert('Failed to update profile.');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        const targetId = userData.user_id || id;
        if (!window.confirm('Are you sure you want to delete this account?')) return;

        setDeleting(true);
        try {
            await api.delete(`/users/${targetId}`);
            alert('Account deleted.');
            if (!id) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/');
            } else {
                navigate('/users');
            }
        } catch (error) {
            console.error('Failed to delete account', error);
            alert('Delete failed.');
        } finally {
            setDeleting(false);
        }
    };

    if (loading || !userData) {
        return (
            <DashboardLayout>
                <div className="h-96 w-full flex items-center justify-center">
                    <Spinner size="lg" />
                </div>
            </DashboardLayout>
        );
    }

    const currentPoints = userData.points || 0;
    const currentLevel = Math.max(1, Math.floor(currentPoints / 100) + 1);
    const nextLevelXP = currentLevel * 100;
    const progressPercent = Math.min(100, Math.round(((currentPoints % 100) / 100) * 100));

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto space-y-6 text-left animate-in fade-in duration-300">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all active:scale-95 shadow-sm cursor-pointer"
                    >
                        <ArrowLeft size={18} />
                    </button>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                            {id ? 'User Profile Inspection' : 'My Profile'}
                        </h1>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 font-medium">
                            Manage profile parameters, contact credentials, and municipal ward allocations.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Avatar & Stats Card */}
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 flex flex-col items-center text-center">
                        <div className="h-24 w-24 rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-3xl font-black uppercase shadow-lg shadow-blue-500/20 border-2 border-white dark:border-slate-800">
                            {userData.email ? userData.email.slice(0, 2) : 'US'}
                        </div>

                        <div className="space-y-1 w-full">
                            <h3 className="text-lg font-black text-slate-900 dark:text-white leading-tight">
                                {userData.email?.split('@')[0]}
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">{userData.email}</p>
                            <div className="pt-2 flex gap-1.5 justify-center">
                                <Badge variant={userData.role === 'ADMIN' ? 'danger' : userData.role === 'WORKER' ? 'warning' : userData.role === 'OFFICIAL' ? 'info' : 'primary'}>
                                    {userData.role}
                                </Badge>
                                {userData.is_banned && <Badge variant="danger">BANNED</Badge>}
                            </div>
                        </div>

                        {/* XP Stats Box */}
                        <div className="w-full pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
                            <div className="grid grid-cols-2 gap-3 text-center">
                                <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-200 dark:border-slate-800">
                                    <span className="block text-2xl font-black text-blue-600 dark:text-blue-400">{currentPoints}</span>
                                    <span className="text-[9px] text-slate-500 dark:text-slate-400 font-extrabold uppercase tracking-widest">XP Points</span>
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-200 dark:border-slate-800">
                                    <span className="block text-2xl font-black text-emerald-600 dark:text-emerald-400">Lvl {currentLevel}</span>
                                    <span className="text-[9px] text-slate-500 dark:text-slate-400 font-extrabold uppercase tracking-widest">Rank Level</span>
                                </div>
                            </div>

                            {/* Level Progress Bar */}
                            <div className="space-y-1 text-left px-1 pt-1">
                                <div className="flex justify-between text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400">
                                    <span>Progress to Level {currentLevel + 1}</span>
                                    <span>{progressPercent}%</span>
                                </div>
                                <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
                                </div>
                            </div>
                        </div>

                        {/* Technical Metadata */}
                        <div className="w-full text-xs space-y-2.5 pt-4 border-t border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-medium text-left">
                            <div className="flex items-center gap-2">
                                <Calendar size={15} className="text-slate-400 shrink-0" />
                                <span>Enrolled: {new Date(userData.created_at || Date.now()).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin size={15} className="text-slate-400 shrink-0" />
                                <span>Municipal District: {platformConfig.city}</span>
                            </div>
                        </div>

                        {userRole === 'ADMIN' && (
                            <Button 
                                variant="danger" 
                                className="w-full flex items-center justify-center gap-2 text-xs py-3 font-extrabold shadow-sm rounded-2xl"
                                onClick={handleDelete}
                                loading={deleting}
                            >
                                <Trash2 size={15} /> Delete User Account
                            </Button>
                        )}
                    </div>

                    {/* Right Form Card */}
                    <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                            <h3 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-wider">Profile Settings</h3>
                            <span className="text-xs text-blue-600 dark:text-blue-400 font-extrabold flex items-center gap-1">
                                <CheckCircle2 size={14} /> Profile Verified
                            </span>
                        </div>
                        
                        <form onSubmit={handleSave} className="space-y-5">
                            <Input
                                label="Email Address"
                                type="email"
                                value={userData.email || ''}
                                onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                                required
                                icon={<Mail size={16} />}
                            />

                            <Input
                                label="Mobile Phone Number"
                                type="tel"
                                value={userData.phone_number || ''}
                                onChange={(e) => setUserData({ ...userData, phone_number: e.target.value })}
                                icon={<Phone size={16} />}
                            />

                            {userRole === 'ADMIN' && (
                                <Input
                                    label="XP Points Override (Root Admin)"
                                    type="number"
                                    value={userData.points || 0}
                                    onChange={(e) => setUserData({ ...userData, points: parseInt(e.target.value) || 0 })}
                                    icon={<Shield size={16} />}
                                />
                            )}

                            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
                                <Button type="submit" loading={saving} className="flex items-center gap-2 py-3 px-6 font-extrabold shadow-[0_0_20px_rgba(59,130,246,0.25)] rounded-2xl">
                                    <Save size={16} /> Save Profile Changes
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>

            </div>
        </DashboardLayout>
    );
};

export default UserProfile;
