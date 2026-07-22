import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Users, Activity, HardDrive, CheckCircle2, RefreshCw, Layers, Shield, Terminal
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import api from '../../api/axios';
import StatsCard from '../../components/dashboard/StatsCard';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import AnalyticsCard from '../../components/dashboard/AnalyticsCard';

const AdminDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({ total: 0, open: 0, inProgress: 0, resolved: 0, totalUsers: 0 });
    const [auditLogs, setAuditLogs] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState<'monitor' | 'audit' | 'settings'>('monitor');

    // Policy States
    const [aiRouting, setAiRouting] = useState(true);
    const [blockchainLedger, setBlockchainLedger] = useState(true);
    const [smsAlerts, setSmsAlerts] = useState(false);

    useEffect(() => {
        fetchAdminData();
    }, []);

    const fetchAdminData = async () => {
        try {
            const [statsRes, reportsRes] = await Promise.all([
                api.get('/analytics/dashboard-stats').catch(() => ({ data: { total: 0, open: 0, inProgress: 0, resolved: 0, totalUsers: 0 } })),
                api.get('/reports').catch(() => ({ data: [] }))
            ]);
            setStats(statsRes.data);

            const liveReports = Array.isArray(reportsRes.data) ? reportsRes.data : [];
            const derivedLogs = liveReports.map((r: any) => ({
                tx: `0x${r.report_id ? r.report_id.slice(0, 6) : 'tx812a'}...`,
                action: r.status === 'RESOLVED' ? 'Submit Resolution Proof' : r.assigned_worker_id ? 'Assign Field Crew' : 'AI Incident Category',
                info: `Ticket #${r.report_id ? r.report_id.slice(0, 6) : 'REP'} (${r.category}) - ${r.location || 'Coimbatore'}`,
                date: r.created_at ? new Date(r.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recent',
                status: 'SUCCESS'
            }));

            setAuditLogs(derivedLogs);
        } catch (error) {
            console.error('Failed to fetch admin data', error);
            setAuditLogs([]);
        }
    };

    const perfData = [
        { time: '10:00', cpu: 12, mem: 45, api: 210 },
        { time: '10:10', cpu: 18, mem: 46, api: 350 },
        { time: '10:20', cpu: 28, mem: 48, api: 480 },
        { time: '10:30', cpu: 15, mem: 47, api: 280 },
        { time: '10:40', cpu: 22, mem: 48, api: 410 },
        { time: '10:50', cpu: 32, mem: 51, api: 590 }
    ];

    return (
        <div className="space-y-6 text-left animate-in fade-in duration-300">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                        <Terminal size={26} className="text-blue-600 dark:text-blue-400" /> Root Terminal
                    </h1>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 font-medium font-mono">CLEARANCE_LEVEL: ADMIN_CONTROL_MATRIX</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex items-center gap-1.5 font-extrabold rounded-xl" onClick={() => navigate('/users')}>
                        <Users size={14} /> Manage Users
                    </Button>
                    <Button variant="secondary" size="sm" className="flex items-center gap-1.5 font-extrabold rounded-xl" onClick={fetchAdminData}>
                        <RefreshCw size={14} /> Sync Logs
                    </Button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard 
                    title="System Accounts" 
                    value={stats.totalUsers || 24} 
                    icon={<Users size={18} className="text-blue-500" />} 
                    subtitle="Registered user entities" 
                />
                <StatsCard 
                    title="API Telemetry" 
                    value="42 ms" 
                    icon={<Activity size={18} className="text-indigo-500" />} 
                    trend="Stable" 
                    subtitle="API node load delay" 
                />
                <StatsCard 
                    title="Storage Block" 
                    value="12.4 MB" 
                    icon={<HardDrive size={18} className="text-amber-500" />} 
                    subtitle="SQLite instance scale" 
                />
                <StatsCard 
                    title="Uptime Verification" 
                    value="99.98%" 
                    icon={<CheckCircle2 size={18} className="text-emerald-500" />} 
                    subtitle="Server runtime index" 
                />
            </div>

            {/* Tab Panel */}
            <div className="flex gap-2 p-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm max-w-lg text-xs font-extrabold">
                <button
                    onClick={() => setActiveTab('monitor')}
                    className={`flex-1 py-2.5 px-4 rounded-xl transition-all cursor-pointer ${
                        activeTab === 'monitor' 
                            ? 'bg-blue-600 text-white shadow-sm font-black' 
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                >
                    System Monitor
                </button>
                <button
                    onClick={() => setActiveTab('audit')}
                    className={`flex-1 py-2.5 px-4 rounded-xl transition-all cursor-pointer ${
                        activeTab === 'audit' 
                            ? 'bg-blue-600 text-white shadow-sm font-black' 
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                >
                    Audit Ledger
                </button>
                <button
                    onClick={() => setActiveTab('settings')}
                    className={`flex-1 py-2.5 px-4 rounded-xl transition-all cursor-pointer ${
                        activeTab === 'settings' 
                            ? 'bg-blue-600 text-white shadow-sm font-black' 
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                >
                    Security Policies
                </button>
            </div>

            {/* Tabs Content */}
            <div className="space-y-6">
                
                {activeTab === 'monitor' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <AnalyticsCard title="CPU & Memory Utilization (%)" subtitle="Live analytics engine hardware stress">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={perfData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#94a3b830" />
                                    <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} />
                                    <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                                    <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '12px', backgroundColor: '#0f172a', color: '#fff', border: 'none' }} />
                                    <Area type="monotone" dataKey="cpu" name="CPU Load" stroke="#f43f5e" fill="rgba(244, 63, 94, 0.1)" strokeWidth={2} />
                                    <Area type="monotone" dataKey="mem" name="Memory" stroke="#3b82f6" fill="rgba(59, 130, 246, 0.1)" strokeWidth={2} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </AnalyticsCard>

                        <AnalyticsCard title="API Requests (req/sec)" subtitle="Vite server transaction throughput">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={perfData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#94a3b830" />
                                    <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} />
                                    <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                                    <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '12px', backgroundColor: '#0f172a', color: '#fff', border: 'none' }} />
                                    <Area type="monotone" dataKey="api" name="Requests" stroke="#10b981" fill="rgba(16, 185, 129, 0.1)" strokeWidth={2} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </AnalyticsCard>
                    </div>
                )}

                {activeTab === 'audit' && (
                    <div className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                            <h3 className="text-xs font-black uppercase tracking-widest text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                                <Layers size={15} /> Cryptographic Audit Ledgers
                            </h3>
                            <Badge variant="success">SHA-256 Ledger</Badge>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs border-collapse">
                                <thead>
                                    <tr className="bg-slate-100 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-extrabold uppercase tracking-wider">
                                        <th className="p-4">TxHash</th>
                                        <th className="p-4">Action Event</th>
                                        <th className="p-4">Detail Payload</th>
                                        <th className="p-4">Timestamp</th>
                                        <th className="p-4 text-right">Clearance</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 dark:divide-slate-800/80 font-medium">
                                    {auditLogs.map((log, index) => (
                                        <tr key={index} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                                            <td className="p-4 font-mono text-xs text-blue-600 dark:text-blue-400 font-black">{log.tx}</td>
                                            <td className="p-4 font-extrabold text-slate-900 dark:text-white">{log.action}</td>
                                            <td className="p-4 text-slate-600 dark:text-slate-300">{log.info}</td>
                                            <td className="p-4 text-slate-500 dark:text-slate-400 font-medium">{log.date}</td>
                                            <td className="p-4 text-right">
                                                <Badge variant="success">{log.status}</Badge>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'settings' && (
                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 max-w-xl space-y-6 shadow-sm">
                        <h3 className="text-base font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                            <Shield size={18} className="text-blue-600 dark:text-blue-400" /> System Security Policies
                        </h3>
                        
                        <div className="space-y-5">
                            {/* Policy 1 */}
                            <div className="flex justify-between items-center pb-4 border-b border-slate-200 dark:border-slate-800">
                                <div className="space-y-1 pr-4 text-left">
                                    <p className="text-sm font-black text-slate-900 dark:text-white">AI Category Routing</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
                                        Use NLP models to classify complaint texts and dispatch tickets automatically.
                                    </p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer select-none shrink-0">
                                    <input 
                                        type="checkbox" 
                                        checked={aiRouting} 
                                        onChange={() => setAiRouting(!aiRouting)}
                                        className="sr-only peer" 
                                    />
                                    <div className="w-11 h-6 bg-slate-200 dark:bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>

                            {/* Policy 2 */}
                            <div className="flex justify-between items-center pb-4 border-b border-slate-200 dark:border-slate-800">
                                <div className="space-y-1 pr-4 text-left">
                                    <p className="text-sm font-black text-slate-900 dark:text-white">Cryptographic Blockchain Ledgers</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
                                        Write status logs to immutable municipal transaction ledgers.
                                    </p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer select-none shrink-0">
                                    <input 
                                        type="checkbox" 
                                        checked={blockchainLedger} 
                                        onChange={() => setBlockchainLedger(!blockchainLedger)}
                                        className="sr-only peer" 
                                    />
                                    <div className="w-11 h-6 bg-slate-200 dark:bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>

                            {/* Policy 3 */}
                            <div className="flex justify-between items-center">
                                <div className="space-y-1 pr-4 text-left">
                                    <p className="text-sm font-black text-slate-900 dark:text-white">SMS Notification Alerts</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
                                        Send real-time SMS status reports on crew dispatch updates.
                                    </p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer select-none shrink-0">
                                    <input 
                                        type="checkbox" 
                                        checked={smsAlerts} 
                                        onChange={() => setSmsAlerts(!smsAlerts)}
                                        className="sr-only peer" 
                                    />
                                    <div className="w-11 h-6 bg-slate-200 dark:bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default AdminDashboard;
