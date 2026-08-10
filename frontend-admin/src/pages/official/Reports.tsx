import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, FileText, LayoutGrid, List, RefreshCw } from 'lucide-react';
import api from '../../api/axios';
import DashboardLayout from '../../layouts/DashboardLayout';
import ComplaintCard from '../../components/dashboard/ComplaintCard';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Spinner from '../../components/ui/Spinner';

const CATEGORIES = ['ALL', 'Road Damage', 'Garbage Dump', 'Streetlight Defect', 'Water Leak', 'Traffic Signal', 'Other Issue'];
const STATUSES = ['ALL', 'OPEN', 'IN_PROGRESS', 'RESOLVED'];

const Reports: React.FC = () => {
    const navigate = useNavigate();
    const [reports, setReports] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('ALL');
    const [selectedStatus, setSelectedStatus] = useState('ALL');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    const user = (() => {
        try {
            const raw = localStorage.getItem('user');
            return raw && raw !== 'undefined' ? JSON.parse(raw) : {};
        } catch {
            return {};
        }
    })();

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            setLoading(true);
            const res = await api.get('/reports');
            setReports(res.data);
        } catch (error) {
            console.error('Failed to load reports', error);
            setReports([]);
        } finally {
            setLoading(false);
        }
    };

    const handleAcceptReport = async (id: string) => {
        try {
            await api.patch(`/reports/${id}/status`, { status: 'APPROVED' });
            alert('Report approved successfully!');
            fetchReports();
        } catch (error) {
            console.error('Failed to accept report', error);
        }
    };

    const filteredReports = reports.filter(r => {
        const matchesSearch = 
            r.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.location?.toLowerCase().includes(searchTerm.toLowerCase());
            
        const matchesCategory = 
            selectedCategory === 'ALL' || 
            r.category?.toLowerCase().includes(selectedCategory.toLowerCase()) ||
            selectedCategory.toLowerCase().includes(r.category?.toLowerCase());

        const matchesStatus = 
            selectedStatus === 'ALL' || 
            r.status === selectedStatus;

        return matchesSearch && matchesCategory && matchesStatus;
    });

    return (
        <DashboardLayout>
            <div className="space-y-6 text-left animate-in fade-in duration-300">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">Mission Control</h1>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 font-medium">Browse, triage, and dispatch municipal field crew assets.</p>
                    </div>
                    <div className="flex items-center gap-1.5 border border-slate-200 dark:border-slate-800 p-1.5 bg-white dark:bg-slate-900 rounded-2xl shadow-sm">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-xl transition-all cursor-pointer ${viewMode === 'grid' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
                        >
                            <LayoutGrid size={16} />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-xl transition-all cursor-pointer ${viewMode === 'list' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
                        >
                            <List size={16} />
                        </button>
                    </div>
                </div>

                {/* Filters Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
                    <Input
                        placeholder="Search incidents by location or title..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        icon={<Search size={16} />}
                        className="text-xs"
                    />

                    <Select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        options={CATEGORIES.map(c => ({ value: c, label: c === 'ALL' ? 'All Categories' : c }))}
                    />

                    <Select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        options={STATUSES.map(s => ({ value: s, label: s === 'ALL' ? 'All Statuses' : s }))}
                    />
                </div>

                {/* Results count banner */}
                <div className="flex justify-between items-center text-xs font-bold text-slate-600 dark:text-slate-400">
                    <span>Showing <span className="text-blue-600 dark:text-blue-400 font-black">{filteredReports.length}</span> complaints</span>
                    <button onClick={fetchReports} className="text-blue-600 dark:text-blue-400 hover:underline uppercase tracking-widest font-black text-[10px] flex items-center gap-1 cursor-pointer">
                        <RefreshCw size={12} /> Refresh Queue
                    </button>
                </div>

                {/* Complaints list grids */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-80 bg-white dark:bg-slate-900 rounded-3xl animate-pulse border border-slate-200 dark:border-slate-800"></div>
                        ))}
                    </div>
                ) : filteredReports.length === 0 ? (
                    <div className="bg-white dark:bg-slate-900 p-12 text-center rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <FileText size={48} className="text-slate-400 mx-auto mb-3" />
                        <p className="text-slate-800 dark:text-slate-200 text-sm font-bold">No complaints found matching filter criteria</p>
                    </div>
                ) : viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredReports.map((report) => (
                            <ComplaintCard 
                                key={report.report_id}
                                report={report} 
                                onActionClick={
                                    (user.role === 'ADMIN' || user.role === 'OFFICIAL') 
                                        ? (id, action) => action === 'approve' && handleAcceptReport(id)
                                        : undefined
                                } 
                            />
                        ))}
                    </div>
                ) : (
                    <div className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs border-collapse">
                                <thead>
                                    <tr className="bg-slate-100 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-extrabold uppercase tracking-wider">
                                        <th className="p-4 w-20">ID</th>
                                        <th className="p-4">Category</th>
                                        <th className="p-4">Location</th>
                                        <th className="p-4">Status</th>
                                        <th className="p-4">Created Date</th>
                                        <th className="p-4 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 dark:divide-slate-800/80 font-medium">
                                    {filteredReports.map((report) => (
                                        <tr key={report.report_id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                                            <td className="p-4 font-mono font-bold text-slate-500">#{report.report_id?.slice(0, 4)}</td>
                                            <td className="p-4 font-extrabold text-slate-900 dark:text-white">{report.category}</td>
                                            <td className="p-4 text-slate-600 dark:text-slate-300 max-w-[200px] truncate">{report.location}</td>
                                            <td className="p-4">
                                                <Badge variant={report.status === 'RESOLVED' ? 'success' : report.status === 'OPEN' ? 'danger' : 'warning'}>{report.status}</Badge>
                                            </td>
                                            <td className="p-4 text-slate-500 dark:text-slate-400 font-medium">{new Date(report.created_at || Date.now()).toLocaleDateString()}</td>
                                            <td className="p-4 text-right">
                                                <Button size="sm" variant="ghost" onClick={() => navigate(`/issues/${report.report_id}`)} className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">
                                                    Details →
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default Reports;
