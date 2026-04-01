import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Calendar, CheckCircle2, Activity, Share2, Download, Shield, User, Phone, Trash2, FileText, XCircle, Clock, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Layout from '../components/Layout';

const DEPARTMENTS = [
    'Roads & Bridges',
    'Sanitation',
    'Electrical',
    'Water Supply',
    'Public Health',
    'General Administration'
];

interface Issue {
    report_id: string;
    id?: string;
    title: string;
    category: string;
    description: string;
    location: string;
    status: string;
    user_id: string;
    created_at: string;
    updated_at?: string;
    image_url?: string;
    imageUrl?: string;
    priority?: string;
    reporter?: string;
    reporterPhone?: string;
    assigned_department?: string;
    assigned_worker_id?: string;
    date?: string;
}

const IssueDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [issue, setIssue] = useState<Issue | null>(null);
    const [workers, setWorkers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [proofImage, setProofImage] = useState<string | null>(null);
    const [submittingProof, setSubmittingProof] = useState(false);
    const [downloading, setDownloading] = useState(false);
    const reportRef = useRef<HTMLDivElement>(null);
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userRole = user.role;

    useEffect(() => {
        if (!id) return;

        setLoading(true);
        const token = localStorage.getItem('token');

        if (userRole === 'ADMIN' || userRole === 'OFFICIAL') {
            axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/users`, {
                headers: { Authorization: `Bearer ${token}` }
            }).then(res => {
                setWorkers(res.data.filter((u: any) => u.role === 'WORKER'));
            }).catch(console.error);
        }

        axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/reports/${id}`)
            .then(res => {
                const data = res.data;
                const reporterName = data.user?.email ? data.user.email.split('@')[0] : 'Citizen User';

                setIssue({
                    ...data,
                    report_id: data.report_id || id || '',
                    title: data.category || 'Untitled Report',
                    user_id: data.user_id || '',
                    created_at: data.created_at || new Date().toISOString(),
                    category: data.category || 'Report Issue',
                    date: new Date(data.created_at).toLocaleDateString(),
                    imageUrl: data.image_url || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                    priority: 'HIGH',
                    reporter: reporterName,
                    reporterPhone: data.user?.phone_number || 'N/A'
                });
                setLoading(false);
            })
            .catch(err => {
                console.log("Failed to fetch issue, using mock", err);
                const mockIssue: Issue = {
                    report_id: id || 'mock-id',
                    id: id || 'mock-id',
                    title: 'Road Damage Mock',
                    user_id: 'mock-user',
                    created_at: new Date().toISOString(),
                    category: 'Road Damage',
                    description: 'Severe pothole causing traffic congestion.',
                    location: 'Main Street, City Center',
                    imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                    status: 'OPEN',
                    priority: 'HIGH',
                    date: new Date().toLocaleDateString(),
                    reporter: 'Citizen #1234',
                    reporterPhone: '+91 98765 43210'
                }
                setIssue(mockIssue);
                setLoading(false);
            });
    }, [id, userRole]);

    const handleShare = async () => {
        if (!issue) return;
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `Civic Issue: ${issue.category}`,
                    text: `Check out this issue reported at ${issue.location}: ${issue.description}`,
                    url: window.location.href,
                });
            } catch (error) {
                console.log('Error sharing:', error);
            }
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert("Link copied to clipboard!");
        }
    };

    const handleDownloadPdf = async () => {
        if (!reportRef.current || !issue) return;
        setDownloading(true);
        try {
            const canvas = await html2canvas(reportRef.current, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: document.documentElement.classList.contains('dark') ? '#050505' : '#ffffff'
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`report-${issue.id || issue.report_id}.pdf`);
        } catch (error) {
            console.error("PDF Download failed", error);
            alert("Failed to generate PDF. Please try again.");
        } finally {
            setDownloading(false);
        }
    };

    const handleDeleteIssue = async () => {
        if (!window.confirm("Are you sure you want to delete this report? This action cannot be undone.")) return;

        try {
            const token = localStorage.getItem('token');
            if (!issue) return;
            await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/reports/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Report deleted successfully.");
            navigate('/dashboard');
        } catch (error: unknown) {
            console.error("Delete failed", error);
            const errMsg = error instanceof Error ? error.message : String(error);
            alert(`Failed to delete: ${errMsg}`);
        }
    };

    const handleAssignDepartment = async (dept: string) => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/reports/${id}/assign-department`, { department: dept }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (issue) {
                setIssue({ ...issue, assigned_department: dept, updated_at: new Date().toISOString() });
            }
        } catch (error: unknown) {
            console.error("Assignment failed", error);
            const errMsg = error instanceof Error ? error.message : String(error);
            alert(`Failed to assign department: ${errMsg}`);
        }
    };

    const handleUpdateStatus = async (newStatus: string) => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/reports/${id}/status`, { status: newStatus }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (issue) {
                setIssue({ ...issue, status: newStatus, updated_at: new Date().toISOString() });
            }
        } catch (error: unknown) {
            console.error("Status update failed", error);
            const errMsg = error instanceof Error ? error.message : String(error);
            alert(`Failed to update status: ${errMsg}`);
        }
    };

    const StatusBadge = ({ status }: { status: string }) => {
        const styles = {
            PENDING: "bg-yellow-50 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border-yellow-200 dark:border-yellow-500/30",
            OPEN: "bg-red-50 dark:bg-red-500/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/30",
            IN_PROGRESS: "bg-blue-50 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/30",
            APPROVED: "bg-cyan-50 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border-cyan-200 dark:border-cyan-500/30",
            RESOLVED: "bg-green-50 dark:bg-green-500/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-500/30",
            REJECTED: "bg-gray-100 dark:bg-gray-500/20 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-500/30"
        };
        const icons = {
            PENDING: <Clock size={16} className="mr-2" />,
            OPEN: <AlertTriangle size={16} className="mr-2" />,
            IN_PROGRESS: <Activity size={16} className="mr-2" />,
            APPROVED: <CheckCircle2 size={16} className="mr-2" />,
            RESOLVED: <CheckCircle2 size={16} className="mr-2" />,
            REJECTED: <XCircle size={16} className="mr-2" />
        };

        return (
            <span className={`px-4 py-1.5 rounded-full text-sm font-bold shadow-md dark:shadow-lg backdrop-blur-md border flex items-center
                ${styles[status as keyof typeof styles] || "bg-gray-100 dark:bg-gray-500/20 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-500/30"}`
            }>
                {icons[status as keyof typeof styles]}
                {status === 'APPROVED' ? 'ACCEPTED' : status.replace('_', ' ')}
            </span>
        );
    };

    if (loading) {
        return (
            <Layout userRole={userRole}>
                <div className="min-h-[80vh] flex items-center justify-center">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full"
                    />
                </div>
            </Layout>
        );
    }

    if (!issue) {
        return (
            <Layout userRole={userRole}>
                <div className="min-h-[80vh] flex items-center justify-center text-gray-500 dark:text-gray-400 text-xl font-medium">
                    Issue not found
                </div>
            </Layout>
        );
    }

    return (
        <Layout userRole={userRole}>
            <div className="space-y-8 pb-24 max-w-6xl mx-auto mt-4 transition-colors duration-500">

                {/* Header Actions */}
                <div className="flex items-center justify-between relative z-10 w-full">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Report Details</h1>
                    <div className="flex space-x-3">
                        <button
                            onClick={handleShare}
                            className="p-3 bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/[0.08] rounded-xl transition-all shadow-sm dark:shadow-lg"
                            title="Share Report"
                        >
                            <Share2 className="h-5 w-5" />
                        </button>
                        <button
                            onClick={handleDownloadPdf}
                            disabled={downloading}
                            className={`p-3 bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/[0.08] rounded-xl transition-all shadow-sm dark:shadow-lg flex items-center gap-2 ${downloading ? 'opacity-50 cursor-wait' : ''}`}
                            title="Download PDF"
                        >
                            {downloading ? <div className="animate-spin h-5 w-5 border-2 border-indigo-500 dark:border-white rounded-full border-t-transparent"></div> : <Download className="h-5 w-5" />}
                        </button>
                    </div>
                </div>

                {/* Content Container for PDF Capture */}
                <div ref={reportRef} className="grid grid-cols-1 lg:grid-cols-3 gap-8 bg-transparent p-2 rounded-3xl pb-4">
                    {/* Left Column: Image & Status */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="lg:col-span-2 space-y-6"
                    >
                        {/* Image Card */}
                        <div className="bg-white dark:bg-white/[0.02] backdrop-blur-2xl border border-gray-200 dark:border-white/10 rounded-3xl overflow-hidden shadow-xl dark:shadow-2xl relative group h-96">
                            <div className="absolute top-5 right-5 z-20">
                                <StatusBadge status={issue.status} />
                            </div>

                            <img
                                src={issue.imageUrl}
                                alt="Issue Evidence"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-100 dark:opacity-90 group-hover:opacity-100"
                                crossOrigin="anonymous"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = 'none';
                                    (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                                }}
                            />
                            {/* Fallback */}
                            <div className={`absolute inset-0 bg-gradient-to-br from-indigo-100 to-transparent dark:from-indigo-900/10 flex items-center justify-center hidden`}>
                                <FileText className="text-gray-300 dark:text-white/10" size={64} />
                            </div>

                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 dark:from-[#0A0A0A] via-black/40 to-transparent"></div>
                            <div className="absolute bottom-0 left-0 p-8 w-full">
                                <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 shadow-sm">{issue.category}</h2>
                                <div className="flex items-center text-gray-200 dark:text-gray-300 text-sm md:text-base font-medium">
                                    <MapPin className="h-5 w-5 mr-2 text-indigo-300 dark:text-indigo-400" />
                                    {issue.location}
                                </div>
                            </div>
                        </div>

                        {/* Description Card */}
                        <div className="bg-white dark:bg-white/[0.02] backdrop-blur-2xl border border-gray-200 dark:border-white/10 rounded-3xl p-6 md:p-8 shadow-lg dark:shadow-xl">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                                <div className="bg-indigo-50 dark:bg-indigo-500/20 p-2.5 rounded-xl mr-4 border border-indigo-100 dark:border-indigo-500/20">
                                    <FileText className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                                </div>
                                Issue Details
                            </h2>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                                {issue.description}
                            </p>

                            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="bg-gray-50 dark:bg-white/[0.03] rounded-2xl p-5 border border-gray-100 dark:border-white/5">
                                    <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-2">Priority Level</div>
                                    <div className="text-lg font-bold text-red-600 dark:text-red-400 flex items-center bg-red-50 dark:bg-red-500/10 w-fit px-3 py-1 rounded-lg border border-red-200 dark:border-red-500/20">
                                        <div className="h-2 w-2 rounded-full bg-red-500 mr-2 animate-pulse"></div>
                                        {issue.priority}
                                    </div>
                                </div>
                                <div className="bg-gray-50 dark:bg-white/[0.03] rounded-2xl p-5 border border-gray-100 dark:border-white/5">
                                    <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-2">Reported Date</div>
                                    <div className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
                                        <Calendar className="h-5 w-5 mr-2 text-cyan-600 dark:text-cyan-400" />
                                        {issue.date}
                                    </div>
                                </div>
                                <div className="bg-gray-50 dark:bg-white/[0.03] rounded-2xl p-5 border border-gray-100 dark:border-white/5 sm:col-span-2">
                                    <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-2">Assigned Department</div>
                                    <div className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
                                        <Shield className="h-5 w-5 mr-3 text-indigo-600 dark:text-indigo-400" />
                                        {issue.assigned_department || <span className="text-gray-500 italic">Unassigned</span>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Column: Sidebar Actions */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="space-y-6"
                    >
                        {/* Reporter Info */}
                        <div className="bg-white dark:bg-white/[0.02] backdrop-blur-2xl border border-gray-200 dark:border-white/10 rounded-3xl p-6 shadow-lg dark:shadow-xl">
                            <h3 className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-6 flex items-center">
                                <User className="h-4 w-4 mr-2 text-cyan-600 dark:text-cyan-400" /> Reporter Information
                            </h3>
                            <div className="flex items-center">
                                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white font-bold text-xl shadow-md dark:shadow-lg border border-white/20 dark:border-white/10">
                                    {issue.reporter?.charAt(0).toUpperCase()}
                                </div>
                                <div className="ml-4">
                                    <p className="text-gray-900 dark:text-white font-bold text-lg">{issue.reporter}</p>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm flex items-center mt-1">
                                        <Phone size={14} className="mr-1.5 text-gray-400 dark:text-gray-500" /> {issue.reporterPhone}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Actions Sidebar */}
                        <div className="bg-white dark:bg-white/[0.02] backdrop-blur-2xl border border-indigo-200 dark:border-indigo-500/20 rounded-3xl p-6 shadow-lg dark:shadow-xl relative overflow-hidden" data-html2canvas-ignore>
                            {/* Decorative background glow */}
                            <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-[50px] pointer-events-none"></div>

                            <h3 className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-6 flex items-center">
                                <Shield className="h-4 w-4 mr-2" />
                                {userRole === 'ADMIN' ? 'Administrative Control' : userRole === 'OFFICIAL' ? 'Official Control' : 'Report Actions'}
                            </h3>

                            <div className="space-y-5 relative z-10">
                                {userRole === 'OFFICIAL' && issue.status !== 'RESOLVED' && (
                                    <button
                                        onClick={() => handleUpdateStatus('RESOLVED')}
                                        className="w-full py-3.5 px-4 rounded-xl bg-green-50 dark:bg-green-500/10 hover:bg-green-600 dark:hover:bg-green-500 text-green-700 dark:text-green-400 hover:text-white font-bold border border-green-200 dark:border-green-500/20 transition-all flex items-center justify-center gap-2 group"
                                    >
                                        <CheckCircle2 size={18} className="group-hover:scale-110 transition-transform" /> Complete Action
                                    </button>
                                )}

                                {userRole === 'ADMIN' && (
                                    <>
                                        {issue.status === 'OPEN' && (
                                            <div className="grid grid-cols-2 gap-3 mb-4">
                                                <button
                                                    onClick={() => handleUpdateStatus('APPROVED')}
                                                    className="py-3 px-4 rounded-xl bg-green-50 dark:bg-green-500/10 hover:bg-green-600 dark:hover:bg-green-500 text-green-700 dark:text-green-400 hover:text-white font-bold border border-green-200 dark:border-green-500/20 transition-all flex items-center justify-center gap-2 group"
                                                >
                                                    <CheckCircle2 size={16} className="group-hover:scale-110 transition-transform" /> Accept
                                                </button>
                                                <button
                                                    onClick={() => handleUpdateStatus('REJECTED')}
                                                    className="py-3 px-4 rounded-xl bg-red-50 dark:bg-red-500/10 hover:bg-red-600 dark:hover:bg-red-500 text-red-700 dark:text-red-400 hover:text-white font-bold border border-red-200 dark:border-red-500/20 transition-all flex items-center justify-center gap-2 group"
                                                >
                                                    <XCircle size={16} className="group-hover:scale-110 transition-transform" /> Reject
                                                </button>
                                            </div>
                                        )}

                                        <div className="space-y-2.5 bg-gray-50 dark:bg-white/[0.02] p-4 rounded-2xl border border-gray-100 dark:border-white/5">
                                            <label className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-widest font-bold">Assign Department</label>
                                            <div className="relative group/select">
                                                <select
                                                    value={issue.assigned_department || ""}
                                                    onChange={(e) => handleAssignDepartment(e.target.value)}
                                                    className="w-full bg-white dark:bg-white/[0.05] hover:bg-gray-50 dark:hover:bg-white/[0.08] border border-gray-200 dark:border-transparent focus:border-indigo-300 dark:focus:border-white/10 rounded-xl py-3 pl-4 pr-10 text-sm font-medium focus:outline-none transition-all appearance-none cursor-pointer text-gray-900 dark:text-white shadow-sm dark:shadow-none"
                                                >
                                                    <option value="" disabled className="bg-white dark:bg-[#0f0f0f]">Select Department</option>
                                                    {DEPARTMENTS.map(dept => (
                                                        <option key={dept} value={dept} className="bg-white dark:bg-[#0f0f0f] text-gray-900 dark:text-white">{dept}</option>
                                                    ))}
                                                </select>
                                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 dark:text-gray-500 group-focus-within/select:text-indigo-500 dark:group-focus-within/select:text-indigo-400 transition-colors">
                                                    <Activity className="h-4 w-4" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2.5 bg-gray-50 dark:bg-white/[0.02] p-4 rounded-2xl border border-gray-100 dark:border-white/5">
                                            <label className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-widest font-bold">Assign Worker</label>
                                            <div className="relative group/select">
                                                <select
                                                    value={issue.assigned_worker_id || ""}
                                                    onChange={async (e) => {
                                                        try {
                                                            const token = localStorage.getItem('token');
                                                            await axios.patch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/reports/${id}/assign-worker`, { workerId: e.target.value }, {
                                                                headers: { Authorization: `Bearer ${token}` }
                                                            });
                                                            setIssue({ ...issue!, assigned_worker_id: e.target.value, updated_at: new Date().toISOString() });
                                                        } catch (error) {
                                                            console.error("Worker assignment failed", error);
                                                            alert('Failed to assign worker');
                                                        }
                                                    }}
                                                    className="w-full bg-white dark:bg-white/[0.05] hover:bg-gray-50 dark:hover:bg-white/[0.08] border border-gray-200 dark:border-transparent focus:border-indigo-300 dark:focus:border-white/10 rounded-xl py-3 pl-4 pr-10 text-sm font-medium focus:outline-none transition-all appearance-none cursor-pointer text-gray-900 dark:text-white shadow-sm dark:shadow-none"
                                                >
                                                    <option value="" disabled className="bg-white dark:bg-[#0f0f0f]">Select Worker</option>
                                                    {workers.map(w => (
                                                        <option key={w.user_id} value={w.user_id} className="bg-white dark:bg-[#0f0f0f] text-gray-900 dark:text-white">{w.email}</option>
                                                    ))}
                                                </select>
                                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 dark:text-gray-500 group-focus-within/select:text-indigo-500 dark:group-focus-within/select:text-indigo-400 transition-colors">
                                                    <User className="h-4 w-4" />
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}

                                {userRole === 'WORKER' && issue.status !== 'RESOLVED' && (
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Submit Proof of Work</label>
                                            <div className="p-1 bg-white/[0.03] rounded-xl border border-white/5">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) {
                                                            const reader = new FileReader();
                                                            reader.onloadend = () => {
                                                                setProofImage(reader.result as string);
                                                            };
                                                            reader.readAsDataURL(file);
                                                        }
                                                    }}
                                                    className="w-full text-sm text-gray-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-indigo-500/20 file:text-indigo-400 hover:file:bg-indigo-500/30 file:cursor-pointer cursor-pointer transition-colors"
                                                />
                                            </div>
                                        </div>
                                        <button
                                            disabled={!proofImage || submittingProof}
                                            onClick={async () => {
                                                setSubmittingProof(true);
                                                try {
                                                    const token = localStorage.getItem('token');
                                                    await axios.patch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/reports/${id}/submit-proof`, { proofImageUrl: proofImage }, {
                                                        headers: { Authorization: `Bearer ${token}` }
                                                    });
                                                    setIssue({ ...issue!, status: 'RESOLVED', updated_at: new Date().toISOString() });
                                                } catch (error) {
                                                    console.error("Proof submission failed", error);
                                                    alert('Failed to submit proof');
                                                } finally {
                                                    setSubmittingProof(false);
                                                }
                                            }}
                                            className="w-full py-3.5 px-4 rounded-xl bg-indigo-500/10 hover:bg-indigo-500 text-indigo-400 hover:text-white font-bold border border-indigo-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 group"
                                        >
                                            <CheckCircle2 size={18} className="group-hover:scale-110 transition-transform" /> Submit Proof & Close
                                        </button>
                                    </div>
                                )}

                                {(userRole === 'ADMIN' || issue.user_id === user.user_id) && (
                                    <button
                                        onClick={handleDeleteIssue}
                                        className="w-full py-3.5 px-4 mt-8 rounded-xl bg-red-50 dark:bg-red-500/10 hover:bg-red-600 dark:hover:bg-red-500 text-red-700 dark:text-red-500 hover:text-white font-bold border border-red-200 dark:border-red-500/20 transition-colors flex items-center justify-center gap-2 group"
                                    >
                                        <Trash2 className="h-4 w-4 group-hover:scale-110 transition-transform" />
                                        Delete Report
                                    </button>
                                )}
                            </div>

                            <p className="text-[10px] text-gray-500 dark:text-gray-500/80 mt-6 text-center font-bold tracking-wide">
                                LAST UPDATED: {new Date(issue.updated_at || issue.created_at).toLocaleString()}
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </Layout>
    );
};

export default IssueDetail;
