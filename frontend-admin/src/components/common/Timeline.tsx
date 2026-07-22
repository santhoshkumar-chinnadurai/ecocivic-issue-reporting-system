import React from 'react';
import { Check, Clock, UserCheck, CheckCircle2 } from 'lucide-react';

interface TimelineProps {
    status: string;
    createdAt: string;
    updatedAt?: string;
    assignedWorker?: string;
}

const Timeline: React.FC<TimelineProps> = ({ status, createdAt, updatedAt, assignedWorker }) => {
    const stages = [
        { key: 'OPEN', label: 'Submitted', desc: 'Complaint registered by citizen', icon: Clock },
        { key: 'APPROVED', label: 'Approved', desc: 'Confirming department resources', icon: UserCheck },
        { key: 'IN_PROGRESS', label: 'Dispatched', desc: 'Worker crew heading to location', icon: Clock },
        { key: 'RESOLVED', label: 'Completed', desc: 'Repair verified with image proof', icon: CheckCircle2 }
    ];

    const getStageIndex = (status: string) => {
        if (status === 'RESOLVED') return 3;
        if (status === 'IN_PROGRESS') return 2;
        if (status === 'APPROVED' || status === 'ASSIGNED') return 1;
        return 0;
    };

    const currentStageIndex = getStageIndex(status);

    return (
        <div className="relative border-l border-slate-900 ml-3 pl-6 space-y-8 text-left py-2">
            {stages.map((stage, idx) => {
                const isPassed = idx < currentStageIndex;
                const isCurrent = idx === currentStageIndex;
                const StageIcon = stage.icon;

                return (
                    <div key={stage.key} className="relative">
                        {/* Bullet circle */}
                        <div className={`absolute -left-[35px] top-0 h-6 w-6 rounded-full border flex items-center justify-center transition-all ${
                            isPassed 
                                ? 'bg-emerald-650 border-emerald-500 text-white shadow-[0_0_10px_rgba(16,185,129,0.3)]' 
                                : isCurrent 
                                ? 'bg-blue-600 border-blue-500 text-white animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.3)]' 
                                : 'bg-slate-950 border-slate-900 text-slate-500'
                        }`}>
                            {isPassed ? <Check size={11} strokeWidth={3} /> : <StageIcon size={11} />}
                        </div>

                        {/* Title and details */}
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <span className={`text-xs font-bold ${
                                    isCurrent ? 'text-blue-400' : 'text-slate-350'
                                }`}>
                                    {stage.label}
                                </span>
                                {isCurrent && (
                                    <span className="text-[8px] font-black bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded border border-blue-500/10">
                                        Current
                                    </span>
                                )}
                            </div>
                            <p className="text-[10px] text-slate-500 leading-normal">
                                {stage.desc}
                            </p>
                            {isCurrent && stage.key === 'IN_PROGRESS' && assignedWorker && (
                                <p className="text-[9px] text-slate-400 font-mono bg-slate-950 p-2 rounded border border-slate-900 mt-2 max-w-xs leading-normal">
                                    Crew: {assignedWorker.split('@')[0]}
                                </p>
                            )}
                            <span className="block text-[8px] text-slate-650 font-mono mt-1">
                                {idx === 0 ? new Date(createdAt).toLocaleString() : isPassed || isCurrent ? new Date(updatedAt || createdAt).toLocaleString() : ''}
                            </span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default Timeline;
