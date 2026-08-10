import React, { useState, useEffect } from 'react';
import { Server, Database, Wifi, ShieldCheck, RefreshCw, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Debug: React.FC = () => {
    const [stats, setStats] = useState([
        { name: 'API Server', status: 'Online', latency: '45ms', icon: Server, color: 'text-emerald-600 dark:text-emerald-400' },
        { name: 'Database', status: 'Connected', latency: '12ms', icon: Database, color: 'text-teal-600 dark:text-teal-400' },
        { name: 'WebSocket', status: 'Active', latency: '5ms', icon: Wifi, color: 'text-amber-600 dark:text-amber-400' },
        { name: 'Auth Node', status: 'Secure', latency: '28ms', icon: ShieldCheck, color: 'text-emerald-600 dark:text-emerald-400' },
    ]);

    const [refreshTimer, setRefreshTimer] = useState(30);
    const [logs, setLogs] = useState([
        { type: 'info', msg: '[SYS] Initializing diagnostic terminal matrix...', color: 'text-emerald-600 dark:text-emerald-400' },
        { type: 'info', msg: '[SYS] System check complete. All telemetry nodes functional.', color: 'text-emerald-600 dark:text-emerald-400' }
    ]);

    useEffect(() => {
        const interval = setInterval(() => {
            setStats(prev => prev.map(s => ({
                ...s,
                latency: Math.floor(Math.random() * 50 + 5) + 'ms'
            })));
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setRefreshTimer((prev) => {
                if (prev <= 1) {
                    const log = { type: 'net', msg: `[SYNC] Telemetries synced at ${new Date().toLocaleTimeString()}.`, color: 'text-emerald-600 dark:text-emerald-400' };
                    setLogs(l => [...l.slice(-10), log]);
                    return 30;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-slate-50 dark:bg-[#030712] text-slate-900 dark:text-slate-100 font-sans p-6 text-left transition-colors duration-300">
            <div className="w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl relative z-10 space-y-6 shadow-xl">
                <div className="flex justify-between items-center pb-4 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                        <Link to="/" className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                            <ArrowLeft size={16} />
                        </Link>
                        <h2 className="text-lg font-black uppercase tracking-wider text-slate-900 dark:text-white">Diagnostics Console</h2>
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">Auto-Sync in {refreshTimer}s</span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {stats.map((s, idx) => {
                        const Icon = s.icon;
                        return (
                            <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col justify-between h-28">
                                <div className="flex justify-between items-start">
                                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">{s.name}</span>
                                    <Icon className={`h-4 w-4 ${s.color}`} />
                                </div>
                                <div className="space-y-1">
                                    <span className="block text-xs font-black text-slate-900 dark:text-white leading-none">{s.status}</span>
                                    <span className="block text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400">Lat: {s.latency}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="bg-slate-900 dark:bg-slate-950 text-slate-100 border border-slate-800 rounded-2xl p-5 h-48 flex flex-col font-mono">
                    <div className="text-[10px] uppercase tracking-widest text-slate-400 pb-2 border-b border-slate-800 mb-3 font-bold">
                        Local Event Logs
                    </div>
                    <div className="flex-1 overflow-y-auto space-y-1.5 text-xs select-text font-medium">
                        {logs.map((log, i) => (
                            <p key={i} className={log.color}>
                                {log.msg}
                            </p>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Debug;
