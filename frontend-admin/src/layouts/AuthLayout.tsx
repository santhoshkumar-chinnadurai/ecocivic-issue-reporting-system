import React from 'react';
import { Shield, Sparkles, CheckCircle2, Zap, Activity, Users, Building2, Terminal, Radio, UserCheck, HardHat } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from '../components/ui/ThemeToggle';

interface AuthLayoutProps {
    children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
    const location = useLocation();

    const portals = [
        { label: 'Citizen Portal', path: '/login', role: 'CITIZEN', icon: UserCheck, activeGlow: 'bg-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.4)] text-white' },
        { label: 'Dispatch Gate', path: '/government/login', role: 'GOV', icon: HardHat, activeGlow: 'bg-amber-600 shadow-[0_0_20px_rgba(217,119,6,0.4)] text-white' },
        { label: 'Root Admin', path: '/admin/login', role: 'ADMIN', icon: Terminal, activeGlow: 'bg-rose-600 shadow-[0_0_20px_rgba(225,29,72,0.4)] text-white' }
    ];

    const getPortalHeroDetails = () => {
        if (location.pathname.includes('/government')) {
            return {
                badge: 'OFFICIAL & CREW DISPATCH',
                title: 'Municipal Operations Command Matrix',
                description: 'Real-time incident triage, ward crew allocation, and PostGIS field vector dispatches.',
                icon: Building2,
                accentGradient: 'from-amber-500/25 via-orange-500/15 to-transparent',
                borderColor: 'border-amber-500/40',
                stats: [
                    { label: 'Active Wards', value: '5 Zones' },
                    { label: 'Avg Dispatch SLA', value: '< 2.4 hrs' },
                    { label: 'Crew Verification', value: '100% Photo' }
                ],
                bullets: [
                    'Live ward queue triage and incident assignment',
                    'Real-time field crew GPS map tracking',
                    'Direct citizen communication channel'
                ]
            };
        }
        if (location.pathname.includes('/admin')) {
            return {
                badge: 'ROOT LEVEL 0 CLEARANCE',
                title: 'System Kernel & Decryption Terminal',
                description: 'Master administrative clearance for telemetry policies, spatial matrices, and audit ledgers.',
                icon: Terminal,
                accentGradient: 'from-rose-500/25 via-purple-500/15 to-transparent',
                borderColor: 'border-rose-500/40',
                stats: [
                    { label: 'Security Ledger', value: 'Encrypted' },
                    { label: 'API Telemetry', value: '99.9% Up' },
                    { label: 'Audit Logs', value: 'Real-Time' }
                ],
                bullets: [
                    'Root system policy & AI auto-routing controls',
                    'Global user accounts & role clearance manager',
                    'Comprehensive immutable audit transaction logs'
                ]
            };
        }
        // Default Citizen
        return {
            badge: 'SMART CITY CITIZEN NETWORK',
            title: 'Empowering Coimbatore Neighborhoods',
            description: 'Report civic issues, track field crew progress in real time, and earn reputation XP points.',
            icon: Users,
            accentGradient: 'from-blue-500/25 via-cyan-500/15 to-transparent',
            borderColor: 'border-blue-500/40',
            stats: [
                { label: 'Civic Reports', value: '1,480+' },
                { label: 'Active Citizens', value: '25,000+' },
                { label: 'Resolution Rate', value: '94.8%' }
            ],
            bullets: [
                'Instant AI auto-routing to responsible municipal division',
                'Live photo evidence & timeline progress tracking',
                'XP leaderboard rankings and civic hero badges'
            ]
        };
    };

    const hero = getPortalHeroDetails();
    const HeroIcon = hero.icon;

