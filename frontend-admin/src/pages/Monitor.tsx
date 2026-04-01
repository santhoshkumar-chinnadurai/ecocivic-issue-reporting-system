import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Activity, Users, Radio, MapPin, Clock, ArrowRight, Cpu, Zap, Wifi, ShieldAlert, Monitor as MonitorIcon } from 'lucide-react';
import Layout from '../components/Layout';
import DashboardMap from '../components/DashboardMap';
import { motion, AnimatePresence } from 'framer-motion';

interface Report {
    report_id: number;
    title: string;
    description: string;
    category: string;
    location: string;
    status: string;
    priority: string;
    image_url: string;
    created_at: string;
}

const Monitor = () => {
    const navigate = useNavigate();
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    const [logs, setLogs] = useState<string[]>([]);
    const scrollRef = useRef<HTMLDivElement>(null);
    const loggedInUser = JSON.parse(localStorage.getItem('user') || '{}');

    // Mock Live Metrics
    const [metrics, setMetrics] = useState({
        cpu: 45,
        mem: 62,
        lat: 24,
        uptime: '12:45:22'
    });

    const [backendStats, setBackendStats] = useState<{ totalUsers?: number; total?: number } | null>(null);
    const [recentLogins, setRecentLogins] = useState<any[]>([]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [statsRes, loginsRes] = await Promise.all([
                    axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/analytics/dashboard-stats`),
                    axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/analytics/recent-logins`)
                ]);
                setBackendStats(statsRes.data);
                setRecentLogins(loginsRes.data);
            } catch (err) {
                console.error("Failed to fetch monitor stats", err);
            }
        };
        fetchStats();
        const interval = setInterval(fetchStats, 10000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setMetrics({
                cpu: Math.floor(Math.random() * (60 - 40) + 40),
                mem: Math.floor(Math.random() * (70 - 60) + 60),
                lat: Math.floor(Math.random() * (30 - 20) + 20),
                uptime: new Date().toLocaleTimeString([], { hour12: false })
            });
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const reportsRes = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/reports?limit=15`);
                const data = reportsRes.data;
                setReports(data);

                // Generate a log from the most recent report if it's new
                if (data.length > 0) {
                    const latest = data[0];
                    const logMsg = `[${new Date().toLocaleTimeString()}] INCOMING: ${latest.category} alert at ${latest.location}`;
                    setLogs(prev => [logMsg, ...prev].slice(0, 50));
                }

                setLoading(false);
            } catch (error) {
                console.error("Monitor: Failed to fetch data", error);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 8000);
        return () => clearInterval(interval);
    }, []);

    // Auto-scroll logs
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = 0;
        }
    }, [logs]);

    const StatusBadge = ({ status }: { status: string }) => {
        const colors: Record<string, string> = {
            'OPEN': 'text-red-400 border-red-500/30 bg-red-500/10 shadow-[0_0_10px_rgba(239,68,68,0.2)]',
            'IN_PROGRESS': 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10',
            'RESOLVED': 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10'
        };
        return (
            <span className={`px-2 py-0.5 text-[10px] font-black uppercase tracking-widest border rounded-xl ${colors[status] || 'text-gray-400 border-gray-500/30 bg-gray-500/10'}`}>
                {status}
            </span>
        );
    };

    return (
        <Layout userRole="ADMIN">
            <div className="max-w-[1600px] mx-auto h-[calc(100vh-8rem)] flex flex-col gap-5 text-gray-200 mt-4 pb-6">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 shrink-0 z-10">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                        <div className="flex items-center gap-3 mb-1">
                            <MonitorIcon className="text-indigo-400" size={28} />
                            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">System Monitor</h1>
                        </div>
                        <p className="text-indigo-300/80 font-medium text-sm tracking-wide uppercase">Real-time infrastructure & incident telemetry</p>
                    </motion.div>
                </div>

                {/* Tactical Header / System Pulse */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="grid grid-cols-2 md:grid-cols-5 gap-4 shrink-0"
                >
                    <div className="bg-white/[0.02] backdrop-blur-3xl border border-white/10 p-5 rounded-3xl flex flex-col relative overflow-hidden group shadow-xl hover:bg-white/[0.04] transition-colors">
                        <div className="absolute top-4 right-4 p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"><Cpu size={16} /></div>
                        <span className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Core Load</span>
                        <div className="flex flex-col gap-3 mt-2">
                            <span className="text-4xl font-black text-white">{metrics.cpu}%</span>
                            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                <motion.div animate={{ width: `${metrics.cpu}%` }} className="h-full bg-indigo-500" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/[0.02] backdrop-blur-3xl border border-white/10 p-5 rounded-3xl flex flex-col relative overflow-hidden group shadow-xl hover:bg-white/[0.04] transition-colors">
                        <div className="absolute top-4 right-4 p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20"><Zap size={16} /></div>
                        <span className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Memory Stack</span>
                        <div className="flex flex-col gap-3 mt-2">
                            <span className="text-4xl font-black text-white">{metrics.mem}%</span>
                            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                <motion.div animate={{ width: `${metrics.mem}%` }} className="h-full bg-purple-500" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/[0.02] backdrop-blur-3xl border border-white/10 p-5 rounded-3xl flex flex-col relative overflow-hidden group shadow-xl hover:bg-white/[0.04] transition-colors">
                        <div className="absolute top-4 right-4 p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"><Wifi size={16} /></div>
                        <span className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Sync Latency</span>
                        <div className="flex flex-col gap-3 mt-2">
                            <span className="text-4xl font-black text-white">{metrics.lat}ms</span>
                            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 w-[20%]" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/[0.02] backdrop-blur-3xl border border-white/10 p-5 rounded-3xl flex flex-col relative overflow-hidden group shadow-xl hover:bg-white/[0.04] transition-colors">
                        <div className="absolute top-4 right-4 p-2 rounded-xl bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"><Users size={16} /></div>
                        <span className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Total Users</span>
                        <div className="flex items-end gap-2 mt-2">
                            <span className="text-4xl font-black text-white">
                                {String(backendStats?.totalUsers || 0).padStart(3, '0')}
                            </span>
                        </div>
                    </div>

                    <div className="hidden md:flex bg-indigo-500/10 border border-indigo-500/30 p-5 rounded-3xl flex-col justify-center items-center relative overflow-hidden shadow-[0_0_30px_rgba(99,102,241,0.15)] group">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent animate-pulse" />
                        <span className="text-[10px] text-indigo-400 uppercase font-bold tracking-widest z-10 mb-1">Operation Clock</span>
                        <span className="text-4xl font-black text-white font-mono tracking-tight z-10 shadow-sm">{metrics.uptime}</span>
                        <div className="absolute bottom-4 flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-indigo-400 animate-ping" />
                            <span className="text-[10px] text-indigo-400/80 font-bold uppercase tracking-widest relative z-10">Uplink Active</span>
                        </div>
                    </div>
                </motion.div>

                {/* Main Control Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    className="flex-1 grid grid-cols-12 gap-5 min-h-0"
                >
                    {/* LEFT: Tactical Map (Glass Style) */}
                    <div className="col-span-12 lg:col-span-8 flex flex-col gap-5">
                        <div className="flex-1 bg-white/[0.02] backdrop-blur-3xl border border-white/10 rounded-3xl relative overflow-hidden shadow-2xl flex flex-col">
                            <div className="p-5 border-b border-white/5 bg-white/[0.01] flex justify-between items-center shrink-0">
                                <div className="flex items-center gap-3">
                                    <MapPin size={18} className="text-indigo-400" />
                                    <h2 className="text-sm font-bold uppercase tracking-widest text-white">Geospatial Array</h2>
                                </div>
                                <div className="flex gap-2">
                                    <button className="text-[10px] font-bold text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-xl transition-all uppercase tracking-widest">Standard</button>
                                    <button className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/30 px-3 py-1.5 rounded-xl transition-all uppercase tracking-widest">Heatmap</button>
                                </div>
                            </div>

                            <div className="flex-1 w-full relative">
                                {/* Map container without heavy image manipulation from cyber theme */}
                                <div className="absolute inset-0 [&>div]:h-full [&>div]:mb-0 [&>div]:border-0 [&>div>div]:h-full opacity-90 mix-blend-screen brightness-110 saturate-150">
                                    <DashboardMap />
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                            </div>
                        </div>

                        {/* BOTTOM: System Console (Logs) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 h-48">
                            <div className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-3xl p-5 relative overflow-hidden flex flex-col shadow-xl font-mono text-xs">
                                <div className="flex items-center gap-3 mb-3 shrink-0">
                                    <Activity size={16} className="text-indigo-400 opacity-80" />
                                    <span className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">System Event Log</span>
                                </div>
                                <div ref={scrollRef} className="flex-1 overflow-y-auto custom-scrollbar text-gray-500 space-y-2 pr-2">
                                    {logs.length === 0 ? (
                                        <div className="text-indigo-400/60 animate-pulse flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
                                            Establishing secure connection...
                                        </div>
                                    ) : (
                                        logs.map((log, i) => (
                                            <div key={i} className="flex gap-3 items-start group">
                                                <span className="text-indigo-500/40 mt-0.5">❯</span>
                                                <span className="group-hover:text-gray-300 transition-colors">{log}</span>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            {loggedInUser?.role === 'ADMIN' && (
                                <div className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-3xl p-5 relative overflow-hidden flex flex-col shadow-xl text-xs">
                                    <div className="flex items-center gap-3 mb-3 shrink-0">
                                        <ShieldAlert size={16} className="text-rose-400 opacity-80" />
                                        <span className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Security & Access Log</span>
                                    </div>
                                    <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-2">
                                        {recentLogins.length === 0 ? (
                                            <div className="text-gray-500 py-4 text-center italic uppercase tracking-widest opacity-50">No recent logins captured</div>
                                        ) : (
                                            recentLogins.map((login, i) => (
                                                <div key={i} className="flex items-center justify-between group p-2 rounded-xl bg-white/[0.01] hover:bg-white/[0.05] transition-all border border-transparent hover:border-white/5">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`p-1.5 rounded-lg ${login.role === 'ADMIN' ? 'bg-rose-500/10 text-rose-400' : 'bg-indigo-500/10 text-indigo-400'}`}>
                                                            <Users size={14} />
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="font-bold text-gray-200">{login.email}</span>
                                                            <span className="text-[10px] text-gray-500 font-mono">{login.last_ip} • {login.last_location || 'Resolving...'}</span>
                                                        </div>
                                                    </div>
                                                    <div className="text-right flex flex-col">
                                                        <span className={`text-[10px] font-bold uppercase tracking-widest ${login.role === 'ADMIN' ? 'text-rose-500' : 'text-indigo-500'}`}>{login.role}</span>
                                                        <span className="text-[9px] text-gray-500">{new Date(login.last_login_at || login.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT: Active Threats / Feed */}
                    <div className="col-span-12 lg:col-span-4 bg-white/[0.02] backdrop-blur-3xl border border-white/10 flex flex-col rounded-3xl overflow-hidden shadow-2xl">
                        <div className="p-5 border-b border-white/10 bg-white/[0.01] flex justify-between items-center shrink-0">
                            <h2 className="text-sm font-bold uppercase tracking-widest text-white flex items-center gap-3">
                                <Radio className="text-indigo-400" size={18} /> LIVE FEED
                            </h2>
                            <span className="text-[10px] font-bold bg-red-500/10 text-red-500 px-3 py-1 rounded-full border border-red-500/20 uppercase tracking-widest flex items-center gap-1.5 shadow-[0_0_10px_rgba(239,68,68,0.2)]">
                                <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping" />
                                ACTIVE
                            </span>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                            <AnimatePresence initial={false}>
                                {loading ? (
                                    <div className="py-20 flex flex-col items-center justify-center text-gray-500 space-y-4">
                                        <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
                                        <span className="text-[10px] uppercase tracking-widest font-bold">Querying Network...</span>
                                    </div>
                                ) : (
                                    reports.map((report) => (
                                        <motion.div
                                            key={report.report_id}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            whileHover={{ y: -2, backgroundColor: 'rgba(255,255,255,0.06)' }}
                                            className="bg-white/[0.03] border border-white/5 p-4 rounded-2xl transition-all cursor-pointer group relative overflow-hidden hover:border-white/20 hover:shadow-xl"
                                            onClick={() => navigate(`/issues/${report.report_id}`)}
                                        >
                                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500/0 group-hover:bg-indigo-500 transition-all duration-300" />
                                            <div className="flex justify-between items-start mb-3">
                                                <StatusBadge status={report.status} />
                                                <span className="text-[10px] font-bold text-gray-500 flex items-center gap-1.5 tracking-wider font-mono">
                                                    <Clock size={12} className="opacity-70" />
                                                    {new Date(report.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                            <h4 className="text-base font-bold text-gray-200 group-hover:text-white transition-colors leading-tight mb-3">
                                                {report.title}
                                            </h4>
                                            <div className="flex items-center justify-between text-xs font-medium text-gray-400">
                                                <span className="flex items-center gap-2 truncate max-w-[85%] bg-black/20 px-2 py-1 rounded-lg">
                                                    <MapPin size={12} className="text-indigo-400 shrink-0" />
                                                    <span className="truncate">{report.location}</span>
                                                </span>
                                                <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-indigo-500 group-hover:text-white transition-colors shrink-0">
                                                    <ArrowRight size={12} />
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Footer Mini Stats */}
                        <div className="p-4 border-t border-white/10 bg-black/40 flex justify-between items-center text-[10px] shrink-0 font-bold uppercase tracking-widest text-gray-500">
                            <div className="flex gap-4">
                                <span className="flex items-center gap-1.5"><ShieldAlert size={14} className="text-indigo-500" /> {backendStats?.total || 0} Reports</span>
                            </div>
                            <span className="text-emerald-500 flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                SYSTEM OPTIMAL
                            </span>
                        </div>
                    </div>

                </motion.div>
            </div>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
            `}</style>
        </Layout>
    );
};

export default Monitor;
