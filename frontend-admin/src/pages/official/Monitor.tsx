import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Radio, Cpu, Wifi, Monitor as MonitorIcon, Clock, Layers, ArrowLeft } from 'lucide-react';
import api from '../../api/axios';
import DashboardLayout from '../../layouts/DashboardLayout';
import MapComponent from '../../components/map/MapComponent';
import StatsCard from '../../components/dashboard/StatsCard';
import Badge from '../../components/ui/Badge';
import platformConfig from '../../config/platformConfig';

const Monitor: React.FC = () => {
    const navigate = useNavigate();
    const [reports, setReports] = useState<any[]>([]);
    const [logs, setLogs] = useState<string[]>([]);
    const [recentLogins, setRecentLogins] = useState<any[]>([]);
    const [metrics, setMetrics] = useState({ cpu: 45, mem: 62, lat: 24, uptime: '00:00:00' });
    const logScrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchMonitorData();
        const statsInterval = setInterval(fetchMonitorData, 10000);
        
        const metricsInterval = setInterval(() => {
            setMetrics({
                cpu: Math.floor(Math.random() * (55 - 35) + 35),
                mem: Math.floor(Math.random() * (68 - 60) + 60),
                lat: Math.floor(Math.random() * (35 - 18) + 18),
                uptime: new Date().toLocaleTimeString([], { hour12: false })
            });
        }, 3000);

        return () => {
            clearInterval(statsInterval);
            clearInterval(metricsInterval);
        };
    }, []);

    const fetchMonitorData = async () => {
        try {
            const [reportsRes, loginsRes] = await Promise.all([
                api.get('/reports'),
                api.get('/analytics/recent-logins').catch(() => ({ data: [] }))
            ]);

            const data = reportsRes.data;
            setReports(data);
            setRecentLogins(loginsRes.data);

            if (data.length > 0) {
                const latest = data[0];
                const logMsg = `[${new Date().toLocaleTimeString()}] ALERT: ${latest.category} logged at ${latest.location}`;
                setLogs(prev => [logMsg, ...prev].slice(0, 30));
            }
        } catch (error) {
            console.error('Failed to load monitor logs', error);
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-8 text-left animate-in fade-in duration-300">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all active:scale-95 shadow-sm cursor-pointer"
                    >
                        <ArrowLeft size={18} />
                    </button>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
                            <MonitorIcon className="text-emerald-500" /> Operations Center
                        </h1>
                        <p className="text-xs text-slate-400 mt-1.5 font-medium">Real-time incident dispatches and telemetries across {platformConfig.city} divisions.</p>
                    </div>
                </div>

                {/* Telemetries */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatsCard 
                        title="Server CPU" 
                        value={`${metrics.cpu}%`} 
                        icon={<Cpu size={18} className="text-emerald-500" />} 
                        subtitle="Node compute load" 
                    />
                    <StatsCard 
                        title="API Latency" 
                        value={`${metrics.lat} ms`} 
                        icon={<Activity size={18} className="text-emerald-400" />} 
                        subtitle="Vite server delay" 
                    />
                    <StatsCard 
                        title="Active Dispatches" 
                        value={reports.filter(r => r.status === 'IN_PROGRESS').length} 
                        icon={<Radio size={18} className="text-amber-500 animate-pulse" />} 
                        subtitle="Crews on ground" 
                    />
                    <StatsCard 
                        title="Live Uptime Clock" 
                        value={metrics.uptime} 
                        icon={<Clock size={18} className="text-slate-505" />} 
                        subtitle="Current server session" 
                    />
                </div>

                {/* Map component */}
                <div className="space-y-3">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                        Interactive Live Map Dispatch
                    </h2>
                    <MapComponent fullScreen={true} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Real-time incident logs terminal */}
                    <div className="bg-slate-950 border border-slate-900 rounded-2xl p-6 shadow-md flex flex-col h-80 text-left font-mono">
                        <div className="flex justify-between items-center pb-3 border-b border-slate-900 mb-4 shrink-0">
                            <span className="text-[10px] text-slate-550 uppercase tracking-widest font-black flex items-center gap-1.5">
                                <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-ping"></span> Live Incident Feed Logs
                            </span>
                            <Wifi size={14} className="text-emerald-500 animate-pulse" />
                        </div>
                        <div className="flex-1 overflow-y-auto space-y-2 text-[11px] text-slate-350 scrollbar-none select-text">
                            {logs.length === 0 ? (
                                <p className="text-slate-700 italic">Listening for telemetry dispatches...</p>
                            ) : (
                                logs.map((log, i) => (
                                    <p key={i} className="leading-relaxed hover:bg-slate-900 px-1 py-0.5 rounded">
                                        {log}
                                    </p>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Recent logins audit details */}
                    <div className="panel-cyber-glass border-slate-805 p-6 shadow-sm flex flex-col h-80">
                        <div className="flex justify-between items-center pb-3 border-b border-slate-900 mb-4 shrink-0">
                            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-black flex items-center gap-1.5">
                                <Layers size={14} /> Active Auth Logs
                            </span>
                            <Badge variant="success">Sync</Badge>
                        </div>
                        <div className="flex-1 overflow-y-auto divide-y divide-slate-900 pr-1 text-left">
                            {recentLogins.length === 0 ? (
                                <p className="text-slate-505 text-xs italic p-4 text-center">No active authentication logs synced.</p>
                            ) : (
                                recentLogins.map((login, i) => (
                                    <div key={i} className="py-3 flex justify-between items-center text-xs">
                                        <div className="space-y-1 truncate pr-2">
                                            <p className="font-bold text-white truncate">{login.email}</p>
                                            <p className="text-[10px] text-slate-500 font-mono">IP: {login.last_ip || '127.0.0.1'} • {login.last_location || 'Local'}</p>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <Badge variant={login.role === 'ADMIN' ? 'danger' : login.role === 'WORKER' ? 'warning' : 'primary'}>
                                                {login.role}
                                            </Badge>
                                            <span className="block text-[9px] text-slate-500 mt-1">{new Date(login.last_login_at || Date.now()).toLocaleTimeString()}</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </DashboardLayout>
    );
};

export default Monitor;
