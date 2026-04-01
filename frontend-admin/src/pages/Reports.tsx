import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Layout from '../components/Layout';
import { FileText, Filter, Search, MapPin, Calendar, ArrowRight, CheckCircle2, XCircle, Clock, MoreVertical, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Report {
    report_id: string;
    user_id: string;
    title: string;
    description: string;
    location: string;
    category: string;
    status: string;
    created_at: string;
    image_url?: string;
    priority?: string;
    user?: {
        full_name: string;
        email: string;
    };
}

const Reports = () => {
    const navigate = useNavigate();
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [filterCategory, setFilterCategory] = useState('ALL');
    const [searchTerm, setSearchTerm] = useState('');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            setLoading(true);
            const res = await api.get('/reports');
            setReports(res.data);
        } catch (error) {
            console.error("Failed to fetch reports", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id: string, newStatus: string, e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await api.patch(`/reports/${id}/status`, { status: newStatus });
            setReports(reports.map(r => r.report_id === id ? { ...r, status: newStatus } : r));
        } catch (error) {
            console.error("Failed to update status", error);
            alert("Failed to update status");
            fetchReports();
        }
    };

    const filteredReports = reports.filter(report => {
        const matchesStatus = filterStatus === 'ALL' || report.status === filterStatus;
        const matchesCategory = filterCategory === 'ALL' || report.category === filterCategory;
        const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            report.location.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesCategory && matchesSearch;
    });

    const categories = Array.from(new Set(reports.map(r => r.category)));

    const StatusBadge = ({ status }: { status: string }) => {
        const styles = {
            PENDING: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20",
            OPEN: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
            IN_PROGRESS: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
            APPROVED: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
            RESOLVED: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
            REJECTED: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20"
        };
        const icons = {
            PENDING: <Clock size={12} />,
            OPEN: <AlertTriangle size={12} />,
            IN_PROGRESS: <Clock size={12} />,
            APPROVED: <CheckCircle2 size={12} />,
            RESOLVED: <CheckCircle2 size={12} />,
            REJECTED: <XCircle size={12} />
        };

        return (
            <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase border flex items-center gap-1.5 w-fit ${styles[status as keyof typeof styles] || "bg-gray-500/10 text-gray-500 dark:text-gray-400 border-gray-500/20"}`}>
                {icons[status as keyof typeof styles]}
                {status === 'APPROVED' ? 'ACCEPTED' : status.replace('_', ' ')}
            </span>
        );
    };

    return (
        <Layout userRole={user?.role}>
            <div className="space-y-10 pb-24">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 relative z-10">
                    <div>
                        <motion.h1
                            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                            className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-tight"
                        >
                            Mission Control
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
                            className="text-gray-500 dark:text-gray-400 mt-2 text-lg"
                        >
                            Monitor and respond to citizen reports in real-time.
                        </motion.p>
                    </div>

                    {/* Stats Summary */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                        className="flex gap-4"
                    >
                        <div className="px-5 py-3 rounded-2xl bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 backdrop-blur-2xl shadow-xl hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:hover:shadow-none transition-shadow">
                            <span className="block text-2xl font-bold text-gray-900 dark:text-white">{reports.filter(r => r.status === 'OPEN').length}</span>
                            <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-widest font-bold">Open Issues</span>
                        </div>
                        <div className="px-5 py-3 rounded-2xl bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 backdrop-blur-2xl shadow-xl hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:hover:shadow-none transition-shadow">
                            <span className="block text-2xl font-bold text-green-500 dark:text-green-400">{reports.filter(r => r.status === 'RESOLVED').length}</span>
                            <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-widest font-bold">Resolved</span>
                        </div>
                    </motion.div>
                </div>

                {/* Filters Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                    className="sticky top-[88px] z-30 bg-white/70 dark:bg-black/40 backdrop-blur-3xl border border-gray-200 dark:border-white/10 p-2.5 rounded-[2rem] shadow-lg dark:shadow-2xl flex flex-col md:flex-row gap-3 transition-colors"
                >
                    <div className="relative flex-1 group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400 dark:text-gray-500 group-focus-within:text-indigo-500 dark:group-focus-within:text-indigo-400 transition-colors" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search reports..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="block w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-white/[0.03] hover:bg-gray-100 dark:hover:bg-white/[0.05] focus:bg-white dark:focus:bg-white/[0.05] border border-transparent focus:border-indigo-500/30 dark:focus:border-white/10 rounded-3xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none transition-all text-sm font-medium shadow-sm dark:shadow-none"
                        />
                    </div>

                    <div className="flex gap-3">
                        <div className="relative">
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="appearance-none h-full bg-gray-50 dark:bg-white/[0.03] hover:bg-gray-100 dark:hover:bg-white/[0.05] border border-transparent focus:border-indigo-500/30 dark:focus:border-white/10 rounded-3xl pl-5 pr-12 py-3.5 text-gray-700 dark:text-white focus:outline-none transition-all cursor-pointer text-sm font-bold shadow-sm dark:shadow-none"
                            >
                                <option value="ALL" className="bg-white dark:bg-[#0f0f0f]">All Status</option>
                                <option value="OPEN" className="bg-white dark:bg-[#0f0f0f]">Open</option>
                                <option value="IN_PROGRESS" className="bg-white dark:bg-[#0f0f0f]">In Progress</option>
                                <option value="RESOLVED" className="bg-white dark:bg-[#0f0f0f]">Resolved</option>
                                <option value="REJECTED" className="bg-white dark:bg-[#0f0f0f]">Rejected</option>
                            </select>
                            <Filter className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none" size={16} />
                        </div>

                        <div className="relative">
                            <select
                                value={filterCategory}
                                onChange={(e) => setFilterCategory(e.target.value)}
                                className="appearance-none h-full bg-gray-50 dark:bg-white/[0.03] hover:bg-gray-100 dark:hover:bg-white/[0.05] border border-transparent focus:border-indigo-500/30 dark:focus:border-white/10 rounded-3xl pl-5 pr-12 py-3.5 text-gray-700 dark:text-white focus:outline-none transition-all cursor-pointer text-sm font-bold w-full md:w-48 shadow-sm dark:shadow-none"
                            >
                                <option value="ALL" className="bg-white dark:bg-[#0f0f0f]">All Categories</option>
                                {categories.map(cat => (
                                    <option key={cat} value={cat} className="bg-white dark:bg-[#0f0f0f]">{cat}</option>
                                ))}
                            </select>
                            <MoreVertical className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none" size={16} />
                        </div>
                    </div>
                </motion.div>

                {/* Reports Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    <AnimatePresence>
                        {loading ? (
                            [...Array(6)].map((_, i) => (
                                <div key={i} className="bg-white dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 rounded-3xl h-80 animate-pulse shadow-sm dark:shadow-none" />
                            ))
                        ) : filteredReports.length > 0 ? (
                            filteredReports.map((report, i) => (
                                <motion.div
                                    key={report.report_id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ delay: i * 0.05 }}
                                    whileHover={{ y: -5 }}
                                    onClick={() => navigate(`/issues/${report.report_id}`)}
                                    className="group relative bg-white dark:bg-white/[0.02] backdrop-blur-2xl border border-gray-200 dark:border-white/10 rounded-3xl overflow-hidden hover:bg-gray-50 dark:hover:bg-white/[0.04] transition-all cursor-pointer flex flex-col shadow-lg hover:shadow-xl dark:shadow-2xl"
                                >
                                    {/* Image Area */}
                                    <div className="h-48 w-full bg-gray-100 dark:bg-[#050505] relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 dark:from-[#0A0A0A] via-transparent to-transparent z-10 opacity-90" />
                                        {report.image_url ? (
                                            <img
                                                src={report.image_url}
                                                alt={report.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 dark:opacity-80 group-hover:opacity-100"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).style.display = 'none';
                                                    (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                                                }}
                                            />
                                        ) : null}
                                        {/* Fallback pattern */}
                                        <div className={`absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-cyan-500/5 dark:from-indigo-900/10 dark:to-cyan-900/10 flex items-center justify-center ${report.image_url ? 'hidden' : ''}`}>
                                            <FileText className="text-gray-300 dark:text-white/10" size={48} />
                                        </div>

                                        <div className="absolute top-4 right-4 z-20">
                                            <StatusBadge status={report.status} />
                                        </div>
                                        <div className="absolute bottom-4 left-5 z-20">
                                            <span className="inline-block px-3 py-1 bg-white/80 dark:bg-white/10 backdrop-blur-md rounded-md text-[10px] font-bold tracking-wider uppercase text-gray-800 dark:text-white border border-white/20 dark:border-white/10 shadow-sm">
                                                {report.category}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content Area */}
                                    <div className="p-6 flex-1 flex flex-col">
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                            {report.title}
                                        </h3>
                                        <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 mb-6 flex-1">
                                            {report.description}
                                        </p>

                                        <div className="flex flex-col gap-2 text-xs text-gray-500 dark:text-gray-500 font-bold mb-6">
                                            <div className="flex items-center gap-2">
                                                <MapPin size={14} className="text-indigo-500 dark:text-indigo-400" />
                                                <span className="truncate">{report.location}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Calendar size={14} className="text-cyan-500 dark:text-cyan-400" />
                                                <span>{new Date(report.created_at).toLocaleDateString()}</span>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="pt-4 border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
                                            <div className="flex gap-2">
                                                {user?.role === 'OFFICIAL' && report.status !== 'RESOLVED' && (
                                                    <button
                                                        onClick={(e) => handleStatusUpdate(report.report_id, 'RESOLVED', e)}
                                                        className="px-3 py-1.5 bg-green-50 dark:bg-green-500/10 hover:bg-green-500 hover:text-white text-green-600 dark:text-green-400 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border border-green-200 dark:border-transparent"
                                                    >
                                                        <CheckCircle2 size={14} />
                                                        Complete
                                                    </button>
                                                )}
                                                {user?.role === 'ADMIN' && report.status === 'OPEN' && (
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={(e) => handleStatusUpdate(report.report_id, 'IN_PROGRESS', e)}
                                                            className="p-1.5 bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-500 text-blue-600 dark:text-blue-400 hover:text-white rounded-lg transition-all border border-blue-200 dark:border-transparent"
                                                            title="Mark In Progress"
                                                        >
                                                            <Clock size={16} />
                                                        </button>
                                                        <button
                                                            onClick={(e) => handleStatusUpdate(report.report_id, 'REJECTED', e)}
                                                            className="p-1.5 bg-red-50 dark:bg-red-500/10 hover:bg-red-500 text-red-600 dark:text-red-400 hover:text-white rounded-lg transition-all border border-red-200 dark:border-transparent"
                                                            title="Reject Report"
                                                        >
                                                            <XCircle size={16} />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-center group-hover:bg-indigo-500 group-hover:border-indigo-500 group-hover:text-white transition-all duration-300">
                                                <ArrowRight size={14} className="text-gray-400 dark:text-gray-400 group-hover:text-white" />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="col-span-full flex flex-col items-center justify-center py-24 text-center">
                                <div className="w-20 h-20 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-full flex items-center justify-center mb-6 shadow-sm">
                                    <Search className="text-gray-400 dark:text-gray-500" size={32} />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">No reports found</h3>
                                <p className="text-gray-500 dark:text-gray-400 max-w-sm">
                                    No reports match your current filters. Try adjusting your search query or criteria.
                                </p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </Layout>
    );
};

export default Reports;
