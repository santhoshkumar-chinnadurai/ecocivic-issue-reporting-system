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
            setSelectedWorkerId(res.data.assigned_worker_id || '');

            if (userRole === 'ADMIN' || userRole === 'OFFICIAL') {
                const usersRes = await api.get('/users');
                setWorkers(usersRes.data.filter((u: any) => u.role === 'WORKER'));
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
        if (!id || !selectedWorkerId) return;

        setAssigning(true);
        try {
            if (selectedDept) {
                await api.patch(`/reports/${id}/assign-department`, { department: selectedDept });
            }
            await api.patch(`/reports/${id}/assign-worker`, { workerId: selectedWorkerId });
            alert('Worker dispatched successfully!');
            fetchIssueDetails();
        } catch (error) {
            console.error('Failed to assign worker', error);
            alert('Assignment failed.');
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
        if (!reportRef.current || !issue) return;
        setDownloading(true);
        try {
            const canvas = await html2canvas(reportRef.current, {
                scale: 2,
                useCORS: true,
                backgroundColor: '#ffffff'
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`Civic_Incident_Report_${issue.report_id.slice(0, 8)}.pdf`);
        } catch (error) {
            console.error('PDF generation failed', error);
            alert('Failed to download report PDF.');
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
                                <MessageSquare size={18} className="text-blue-600 dark:text-blue-400" /> Dispatch & Official Notes
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
                                    className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 font-medium"
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
                                    <Wrench size={16} className="text-blue-600 dark:text-blue-400" /> Allocate Crew Dispatch
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
                                    <Button type="submit" className="w-full font-extrabold shadow-[0_0_20px_rgba(59,130,246,0.25)] rounded-2xl py-3" loading={assigning}>
                                        Dispatch Allocation
                                    </Button>
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