    return (
        <div className="min-h-screen relative flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-slate-100 via-slate-50 to-blue-50/40 dark:from-[#030712] dark:via-[#090d16] dark:to-[#030712] text-slate-900 dark:text-slate-100 font-sans p-4 sm:p-6 selection:bg-blue-500/20 transition-colors duration-300">
            
            {/* Ambient Animated Futuristic Glowing Background Elements */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-40 dark:opacity-60">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
                <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-blue-500/20 dark:bg-blue-600/20 rounded-full blur-[150px] animate-pulse"></div>
                <div className="absolute -bottom-32 -right-32 w-[600px] h-[600px] bg-indigo-500/20 dark:bg-indigo-600/20 rounded-full blur-[150px]"></div>
            </div>

            {/* Top Navigation Header */}
            <div className="w-full max-w-5xl flex justify-between items-center mb-6 z-20">
                <Link to="/" className="flex items-center space-x-3 group">
                    <div className="h-11 w-11 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-500/30 border border-blue-400/40 group-hover:scale-105 transition-all duration-300">
                        <Shield className="h-6 w-6" />
                    </div>
                    <div className="flex flex-col text-left">
                        <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white uppercase leading-none">CivicConnect</span>
                        <span className="text-[10px] font-mono font-bold text-blue-600 dark:text-blue-400 tracking-widest pt-0.5">SMART MUNICIPAL GATEWAY</span>
                    </div>
                </Link>
                <div className="flex items-center gap-3">
                    <ThemeToggle />
                </div>
            </div>

            {/* Main Dual-Column Futuristic Gateway Card */}
            <div className="w-full max-w-5xl bg-white/90 dark:bg-[#090d16]/90 border border-slate-200/90 dark:border-slate-800/90 rounded-3xl overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.15)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] backdrop-blur-2xl relative z-10 transition-all duration-300 grid grid-cols-1 lg:grid-cols-12">
                
                {/* Left Hero Infographic Panel */}
                <div className="lg:col-span-5 p-8 lg:p-10 bg-slate-900 dark:bg-[#060814] text-white relative flex flex-col justify-between overflow-hidden border-b lg:border-b-0 lg:border-r border-slate-800 text-left">
                    {/* Background Radial Glow */}
                    <div className={`absolute top-0 right-0 w-96 h-96 bg-gradient-to-br ${hero.accentGradient} rounded-full blur-3xl pointer-events-none`}></div>

                    <div className="space-y-6 relative z-10">
                        {/* Hero Badge */}
                        <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border ${hero.borderColor} text-[10px] font-black font-mono tracking-widest text-blue-400 uppercase`}>
                            <HeroIcon size={14} className="text-blue-400" />
                            <span>{hero.badge}</span>
                        </div>

                        {/* Title & Subtitle */}
                        <div>
                            <h2 className="text-2xl lg:text-3xl font-black tracking-tight text-white leading-tight">
                                {hero.title}
                            </h2>
                            <p className="text-xs text-slate-300 mt-2.5 leading-relaxed font-medium">
                                {hero.description}
                            </p>
                        </div>

                        {/* Bullet points */}
                        <div className="space-y-3 pt-2">
                            {hero.bullets.map((b, idx) => (
                                <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-200 font-medium">
                                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                                    <span>{b}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Telemetry Stats Grid */}
                    <div className="pt-8 relative z-10">
                        <div className="grid grid-cols-3 gap-2 p-3.5 rounded-2xl bg-white/10 dark:bg-white/5 backdrop-blur-md border border-white/15 text-center">
                            {hero.stats.map((s, idx) => (
                                <div key={idx} className="space-y-0.5">
                                    <span className="block text-[9px] font-mono text-slate-300 dark:text-slate-400 uppercase tracking-wider">{s.label}</span>
                                    <span className="block text-sm font-black text-white">{s.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Interactive Form Container */}
                <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6 bg-slate-50/60 dark:bg-slate-950/40">
                    
                    {/* Next-Gen Interactive Role Switcher Tabs */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="block text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest text-left">
                                Select Portal Clearance
                            </span>
                            <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                <Radio size={12} className="animate-pulse" /> Node Active
                            </span>
                        </div>

                        <div className="grid grid-cols-3 gap-2 p-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm text-xs font-bold">
                            {portals.map(p => {
                                const isActive = location.pathname === p.path || (p.path === '/login' && location.pathname === '/signup');
                                const TabIcon = p.icon;
                                return (
                                    <Link
                                        key={p.path}
                                        to={p.path}
                                        className={`py-2.5 px-2 rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 truncate ${
                                            isActive
                                                ? p.activeGlow + ' font-black scale-[1.02]'
                                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                                        }`}
                                    >
                                        <TabIcon size={14} />
                                        <span className="truncate">{p.label}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* Page Specific Auth Form */}
                    <div className="flex-1">
                        {children}
                    </div>

                    {/* Telemetry Status Footer */}
                    <div className="pt-4 border-t border-slate-200 dark:border-slate-800/80 flex justify-between items-center text-[10px] font-mono text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1.5 font-bold">
                            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
                            Coimbatore Ward Mesh Online
                        </span>
                        <span>Node #CBE-S01 • v3.4</span>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
