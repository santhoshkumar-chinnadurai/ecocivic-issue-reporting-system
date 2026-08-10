import React, { useState } from 'react';
import { Search, ChevronDown, ChevronUp, HelpCircle, Shield, Cpu, UserCheck, Wrench, Lock } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import Input from '../components/ui/Input';
import platformConfig from '../config/platformConfig';

const FaqPage: React.FC = () => {
    const categories = [
        { id: 'all', label: 'All FAQs', icon: HelpCircle },
        { id: 'citizen', label: 'Citizen Reporting', icon: UserCheck },
        { id: 'ai', label: 'AI Triage & Routing', icon: Cpu },
        { id: 'worker', label: 'Field Workers & Dispatches', icon: Wrench },
        { id: 'security', label: 'Account & Security', icon: Lock }
    ];

    const faqs = [
        {
            category: 'ai',
            q: 'How does AI route my municipal reports automatically?',
            a: 'When you submit a complaint on EcoCivic, our Natural Language Processing (NLP) model analyzes the text description and attached photo. It categorizes the issue (e.g., Roads, Water Supply, Sanitation), determines the priority level, and assigns it to the responsible municipal department queue.'
        },
        {
            category: 'citizen',
            q: 'What are XP points and Citizen Badges?',
            a: 'XP (Experience Points) and badges are gamified community rewards. Every time a citizen logs a valid civic complaint or when repairs are verified, points are awarded. Earning XP elevates your profile level from Neighborhood Watch up to Civic Guardian.'
        },
        {
            category: 'worker',
            q: 'How do field workers accept and verify dispatches?',
            a: 'Assigned field workers receive real-time dispatch alerts on their Worker Workspace. Once repair work is finished, workers upload a photo proof of completion. The system logs the resolution and notifies the citizen.'
        },
        {
            category: 'security',
            q: 'Is my personal contact information kept private?',
            a: 'Yes. Your phone number and email address are strictly protected within municipal command servers and are never shown publicly on public leaderboards or issue maps.'
        },
        {
            category: 'citizen',
            q: 'How do I track the status of my reported complaint?',
            a: 'You can view live status updates directly from your Citizen Dashboard. The interactive progress timeline shows when your complaint is Submitted, Approved, Dispatched, or Completed.'
        },
        {
            category: 'ai',
            q: 'What happens if the AI misclassifies a report?',
            a: 'Municipal officials can easily reallocate departments or adjust ticket priorities with a single click using the Allocate Crew Dispatch drawer.'
        },
        {
            category: 'security',
            q: 'How does the secret 3-tap auto-fill login feature work?',
            a: 'For demonstration and rapid access, tapping the role-specific icon button at the top right of any login portal header 3 times will automatically populate that portal’s default demo credentials.'
        }
    ];

    const [activeCategory, setActiveCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [openIdx, setOpenIdx] = useState<number | null>(0);

    const toggleFaq = (index: number) => {
        setOpenIdx(openIdx === index ? null : index);
    };

    const filteredFaqs = faqs.filter((f) => {
        const matchesCategory = activeCategory === 'all' || f.category === activeCategory;
        const matchesSearch = f.q.toLowerCase().includes(searchTerm.toLowerCase()) || f.a.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#030712] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300 flex flex-col justify-between">
            <Navbar />

            <main className="max-w-4xl mx-auto px-6 py-16 text-left space-y-10 animate-in fade-in duration-300 flex-1">
                {/* Header */}
                <div className="space-y-3">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-emerald-500/10 border border-emerald-500/25 rounded-full text-emerald-700 dark:text-emerald-400 text-xs font-black uppercase tracking-wider">
                        🌱 Knowledge Base & Support
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                        Frequently Asked Questions
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">
                        Everything you need to know about {platformConfig.appName} AI triage, citizen badges, and field crew dispatches.
                    </p>
                </div>

                {/* Search Bar */}
                <div className="max-w-xl">
                    <Input
                        type="text"
                        placeholder="Search documentation or keywords..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        icon={<Search size={16} className="text-emerald-600 dark:text-emerald-400" />}
                        className="shadow-sm border-slate-300 dark:border-slate-800 rounded-2xl"
                    />
                </div>

                {/* Category Filter Pills */}
                <div className="flex flex-wrap gap-2 pt-1">
                    {categories.map((cat) => {
                        const Icon = cat.icon;
                        const isActive = activeCategory === cat.id;
                        return (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                                    isActive
                                        ? 'bg-emerald-600 text-white shadow-md font-extrabold'
                                        : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/40'
                                }`}
                            >
                                <Icon size={14} />
                                {cat.label}
                            </button>
                        );
                    })}
                </div>

                {/* FAQ Accordion List */}
                <div className="space-y-4">
                    {filteredFaqs.length === 0 ? (
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl text-center text-slate-500 space-y-2">
                            <HelpCircle size={36} className="mx-auto text-emerald-500" />
                            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No FAQs found matching "{searchTerm}"</p>
                        </div>
                    ) : (
                        filteredFaqs.map((faq, i) => {
                            const isOpen = openIdx === i;
                            return (
                                <div key={i} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-all">
                                    <button
                                        onClick={() => toggleFaq(i)}
                                        className="w-full p-5 flex justify-between items-center text-left font-extrabold text-sm text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
                                    >
                                        <span className="flex items-center gap-3">
                                            <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0"></span>
                                            {faq.q}
                                        </span>
                                        {isOpen ? <ChevronUp size={18} className="text-emerald-600 shrink-0" /> : <ChevronDown size={18} className="text-slate-400 shrink-0" />}
                                    </button>
                                    {isOpen && (
                                        <div className="p-5 pt-3 text-xs md:text-sm text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 leading-relaxed font-medium">
                                            {faq.a}
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default FaqPage;
