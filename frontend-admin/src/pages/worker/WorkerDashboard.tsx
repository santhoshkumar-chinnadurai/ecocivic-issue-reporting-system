import React, { useState, useEffect } from 'react';
import { 
    Wrench, CheckCircle, Navigation, Camera, AlertTriangle, 
    Play, ShieldCheck, UploadCloud
} from 'lucide-react';
import api from '../../api/axios';
import StatsCard from '../../components/dashboard/StatsCard';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import ImageUploader from '../../components/forms/ImageUploader';

const WorkerDashboard: React.FC = () => {
    const [assignedIssues, setAssignedIssues] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [submittingProof, setSubmittingProof] = useState<string | null>(null);
    const [proofImage, setProofImage] = useState('');
    const [actionLoading, setActionLoading] = useState(false);

    const user = (() => {
        try {
            const raw = localStorage.getItem('user');
            return raw && raw !== 'undefined' ? JSON.parse(raw) : {};
        } catch {
            return {};
        }
    })();

    useEffect(() => {
        fetchWorkerIssues();
    }, []);

    const fetchWorkerIssues = async () => {
        try {
            setLoading(true);
            const res = await api.get('/reports');
            // Filter issues assigned to this worker
            const workerTasks = res.data.filter((r: any) => r.assigned_worker_id === user.user_id || r.assigned_worker_id === user.id);
            setAssignedIssues(workerTasks);
        } catch (error) {
            console.error('Failed to fetch worker issues', error);
            setAssignedIssues([]);
        } finally {
            setLoading(false);
        }
    };

    const handleAcceptJob = async (id: string) => {
        setActionLoading(true);
        try {
            await api.patch(`/reports/${id}/status`, { status: 'IN_PROGRESS' });
            alert('Job dispatch accepted! Moving to location.');
            fetchWorkerIssues();
        } catch (error) {
            console.error('Failed to accept job', error);
        } finally {
            setActionLoading(false);
        }
    };

    const handleSubmitProof = async (e: React.FormEvent, id: string) => {
        e.preventDefault();
        if (!proofImage) {
            alert('Please attach verification photo first.');
            return;
        }

        setActionLoading(true);
        try {
            // NestJS endpoint submits proof to resolve
            await api.patch(`/reports/${id}/submit-proof`, { proof_image_url: proofImage });
            alert('Proof submitted! Job resolved successfully.');
            setSubmittingProof(null);
            setProofImage('');
            fetchWorkerIssues();
        } catch (error) {
            console.error('Failed to submit resolution proof', error);
            alert('Resolution failed.');
        } finally {
            setActionLoading(false);
        }
    };

    const activeTasks = assignedIssues.filter(t => t.status !== 'RESOLVED');
    const completedTasks = assignedIssues.filter(t => t.status === 'RESOLVED');

    return (
        <div className="space-y-6 text-left animate-in fade-in duration-300">
            {/* Header */}
            <div className="pb-6 border-b border-slate-200 dark:border-slate-800">
                <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                    <Wrench className="text-blue-600 dark:text-blue-400" /> Dispatch HUD
                </h1>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 font-medium font-mono">Crew ID: {user.email?.split('@')[0]} // Active Status: Field Available</p>
            </div>

            {/* Performance Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatsCard 
                    title="Active Dispatches" 
                    value={activeTasks.length} 
                    icon={<Play size={18} className="text-amber-500 animate-pulse" />} 
                    subtitle="Jobs awaiting repair today" 
                />
                <StatsCard 
                    title="Repairs Solved" 
                    value={completedTasks.length} 
                    icon={<CheckCircle size={18} className="text-emerald-500" />} 
                    subtitle="Resolved cases verified by admin" 
                />
                <StatsCard 
                    title="Dispatched Points" 
                    value={user.points || 0} 
                    icon={<ShieldCheck size={18} className="text-blue-500" />} 
                    subtitle="XP Points awarded from resolutions" 
                />
            </div>

            {/* Dispatch items checklist list */}
            <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Assigned Missions Queue</h3>

                {loading ? (
                    <div className="h-44 w-full flex items-center justify-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl">
                        <Spinner size="md" />
                    </div>
                ) : assignedIssues.length === 0 ? (
                    <div className="bg-white dark:bg-slate-900 p-8 text-center rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <CheckCircle className="h-10 w-10 text-emerald-500 mx-auto mb-3" />
                        <p className="text-sm font-black text-slate-900 dark:text-white">Operations Complete</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">No active dispatches allocated to your crew bin.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {assignedIssues.map((task) => {
                            const isResolved = task.status === 'RESOLVED';
                            const isNew = task.status === 'APPROVED' || task.status === 'ASSIGNED';

                            return (
                                <div key={task.report_id} className="bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                    <div className="space-y-2 max-w-xl text-left">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="text-base font-black text-slate-900 dark:text-white">{task.category}</span>
                                            <Badge variant={isResolved ? 'success' : isNew ? 'info' : 'warning'}>
                                                {task.status}
                                            </Badge>
                                        </div>
                                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">{task.description}</p>
                                        <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                                            Loc: {task.location} • Lat: {task.latitude}, Lng: {task.longitude}
                                        </div>
                                    </div>

                                    {/* Action Drawer triggers */}
                                    <div className="shrink-0 flex gap-2 w-full md:w-auto">
                                        {isNew && (
                                            <Button 
                                                onClick={() => handleAcceptJob(task.report_id)}
                                                disabled={actionLoading}
                                                className="w-full md:w-auto font-extrabold shadow-[0_0_20px_rgba(59,130,246,0.25)] rounded-2xl py-3"
                                            >
                                                Start Dispatch
                                            </Button>
                                        )}
                                        {!isResolved && !isNew && !submittingProof && (
                                            <Button 
                                                onClick={() => setSubmittingProof(task.report_id)}
                                                className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-500 font-extrabold shadow-[0_0_20px_rgba(16,185,129,0.25)] rounded-2xl py-3"
                                            >
                                                <UploadCloud size={16} /> Upload Evidence
                                            </Button>
                                        )}
                                    </div>

                                    {/* Inline proof submission drawer */}
                                    {submittingProof === task.report_id && (
                                        <div className="w-full md:w-auto bg-slate-50 dark:bg-slate-800/80 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4 text-left">
                                            <ImageUploader onChange={(url) => setProofImage(url)} label="Attach Repair Photo Proof" />
                                            <div className="flex gap-2 justify-end">
                                                <Button size="sm" variant="outline" onClick={() => setSubmittingProof(null)} className="font-bold">
                                                    Cancel
                                                </Button>
                                                <Button 
                                                    size="sm"
                                                    disabled={actionLoading}
                                                    onClick={(e) => handleSubmitProof(e, task.report_id)}
                                                    className="bg-emerald-600 hover:bg-emerald-500 font-extrabold"
                                                >
                                                    Solve Ticket
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default WorkerDashboard;
