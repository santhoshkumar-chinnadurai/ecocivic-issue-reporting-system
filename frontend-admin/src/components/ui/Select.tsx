import React from 'react';
import { ChevronDown } from 'lucide-react';

interface Option {
    value: string;
    label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    options: Option[];
    error?: string;
}

const Select: React.FC<SelectProps> = ({
    label,
    options,
    error,
    className = '',
    id,
    ...props
}) => {
    const selectId = id || Math.random().toString(36).substring(7);

    return (
        <div className="w-full text-left space-y-1.5">
            {label && (
                <label htmlFor={selectId} className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    {label}
                </label>
            )}
            <div className="relative flex items-center">
                <select
                    id={selectId}
                    className={`w-full px-4 py-2.5 bg-white dark:bg-slate-950/60 border ${
                        error ? 'border-rose-500/50 focus:border-rose-500' : 'border-slate-300 dark:border-slate-800 focus:border-emerald-500'
                    } rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500/30 transition-all duration-200 shadow-inner appearance-none cursor-pointer text-xs ${className}`}
                    {...props}
                >
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value} className="bg-white dark:bg-[#0b0f19] text-slate-900 dark:text-white">
                            {opt.label}
                        </option>
                    ))}
                </select>
                <div className="absolute right-3.5 pointer-events-none text-slate-500">
                    <ChevronDown size={16} />
                </div>
            </div>
            {error && (
                <p className="text-[10px] text-rose-450 font-medium">
                    {error}
                </p>
            )}
        </div>
    );
};

export default Select;
