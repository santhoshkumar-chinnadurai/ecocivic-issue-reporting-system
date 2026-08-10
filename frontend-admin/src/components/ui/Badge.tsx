import React from 'react';

interface BadgeProps {
    variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'gray';
    children: React.ReactNode;
}

const Badge: React.FC<BadgeProps> = ({ variant = 'primary', children }) => {
    const baseStyle = "inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all duration-300";
    
    const variants = {
        primary: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 shadow-[0_0_8px_rgba(16,185,129,0.15)]",
        success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_8px_rgba(16,185,129,0.15)]",
        warning: "bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-[0_0_8px_rgba(245,158,11,0.15)]",
        danger: "bg-rose-500/10 text-rose-400 border-rose-500/20 shadow-[0_0_8px_rgba(244,63,94,0.15)]",
        info: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20 shadow-[0_0_8px_rgba(6,182,212,0.15)]",
        gray: "bg-slate-900/50 text-slate-400 border-slate-800"
    };

    return (
        <span className={`${baseStyle} ${variants[variant]}`}>
            {children}
        </span>
    );
};

export default Badge;
