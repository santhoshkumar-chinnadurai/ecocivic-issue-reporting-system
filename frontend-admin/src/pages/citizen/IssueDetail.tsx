import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, ArrowLeft, Download, Wrench, MessageSquare, Send } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import api from '../../api/axios';
import DashboardLayout from '../../layouts/DashboardLayout';
import Timeline from '../../components/common/Timeline';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Select from '../../components/ui/Select';
import Spinner from '../../components/ui/Spinner';

const DEPARTMENTS = [
    'Roads & Bridges',
    'Sanitation',
    'Electrical',
    'Water Supply',
    'Public Health',
    'General Administration'
];

const IssueDetail: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [issue, setIssue] = useState<any>(null);
    const [workers, setWorkers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState(false);
    const [assigning, setAssigning] = useState(false);
    const [selectedWorkerId, setSelectedWorkerId] = useState('');
    const [selectedDept, setSelectedDept] = useState('');

    const [commentText, setCommentText] = useState('');
    const [comments, setComments] = useState<any[]>([]);

    const reportRef = useRef<HTMLDivElement>(null);
    const user = (() => {
        try {
            const raw = localStorage.getItem('user');
            return raw && raw !== 'undefined' ? JSON.parse(raw) : {};
        } catch {
            return {};
        }
    })();
    const userRole = user.role;

    useEffect(() => {
        if (!id) return;
        fetchIssueDetails();
    }, [id]);

    const fetchIssueDetails = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/reports/${id}`);
            setIssue(res.data);
            setSelectedDept(res.data.assigned_department || DEPARTMENTS[0]);

            if (userRole === 'ADMIN' || userRole === 'OFFICIAL') {
                const usersRes = await api.get('/users');
                const workerList = usersRes.data.filter((u: any) => u.role === 'WORKER');
                setWorkers(workerList);

                const currentWorkerId = res.data.assigned_worker_id || (workerList[0] ? (workerList[0].user_id || workerList[0].id) : '');
                setSelectedWorkerId(currentWorkerId);
            }
        } catch (error) {
            console.error('Failed to load issue details', error);
            setIssue(null);
        } finally {
            setLoading(false);
        }
    };

    const handleAssignWorker = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id) return;

        const workerToAssign = selectedWorkerId || (workers[0] ? (workers[0].user_id || workers[0].id) : null);
        if (!workerToAssign) {
            alert('Please select a ground worker crew member to dispatch.');
            return;
        }

        setAssigning(true);
        try {
            if (selectedDept) {
                await api.patch(`/reports/${id}/assign-department`, { department: selectedDept });
            }
            await api.patch(`/reports/${id}/assign-worker`, { workerId: workerToAssign });
            alert('Worker crew dispatched successfully!');
            fetchIssueDetails();
        } catch (error: any) {
            console.error('Failed to assign worker', error);
            alert(error.response?.data?.message || 'Assignment failed. Please check permissions.');
        } finally {
            setAssigning(false);
        }
    };

    const handleUndoDispatch = async () => {
        if (!id) return;
        setAssigning(true);
        try {
            await api.patch(`/reports/${id}/status`, { status: 'OPEN' });
            await api.patch(`/reports/${id}/assign-worker`, { workerId: null });
            alert('Dispatch allocation undone! Status reset to OPEN.');
            fetchIssueDetails();
        } catch (error: any) {
            console.error('Failed to undo dispatch', error);
            alert('Failed to reset dispatch allocation.');
        } finally {
            setAssigning(false);
        }
    };

    const handleAddComment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentText.trim()) return;

        const newComment = {
            id: Date.now(),
            user: `${user.email?.split('@')[0]} (${user.role})`,
            text: commentText,
            time: 'Just now'
        };
        setComments([...comments, newComment]);
        setCommentText('');
    };

    const handleDownloadPdf = async () => {
        if (!issue) return;
        setDownloading(true);
        try {
            const pdf = new jsPDF('p', 'mm', 'a4');

            // Header Banner
            pdf.setFillColor(37, 99, 235);
            pdf.rect(0, 0, 210, 24, 'F');

            pdf.setTextColor(255, 255, 255);
            pdf.setFontSize(14);
            pdf.setFont('helvetica', 'bold');
            pdf.text('CIVICCONNECT INCIDENT REPORT', 14, 16);

            // Metadata Section
            pdf.setTextColor(15, 23, 42);
            pdf.setFontSize(10);
            pdf.setFont('helvetica', 'bold');
            pdf.text(`REPORT REFERENCE:`, 14, 36);
            pdf.setFont('helvetica', 'normal');
            pdf.text(`#${issue.report_id}`, 60, 36);

            pdf.setFont('helvetica', 'bold');
            pdf.text(`DATE FILED:`, 14, 44);
            pdf.setFont('helvetica', 'normal');
            pdf.text(`${new Date(issue.created_at).toLocaleString()}`, 60, 44);

            pdf.setFont('helvetica', 'bold');
            pdf.text(`CATEGORY:`, 14, 52);
            pdf.setFont('helvetica', 'normal');
            pdf.text(`${issue.category || 'General'}`, 60, 52);

            pdf.setFont('helvetica', 'bold');
            pdf.text(`CURRENT STATUS:`, 14, 60);
            pdf.setFont('helvetica', 'normal');
            pdf.text(`${issue.status}`, 60, 60);

            pdf.setFont('helvetica', 'bold');
            pdf.text(`PRIORITY LEVEL:`, 14, 68);
            pdf.setFont('helvetica', 'normal');
            pdf.text(`${issue.priority || 'MEDIUM'}`, 60, 68);

            pdf.setFont('helvetica', 'bold');
            pdf.text(`LOCATION:`, 14, 76);
            pdf.setFont('helvetica', 'normal');
            pdf.text(`${issue.location || 'Municipal Area'}`, 60, 76);

            pdf.setFont('helvetica', 'bold');
            pdf.text(`ASSIGNED DEPT:`, 14, 84);
            pdf.setFont('helvetica', 'normal');
            pdf.text(`${issue.assigned_department || 'Unassigned'}`, 60, 84);

            // Divider Line
            pdf.setDrawColor(226, 232, 240);
            pdf.line(14, 94, 196, 94);

            // Description Section
            pdf.setFont('helvetica', 'bold');
            pdf.text('INCIDENT DESCRIPTION:', 14, 104);
            pdf.setFont('helvetica', 'normal');
            const splitDesc = pdf.splitTextToSize(issue.description || 'No description provided.', 180);
            pdf.text(splitDesc, 14, 112);

            // Official Footer
            pdf.setDrawColor(226, 232, 240);
            pdf.line(14, 275, 196, 275);
            pdf.setFontSize(8);
            pdf.setTextColor(148, 163, 184);
            pdf.text('Official Municipal Civic Platform Document — Verified Governance Record', 14, 282);

            pdf.save(`Civic_Report_${issue.report_id.slice(0, 8)}.pdf`);
        } catch (error) {
            console.error('PDF generation failed', error);
            alert('Failed to generate PDF. Please try again.');
        } finally {
            setDownloading(false);
        }
    };

    if (loading || !issue) {
        return (
            <DashboardLayout>
                <div className="h-96 w-full flex items-center justify-center">
                    <Spinner size="lg" />
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="max-w-5xl mx-auto space-y-6 text-left animate-in fade-in duration-300">
                
                {/* Header Title */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all active:scale-95 shadow-sm cursor-pointer"
                        >
                            <ArrowLeft size={18} />
                        </button>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                                Complaint Details
                            </h1>
                            <p className="text-xs text-slate-500 font-mono mt-0.5">#{issue.report_id}</p>
                        </div>
                    </div>
                    <Button variant="outline" size="sm" className="flex items-center gap-2 font-extrabold rounded-2xl py-2.5" onClick={handleDownloadPdf} loading={downloading}>
                        <Download size={15} /> Export Report PDF
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" ref={reportRef}>
                    {/* Left/Middle: Image, Details & Comments */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                            
                            {/* Images Comparison Before vs After */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-widest font-black">Reported Evidence (Before)</span>
                                    <div className="h-48 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                                        <img 
                                            src={issue.image_url || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?ixlib=rb-1.2.1&auto=format&fit=crop&w=640&q=80'} 
                                            className="w-full h-full object-cover"
                                            alt="Evidence Before"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-widest font-black">Crew Resolution (After)</span>
                                    <div className="h-48 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400">
                                        {issue.proof_image_url ? (
                                            <img 
                                                src={issue.proof_image_url} 
                                                className="w-full h-full object-cover"
                                                alt="Evidence After"
                                            />
                                        ) : (
                                            <p className="text-xs font-bold uppercase tracking-wider italic text-slate-400">Awaiting repair resolution...</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Complaint text */}
                            <div className="space-y-3">
                                <div className="flex flex-wrap gap-2">
                                    <Badge variant={issue.status === 'RESOLVED' ? 'success' : issue.status === 'OPEN' ? 'danger' : 'warning'}>{issue.status}</Badge>
                                    <Badge variant="primary">{issue.category}</Badge>
                                    {issue.priority && <Badge variant="danger">{issue.priority}</Badge>}
                                </div>
                                <h3 className="text-lg font-black text-slate-900 dark:text-white leading-tight">{issue.category} Issue</h3>
                                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">{issue.description}</p>
                            </div>

                            {/* Location Details block */}
                            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400">
                                <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
                                <span>{issue.location}</span>
                            </div>
                        </div>

                        {/* Crew Comments Board */}
                        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                            <h3 className="text-base font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                                <MessageSquare size={18} className="text-emerald-600 dark:text-emerald-400" /> Dispatch & Official Notes
                            </h3>

                            <div className="space-y-3">
                                {comments.map((comm) => (
                                    <div key={comm.id} className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-2xl space-y-1">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs font-black text-slate-900 dark:text-white">{comm.user}</span>
                                            <span className="text-[10px] text-slate-400 font-mono">{comm.time}</span>
                                        </div>
                                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">{comm.text}</p>
                                    </div>
                                ))}
                                {comments.length === 0 && (
                                    <p className="text-xs text-slate-400 italic font-medium">No comments posted yet.</p>
                                )}
                            </div>

                            <form onSubmit={handleAddComment} className="flex gap-2 pt-2">
                                <input
                                    type="text"
                                    placeholder="Type dispatch update or citizen inquiry..."
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 font-medium"
                                />
                                <Button type="submit" size="sm" className="font-extrabold px-5 rounded-2xl">
                                    <Send size={14} /> Send
                                </Button>
                            </form>
                        </div>
                    </div>

                    {/* Right Pane: Timeline Tracker & Dispatch Actions */}
                    <div className="space-y-6">
                        {/* Timeline */}
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                            <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white mb-6">
                                Progress Tracking
                            </h3>
                            <Timeline 
                                status={issue.status} 
                                createdAt={issue.created_at} 
                                updatedAt={issue.updated_at}
                                assignedWorker={issue.assigned_worker?.email}
                            />
                        </div>

                        {/* Dispatch Drawer for Officials */}
                        {(userRole === 'ADMIN' || userRole === 'OFFICIAL') && issue.status !== 'RESOLVED' && (
                            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                                <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                                    <Wrench size={16} className="text-emerald-600 dark:text-emerald-400" /> Allocate Crew Dispatch
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal font-medium">
                                    Reallocate department or dispatch a field worker team.
                                </p>
                                <form onSubmit={handleAssignWorker} className="space-y-4">
                                    <Select
                                        label="Select Department"
                                        value={selectedDept}
                                        onChange={(e) => setSelectedDept(e.target.value)}
                                        options={DEPARTMENTS.map(d => ({ value: d, label: d }))}
                                    />
                                    <Select
                                        label="Ground Worker Crew"
                                        value={selectedWorkerId}
                                        onChange={(e) => setSelectedWorkerId(e.target.value)}
                                        options={workers.map(w => ({ value: w.user_id || w.id, label: w.email }))}
                                    />
                                    <div className="flex gap-2 pt-1">
                                        <Button type="submit" className="flex-1 font-extrabold shadow-[0_0_20px_rgba(16, 185, 129,0.25)] rounded-2xl py-3" loading={assigning}>
                                            Dispatch Allocation
                                        </Button>
                                        {issue?.assigned_worker_id && (
                                            <Button 
                                                type="button" 
                                                variant="outline" 
                                                onClick={handleUndoDispatch} 
                                                className="font-extrabold rounded-2xl py-3 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800 hover:bg-rose-50 dark:hover:bg-rose-950/40" 
                                                loading={assigning}
                                                title="Undo current dispatch allocation"
                                            >
                                                Undo
                                            </Button>
                                        )}
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </DashboardLayout>
    );
};

export default IssueDetail;
