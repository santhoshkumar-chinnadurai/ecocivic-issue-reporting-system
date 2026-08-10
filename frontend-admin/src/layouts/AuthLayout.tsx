import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Building2, CheckCircle2, UserCheck, HardHat, ShieldCheck, ArrowLeft, Lock } from 'lucide-react';
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

    const getPortalConfig = () => {
        if (location.pathname === '/admin/login') {
            return {
                badge: 'System Administration',
                title: 'Platform Governance & Control',
                description: 'Secure management portal for user access provisioning, security policies, and system audit ledgers.',
                icon: ShieldCheck,
                stats: [
                    { label: 'Access Level', value: 'Administrator' },
                    { label: 'Encryption', value: '256-Bit TLS' },
                    { label: 'Audit Trail', value: 'Active' }
                ],
                bullets: [
                    'User access control & role permission management',
                    'System security configuration & policy controls',
                    'Comprehensive immutable system audit ledgers'
                ]
            };
        }
        if (location.pathname === '/government/login') {
            return {
                badge: 'Municipal Official Portal',
                title: 'Operations & Issue Triage',
                description: 'Official portal for reviewing citizen reports, assigning field teams, and monitoring SLA performance.',
                icon: Building2,
                stats: [
                    { label: 'Operations', value: 'Active' },
                    { label: 'Department Triage', value: 'Real-Time' },
                    { label: 'Verification', value: 'Required' }
                ],
                bullets: [
                    'Departmental issue triage & status management',
                    'Direct worker dispatch & task assignment',
                    'Resolution review & SLA performance tracking'
                ]
            };
        }
        if (location.pathname === '/worker/login') {
            return {
                badge: 'Field Operations Portal',
                title: 'Maintenance Crew Management',
                description: 'Dedicated workspace for field personnel to manage task assignments, update status, and submit proof of completion.',
                icon: HardHat,
                stats: [
                    { label: 'Field Status', value: 'Operational' },
                    { label: 'Proof Upload', value: 'Mandatory' },
                    { label: 'Location Mesh', value: 'GPS Enabled' }
                ],
                bullets: [
                    'Priority task queue & location details',
                    'Real-time status updates from dispatch to resolution',
                    'Photo verification proof submission system'
                ]
            };
        }
        return {
            badge: 'Citizen Service Portal',
            title: 'Municipal Civic Reporting',
            description: 'Public portal for citizens to report infrastructure defects, track repair progress, and improve local community services.',
            icon: UserCheck,
            stats: [
                { label: 'Service Network', value: 'Connected' },
                { label: 'Issue Tracking', value: 'Real-Time' },
                { label: 'Status Updates', value: 'Automated' }
            ],
            bullets: [
                'Direct report submission with location and photo evidence',
                'Real-time status tracking from submission to resolution',
                'Transparent municipal response workflow'
            ]
        };
    };

    const config = getPortalConfig();
    const HeaderIcon = config.icon;

    return (
        <div className="min-h-screen bg-slate-100 dark:bg-[#030712] text-slate-900 dark:text-slate-100 flex items-center justify-center p-4 sm:p-6 transition-colors duration-300 relative font-sans overflow-x-hidden">
            
            {/* Top Navigation Bar */}
            <header className="absolute top-0 left-0 right-0 h-20 max-w-7xl mx-auto px-6 flex justify-between items-center z-20">
                <Link to="/" className="flex items-center gap-3 group text-left">
                    <div className="h-10 w-10 bg-slate-900 dark:bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-sm border border-slate-700 dark:border-blue-400/30 group-hover:scale-105 transition-transform">
                        <Building2 className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-base font-black tracking-tight text-slate-900 dark:text-white uppercase leading-none">{platformConfig.appName}</span>
                        <span className="text-[9px] font-mono font-bold text-slate-500 dark:text-slate-400 tracking-wider uppercase mt-0.5">Municipal Civic Platform</span>
                    </div>
                </Link>

                <div className="flex items-center gap-4">
                    <ThemeToggle />
                    <Link to="/" className="text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-1.5 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
                        <ArrowLeft size={14} /> Home Page
                    </Link>
                </div>
            </header>

            {/* Main Split-Screen Container */}
            <div className="w-full max-w-5xl bg-white dark:bg-[#090d16] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 relative z-10 my-24">
                
                {/* Left Informational Panel */}
                <div className="lg:col-span-5 p-8 lg:p-10 bg-slate-50 dark:bg-slate-950/70 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between text-left relative overflow-hidden">
                    
                    <div className="space-y-6 relative z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900/5 dark:bg-blue-500/10 border border-slate-900/10 dark:border-blue-500/20 text-slate-800 dark:text-blue-400 rounded-lg text-[11px] font-extrabold uppercase tracking-wider">
                            <HeaderIcon size={14} /> {config.badge}
                        </div>

                        <div className="space-y-2">
                            <h2 className="text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
                                {config.title}
                            </h2>
                            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                                {config.description}
                            </p>
                        </div>

                        {/* Bullet Highlights */}
                        <div className="space-y-3 pt-2">
                            {config.bullets.map((bullet, idx) => (
                                <div key={idx} className="flex items-start gap-3 text-xs text-slate-700 dark:text-slate-300 font-medium leading-normal">
                                    <CheckCircle2 size={16} className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                                    <span>{bullet}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Stats Footer */}
                    <div className="pt-8 border-t border-slate-200 dark:border-slate-800/80 grid grid-cols-3 gap-2 relative z-10">
                        {config.stats.map((st, i) => (
                            <div key={i} className="space-y-0.5">
                                <span className="block text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{st.label}</span>
                                <span className="block text-xs font-black text-slate-900 dark:text-white font-mono">{st.value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Form Container */}
                <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6 bg-white dark:bg-[#090d16]">
                    
                    {/* Role Clearance Segmented Control */}
                    <div className="space-y-2">
                        <span className="block text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider text-left">
                            Portal Role Selection
                        </span>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-bold">
                            {portals.map(p => {
                                const isActive = location.pathname === p.path || (p.path === '/login' && location.pathname === '/signup');
                                const TabIcon = p.icon;
                                return (
                                    <Link
                                        key={p.path}
                                        to={p.path}
                                        className={`py-2 px-2.5 rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 truncate ${
                                            isActive
                                                ? 'bg-slate-900 dark:bg-blue-600 text-white shadow-sm font-extrabold'
                                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-800/50'
                                        }`}
                                    >
                                        <TabIcon size={14} />
                                        <span className="truncate">{p.label}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* Form Component Slot */}
                    <div className="flex-1">
                        {children}
                    </div>

                    {/* Security & System Footer */}
                    <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center text-[10px] font-mono text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1.5 font-bold">
                            <Lock size={12} className="text-emerald-500" />
                            256-Bit SSL Encrypted Session
                        </span>
                        <span>Municipal Portal v3.0</span>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
