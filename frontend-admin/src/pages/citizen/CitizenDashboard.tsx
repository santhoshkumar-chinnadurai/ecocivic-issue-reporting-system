import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
    Trophy, PlusCircle, AlertTriangle, CheckCircle, 
    FileText, User, HelpCircle, ArrowRight, ShieldAlert 
} from 'lucide-react';
import api from '../../api/axios';
import StatsCard from '../../components/dashboard/StatsCard';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';

const CitizenDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [reports, setReports] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const user = (() => {
        try {
            const raw = localStorage.getItem('user');
            return raw && raw !== 'undefined' ? JSON.parse(raw) : {};
        } catch {
            return {};
        }
    })();

    useEffect(() => {
        fetchCitizenReports();
    }, []);

    const fetchCitizenReports = async () => {
        try {
            setLoading(true);
            const res = await api.get('/reports');
            // Filter user reports
            const userReports = res.data.filter((r: any) => r.user_id === user.user_id || r.userId === user.id || r.user_id === user.id);
            setReports(userReports);
        } catch (error) {
            console.error('Failed to load citizen reports', error);
            setReports([]);
        } finally {
            setLoading(false);
        }
    };

    const resolvedCount = reports.filter(r => r.status === 'RESOLVED').length;
    const pendingCount = reports.filter(r => r.status === 'OPEN').length;

    // Gamification level stats
    const xpPoints = user.points || 140;
    const progressPercent = Math.min((xpPoints / 300) * 100, 100);

    return (
        <div className="space-y-6 text-left animate-in fade-in duration-300">
            {/* Upper Banner */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-slate-200 dark:border-slate-800">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                        Welcome Back, <span className="text-blue-600 dark:text-blue-400">{user.email?.split('@')[0]}</span>
                    </h1>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 font-medium font-mono">Citizen Reporter Matrix // Node #{user.user_id?.slice(0, 8) || 'ENTITY-01'}</p>
                </div>
                <Link to="/create-report">
                    <Button className="flex items-center gap-2 font-extrabold shadow-[0_0_20px_rgba(59,130,246,0.25)] rounded-2xl py-3 px-5">
                        <PlusCircle size={18} /> File New Complaint
                    </Button>
                </Link>
            </div>

            {/* Gamification Ring HUD and stats grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Level Progress Circle HUD */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col items-center justify-between">
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-widest font-black mb-4">Reputation Index</span>
                    <div className="relative h-32 w-32 flex items-center justify-center">
                        <svg className="absolute inset-0 transform -rotate-90" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="40" fill="transparent" stroke="currentColor" className="text-slate-200 dark:text-slate-800" strokeWidth="6" />
                            <circle cx="50" cy="50" r="40" fill="transparent" stroke="#3b82f6" strokeWidth="6" 
                                    strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * progressPercent) / 100}
                                    strokeLinecap="round" className="transition-all duration-1000" />
                        </svg>
                        <div className="text-center">
                            <span className="block text-2xl font-black text-slate-900 dark:text-white">{xpPoints}</span>
                            <span className="text-[9px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold">XP Earned</span>
                        </div>
                    </div>
                    <div className="mt-4 text-center">
                        <span className="text-xs font-black text-slate-900 dark:text-white">Level 3: Neighborhood Watch</span>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 font-medium">{300 - xpPoints} XP to next level clearance</p>
                    </div>
                </div>

                {/* Performance HUD metrics */}
                <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <StatsCard 
                        title="Logged Reports" 
                        value={reports.length} 
                        icon={<FileText size={18} className="text-blue-500" />} 
                        subtitle="Active tickets created by you" 
                    />
                    <StatsCard 
                        title="Tickets Solved" 
                        value={resolvedCount} 
                        icon={<CheckCircle size={18} className="text-emerald-500" />} 
                        trend="High Efficiency"
                        subtitle="Repairs verified by city crew" 
                    />
                </div>
            </div>

            {/* Incidents Queue list */}
            <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Your Activity Logs</h3>
                
                {loading ? (
                    <div className="h-44 w-full flex items-center justify-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl">
                        <Spinner size="md" />
                    </div>
                ) : reports.length === 0 ? (
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 text-center shadow-sm">
                        <ShieldAlert size={36} className="text-slate-400 dark:text-slate-600 mx-auto mb-3" />
                        <p className="text-sm font-bold text-slate-900 dark:text-white">No active complaints logged</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">If you spot street defects, water leaks, or waste heaps, click file complaint.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {reports.map((rep) => (
                            <div key={rep.report_id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:border-blue-500 transition-all text-left">
                                <div className="space-y-2">
                                    <div className="flex justify-between items-start">
                                        <span className="text-sm font-black text-slate-900 dark:text-white">{rep.category}</span>
                                        <Badge variant={rep.status === 'RESOLVED' ? 'success' : 'warning'}>{rep.status}</Badge>
                                    </div>
                                    <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed truncate">{rep.location}</p>
                                </div>
                                <div className="pt-4 border-t border-slate-200 dark:border-slate-800 mt-4 flex justify-between items-center text-xs">
                                    <span className="text-slate-500 font-mono font-bold">#{rep.report_id?.slice(0, 6)}</span>
                                    <button 
                                        onClick={() => navigate(`/issues/${rep.report_id}`)}
                                        className="text-blue-600 dark:text-blue-400 font-extrabold flex items-center gap-1 hover:underline cursor-pointer"
                                    >
                                        Inspect Details →
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CitizenDashboard;
