import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, ArrowRight, ShieldCheck, Activity, CheckCircle, Wrench, Sparkles, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import MapComponent from '../components/map/MapComponent';
import Button from '../components/ui/Button';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

const DYNAMIC_HERO_TAGS = [
    { label: "⚡ Live AI Auto-Routing Matrix Active", border: "border-blue-500/30", text: "text-blue-600 dark:text-blue-400", bg: "bg-blue-500/10" },
    { label: "🛡️ PostGIS Spatial GPS Telemetry Synced", border: "border-emerald-500/30", text: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-500/10" },
    { label: "🏆 1,480+ Municipal Defect Reports Triaged", border: "border-amber-500/30", text: "text-amber-600 dark:text-amber-400", bg: "bg-amber-500/10" },
    { label: "🚀 Average Field Dispatch Time: < 2.4 Hours", border: "border-indigo-500/30", text: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-500/10" }
];

const Landing: React.FC = () => {
    const navigate = useNavigate();
    const [liveCounter, setLiveCounter] = useState(148);
    const [activeTagIndex, setActiveTagIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setLiveCounter(prev => prev + Math.floor(Math.random() * 2));
        }, 8000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const tagTimer = setInterval(() => {
            setActiveTagIndex(prev => (prev + 1) % DYNAMIC_HERO_TAGS.length);
        }, 3500);
        return () => clearInterval(tagTimer);
    }, []);

    const currentTag = DYNAMIC_HERO_TAGS[activeTagIndex];

    const features = [
        { title: 'AI Incident Routing', desc: 'NLP-based categorization dispatches tickets to matching division queues.', icon: ShieldCheck },
        { title: 'Field Crew Telemetries', desc: 'Real-time GPS coordinates locate active repairs instantly.', icon: Wrench },
        { title: 'Audit Transparency', desc: 'Cryptographic ledger logs verify status transitions safely.', icon: Activity },
        { title: 'Gamified Reputations', desc: 'Earn points and unlock active neighbor badges for community reporting.', icon: CheckCircle }
    ];

    const portals = [
        {
            title: 'Citizen Core',
            desc: 'Log street defects, attach photo evidence, and inspect resolution timelines.',
            link: '/login',
            btnLabel: 'Citizen Sign In'
        },
        {
            title: 'Dispatch Portal',
            desc: 'Triage dispatches, assign crew teams, and monitor department performance.',
            link: '/government/login',
            btnLabel: 'Government Gate'
        },
        {
            title: 'Root Matrix',
            desc: 'Manage credentials, switch role parameters, and review system audit keys.',
            link: '/admin/login',
            btnLabel: 'Admin Console'
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#030712] text-slate-900 dark:text-slate-100 font-sans selection:bg-blue-500/20 overflow-x-hidden relative transition-colors duration-300">
            
            {/* Holographic City Grid Mesh Background */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-25">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-blue-500/10 to-indigo-500/10 rounded-full blur-[140px]"></div>
                {/* Glowing Nodes */}
                <span className="absolute top-1/3 left-1/4 h-2.5 w-2.5 rounded-full bg-blue-500 animate-ping"></span>
                <span className="absolute top-1/2 left-3/4 h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping [animation-delay:1.5s]"></span>
            </div>

            {/* Header navbar */}
            <Navbar />

            {/* Main Area */}
            <main className="relative z-10">
                {/* Hero Section */}
                <section className="max-w-7xl mx-auto px-6 pt-16 pb-20 flex flex-col lg:flex-row items-center justify-between gap-12 text-left">
                    <div className="w-full lg:w-1/2 space-y-6">
                        
                        {/* Dynamic Hero Tag Animation */}
                        <div className="h-8 flex items-center">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTagIndex}
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    transition={{ duration: 0.3 }}
                                    className={`inline-flex items-center gap-2 px-3.5 py-1.5 border ${currentTag.border} ${currentTag.bg} ${currentTag.text} rounded-full text-[11px] font-extrabold uppercase tracking-wider shadow-sm`}
                                >
                                    <Sparkles size={12} className="animate-spin" />
                                    <span>{currentTag.label}</span>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-slate-900 dark:text-white">
                            Better Cities.<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-blue-400 dark:to-indigo-400 text-neon-blue">Collaboratively Built.</span>
                        </h1>
                        <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                            Report neighborhood utility defects, verify resolution timelines, and dispatch public works assets instantly on Coimbatore's digital command dashboard.
                        </p>
                        <div className="flex flex-wrap items-center gap-4 pt-2">
                            <Button size="lg" className="flex items-center gap-2 shadow-[0_0_15px_rgba(59,130,246,0.25)]" onClick={() => navigate('/login')}>
                                File Report <ArrowRight size={16} />
                            </Button>
                            <a href="#map-preview">
                                <Button size="lg" variant="outline" className="flex items-center gap-1.5 font-bold">
                                    <MapPin size={16} /> Live Queue Map
                                </Button>
                            </a>
                        </div>
                    </div>

                    {/* HUD metrics card */}
                    <div className="w-full lg:w-5/12 flex justify-center">
                        <div className="w-full max-w-sm panel-cyber-glass p-6 text-left shadow-2xl">
                            <div className="flex justify-between items-center pb-4 border-b border-slate-200 dark:border-slate-900 mb-6">
                                <div className="flex items-center gap-2">
                                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Live Telemetries</span>
                                </div>
                                <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">COIMBATORE_V1</span>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold">Logged Incidents</span>
                                    <span className="block text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1 text-neon-blue">{liveCounter}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200 dark:border-slate-900 text-xs font-bold">
                                    <div>
                                        <span className="text-[9px] text-slate-500 dark:text-slate-400 uppercase tracking-widest block font-bold">Resolution Index</span>
                                        <span className="block text-lg text-emerald-600 dark:text-emerald-400 font-extrabold mt-1 text-neon-emerald">94%</span>
                                    </div>
                                    <div>
                                        <span className="text-[9px] text-slate-500 dark:text-slate-400 uppercase tracking-widest block font-bold">Avg Dispatch</span>
                                        <span className="block text-lg text-slate-900 dark:text-white font-extrabold mt-1">2.4 Days</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Portal access gateways */}
                <section className="bg-slate-100/60 dark:bg-slate-955/40 border-y border-slate-200 dark:border-slate-900 py-16 text-left">
                    <div className="max-w-7xl mx-auto px-6 space-y-12">
                        <div className="text-center max-w-xl mx-auto space-y-2">
                            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Access Portals</h2>
                            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Verify credentials and mount database gates.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="portals">
                            {portals.map((p, i) => (
                                <div key={i} className="panel-cyber-glass p-6 flex flex-col justify-between hover:border-blue-500/40 transition-all duration-200 h-64 shadow-lg bg-white/60 dark:bg-slate-950/20 group">
                                    <div className="space-y-3">
                                        <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{p.title}</h3>
                                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">{p.desc}</p>
                                    </div>
                                    <Button className="w-full text-xs font-bold shadow-[0_0_10px_rgba(59,130,246,0.1)]" onClick={() => navigate(p.link)}>
                                        {p.btnLabel}
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="max-w-7xl mx-auto px-6 py-20 text-left space-y-12" id="features">
                    <div className="max-w-xl mx-auto text-center space-y-2">
                        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">High Integrity Matrix</h2>
                        <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Equipped with NLP classifiers, location telemetry, and ledgers.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feat, i) => {
                            const Icon = feat.icon;
                            return (
                                <div key={i} className="space-y-3 p-5 border border-slate-200 dark:border-slate-800 rounded-2xl hover:bg-slate-100/60 dark:hover:bg-slate-950/60 transition-all duration-200 panel-cyber-glass">
                                    <div className="h-10 w-10 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-500 flex items-center justify-center">
                                        <Icon size={20} />
                                    </div>
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">{feat.title}</h3>
                                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-normal font-medium">{feat.desc}</p>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Live map preview section */}
                <section className="max-w-7xl mx-auto px-6 pb-24 text-left space-y-6" id="map-preview">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Active Queue Map</h2>
                            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 font-medium font-sans">Geolocations of active complaints logged in Coimbatore municipal region.</p>
                        </div>
                        <Button size="sm" onClick={() => navigate('/login')} className="font-bold flex items-center gap-1 shadow-[0_0_10px_rgba(59,130,246,0.15)]">
                            Report Incident <ArrowRight size={14} />
                        </Button>
                    </div>
                    <MapComponent />
                </section>
            </main>
            
            {/* Municipal footer */}
            <Footer />
        </div>
    );
};

export default Landing;
