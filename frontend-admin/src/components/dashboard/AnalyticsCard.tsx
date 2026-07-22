import React from 'react';

interface AnalyticsCardProps {
    title: string;
    subtitle?: string;
    children: React.ReactNode;
}

const AnalyticsCard: React.FC<AnalyticsCardProps> = ({
    title,
    subtitle,
    children
}) => {
    return (
        <div className="panel-cyber-glass p-5 border-slate-850 shadow-md flex flex-col h-80 text-left">
            <div className="pb-3 border-b border-slate-900 mb-4 shrink-0">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">{title}</h3>
                {subtitle && <p className="text-[10px] text-slate-500 font-medium mt-0.5">{subtitle}</p>}
            </div>
            <div className="flex-1 min-h-0 relative z-10">
                {children}
            </div>
        </div>
    );
};

export default AnalyticsCard;
