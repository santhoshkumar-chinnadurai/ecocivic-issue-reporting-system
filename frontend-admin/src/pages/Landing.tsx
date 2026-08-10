import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Shield, ArrowRight, Search, MapPin, CheckCircle, AlertCircle, 
    Clock, Building, User, Users, FileText, Camera, ChevronRight, 
    Lightbulb, Trash2, Droplets, CloudRain, Building2, ShieldAlert, 
    Trees, Sparkles, Wrench, ShieldCheck, Activity, BarChart3, Lock
} from 'lucide-react';
import MapComponent from '../components/map/MapComponent';
import Button from '../components/ui/Button';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import platformConfig from '../config/platformConfig';
import api from '../api/axios';

const Landing: React.FC = () => {
    const navigate = useNavigate();
    const [liveCounter, setLiveCounter] = useState<number>(0);
    const [activePreviewTab, setActivePreviewTab] = useState<'map' | 'issues' | 'timeline'>('map');

    useEffect(() => {
        api.get('/analytics/dashboard-stats')
            .then(res => {
                setLiveCounter(res.data.total || 0);
            })
            .catch(() => setLiveCounter(0));
    }, []);

    const lifecycleSteps = [
        { title: 'Report', desc: 'Citizen submits report with GPS and photo evidence', icon: FileText },
        { title: 'Review', desc: 'Municipal triage team verifies issue details', icon: CheckCircle },
        { title: 'Assign', desc: 'Dispatched to specialized department crew', icon: Users },
        { title: 'Resolve', desc: 'Field team completes repairs and uploads proof', icon: Wrench },
        { title: 'Verify', desc: 'Official confirms work and closes incident ticket', icon: ShieldCheck }
    ];

    const howItWorksSteps = [
        { 
            number: '01', 
            title: 'Report', 
            desc: 'Submit a civic issue with description, category, location and evidence.',
            icon: FileText
        },
        { 
            number: '02', 
            title: 'Review', 
            desc: 'The responsible authority reviews the submitted report.',
            icon: Search
        },
        { 
            number: '03', 
            title: 'Assign', 
            desc: 'The issue is assigned to the appropriate official or worker.',
            icon: Users
        },
        { 
            number: '04', 
            title: 'Resolve', 
            desc: 'The responsible team completes the work.',
            icon: Wrench
        },
        { 
            number: '05', 
            title: 'Verify', 
            desc: 'Completion evidence is reviewed and the issue is resolved.',
            icon: ShieldCheck
        }
    ];

    const issueCategories = [
        { title: 'Roads & Potholes', desc: 'Potholes, asphalt damage, and road erosion', icon: AlertCircle },
        { title: 'Street Lighting', desc: 'Non-functional streetlights and wiring faults', icon: Lightbulb },
        { title: 'Waste Management', desc: 'Uncollected garbage, illegal dumps, and overflow', icon: Trash2 },
        { title: 'Water Supply', desc: 'Pipe leaks, water main breaks, and supply outages', icon: Droplets },
        { title: 'Drainage', desc: 'Blocked storm drains and flooding hazards', icon: CloudRain },
        { title: 'Public Infrastructure', desc: 'Damaged sidewalks, benches, and public property', icon: Building2 },
        { title: 'Traffic', desc: 'Signal malfunctions and missing road signage', icon: ShieldAlert },
        { title: 'Parks & Public Spaces', desc: 'Overgrown trees, broken park equipment, and litter', icon: Trees },
        { title: 'Sanitation', desc: 'Public restroom defects and sanitation hazards', icon: Sparkles },
        { title: 'Other Hazards', desc: 'General civic hazards requiring municipal triage', icon: FileText }
    ];

    const platformFeatures = [
        {
            title: 'Easy Reporting',
            desc: 'Report problems with accurate location tagging and supporting photo evidence.',
            icon: Camera
        },
        {
            title: 'Real-Time Tracking',
            desc: 'Follow the exact status and progress of submitted issues in real time.',
            icon: Activity
        },
        {
            title: 'Transparent Workflow',
            desc: 'See how issues move from initial report to official verification.',
            icon: ShieldCheck
        },
        {
            title: 'Evidence-Based Resolution',
            desc: 'Field workers upload photo proof before issues are officially closed.',
            icon: CheckCircle
        },
        {
            title: 'Role-Based Management',
            desc: 'Citizens, officials, workers and administrators have dedicated, secure consoles.',
            icon: Lock
        },
        {
            title: 'Data-Driven Operations',
            desc: 'Authorities can monitor issue trends and municipal department response performance.',
            icon: BarChart3
        }
    ];

    const timelineSteps = [
        { status: 'Reported', desc: 'Logged by citizen', time: 'Day 1' },
        { status: 'Reviewed', desc: 'Triaged by officer', time: 'Day 1' },
        { status: 'Assigned', desc: 'Dispatched to crew', time: 'Day 2' },
        { status: 'In Progress', desc: 'Field work active', time: 'Day 2' },
        { status: 'Verified', desc: 'Proof photo checked', time: 'Day 3' },
        { status: 'Resolved', desc: 'Case officially closed', time: 'Day 3' }
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#030712] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300 flex flex-col justify-between overflow-x-hidden">
            <Navbar />

            <main className="flex-1 space-y-24 pb-20">
                
                {/* 1. Hero Section */}
                <section className="max-w-7xl mx-auto px-6 pt-16 lg:pt-24 pb-12 text-center">
                    <div className="max-w-3xl mx-auto space-y-6 flex flex-col items-center">
                        
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-extrabold uppercase tracking-wider">
                            <Building2 size={14} />
                            <span>Municipal Civic Issue Triage Platform</span>
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-slate-900 dark:text-white">
                            Report Issues.<br />
                            Track Progress.<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                                Improve Your Community.
                            </span>
                        </h1>

                        <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed font-medium max-w-xl mx-auto">
                            Report civic problems directly to the appropriate authorities, follow their progress, and help build cleaner, safer and better communities.
                        </p>

                        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                            <Button 
                                size="lg" 
                                className="flex items-center gap-2 rounded-2xl py-3.5 px-6 font-extrabold shadow-md"
                                onClick={() => navigate('/login')}
                            >
                                Report an Issue <ArrowRight size={16} />
                            </Button>
                            <a href="#map-preview">
                                <Button 
                                    size="lg" 
                                    variant="outline" 
                                    className="flex items-center gap-2 rounded-2xl py-3.5 px-6 font-extrabold"
                                >
                                    <Search size={16} /> Track an Issue
                                </Button>
                            </a>
                        </div>
                    </div>
                </section>

                {/* 2. Trust Indicators / Platform Lifecycle Flow */}
                <section className="bg-slate-100/60 dark:bg-slate-950/40 border-y border-slate-200 dark:border-slate-800 py-12 text-left">
                    <div className="max-w-7xl mx-auto px-6 space-y-8">
                        <div className="text-center max-w-xl mx-auto">
                            <h2 className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                                One platform for the complete civic issue lifecycle
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                            {lifecycleSteps.map((step, idx) => {
                                const Icon = step.icon;
                                return (
                                    <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-2 shadow-sm">
                                        <div className="flex items-center gap-2">
                                            <div className="h-8 w-8 rounded-xl bg-blue-600/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 flex items-center justify-center">
                                                <Icon size={16} />
                                            </div>
                                            <span className="text-xs font-extrabold uppercase text-slate-900 dark:text-white">{step.title}</span>
                                        </div>
                                        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{step.desc}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* 3. How It Works (5 Clear Steps) */}
                <section className="max-w-7xl mx-auto px-6 text-left space-y-12" id="how-it-works">
                    <div className="text-center max-w-xl mx-auto space-y-2">
                        <h2 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                            How It Works
                        </h2>
                        <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                            A simple, transparent 5-step process connecting citizens directly with field crews.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                        {howItWorksSteps.map((step, idx) => {
                            const Icon = step.icon;
                            return (
                                <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm relative text-left">
                                    <div className="flex items-center justify-between">
                                        <span className="text-2xl font-black font-mono text-blue-600 dark:text-blue-400">{step.number}</span>
                                        <div className="h-9 w-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center">
                                            <Icon size={18} />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase">{step.title}</h3>
                                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">{step.desc}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* 4. Issue Categories */}
                <section className="max-w-7xl mx-auto px-6 text-left space-y-12">
                    <div className="text-center max-w-xl mx-auto space-y-2">
                        <h2 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                            Issue Categories
                        </h2>
                        <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                            Categorize infrastructure defects for immediate department dispatch.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                        {issueCategories.map((cat, idx) => {
                            const Icon = cat.icon;
                            return (
                                <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:border-blue-500/40 transition-all space-y-3 group shadow-sm flex flex-col justify-between">
                                    <div className="space-y-2">
                                        <div className="h-9 w-9 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                                            <Icon size={18} />
                                        </div>
                                        <h3 className="text-xs font-extrabold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                            {cat.title}
                                        </h3>
                                        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-normal">
                                            {cat.desc}
                                        </p>
                                    </div>
                                    <div className="pt-2 flex items-center text-[10px] font-bold text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span>Report Category</span>
                                        <ChevronRight size={12} className="ml-1" />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* 5. Platform Features */}
                <section className="bg-slate-100/60 dark:bg-slate-950/40 border-y border-slate-200 dark:border-slate-800 py-16 text-left" id="features">
                    <div className="max-w-7xl mx-auto px-6 space-y-12">
                        <div className="text-center max-w-xl mx-auto space-y-2">
                            <h2 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                                Built for Operational Excellence
                            </h2>
                            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                                Powerful tools for citizens, officials, field crews, and administrators.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {platformFeatures.map((feat, idx) => {
                                const Icon = feat.icon;
                                return (
                                    <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-3 shadow-sm">
                                        <div className="h-10 w-10 bg-blue-600/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 rounded-2xl flex items-center justify-center">
                                            <Icon size={20} />
                                        </div>
                                        <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">{feat.title}</h3>
                                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">{feat.desc}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* 6. Product Preview (Interactive Dashboard Section) */}
                <section className="max-w-7xl mx-auto px-6 text-left space-y-8">
                    <div className="text-center max-w-xl mx-auto space-y-2">
                        <h2 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                            Interactive Operational Console
                        </h2>
                        <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                            Preview the unified municipal issue management interface.
                        </p>
                    </div>

                    <div className="bg-white dark:bg-[#090d16] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
                        
                        {/* Tab selector */}
                        <div className="flex justify-center border-b border-slate-200 dark:border-slate-800 pb-4">
                            <div className="inline-flex p-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-bold gap-1">
                                <button
                                    onClick={() => setActivePreviewTab('map')}
                                    className={`px-4 py-2 rounded-xl transition-colors cursor-pointer ${
                                        activePreviewTab === 'map' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'
                                    }`}
                                >
                                    Spatial Queue Map
                                </button>
                                <button
                                    onClick={() => setActivePreviewTab('issues')}
                                    className={`px-4 py-2 rounded-xl transition-colors cursor-pointer ${
                                        activePreviewTab === 'issues' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'
                                    }`}
                                >
                                    Incident Queue
                                </button>
                                <button
                                    onClick={() => setActivePreviewTab('timeline')}
                                    className={`px-4 py-2 rounded-xl transition-colors cursor-pointer ${
                                        activePreviewTab === 'timeline' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'
                                    }`}
                                >
                                    Accountability Timeline
                                </button>
                            </div>
                        </div>

                        {/* Content Preview based on tab */}
                        {activePreviewTab === 'map' && (
                            <div className="h-96 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800" id="map-preview">
                                <MapComponent />
                            </div>
                        )}

                        {activePreviewTab === 'issues' && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="p-5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-black text-slate-900 dark:text-white">Water Main Leak</span>
                                        <span className="px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 rounded text-[10px] font-extrabold">OPEN</span>
                                    </div>
                                    <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Water pipe break reported on Main Street.</p>
                                    <div className="text-[10px] text-slate-500 font-mono">ID: #REP-8821 • Priority: High</div>
                                </div>

                                <div className="p-5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-black text-slate-900 dark:text-white">Uncollected Waste</span>
                                        <span className="px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 rounded text-[10px] font-extrabold">IN PROGRESS</span>
                                    </div>
                                    <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Waste truck dispatched to site.</p>
                                    <div className="text-[10px] text-slate-500 font-mono">ID: #REP-8820 • Priority: Medium</div>
                                </div>

                                <div className="p-5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-black text-slate-900 dark:text-white">Streetlight Out</span>
                                        <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded text-[10px] font-extrabold">RESOLVED</span>
                                    </div>
                                    <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Bulb replaced and proof verified.</p>
                                    <div className="text-[10px] text-slate-500 font-mono">ID: #REP-8819 • Priority: Normal</div>
                                </div>
                            </div>
                        )}

                        {activePreviewTab === 'timeline' && (
                            <div className="p-6 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4">
                                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                                    Report Lifecycle Progression
                                </h3>
                                <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
                                    {timelineSteps.map((ts, idx) => (
                                        <div key={idx} className="p-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1 text-center">
                                            <span className="text-[10px] font-mono text-blue-600 dark:text-blue-400 font-bold block">{ts.time}</span>
                                            <span className="text-xs font-extrabold block text-slate-900 dark:text-white">{ts.status}</span>
                                            <span className="text-[10px] text-slate-500 block font-medium">{ts.desc}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                    </div>
                </section>

            </main>

            <Footer />
        </div>
    );
};

export default Landing;
