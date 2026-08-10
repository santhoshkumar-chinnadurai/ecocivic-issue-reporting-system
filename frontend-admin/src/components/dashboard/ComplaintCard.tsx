import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, ArrowRight } from 'lucide-react';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

interface ComplaintCardProps {
    report: any;
    onActionClick?: (id: string, action: 'approve' | 'assign') => void;
}

const ComplaintCard: React.FC<ComplaintCardProps> = ({ report, onActionClick }) => {
    const navigate = useNavigate();
    const isNew = report.status === 'OPEN' || report.status === 'PENDING';

    return (
        <div className="panel-cyber-glass p-5 border-slate-850 flex flex-col justify-between hover:border-slate-700 hover:scale-[1.01] transition-all text-left">
            <div className="space-y-4">
                {/* Header info */}
                <div className="flex justify-between items-start gap-2">
                    <span className="text-xs font-bold text-white truncate">{report.category}</span>
                    <Badge variant={report.status === 'RESOLVED' ? 'success' : report.status === 'IN_PROGRESS' ? 'warning' : 'primary'}>
                        {report.status}
                    </Badge>
                </div>

                {/* Evidence photo preview if available */}
                {report.image_url && (
                    <div className="h-28 rounded-xl overflow-hidden bg-slate-950 border border-slate-900">
                        <img src={report.image_url} alt={report.category} className="w-full h-full object-cover" />
                    </div>
                )}

                <p className="text-[11px] text-slate-405 leading-relaxed line-clamp-3">
                    {report.description}
                </p>

                <div className="space-y-1.5 text-[10px] text-slate-500 font-medium">
                    <div className="flex items-center gap-1.5">
                        <MapPin size={12} className="text-slate-600 shrink-0" />
                        <span className="truncate">{report.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Calendar size={12} className="text-slate-600 shrink-0" />
                        <span>Logged: {new Date(report.created_at || Date.now()).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>

            {/* Footer action elements */}
            <div className="pt-4 border-t border-slate-900 mt-4 flex justify-between items-center text-[10px]">
                <span className="text-slate-600 font-mono">#{report.report_id?.slice(0, 6) || 'Incident'}</span>
                
                <div className="flex gap-2">
                    {onActionClick && isNew && (
                        <Button 
                            size="sm" 
                            onClick={(e) => {
                                e.stopPropagation();
                                onActionClick(report.report_id, 'approve');
                            }}
                            className="px-2.5 py-1 text-[9px] shadow-sm bg-emerald-600 hover:bg-emerald-500"
                        >
                            Approve
                        </Button>
                    )}
                    <button 
                        onClick={() => navigate(`/issues/${report.report_id}`)}
                        className="text-emerald-400 font-bold flex items-center gap-1 hover:underline"
                    >
                        Details <ArrowRight size={10} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ComplaintCard;
