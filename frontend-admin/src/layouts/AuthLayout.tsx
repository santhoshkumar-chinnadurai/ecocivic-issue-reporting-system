import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Building2, UserCheck, HardHat, ShieldCheck, ArrowLeft, Lock } from 'lucide-react';
import ThemeToggle from '../components/ui/ThemeToggle';
import platformConfig from '../config/platformConfig';

interface AuthLayoutProps {
    children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
    const location = useLocation();

    const portals = [
        { label: 'Citizen', path: '/login', icon: UserCheck },
        { label: 'Official', path: '/government/login', icon: Building2 },
        { label: 'Worker', path: '/worker/login', icon: HardHat },
        { label: 'Admin', path: '/admin/login', icon: ShieldCheck }
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#030712] text-slate-900 dark:text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 transition-colors duration-300 relative font-sans overflow-x-hidden">
            
            {/* Top Navigation Bar */}
            <header className="absolute top-0 left-0 right-0 h-20 max-w-7xl mx-auto px-6 flex justify-between items-center z-20">
                <Link to="/" className="flex items-center gap-3 group text-left">
                    <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-md border border-blue-400/30 group-hover:scale-105 transition-transform">
                        <Building2 className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-base font-black tracking-tight text-slate-900 dark:text-white uppercase leading-none">{platformConfig.appName}</span>
                        <span className="text-[9px] font-mono font-bold text-blue-600 dark:text-blue-400 tracking-wider uppercase mt-0.5">Municipal Civic Platform</span>
                    </div>
                </Link>

                <div className="flex items-center gap-4">
                    <ThemeToggle />
                    <Link to="/" className="text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-1.5 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
                        <ArrowLeft size={14} /> Home Page
                    </Link>
                </div>
            </header>

            {/* Single Clean Centered Card Container */}
            <div className="w-full max-w-md bg-white dark:bg-[#090d16] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 relative z-10 my-20">
                
                {/* Role Clearance Switcher */}
                <div>
                    <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-bold">
                        {portals.map(p => {
                            const isActive = location.pathname === p.path || (p.path === '/login' && location.pathname === '/signup');
                            const TabIcon = p.icon;
                            return (
                                <Link
                                    key={p.path}
                                    to={p.path}
                                    className={`py-2 px-1.5 rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-center gap-1 truncate ${
                                        isActive
                                            ? 'bg-blue-600 text-white shadow-sm font-extrabold'
                                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-800/50'
                                    }`}
                                >
                                    <TabIcon size={14} />
                                    <span className="truncate hidden sm:inline">{p.label}</span>
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* Form Component Slot */}
                <div>
                    {children}
                </div>

                {/* Security Footer */}
                <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center text-[10px] font-mono text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1.5 font-bold">
                        <Lock size={12} className="text-emerald-500" />
                        256-Bit Encrypted Session
                    </span>
                    <span>Municipal Portal v3.0</span>
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
