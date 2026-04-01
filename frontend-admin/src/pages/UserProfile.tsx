import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, Mail, Phone, Shield, Calendar, Trash2, Save, User as UserIcon, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../api/axios';
import Layout from '../components/Layout';

const UserProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [userData, setUserData] = useState<any>({
        email: '',
        phone_number: '',
        role: '',
        user_id: '',
        created_at: new Date().toISOString()
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);

    // Get logged in user to check permissions
    const loggedInUserStr = localStorage.getItem('user');
    const loggedInUser = loggedInUserStr ? JSON.parse(loggedInUserStr) : null;

    const handleDelete = async () => {
        const userId = userData.user_id || userData.id || id;

        if (!userId) {
            alert("Error: No user ID found to delete.");
            return;
        }

        if (!window.confirm(`Are you sure you want to delete user ${userData.email || 'this user'}? This action cannot be undone.`)) {
            return;
        }

        setDeleting(true);
        try {
            console.log(`Attempting to delete user: ${userId}`);
            await api.delete(`/users/${userId}`);
            alert("User deleted successfully.");
            navigate('/users'); // Navigate back to the list
        } catch (error: any) {
            console.error("Failed to delete user", error.response?.data || error.message);
            alert(`Failed to delete user: ${error.response?.data?.message || error.message}`);
        } finally {
            setDeleting(false);
        }
    };

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const targetId = id || (loggedInUser?.id || loggedInUser?.user_id);

                if (targetId) {
                    // 1. Try fetching from API
                    try {
                        const res = await api.get(`/users/${targetId}`);
                        setUserData(res.data);
                    } catch (apiErr) {
                        console.warn("API unavailable, falling back to local storage/mock", apiErr);
                        // 2. Fallback: Use loggedInUser data if IDs match or if it's 'me'
                        if (loggedInUser && (loggedInUser.id === targetId || loggedInUser.user_id === targetId || !id)) {
                            setUserData({
                                ...loggedInUser,
                                phone_number: loggedInUser.phone_number || loggedInUser.phone || 'Not provided',
                                created_at: loggedInUser.created_at || new Date().toISOString()
                            });
                        } else {
                            // 3. Mock Data Last Resort
                            setUserData({
                                email: 'citizen@example.com',
                                phone_number: '+1 (555) 000-0000',
                                role: 'CITIZEN',
                                user_id: targetId || 'user-123',
                                created_at: new Date().toISOString()
                            });
                        }
                    }
                }
            } catch (err) {
                console.error("Failed to fetch user", err);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [id]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        // Mock API Call delay
        await new Promise(r => setTimeout(r, 800));

        try {
            // Try Real API
            if (userData.user_id) {
                await api.patch(`/users/${userData.user_id}`, {
                    phone_number: userData.phone_number,
                    email: userData.email,
                });
            }

            // Update Local Storage if it's the current user
            if (loggedInUser && (loggedInUser.id === userData.user_id || loggedInUser.user_id === userData.user_id)) {
                const updatedUser = { ...loggedInUser, email: userData.email, phone_number: userData.phone_number, phone: userData.phone_number };
                localStorage.setItem('user', JSON.stringify(updatedUser));
            }

            alert('Profile Updated Successfully!');
        } catch (err) {
            console.error("Save failed, but updating local state for demo", err);
            // Demo Fallback
            if (loggedInUser) {
                const updatedUser = { ...loggedInUser, email: userData.email, phone_number: userData.phone_number, phone: userData.phone_number };
                localStorage.setItem('user', JSON.stringify(updatedUser));
                alert('Profile Updated (Local)!');
            }
        } finally {
            setSaving(false);
        }
    };

    const canEdit = true; // Allow editing for demo purposes mostly

    return (
        <Layout userRole={loggedInUser?.role}>
            <div className="max-w-5xl mx-auto pb-24 mt-4 transition-colors duration-500">
                {/* Header Sequence */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 flex flex-col items-start gap-4"
                >
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center text-sm font-bold tracking-widest uppercase text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 bg-white dark:bg-white/[0.02] hover:bg-gray-50 dark:hover:bg-indigo-500/10 border border-gray-200 dark:border-white/5 hover:border-indigo-200 dark:hover:border-indigo-500/30 px-4 py-2 rounded-xl transition-all shadow-sm dark:shadow-none group"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Return
                    </button>
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
                            <UserIcon className="text-indigo-600 dark:text-indigo-400" size={32} />
                            Profile Configuration
                        </h1>
                        <p className="text-indigo-600 dark:text-indigo-300/80 font-bold text-sm mt-2 tracking-wide uppercase">Identity and Security Credentials</p>
                    </div>
                </motion.div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center p-24 space-y-4 bg-white dark:bg-white/[0.02] backdrop-blur-3xl border border-gray-200 dark:border-white/10 rounded-3xl mt-8 shadow-sm dark:shadow-none">
                        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-sm font-bold tracking-widest text-gray-500 uppercase">Synchronizing Records...</span>
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ delay: 0.1, type: "spring", stiffness: 100 }}
                        className="bg-white dark:bg-white/[0.02] backdrop-blur-3xl border border-gray-200 dark:border-white/10 rounded-3xl overflow-hidden shadow-xl dark:shadow-2xl mt-8 flex flex-col md:flex-row"
                    >
                        {/* Sidebar / Avatar Section */}
                        <div className="md:w-[35%] bg-gray-50 dark:bg-black/40 p-10 flex flex-col items-center border-b md:border-b-0 md:border-r border-gray-200 dark:border-white/10 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 dark:from-indigo-500/5 to-purple-50 dark:to-purple-500/5 pointer-events-none" />

                            <div className="relative mb-8 z-10 group-hover:scale-105 transition-transform duration-500">
                                <div className="h-36 w-36 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-500 p-[2px] shadow-[0_0_30px_rgba(99,102,241,0.2)] rotate-3 group-hover:rotate-6 transition-all">
                                    <div className="h-full w-full rounded-[22px] bg-white dark:bg-[#0A0A0A] flex items-center justify-center text-gray-900 dark:text-white text-6xl font-black -rotate-3 group-hover:-rotate-6 transition-all shadow-inner">
                                        {userData.email?.[0]?.toUpperCase() || 'U'}
                                    </div>
                                </div>
                                <button className="absolute -bottom-3 -right-3 p-3 bg-indigo-600 dark:bg-indigo-500 rounded-2xl hover:bg-indigo-700 dark:hover:bg-indigo-400 transition-all shadow-xl rotate-12 hover:rotate-0 hover:scale-110 border-2 border-white dark:border-[#111]">
                                    <Camera className="h-5 w-5 text-white" />
                                </button>
                            </div>

                            <h2 className="text-2xl font-black text-gray-900 dark:text-white text-center break-all z-10">{userData.email || 'User Account'}</h2>
                            <div className="mt-3 px-4 py-1.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 text-xs font-black tracking-widest uppercase rounded-xl border border-indigo-200 dark:border-indigo-500/30 shadow-sm dark:shadow-[0_0_15px_rgba(99,102,241,0.15)] z-10">
                                {userData.role || 'CITIZEN'}
                            </div>

                            <div className="mt-10 w-full space-y-4 z-10">
                                <div className="p-5 bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-200 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/[0.06] transition-colors relative overflow-hidden shadow-sm dark:shadow-none">
                                    <div className="absolute top-0 right-0 p-3 opacity-[0.05] dark:opacity-10 text-emerald-600 dark:text-current"><Shield size={32} /></div>
                                    <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Clearance Level</div>
                                    <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400">98<span className="text-xl text-emerald-600/50 dark:text-emerald-400/50">%</span></div>
                                </div>
                                <div className="p-5 bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-200 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/[0.06] transition-colors relative overflow-hidden shadow-sm dark:shadow-none">
                                    <div className="absolute top-0 right-0 p-3 opacity-[0.05] dark:opacity-10 text-indigo-600 dark:text-current"><Activity size={32} /></div>
                                    <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Total Reports</div>
                                    <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400">12<span className="text-xl text-indigo-600/50 dark:text-indigo-400/50">#</span></div>
                                </div>
                            </div>
                        </div>

                        {/* Form Section */}
                        <div className="md:w-[65%] p-10 bg-transparent relative z-10">
                            <form onSubmit={handleSave} className="space-y-8">
                                <h3 className="text-xs font-black tracking-[0.2em] text-gray-500 uppercase border-b border-gray-200 dark:border-white/5 pb-4 mb-8">
                                    Personal Credentials
                                </h3>

                                <div className="grid grid-cols-1 gap-7">
                                    <div>
                                        <label className="block text-[10px] font-bold tracking-widest uppercase text-gray-500 dark:text-gray-400 mb-2">Primary Email</label>
                                        <div className="relative group">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500 group-focus-within:text-indigo-500 dark:group-focus-within:text-indigo-400 transition-colors" />
                                            <input
                                                type="email"
                                                value={userData.email || ''}
                                                onChange={e => setUserData({ ...userData, email: e.target.value })}
                                                disabled={!canEdit}
                                                className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-2xl py-4 pl-12 pr-4 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 focus:bg-white dark:focus:bg-white/[0.02] transition-all shadow-sm dark:shadow-inner disabled:opacity-50"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-bold tracking-widest uppercase text-gray-500 dark:text-gray-400 mb-2">Secure Comm Link</label>
                                        <div className="relative group">
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500 group-focus-within:text-indigo-500 dark:group-focus-within:text-indigo-400 transition-colors" />
                                            <input
                                                type="tel"
                                                value={userData.phone_number || ''}
                                                onChange={e => setUserData({ ...userData, phone_number: e.target.value })}
                                                disabled={!canEdit}
                                                className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-2xl py-4 pl-12 pr-4 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 focus:bg-white dark:focus:bg-white/[0.02] transition-all shadow-sm dark:shadow-inner disabled:opacity-50"
                                                placeholder="+1 (555) 000-0000"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-[10px] font-bold tracking-widest uppercase text-gray-500 dark:text-gray-400 mb-2">Assigned Role</label>
                                            <div className="relative border border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-white/[0.01] rounded-2xl overflow-hidden pointer-events-none shadow-sm dark:shadow-none">
                                                <Shield className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-indigo-500/60" />
                                                <input
                                                    type="text"
                                                    value={userData.role || ''}
                                                    disabled
                                                    className="w-full bg-transparent py-4 pl-12 pr-4 text-gray-700 dark:text-gray-300 font-bold tracking-wider"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold tracking-widest uppercase text-gray-500 dark:text-gray-400 mb-2">System Entry Date</label>
                                            <div className="relative border border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-white/[0.01] rounded-2xl overflow-hidden pointer-events-none shadow-sm dark:shadow-none">
                                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-purple-500/60" />
                                                <input
                                                    type="text"
                                                    value={new Date(userData.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                                                    disabled
                                                    className="w-full bg-transparent py-4 pl-12 pr-4 text-gray-700 dark:text-gray-300 font-bold"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-8 mt-4 border-t border-gray-200 dark:border-white/5 flex flex-col sm:flex-row justify-between gap-4">
                                    {loggedInUser?.role === 'ADMIN' && (
                                        <button
                                            type="button"
                                            onClick={handleDelete}
                                            disabled={deleting || !canEdit}
                                            className="flex items-center justify-center px-6 py-4 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 text-red-600 dark:text-red-500 border border-red-200 dark:border-red-500/20 rounded-2xl font-bold transition-all disabled:opacity-50 cursor-pointer shadow-sm dark:shadow-none"
                                        >
                                            <Trash2 className="h-5 w-5 mr-3" />
                                            {deleting ? 'Executing...' : 'Terminate Account'}
                                        </button>
                                    )}
                                    <button
                                        type="submit"
                                        disabled={saving || !canEdit}
                                        className="sm:ml-auto flex items-center justify-center px-8 py-4 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-2xl font-bold tracking-wide shadow-lg dark:shadow-xl dark:shadow-indigo-500/20 transition-all transform hover:-translate-y-1 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                                    >
                                        <Save className="h-5 w-5 mr-3" />
                                        {saving ? 'Encrypting...' : 'Save Configuration'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                )}
            </div>
        </Layout>
    );
};

export default UserProfile;
