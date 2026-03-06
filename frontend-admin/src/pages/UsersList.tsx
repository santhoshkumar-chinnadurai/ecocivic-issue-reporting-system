import { useState, useEffect } from 'react';
import axios from 'axios';
import { Phone, Mail, Calendar, UserPlus, X, Search, MoreVertical, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../components/Layout';

const UsersList = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentUser, setCurrentUser] = useState<any>(null);

    // Form state for new admin
    const [newAdminEmail, setNewAdminEmail] = useState('');
    const [newAdminPass, setNewAdminPass] = useState('');
    const [newAdminPhone, setNewAdminPhone] = useState('');

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            setCurrentUser(user);

            // STRICT SECURITY: Only Admins can view this page
            if (user.role !== 'ADMIN') {
                window.location.href = '/dashboard'; // Force redirect
                return;
            }
        } else {
            window.location.href = '/login';
        }
        fetchUsers();
    }, []);

    const fetchUsers = () => {
        axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/users`)
            .then(res => setUsers(res.data))
            .catch(err => console.error("Failed to fetch users", err))
            .finally(() => setLoading(false));
    };

    const handleCreateAdmin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/auth/register-admin`, {
                email: newAdminEmail,
                password: newAdminPass,
                phone: newAdminPhone
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('New Admin Created Successfully!');
            setShowModal(false);
            setNewAdminEmail('');
            setNewAdminPass('');
            fetchUsers();
        } catch (err: any) {
            console.error(err);
            alert('Failed to create admin. Ensure you have permissions or email is unique.');
        }
    };

    const filteredUsers = users.filter(user =>
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Layout userRole={currentUser?.role}>
            <div className="max-w-7xl mx-auto pb-24 mt-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-6">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                        <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">User Management</h1>
                        <p className="text-indigo-300/80 font-medium text-sm mt-2 tracking-wide uppercase">Manage system users and administrators</p>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 group-focus-within:text-indigo-400 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search users by email or role..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full sm:w-72 bg-white/[0.03] border border-white/10 rounded-2xl pl-11 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.05] transition-all shadow-inner"
                            />
                        </div>
                        <button
                            onClick={() => setShowModal(true)}
                            className="flex items-center justify-center space-x-2 bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 text-white px-5 py-3 rounded-2xl shadow-lg shadow-indigo-500/20 transition-all font-bold tracking-wide transform hover:-translate-y-0.5"
                        >
                            <UserPlus size={18} />
                            <span>New Admin</span>
                        </button>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="bg-white/[0.02] backdrop-blur-3xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
                >
                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="min-w-full divide-y divide-white/10">
                            <thead className="bg-black/30">
                                <tr>
                                    <th className="px-6 py-5 text-left text-[10px] font-bold text-gray-500 uppercase tracking-widest">User Details</th>
                                    <th className="px-6 py-5 text-left text-[10px] font-bold text-gray-500 uppercase tracking-widest">System Role</th>
                                    <th className="px-6 py-5 text-left text-[10px] font-bold text-gray-500 uppercase tracking-widest">Contact Info</th>
                                    <th className="px-6 py-5 text-left text-[10px] font-bold text-gray-500 uppercase tracking-widest">Date Joined</th>
                                    <th className="px-6 py-5 text-right text-[10px] font-bold text-gray-500 uppercase tracking-widest">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 bg-transparent">
                                <AnimatePresence>
                                    {loading ? (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                                <div className="flex flex-col items-center justify-center space-y-3">
                                                    <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
                                                    <span className="text-sm tracking-widest font-bold uppercase">Loading Registry...</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : filteredUsers.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                                <div className="flex flex-col items-center justify-center space-y-3">
                                                    <Search size={32} className="opacity-20" />
                                                    <span className="text-sm tracking-widest font-bold uppercase">No Users Found</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : filteredUsers.map((user, i) => (
                                        <motion.tr
                                            key={user.user_id || user.id}
                                            layout
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ delay: i * 0.05 }}
                                            className="hover:bg-white/[0.04] transition-colors group"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                                                        <span className="text-sm font-bold text-indigo-300">{user.email?.[0].toUpperCase()}</span>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-bold text-gray-200">{user.email}</div>
                                                        <div className="text-xs text-gray-500 capitalize">{user.provider || 'Email'}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-3 py-1 inline-flex text-xs font-bold rounded-xl border items-center space-x-1 ${user.role === 'ADMIN'
                                                    ? 'bg-purple-500/10 text-purple-400 border-purple-500/30 shadow-[0_0_10px_rgba(168,85,247,0.2)]'
                                                    : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30'
                                                    }`}>
                                                    {user.role === 'ADMIN' && <ShieldAlert size={12} className="mr-1" />}
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                                <div className="flex flex-col space-y-1">
                                                    <span className="flex items-center group-hover:text-gray-300 transition-colors"><Mail size={12} className="mr-2 opacity-50" /> {user.email}</span>
                                                    <span className="flex items-center group-hover:text-gray-300 transition-colors"><Phone size={12} className="mr-2 opacity-50" /> {user.phone_number || '-'}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                                <div className="flex items-center group-hover:text-gray-300 transition-colors">
                                                    <Calendar size={14} className="mr-2 opacity-50" />
                                                    {new Date(user.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex justify-end space-x-3">
                                                    <button
                                                        onClick={() => window.location.href = `/users/${user.user_id || user.id}`}
                                                        className="p-2 text-gray-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-xl transition-all"
                                                        title="View Profile"
                                                    >
                                                        <MoreVertical size={18} />
                                                    </button>
                                                    {currentUser?.role === 'ADMIN' && (
                                                        <button
                                                            onClick={async () => {
                                                                const userId = user.user_id || user.id;
                                                                if (window.confirm(`Are you sure you want to delete user ${user.email}? This action cannot be undone.`)) {
                                                                    try {
                                                                        const token = localStorage.getItem('token');
                                                                        await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/users/${userId}`, {
                                                                            headers: { Authorization: `Bearer ${token}` }
                                                                        });
                                                                        fetchUsers();
                                                                    } catch (err: any) {
                                                                        alert(`Failed to delete user: ${err.response?.data?.message || err.message}`);
                                                                    }
                                                                }
                                                            }}
                                                            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                                                            title="Delete User"
                                                        >
                                                            <X size={18} />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>
                </motion.div>

                {/* Create Admin Modal */}
                <AnimatePresence>
                    {showModal && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                        >
                            <motion.div
                                initial={{ scale: 0.9, y: 20 }}
                                animate={{ scale: 1, y: 0 }}
                                exit={{ scale: 0.9, y: 20 }}
                                className="bg-[#111] border border-white/10 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden relative"
                            >
                                <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 to-transparent pointer-events-none" />

                                <div className="flex justify-between items-center px-8 py-6 border-b border-white/10 relative z-10">
                                    <h3 className="text-xl font-bold text-white tracking-tight">Create Admin Account</h3>
                                    <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-full transition-all">
                                        <X size={20} />
                                    </button>
                                </div>

                                <div className="p-8 relative z-10">
                                    <div className="flex gap-3 mb-6 bg-purple-500/10 border border-purple-500/20 p-4 rounded-2xl items-start">
                                        <ShieldAlert className="text-purple-400 shrink-0 mt-0.5" size={20} />
                                        <p className="text-xs text-purple-200/80 leading-relaxed font-medium">
                                            This user will have full administrative privileges across the entire system.
                                        </p>
                                    </div>

                                    <form onSubmit={handleCreateAdmin} className="space-y-5">
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Email Address</label>
                                            <input
                                                required
                                                type="email"
                                                value={newAdminEmail}
                                                onChange={e => setNewAdminEmail(e.target.value)}
                                                className="w-full bg-black border border-white/10 rounded-2xl px-5 py-3 text-white focus:outline-none focus:border-indigo-500 focus:bg-white/5 transition-all shadow-inner"
                                                placeholder="admin@example.com"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Phone Number</label>
                                            <input
                                                required
                                                type="tel"
                                                value={newAdminPhone}
                                                onChange={e => setNewAdminPhone(e.target.value)}
                                                className="w-full bg-black border border-white/10 rounded-2xl px-5 py-3 text-white focus:outline-none focus:border-indigo-500 focus:bg-white/5 transition-all shadow-inner"
                                                placeholder="+1 (555) 000-0000"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Secure Password</label>
                                            <input
                                                required
                                                type="password"
                                                value={newAdminPass}
                                                onChange={e => setNewAdminPass(e.target.value)}
                                                className="w-full bg-black border border-white/10 rounded-2xl px-5 py-3 text-white focus:outline-none focus:border-indigo-500 focus:bg-white/5 transition-all shadow-inner"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                        <div className="pt-2">
                                            <button
                                                type="submit"
                                                className="w-full py-4 rounded-2xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold tracking-wide shadow-xl shadow-indigo-500/20 transition-all flex justify-center items-center gap-2 active:scale-[0.98]"
                                            >
                                                <UserPlus size={20} />
                                                Create Administrator
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <style>{`
                    .custom-scrollbar::-webkit-scrollbar { height: 6px; }
                    .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); }
                    .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
                    .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
                `}</style>
            </div>
        </Layout>
    );
};

export default UsersList;
