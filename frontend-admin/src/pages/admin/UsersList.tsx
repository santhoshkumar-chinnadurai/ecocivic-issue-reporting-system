import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, UserPlus, X, Mail, Phone, ShieldCheck, Users, Ban, CheckCircle2, ExternalLink, ArrowLeft } from 'lucide-react';
import api from '../../api/axios';
import DashboardLayout from '../../layouts/DashboardLayout';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Badge from '../../components/ui/Badge';
import Spinner from '../../components/ui/Spinner';

const UsersList: React.FC = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRoleFilter, setSelectedRoleFilter] = useState('ALL');

    // Admin Creation Form States
    const [newAdminEmail, setNewAdminEmail] = useState('');
    const [newAdminPass, setNewAdminPass] = useState('');
    const [newAdminPhone, setNewAdminPhone] = useState('');
    const [creatingAdmin, setCreatingAdmin] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await api.get('/users');
            setUsers(res.data);
        } catch (error) {
            console.error('Failed to load users list', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateAdmin = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreatingAdmin(true);
        try {
            await api.post('/auth/register', {
                email: newAdminEmail,
                password: newAdminPass,
                phone: newAdminPhone,
                role: 'ADMIN'
            });
            alert('New Administrator successfully enrolled!');
            setShowModal(false);
            setNewAdminEmail('');
            setNewAdminPass('');
            setNewAdminPhone('');
            fetchUsers();
        } catch (error: any) {
            console.error('Admin creation failed', error);
            alert(`Failed: ${error.response?.data?.message || 'Email unique check failed'}`);
        } finally {
            setCreatingAdmin(false);
        }
    };

    const handleBanUser = async (id: string, isBanned: boolean) => {
        const action = isBanned ? 'unban' : 'ban';
        if (!window.confirm(`Are you sure you want to ${action} this user?`)) return;

        try {
            if (isBanned) {
                await api.patch(`/users/${id}/unban`);
            } else {
                const reason = window.prompt('Enter reason for ban:') || 'Violated municipal reporting rules';
                await api.patch(`/users/${id}/ban`, { reason });
            }
            alert(`User successfully ${action}ned!`);
            fetchUsers();
        } catch (error) {
            console.error('Failed to update ban state', error);
        }
    };

    const filteredUsers = users.filter(u => {
        const matchesSearch = 
            u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.phone_number?.includes(searchTerm);
            
        const matchesRole = 
            selectedRoleFilter === 'ALL' || 
            u.role === selectedRoleFilter;

        return matchesSearch && matchesRole;
    });

    return (
        <DashboardLayout>
            <div className="space-y-6 text-left animate-in fade-in duration-300">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all active:scale-95 shadow-sm cursor-pointer"
                        >
                            <ArrowLeft size={18} />
                        </button>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">Accounts Directory</h1>
                            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 font-medium">Verify system profiles, change role clearances, or manage offending user node bans.</p>
                        </div>
                    </div>
                    <Button onClick={() => setShowModal(true)} className="flex items-center gap-2 font-extrabold shadow-[0_0_20px_rgba(16, 185, 129,0.25)] rounded-2xl">
                        <UserPlus size={16} /> Enroll Admin
                    </Button>
                </div>

                {/* Search & Role Filter Toolbar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full sm:w-auto flex-1 max-w-xl">
                        <Input
                            placeholder="Search email or phone..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            icon={<Search size={16} />}
                            className="text-xs"
                        />
                        <Select
                            value={selectedRoleFilter}
                            onChange={(e) => setSelectedRoleFilter(e.target.value)}
                            options={[
                                { value: 'ALL', label: 'All Roles' },
                                { value: 'CITIZEN', label: 'Citizen' },
                                { value: 'WORKER', label: 'Worker Crew' },
                                { value: 'OFFICIAL', label: 'Official' },
                                { value: 'ADMIN', label: 'Administrator' }
                            ]}
                        />
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
                        Showing <span className="text-emerald-600 dark:text-emerald-400 font-black">{filteredUsers.length}</span> / {users.length} accounts
                    </span>
                </div>

                {/* Accounts Table */}
                {loading ? (
                    <div className="h-80 w-full flex items-center justify-center">
                        <Spinner size="lg" />
                    </div>
                ) : filteredUsers.length === 0 ? (
                    <div className="bg-white dark:bg-slate-900 p-12 text-center rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <Users size={48} className="text-slate-400 mx-auto mb-3" />
                        <p className="text-slate-800 dark:text-slate-200 text-sm font-bold">No accounts found matching filter criteria</p>
                    </div>
                ) : (
                    <div className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs border-collapse">
                                <thead>
                                    <tr className="bg-slate-100 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-extrabold uppercase tracking-wider">
                                        <th className="p-4">Profile Email</th>
                                        <th className="p-4">Role Clearance</th>
                                        <th className="p-4">Contact Phone</th>
                                        <th className="p-4 text-center">Ban Status</th>
                                        <th className="p-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 dark:divide-slate-800/80 font-medium">
                                    {filteredUsers.map((u) => (
                                        <tr key={u.user_id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                                            <td className="p-4 font-bold text-slate-900 dark:text-white">{u.email}</td>
                                            <td className="p-4">
                                                <Badge variant={u.role === 'ADMIN' ? 'danger' : u.role === 'WORKER' ? 'warning' : u.role === 'OFFICIAL' ? 'info' : 'primary'}>
                                                    {u.role}
                                                </Badge>
                                            </td>
                                            <td className="p-4 font-mono font-bold text-slate-600 dark:text-slate-400">{u.phone_number || 'N/A'}</td>
                                            <td className="p-4 text-center">
                                                <Badge variant={u.is_banned ? 'danger' : 'success'}>
                                                    {u.is_banned ? 'BANNED' : 'ACTIVE'}
                                                </Badge>
                                            </td>
                                            <td className="p-4 text-right flex justify-end gap-2">
                                                <button
                                                    onClick={() => navigate(`/users/${u.user_id}`)}
                                                    className="px-3 py-1.5 text-xs font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-xl transition-all flex items-center gap-1 cursor-pointer"
                                                >
                                                    <ExternalLink size={12} /> Inspect
                                                </button>
                                                {u.role !== 'ADMIN' && (
                                                    <button
                                                        onClick={() => handleBanUser(u.user_id, u.is_banned)}
                                                        className={`px-3 py-1.5 text-xs font-extrabold rounded-xl transition-all cursor-pointer flex items-center gap-1 ${
                                                            u.is_banned 
                                                                ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30' 
                                                                : 'text-rose-600 dark:text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30'
                                                        }`}
                                                    >
                                                        {u.is_banned ? <CheckCircle2 size={12} /> : <Ban size={12} />}
                                                        {u.is_banned ? 'Unban' : 'Ban'}
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Enroll Admin Modal */}
                <AnimatePresence>
                    {showModal && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                            <motion.div
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.95, opacity: 0 }}
                                className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl text-left"
                            >
                                <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-800 mb-4">
                                    <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                                        <ShieldCheck size={18} className="text-emerald-600 dark:text-emerald-400" /> Enroll Administrator
                                    </h3>
                                    <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-700 dark:hover:text-white">
                                        <X size={20} />
                                    </button>
                                </div>

                                <form onSubmit={handleCreateAdmin} className="space-y-4">
                                    <Input
                                        label="Admin Email Address"
                                        type="email"
                                        placeholder="admin_new@civic.com"
                                        value={newAdminEmail}
                                        onChange={(e) => setNewAdminEmail(e.target.value)}
                                        required
                                        icon={<Mail size={16} />}
                                    />
                                    <Input
                                        label="Contact Phone Number"
                                        type="tel"
                                        placeholder="+91 98765 43210"
                                        value={newAdminPhone}
                                        onChange={(e) => setNewAdminPhone(e.target.value)}
                                        required
                                        icon={<Phone size={16} />}
                                    />
                                    <Input
                                        label="Admin Passkey"
                                        type="password"
                                        placeholder="••••••••"
                                        value={newAdminPass}
                                        onChange={(e) => setNewAdminPass(e.target.value)}
                                        required
                                        icon={<ShieldCheck size={16} />}
                                    />

                                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                                        <Button type="button" variant="outline" onClick={() => setShowModal(false)} disabled={creatingAdmin} className="font-bold">
                                            Cancel
                                        </Button>
                                        <Button type="submit" loading={creatingAdmin} className="font-extrabold shadow-[0_0_20px_rgba(16, 185, 129,0.25)] rounded-2xl">
                                            Enroll Admin Node
                                        </Button>
                                    </div>
                                </form>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </DashboardLayout>
    );
};

export default UsersList;
