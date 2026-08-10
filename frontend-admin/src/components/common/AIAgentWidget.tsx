import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, X, Send, Sparkles, AlertCircle, ArrowRight, ShieldCheck, MapPin, Trophy, RefreshCw, Volume2, VolumeX, FilePlus, CheckCircle2, Zap } from 'lucide-react';
import { motion as motionFramer, AnimatePresence as AnimatePresenceFramer } from 'framer-motion';
import api from '../../api/axios';
import platformConfig from '../../config/platformConfig';

interface Message {
    id: string;
    sender: 'user' | 'agent';
    text: string;
    timestamp: string;
    action?: {
        label: string;
        path?: string;
        onClick?: () => void;
    };
    categoryTag?: string;
    reportDraft?: {
        category: string;
        location: string;
        description: string;
        sla: string;
    };
}

const QUICK_PROMPTS = [
    { label: 'Help Me File Report', query: 'I want to file a new report for my neighborhood' },
    { label: 'Report Pothole', query: 'I want to report a deep road pothole on Avinashi Road' },
    { label: 'Report Water Leak', query: 'There is a major water pipe leak near Ward 4 market' },
    { label: 'Report Waste Heap', query: 'Garbage dump is uncollected near Town Hall signal' }
];

const AIAgentWidget = () => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'msg-0',
            sender: 'agent',
            text: `Greetings! I am ${platformConfig.appName} AI Assistant, your smart municipal helper. Describe any pothole, water leak, waste heap, or streetlight issue, and I will help file your report instantly!`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            action: { label: 'Open Report Form', path: '/create-report' }
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isSubmittingReport, setIsSubmittingReport] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    const user = (() => {
        try {
            const raw = localStorage.getItem('user');
            return raw && raw !== 'undefined' ? JSON.parse(raw) : {};
        } catch {
            return {};
        }
    })();

    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isTyping]);

    const handleInstantSubmitReport = async (draft: { category: string; location: string; description: string }) => {
        setIsSubmittingReport(true);
        try {
            const payload = {
                category: draft.category,
                description: draft.description || `AI Filed Report: ${draft.category} incident at ${draft.location}`,
                location: draft.location,
                userId: user.user_id || user.id || 'cit-ai-user',
                latitude: 11.0168,
                longitude: 76.9558,
                image_url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?ixlib=rb-1.2.1&auto=format&fit=crop&w=640&q=80'
            };

            await api.post('/reports', payload);

            setMessages(prev => [...prev, {
                id: `success-${Date.now()}`,
                sender: 'agent',
                text: `Report Filed Successfully! Your ${draft.category} report for "${draft.location}" has been logged into the queue. Field crews have been notified.`,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                categoryTag: 'SUCCESS LOGGED',
                action: { label: 'View Dashboard', path: '/dashboard' }
            }]);
        } catch (error) {
            console.error('AI Report submission failed', error);
            setMessages(prev => [...prev, {
                id: `err-${Date.now()}`,
                sender: 'agent',
                text: 'We encountered an error filing your report directly. Opening full report form...',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                action: { label: 'Complete Report Form', path: '/create-report' }
            }]);
        } finally {
            setIsSubmittingReport(false);
        }
    };

    const handleSendMessage = async (text: string) => {
        if (!text.trim()) return;

        const userMsg: Message = {
            id: `usr-${Date.now()}`,
            sender: 'user',
            text,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, userMsg]);
        setInputValue('');
        setIsTyping(true);

        const query = text.toLowerCase();
        let responseText = '';
        let action: { label: string; path?: string; onClick?: () => void } | undefined = undefined;
        let categoryTag: string | undefined = undefined;
        let reportDraft: Message['reportDraft'] = undefined;

        // Detect Report Filing Intent
        const isReportFilingQuery = 
            query.includes('report') || 
            query.includes('file') || 
            query.includes('pothole') || 
            query.includes('leak') || 
            query.includes('garbage') || 
            query.includes('light') || 
            query.includes('trash') ||
            query.includes('broken');

        if (isReportFilingQuery) {
            let category = 'Other Issue';
            let sla = 'SLA: 24h';
            if (query.includes('water') || query.includes('leak') || query.includes('pipe')) {
                category = 'Water Leak';
                sla = 'SLA: 6h (Emergency)';
            } else if (query.includes('pothole') || query.includes('road') || query.includes('crack') || query.includes('tar')) {
                category = 'Road Damage';
                sla = 'SLA: 24h (Urgent)';
            } else if (query.includes('garbage') || query.includes('trash') || query.includes('waste') || query.includes('dump')) {
                category = 'Garbage Dump';
                sla = 'SLA: 12h (Sanitation)';
            } else if (query.includes('light') || query.includes('dark') || query.includes('power') || query.includes('wire')) {
                category = 'Streetlight Defect';
                sla = 'SLA: 12h (Electrical)';
            } else if (query.includes('traffic') || query.includes('signal')) {
                category = 'Traffic Signal';
                sla = 'SLA: 4h (Emergency)';
            }

            let location = `${platformConfig.city} Central District`;
            if (query.includes('on ')) {
                location = text.substring(query.indexOf('on ') + 3).trim();
            } else if (query.includes('at ')) {
                location = text.substring(query.indexOf('at ') + 3).trim();
            } else if (query.includes('near ')) {
                location = text.substring(query.indexOf('near ') + 5).trim();
            }

            reportDraft = {
                category,
                location,
                description: text,
                sla
            };

            responseText = `I have parsed your request! I am ready to file a "${category}" report for location "${location}".`;
            categoryTag = 'REPORT ASSISTANT';
        } else if (query.includes('status') || query.includes('incident') || query.includes('how many')) {
            try {
                const res = await api.get('/reports').catch(() => ({ data: [] }));
                const liveReports = Array.isArray(res.data) ? res.data : [];
                const openCount = liveReports.filter((r: any) => r.status === 'OPEN').length;
                const solvedCount = liveReports.filter((r: any) => r.status === 'RESOLVED').length;

                responseText = `Live Telemetry: Currently ${liveReports.length} total municipal incidents logged (${openCount} pending, ${solvedCount} resolved). All PostGIS spatial vectors are active.`;
                action = { label: 'View Leaderboard', path: '/leaderboard' };
                categoryTag = 'LIVE METRICS';
            } catch {
                responseText = `${platformConfig.appName} AI engine is online. All municipal ward queues (Roads, Sanitation, Electrical, Water, Traffic) are operational.`;
            }
        } else if (query.includes('xp') || query.includes('point') || query.includes('badge') || query.includes('rank')) {
            responseText = 'You earn 10-50 XP points for filing verified reports or confirming repairs. Reaching higher XP levels unlocks badges like "Civic Hero" and "Neighborhood Watch".';
            action = { label: 'View Leaderboard', path: '/leaderboard' };
            categoryTag = 'REWARDS';
        } else {
            responseText = `${platformConfig.appName} AI classifier analyzed your input. Would you like me to help file an official report for your ward?`;
            action = { label: 'Open Report Form', path: '/create-report' };
            categoryTag = 'AI DISPATCH';
        }

        setTimeout(() => {
            setMessages(prev => [...prev, {
                id: `agent-${Date.now()}`,
                sender: 'agent',
                text: responseText,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                action,
                categoryTag,
                reportDraft
            }]);
            setIsTyping(false);
        }, 500);
    };

    return (
        <div className="fixed bottom-24 right-6 z-50 font-sans pointer-events-auto">
            <motionFramer.button
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 text-white flex items-center justify-center shadow-[0_8px_30px_rgba(16,185,129,0.45)] border border-emerald-400/30 cursor-pointer relative group"
            >
                {isOpen ? <X size={22} /> : <Bot size={26} />}
                {!isOpen && (
                    <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-emerald-400 border-2 border-slate-900" />
                )}
            </motionFramer.button>

            <AnimatePresenceFramer>
                {isOpen && (
                    <motionFramer.div
                        initial={{ opacity: 0, y: 40, scale: 0.88 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 40, scale: 0.88 }}
                        transition={{ type: "spring", stiffness: 220, damping: 22 }}
                        className="absolute bottom-18 right-0 w-88 md:w-96 h-[540px] rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-slate-200 dark:border-slate-800 text-left bg-white/95 dark:bg-[#090d16]/95 backdrop-blur-xl"
                    >
                        <div className="p-4 bg-slate-100/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="h-9 w-9 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-md border border-emerald-400/30">
                                    <Bot size={20} />
                                </div>
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider leading-none">EcoCivic AI Assistant</span>
                                        <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-mono font-bold text-emerald-600 dark:text-emerald-400">v3.0</span>
                                    </div>
                                    <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 mt-0.5">
                                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                                        AI Assistant Ready
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => setSoundEnabled(!soundEnabled)}
                                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                                    title={soundEnabled ? "Mute audio" : "Enable audio"}
                                >
                                    {soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
                                </button>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 dark:bg-slate-950/30">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[88%] p-3.5 rounded-2xl text-xs shadow-sm space-y-2 leading-relaxed ${
                                        msg.sender === 'user'
                                            ? 'bg-emerald-600 text-white rounded-tr-none font-medium'
                                            : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none'
                                    }`}>
                                        {msg.categoryTag && (
                                            <span className="inline-block px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[9px] font-extrabold uppercase tracking-wider border border-emerald-500/20">
                                                {msg.categoryTag}
                                            </span>
                                        )}
                                        <p>{msg.text}</p>

                                        {msg.reportDraft && (
                                            <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl space-y-2 text-left">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1">
                                                        <FilePlus size={14} className="text-emerald-600" /> {msg.reportDraft.category}
                                                    </span>
                                                    <span className="text-[9px] font-mono font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                                                        {msg.reportDraft.sla}
                                                    </span>
                                                </div>
                                                <div className="text-[10px] text-slate-600 dark:text-slate-300 font-medium">
                                                    <p><span className="font-bold">Target Location:</span> {msg.reportDraft.location}</p>
                                                </div>
                                                <div className="pt-2 flex flex-col gap-2">
                                                    <button
                                                        disabled={isSubmittingReport}
                                                        onClick={() => handleInstantSubmitReport(msg.reportDraft!)}
                                                        className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-[11px] font-extrabold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm active:scale-95 disabled:opacity-50"
                                                    >
                                                        <Zap size={14} /> 1-Click Instant Submit Report
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setIsOpen(false);
                                                            navigate('/create-report', { state: msg.reportDraft });
                                                        }}
                                                        className="w-full py-2 px-3 bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 rounded-xl text-[11px] font-extrabold transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                                                    >
                                                        <FilePlus size={14} /> Pre-fill Full Form
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {msg.action && (
                                            <button
                                                onClick={() => {
                                                    if (msg.action?.onClick) {
                                                        msg.action.onClick();
                                                    } else if (msg.action?.path) {
                                                        setIsOpen(false);
                                                        navigate(msg.action.path);
                                                    }
                                                }}
                                                className="w-full mt-2 py-2 px-3 bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 rounded-xl text-[11px] font-extrabold transition-all flex items-center justify-between cursor-pointer"
                                            >
                                                <span>{msg.action.label}</span>
                                            </button>
                                        )}
                                        <span className="block text-[8px] text-right text-slate-400 font-mono pt-1">
                                            {msg.timestamp}
                                        </span>
                                    </div>
                                </div>
                            ))}

                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-2xl rounded-tl-none flex items-center gap-1.5 shadow-sm">
                                        <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-bounce"></span>
                                        <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                                        <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                                    </div>
                                </div>
                            )}
                            <div ref={chatEndRef} />
                        </div>

                        {/* Quick Prompts Carousel */}
                        <div className="px-3 py-2 bg-slate-100/70 dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-800 flex gap-1.5 overflow-x-auto no-scrollbar shrink-0">
                            {QUICK_PROMPTS.map((prompt, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleSendMessage(prompt.query)}
                                    className="px-2.5 py-1 bg-white dark:bg-slate-900 hover:bg-emerald-500/10 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/30 rounded-lg text-[10px] font-bold text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 whitespace-nowrap transition-colors cursor-pointer shrink-0 shadow-2xs"
                                >
                                    {prompt.label}
                                </button>
                            ))}
                        </div>

                        {/* Input Form */}
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleSendMessage(inputValue);
                            }}
                            className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex gap-2 shrink-0"
                        >
                            <input
                                type="text"
                                placeholder="Tell AI: 'Pothole on Main Road' or 'Water leak'..."
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                className="flex-1 px-3.5 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500 shadow-inner"
                            />
                            <button
                                type="submit"
                                className="p-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl shadow-sm cursor-pointer transition-all"
                            >
                                <Send size={15} />
                            </button>
                        </form>
                    </motionFramer.div>
                )}
            </AnimatePresenceFramer>
        </div>
    );
};

export default AIAgentWidget;
