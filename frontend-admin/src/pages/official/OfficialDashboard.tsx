import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    LayoutDashboard, Radio, Cpu, Layers, CheckCircle2, ArrowRight
} from 'lucide-react';
import api from '../../api/axios';
import StatsCard from '../../components/dashboard/StatsCard';
import Badge from '../../components/ui/Badge';
import Spinner from '../../components/ui/Spinner';

const OfficialDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [reports, setReports] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const res = await api.get('/reports');
            setReports(res.data);
        } catch (error) {
            console.error('Failed to load official dashboard data', error);
            setReports([]);
        } finally {
            setLoading(false);
        }
    };

    // Columns config
    const COLUMNS = [
        { title: 'Open Backlog', key: 'OPEN', color: 'border-rose-500/30' },
        { title: 'Approved / Assigned', key: 'APPROVED', color: 'border-blue-500/30' },
        { title: 'In Progress', key: 'IN_PROGRESS', color: 'border-amber-500/30' },
        { title: 'Solved', key: 'RESOLVED', color: 'border-emerald-500/30' }
    ];

    const getColumnTickets = (statusKey: string) => {
        return reports.filter(r => {
            if (statusKey === 'APPROVED') {
                return r.status === 'APPROVED' || r.status === 'ASSIGNED';
            }
            return r.status === statusKey;
        });
    };

    return (
        <div className="space-y-8 text-left animate-in fade-in duration-300">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                        <LayoutDashboard className="text-blue-600 dark:text-blue-400" /> Official Operations
                    </h1>
                </div>
            </div>

            {/* Performance Indicators */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard 
                    title="Active Backlog" 
                    value={reports.filter(r => r.status === 'OPEN').length} 
                    icon={<Layers size={18} className="text-rose-500" />} 
                    subtitle="Tickets awaiting AI categorization" 
                />
                <StatsCard 
                    title="Allocated Crews" 
                    value={reports.filter(r => r.status === 'IN_PROGRESS').length} 
                    icon={<Radio size={18} className="text-amber-500" />} 
                    subtitle="Workers in field dispatch states" 
                />
                <StatsCard 
                    title="Resolved Cases" 
                    value={reports.filter(r => r.status === 'RESOLVED').length} 
                    icon={<CheckCircle2 size={18} className="text-emerald-500" />} 
                    subtitle="Database ledger solved states" 
                />
                <StatsCard 
                    title="AI Routing Rate" 
                    value="98.5%" 
                    icon={<Cpu size={18} className="text-blue-500" />} 
                    subtitle="NLP dispatch precision index" 
                />
            </div>

            {/* Kanban Columns */}
            <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Incident Triage Columns</h3>

                {loading ? (
                    <div className="h-96 w-full flex items-center justify-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl">
                        <Spinner size="lg" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {COLUMNS.map((col) => {
                            const tickets = getColumnTickets(col.key);
                            return (
                                <div key={col.key} className={`bg-white dark:bg-slate-900 p-4 border rounded-3xl flex flex-col h-[52vh] shadow-sm ${col.color}`}>
                                    <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-800 mb-4">
                                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                                            {col.title}
                                        </span>
                                        <Badge variant={col.key === 'RESOLVED' ? 'success' : col.key === 'OPEN' ? 'danger' : 'warning'}>
                                            {tickets.length}
                                        </Badge>
                                    </div>

                                    <div className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-none">
                                        {tickets.map((t) => (
                                            <div 
                                                key={t.report_id}
                                                onClick={() => navigate(`/issues/${t.report_id}`)}
                                                className="p-3.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-2xl hover:border-blue-500 active:scale-[0.98] transition-all cursor-pointer text-left space-y-1.5 shadow-sm"
                                            >
                                                <div className="flex justify-between items-start gap-2">
                                                    <span className="text-xs font-black text-slate-900 dark:text-white truncate">{t.category}</span>
                                                    <span className="text-[8px] font-mono text-slate-500 shrink-0">#{t.report_id?.slice(0, 4)}</span>
                                                </div>
                                                <p className="text-[11px] text-slate-600 dark:text-slate-300 truncate font-medium">{t.description}</p>
                                                <p className="text-[9px] text-slate-500 dark:text-slate-400 font-mono">{t.location}</p>
                                            </div>
                                        ))}

                                        {tickets.length === 0 && (
                                            <div className="h-full flex items-center justify-center text-[10px] text-slate-400 italic font-medium">
                                                No tickets in stack
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OfficialDashboard;
