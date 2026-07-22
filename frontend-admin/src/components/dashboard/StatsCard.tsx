import React from 'react';

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    subtitle?: string;
    trend?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
    title,
    value,
    icon,
    subtitle,
    trend
}) => {
    return (
        <div className="panel-cyber-glass p-5 flex flex-col justify-between shadow-md">
            <div className="flex justify-between items-start gap-4">
                <div className="space-y-1">
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-widest font-black block">
                        {title}
                    </span>
                    <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight block">
                        {value}
                    </span>
                </div>
                <div className="h-9 w-9 bg-blue-500/10 text-blue-500 border border-blue-500/20 rounded-xl flex items-center justify-center">
                    {icon}
                </div>
            </div>
            {(subtitle || trend) && (
                <div className="pt-3 border-t border-slate-200 dark:border-slate-900 mt-4 flex justify-between items-center text-[9px] font-bold">
                    <span className="text-slate-500 dark:text-slate-400 uppercase tracking-wider">{subtitle}</span>
                    {trend && <span className="text-blue-600 dark:text-blue-400 uppercase tracking-wider">{trend}</span>}
                </div>
            )}
        </div>
    );
};

export default StatsCard;
