import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { Users, FileText, CheckCircle, Clock, AlertTriangle, MapPin, Calendar, ArrowRight, Activity, TrendingUp, Trash2, Download } from 'lucide-react';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import DashboardMap from '../components/DashboardMap';
import DashboardCharts from '../components/DashboardCharts';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface User {
    user_id: string;
    email: string;
    role: string;
}

interface Report {
    report_id: string;
    user_id: string;
    title: string;
    location: string;
    created_at: string;
    status: string;
    image_url?: string;
}

interface DashboardStats {
    total: number;
    resolved: number;
    open: number; // pending
    inProgress: number;
    totalUsers?: number;
    avgResolutionTime?: string;
    wardPerformance?: Record<string, number>;
}

const Dashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState<DashboardStats>({
        total: 0,
        resolved: 0,
        open: 0,
        inProgress: 0
    });
    const [recentReports, setRecentReports] = useState<Report[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [statsRes, reportsRes] = await Promise.all([
                api.get('/analytics/dashboard-stats'),
                api.get('/reports')
            ]);
            setStats(statsRes.data);
            setRecentReports(reportsRes.data.slice(0, 5)); // Show only top 5 recent
        } catch (error) {
            console.error("Failed to fetch dashboard data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteReport = async (report_id: string) => {
        if (!window.confirm('Are you sure you want to delete this report? This action cannot be undone.')) return;
        try {
            await api.delete(`/reports/${report_id}`);
            fetchDashboardData();
        } catch (error) {
            console.error("Failed to delete report", error);
            alert("Failed to delete report. You might not have permission.");
        }
    };

    const handleGenerateUserReport = async () => {
        const dashboardElement = document.getElementById('dashboard-content');
        if (!dashboardElement) return;

        try {
            const canvas = await html2canvas(dashboardElement, {
                scale: 2,
                useCORS: true,
                backgroundColor: '#0A0A0A'
            });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`Civic_Reports_${new Date().toISOString().split('T')[0]}.pdf`);
        } catch (error) {
            console.error("Error generating PDF:", error);
        }
    };

    const StatusBadge = ({ status }: { status: string }) => {
        const styles = {
            PENDING: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
            OPEN: "bg-red-500/10 text-red-400 border-red-500/20",
            IN_PROGRESS: "bg-blue-500/10 text-blue-400 border-blue-500/20",
            APPROVED: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
            RESOLVED: "bg-green-500/10 text-green-400 border-green-500/20",
            REJECTED: "bg-red-500/10 text-red-400 border-red-500/20"
        };
        return (
            <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase border ${styles[status as keyof typeof styles] || "bg-gray-500/10 text-gray-400 border-gray-500/20"}`}>
                {status === 'APPROVED' ? 'ACCEPTED' : status.replace('_', ' ')}
            </span>
        );
    };

    return (
        <Layout userRole={user?.role}>
            <div id="dashboard-content" className="space-y-10">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div>
                        <motion.h1
                            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                            className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-tight"
                        >
                            Welcome back, {user?.email?.split('@')[0] || 'User'}
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
                            className="text-gray-600 dark:text-gray-400 mt-2 text-lg"
                        >
                            Here's your operations overview.
                        </motion.p>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                        className="flex flex-wrap gap-3"
                    >
                        {/* Admin Buttons */}
                        {user?.role === 'ADMIN' && (
                            <>
                                <button
                                    onClick={() => navigate('/reports')}
                                    className="bg-white dark:bg-white/[0.05] hover:bg-gray-50 dark:hover:bg-white/[0.1] text-gray-900 dark:text-white px-5 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 transition-all font-semibold flex items-center gap-2 text-sm shadow-sm dark:shadow-none"
                                >
                                    <FileText size={16} /> All Reports
                                </button>
                                <button
                                    onClick={handleGenerateUserReport}
                                    className="bg-gray-900 dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 px-5 py-2.5 rounded-xl transition-all font-semibold flex items-center gap-2 text-sm shadow-lg shadow-gray-200 dark:shadow-white/10"
                                >
                                    <Download size={16} /> Export PDF
                                </button>
                            </>
                        )}

                        {/* Official Buttons */}
                        {user?.role === 'OFFICIAL' && (
                            <Link
                                to="/reports"
                                className="bg-gray-900 dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 px-5 py-2.5 rounded-xl transition-all font-semibold flex items-center gap-2 text-sm shadow-lg"
                            >
                                <FileText size={16} /> View All Reports
                            </Link>
                        )}

                        {/* Citizen Buttons */}
                        {user?.role === 'CITIZEN' && (
                            <button
                                onClick={() => navigate('/create-report')}
                                className="bg-gray-900 dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 px-5 py-2.5 rounded-xl transition-all font-semibold flex items-center gap-2 text-sm shadow-lg"
                            >
                                <FileText size={16} /> Create Report
                            </button>
                        )}

                        {/* Worker Buttons */}
                        {user?.role === 'WORKER' && (
                            <Link
                                to="/reports"
                                className="bg-gray-900 dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 px-5 py-2.5 rounded-xl transition-all font-semibold flex items-center gap-2 text-sm shadow-lg"
                            >
                                <Activity size={16} /> My Tasks
                            </Link>
                        )}
                    </motion.div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {user?.role === 'ADMIN' && (
                        <>
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white dark:bg-white/[0.03] backdrop-blur-2xl border border-gray-200 dark:border-white/10 p-6 rounded-3xl shadow-xl hover:bg-gray-50 dark:hover:bg-white/[0.05] transition-colors relative overflow-hidden group">
                                <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-colors"></div>
                                <div className="flex justify-between items-start relative z-10">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Reports</p>
                                        <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{stats.total}</h3>
                                    </div>
                                    <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-500 dark:text-blue-400 border border-blue-500/20">
                                        <FileText size={22} />
                                    </div>
                                </div>
                                <div className="mt-5 flex items-center text-xs text-green-500 dark:text-green-400 font-medium">
                                    <TrendingUp size={14} className="mr-1.5" /> +12% from last month
                                </div>
                            </motion.div>

                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white dark:bg-white/[0.03] backdrop-blur-2xl border border-gray-200 dark:border-white/10 p-6 rounded-3xl shadow-xl hover:bg-gray-50 dark:hover:bg-white/[0.05] transition-colors relative overflow-hidden group">
                                <div className="absolute -right-6 -top-6 w-24 h-24 bg-green-500/10 rounded-full blur-2xl group-hover:bg-green-500/20 transition-colors"></div>
                                <div className="flex justify-between items-start relative z-10">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Resolved</p>
                                        <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{stats.resolved}</h3>
                                    </div>
                                    <div className="p-3 bg-green-500/10 rounded-2xl text-green-500 dark:text-green-400 border border-green-500/20">
                                        <CheckCircle size={22} />
                                    </div>
                                </div>
                                <div className="mt-5 flex items-center text-xs text-gray-500 dark:text-gray-400 font-medium">
                                    <Activity size={14} className="mr-1.5" /> Avg time: {stats.avgResolutionTime || 'N/A'}
                                </div>
                            </motion.div>

                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white dark:bg-white/[0.03] backdrop-blur-2xl border border-gray-200 dark:border-white/10 p-6 rounded-3xl shadow-xl hover:bg-gray-50 dark:hover:bg-white/[0.05] transition-colors relative overflow-hidden group">
                                <div className="absolute -right-6 -top-6 w-24 h-24 bg-yellow-500/10 rounded-full blur-2xl group-hover:bg-yellow-500/20 transition-colors"></div>
                                <div className="flex justify-between items-start relative z-10">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">In Progress</p>
                                        <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{stats.inProgress}</h3>
                                    </div>
                                    <div className="p-3 bg-yellow-500/10 rounded-2xl text-yellow-600 dark:text-yellow-400 border border-yellow-500/20">
                                        <Clock size={22} />
                                    </div>
                                </div>
                                <div className="mt-5 flex items-center text-xs text-yellow-600 dark:text-yellow-400 font-medium">
                                    <AlertTriangle size={14} className="mr-1.5" /> {stats.open} Pending validation
                                </div>
                            </motion.div>

                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white dark:bg-white/[0.03] backdrop-blur-2xl border border-gray-200 dark:border-white/10 p-6 rounded-3xl shadow-xl hover:bg-gray-50 dark:hover:bg-white/[0.05] transition-colors relative overflow-hidden group">
                                <div className="absolute -right-6 -top-6 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-colors"></div>
                                <div className="flex justify-between items-start relative z-10">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Users</p>
                                        <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{(stats as DashboardStats & { totalUsers?: number }).totalUsers || 0}</h3>
                                    </div>
                                    <div className="p-3 bg-purple-500/10 rounded-2xl text-purple-500 dark:text-purple-400 border border-purple-500/20">
                                        <Users size={22} />
                                    </div>
                                </div>
                                <div className="mt-5 flex items-center text-xs text-green-500 dark:text-green-400 font-medium">
                                    <TrendingUp size={14} className="mr-1.5" /> +5% new users
                                </div>
                            </motion.div>
                        </>
                    )}

                    {user?.role === 'WORKER' && (
                        <>
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white dark:bg-white/[0.03] backdrop-blur-2xl border border-gray-200 dark:border-white/10 p-6 rounded-3xl shadow-xl hover:bg-gray-50 dark:hover:bg-white/[0.05] transition-colors relative overflow-hidden group">
                                <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-colors"></div>
                                <div className="flex justify-between items-start relative z-10">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">My Tasks</p>
                                        <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{recentReports.length}</h3>
                                    </div>
                                    <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-500 dark:text-blue-400 border border-blue-500/20">
                                        <FileText size={22} />
                                    </div>
                                </div>
                            </motion.div>
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white dark:bg-white/[0.03] backdrop-blur-2xl border border-gray-200 dark:border-white/10 p-6 rounded-3xl shadow-xl hover:bg-gray-50 dark:hover:bg-white/[0.05] transition-colors relative overflow-hidden group">
                                <div className="absolute -right-6 -top-6 w-24 h-24 bg-yellow-500/10 rounded-full blur-2xl group-hover:bg-yellow-500/20 transition-colors"></div>
                                <div className="flex justify-between items-start relative z-10">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">To Do</p>
                                        <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{recentReports.filter(r => r.status === 'IN_PROGRESS' || r.status === 'APPROVED').length}</h3>
                                    </div>
                                    <div className="p-3 bg-yellow-500/10 rounded-2xl text-yellow-600 dark:text-yellow-400 border border-yellow-500/20">
                                        <Clock size={22} />
                                    </div>
                                </div>
                            </motion.div>
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white dark:bg-white/[0.03] backdrop-blur-2xl border border-gray-200 dark:border-white/10 p-6 rounded-3xl shadow-xl hover:bg-gray-50 dark:hover:bg-white/[0.05] transition-colors relative overflow-hidden group">
                                <div className="absolute -right-6 -top-6 w-24 h-24 bg-green-500/10 rounded-full blur-2xl group-hover:bg-green-500/20 transition-colors"></div>
                                <div className="flex justify-between items-start relative z-10">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Completed</p>
                                        <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{recentReports.filter(r => r.status === 'RESOLVED').length}</h3>
                                    </div>
                                    <div className="p-3 bg-green-500/10 rounded-2xl text-green-500 dark:text-green-400 border border-green-500/20">
                                        <CheckCircle size={22} />
                                    </div>
                                </div>
                            </motion.div>
                        </>
                    )}
                </div>

                {/* Map Section */}
                <DashboardMap />

                {/* Charts Section */}
                {user?.role === 'ADMIN' && <DashboardCharts stats={stats} />}

                {/* Recent Activities */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}
                    className="bg-white dark:bg-white/[0.02] backdrop-blur-3xl border border-gray-200 dark:border-white/10 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>

                    <div className="flex justify-between items-center mb-8 relative z-10">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Recent Reports</h2>
                        <Link to="/reports" className="text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1">
                            View All <ArrowRight size={16} />
                        </Link>
                    </div>

                    <div className="space-y-4 relative z-10">
                        {loading ? (
                            <div className="text-center py-10 text-gray-500 dark:text-gray-400 flex flex-col items-center">
                                <Activity size={32} className="animate-spin mb-4 text-indigo-500" />
                                Loading reports...
                            </div>
                        ) : recentReports.length > 0 ? (
                            recentReports.map((report, i) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 * i }}
                                    key={report.report_id}
                                    className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl bg-gray-50 dark:bg-white/[0.03] hover:bg-gray-100 dark:hover:bg-white/[0.08] transition-all border border-gray-200 dark:border-white/5 hover:border-gray-300 dark:hover:border-white/10 group cursor-pointer"
                                    onClick={() => navigate(`/issues/${report.report_id}`)}
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-5 sm:w-2/3">
                                        <div className="h-16 w-16 flex-shrink-0 rounded-xl bg-gray-200 dark:bg-white/5 overflow-hidden relative border border-gray-300 dark:border-white/5">
                                            {report.image_url ? (
                                                <img src={report.image_url} alt="Report" className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                            ) : (
                                                <div className="h-full w-full flex items-center justify-center text-gray-400 dark:text-gray-500">
                                                    <FileText size={24} />
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900 dark:text-white text-lg group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors pr-8 truncate max-w-sm">{report.title}</h4>
                                            <div className="flex flex-wrap items-center text-sm text-gray-500 dark:text-gray-400 mt-2 gap-4">
                                                <span className="flex items-center"><MapPin size={14} className="mr-1.5 text-rose-500 dark:text-rose-400" /> {report.location}</span>
                                                <span className="flex items-center"><Calendar size={14} className="mr-1.5" /> {new Date(report.created_at).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-end gap-3 mt-4 sm:mt-0 sm:w-1/3">
                                        <StatusBadge status={report.status} />

                                        {/* Admin Actions */}
                                        {user?.role === 'ADMIN' && report.status === 'OPEN' && (
                                            <div className="flex gap-2 ml-2">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        api.patch(`/reports/${report.report_id}/status`, { status: 'IN_PROGRESS' }).then(() => fetchDashboardData());
                                                    }}
                                                    className="p-1.5 px-3 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500 hover:text-white text-xs font-bold transition-colors"
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        api.patch(`/reports/${report.report_id}/status`, { status: 'REJECTED' }).then(() => fetchDashboardData());
                                                    }}
                                                    className="p-1.5 px-3 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white text-xs font-bold transition-colors"
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        )}

                                        {/* Official Actions */}
                                        {user?.role === 'OFFICIAL' && report.status !== 'RESOLVED' && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    api.patch(`/reports/${report.report_id}/status`, { status: 'RESOLVED' }).then(() => fetchDashboardData());
                                                }}
                                                className="ml-2 p-1.5 px-3 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500 hover:text-white text-xs font-bold transition-colors"
                                            >
                                                Complete
                                            </button>
                                        )}

                                        {/* Delete Button - Only for Owner */}
                                        {user?.user_id === report.user_id && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteReport(report.report_id);
                                                }}
                                                className="p-2 ml-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-colors"
                                                title="Delete Report"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        )}

                                        <ArrowRight size={18} className="text-gray-400 dark:text-gray-500 group-hover:translate-x-1 transition-transform duration-300 group-hover:text-gray-900 dark:group-hover:text-white ml-2 hidden sm:block" />
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="text-center py-10 text-gray-500 flex flex-col items-center">
                                <FileText size={48} className="mb-4 text-gray-400 dark:text-gray-600 opacity-50" />
                                No recent reports found.
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </Layout>
    );
};

export default Dashboard;

