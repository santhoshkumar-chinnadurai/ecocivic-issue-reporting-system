import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

const Input: React.FC<InputProps> = ({
    label,
    error,
    icon,
    rightIcon,
    className = '',
    id,
    ...props
}) => {
    const inputId = id || Math.random().toString(36).substring(7);

    return (
        <div className="w-full text-left space-y-1.5">
            {label && (
                <label htmlFor={inputId} className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    {label}
                </label>
            )}
            <div className="relative flex items-center">
                {icon && (
                    <div className="absolute left-3.5 text-slate-400 dark:text-slate-500 pointer-events-none">
                        {icon}
                    </div>
                )}
                <input
                    id={inputId}
                    className={`w-full px-4 py-2.5 bg-white dark:bg-slate-950/60 border ${
                        error ? 'border-rose-500/50 focus:border-rose-500' : 'border-slate-300 dark:border-slate-800 focus:border-blue-500'
                    } rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500/30 transition-all duration-200 shadow-inner text-xs ${
                        icon ? 'pl-10' : ''
                    } ${rightIcon ? 'pr-20' : ''} ${className}`}
                    {...props}
                />
                {rightIcon && (
                    <div className="absolute right-3.5 flex items-center justify-center">
                        {rightIcon}
                    </div>
                )}
            </div>
            {error && (
                <p className="text-[10px] text-rose-450 font-medium tracking-wide">
                    {error}
                </p>
            )}
        </div>
    );
};

export default Input;
