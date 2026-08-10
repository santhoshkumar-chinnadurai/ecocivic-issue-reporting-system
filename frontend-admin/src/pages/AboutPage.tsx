import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowRight, Target, Award, Users, Compass, Cpu, Layers, ShieldCheck, HeartHandshake, Eye } from 'lucide-react';
import platformConfig from '../config/platformConfig';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import Button from '../components/ui/Button';

const AboutPage: React.FC = () => {
    const coreValues = [
        { title: 'Public Transparency', desc: 'Every ticket lifecycle step from submission to field crew resolution is cryptographically timestamped and publicly verifiable.', icon: Eye, color: 'text-blue-500 bg-blue-500/10 border-blue-500/20' },
        { title: 'Sub-3 Hour Dispatch', desc: 'AI-driven NLP auto-routes reports to ward department dispatches within minutes, slashing traditional bureaucratic latency.', icon: Target, color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' },
        { title: 'Citizen Empowerment', desc: 'Gamified reputation systems reward active community reporters with civic ranks, badges, and recognition.', icon: HeartHandshake, color: 'text-amber-500 bg-amber-500/10 border-amber-500/20' },
        { title: 'Spatial Precision', desc: 'PostGIS spatial vector coordinates map precise defect locations, enabling field crews to navigate directly to site targets.', icon: Compass, color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20' }
    ];

    const techPillars = [
        { name: 'AI NLP Classification Engine', desc: 'Neural language parser analyzes report text and images to categorize defect urgency and assign department tags.' },
        { name: 'PostGIS Spatial Routing', desc: 'High-precision geospatial index filters tickets by Ward boundary and dispatches nearest active maintenance crew.' },
        { name: 'Encrypted Audit Ledger', desc: 'Immutable transaction logs prevent unauthorized ticket deletion and ensure total municipal accountability.' }
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#030712] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300 flex flex-col justify-between">
            <Navbar />

            <main className="max-w-6xl mx-auto px-6 py-16 text-left space-y-16 animate-in fade-in duration-300 flex-1">
                
                {/* Header Banner */}
                <div className="space-y-4 max-w-3xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-600 dark:text-blue-400 text-[10px] font-extrabold uppercase tracking-widest">
                        Municipal Digital Transformation
                    </div>
                    <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
                        Pioneering Modern Civic Command Systems.
                    </h1>

                    <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                        {platformConfig.appName} is a next-generation civic triage portal. Built to bridge citizens, local ward officials, and maintenance crews with real-time AI automation and spatial intelligence.
                    </p>
                </div>

                {/* Dedicated Vision & Mission Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="panel-cyber-glass p-8 rounded-3xl space-y-4 border border-blue-500/20 shadow-xl bg-gradient-to-br from-blue-500/5 to-transparent">
                        <div className="h-12 w-12 rounded-2xl bg-blue-600/10 text-blue-600 dark:text-blue-400 border border-blue-500/30 flex items-center justify-center">
                            <Compass size={26} />
                        </div>
                        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">Our Vision</h2>
                        <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                            To establish every community as a benchmark smart city where public infrastructure hazards—such as potholes, water leaks, streetlight failures, and sanitation bottlenecks—are identified, triaged, and resolved collaboratively with zero administrative friction.
                        </p>
                    </div>

                    <div className="panel-cyber-glass p-8 rounded-3xl space-y-4 border border-emerald-500/20 shadow-xl bg-gradient-to-br from-emerald-500/5 to-transparent">
                        <div className="h-12 w-12 rounded-2xl bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                            <Target size={26} />
                        </div>
                        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">Our Mission</h2>
                        <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                            To empower every citizen with instant report logging tools, provide ward officials with automated AI triage and dispatch metrics, and furnish field workers with precise GPS-guided task assignments and cryptographic proof-of-work verification.
                        </p>
                    </div>
                </div>

                {/* Core Pillars */}
                <div className="space-y-8">
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Core Operational Pillars</h2>
                        <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">The foundational principles powering CivicConnect's municipal matrix.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {coreValues.map((val, idx) => {
                            const Icon = val.icon;
                            return (
                                <div key={idx} className="panel-cyber-glass p-6 rounded-2xl space-y-3 hover:border-blue-500/30 transition-all duration-200 shadow-md">
                                    <div className={`h-10 w-10 rounded-xl border flex items-center justify-center ${val.color}`}>
                                        <Icon size={20} />
                                    </div>
                                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">{val.title}</h3>
                                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">{val.desc}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Architecture Highlights */}
                <div className="panel-cyber-glass p-8 rounded-3xl space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 flex items-center justify-center">
                            <Cpu size={22} />
                        </div>
                        <div>
                            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Architectural Telemetry</h3>
                            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Engineered for high availability, fault tolerance, and spatial precision.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                        {techPillars.map((pillar, i) => (
                            <div key={i} className="p-4 bg-slate-100/60 dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">{pillar.name}</h4>
                                <p className="text-xs text-slate-600 dark:text-slate-400 leading-normal font-medium">{pillar.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Action CTA Banner */}
                <div className="p-8 rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex flex-col md:flex-row justify-between items-center gap-6 shadow-2xl">
                    <div className="space-y-1">
                        <h3 className="text-xl font-extrabold">Ready to make your neighborhood better?</h3>
                        <p className="text-xs text-blue-100 font-medium">Report an infrastructure defect or track ongoing repair dispatches today.</p>
                    </div>
                    <Link to="/login">
                        <Button variant="secondary" className="font-bold flex items-center gap-1.5 shrink-0 px-6 py-2.5">
                            Launch Console <ArrowRight size={16} />
                        </Button>
                    </Link>
                </div>

            </main>

            <Footer />
        </div>
    );
};

export default AboutPage;
