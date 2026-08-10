import React from 'react';
import Spinner from './Spinner';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    size = 'md',
    loading = false,
    className = '',
    disabled,
    children,
    ...props
}) => {
    const baseStyle = "inline-flex items-center justify-center font-bold rounded-xl transition-all duration-200 focus:outline-none select-none active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none";
    
    const variants = {
        primary: "bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.25)] border border-transparent",
        secondary: "bg-slate-900/60 border border-slate-800 text-slate-300 hover:bg-slate-850 hover:text-white",
        outline: "bg-transparent border border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white",
        ghost: "bg-transparent hover:bg-slate-900 text-slate-400 hover:text-white",
        danger: "bg-rose-600 hover:bg-rose-500 text-white shadow-[0_0_15px_rgba(244,63,94,0.25)] border border-transparent"
    };

    const sizes = {
        sm: "px-3 py-1.5 text-xs",
        md: "px-5 py-2.5 text-xs",
        lg: "px-6 py-3.5 text-sm"
    };

    return (
        <button
            className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
            disabled={disabled || loading}
            {...props}
        >
            {loading && <Spinner size="sm" className="mr-2" />}
            {children}
        </button>
    );
};

export default Button;
