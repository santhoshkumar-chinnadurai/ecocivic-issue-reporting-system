import React, { useState } from 'react';
import { Search, ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import Input from '../components/ui/Input';

const FaqPage: React.FC = () => {
    const faqs = [
        {
            q: 'How does AI route my municipal reports?',
            a: 'When you file a report, our integrated Natural Language Processing (NLP) models analyze the description text. The issue is then classified (e.g., Road Damage, Sanitation) and automatically placed in the correct department dispatcher queue for local crew allocation.'
        },
        {
            q: 'What are XP points and badges?',
            a: 'XP points and badges represent civic gamification rewards. When a citizen files valid complaints, or when ground crews resolve assigned repairs, they earn XP (experience points). Accumulating points unlocks reputation titles (Level 1-5) and badges shown on your user profiles.'
        },
        {
            q: 'How are dispatch updates verified?',
            a: 'When workers resolve an issue, they are required to submit before-and-after photo evidence. Once uploaded, the system validates the change, logs the confirmation to our secure blockchain ledger hash, and updates the timeline for public tracking.'
        },
        {
            q: 'How can I change my profile credentials?',
            a: 'Navigate to the Profile Settings tab in your dashboard, where you can modify your registered email address and contact numbers. Administrators can also manage system permissions and edit user points allocations.'
        },
        {
            q: 'Is my personal contact information public?',
            a: 'No. Your phone number and email ID are kept strictly confidential within municipal command servers and are never displayed publicly on public leaderboard or queue maps.'
        }
    ];

    const [searchTerm, setSearchTerm] = useState('');
    const [openIdx, setOpenIdx] = useState<number | null>(0);

    const toggleFaq = (index: number) => {
        setOpenIdx(openIdx === index ? null : index);
    };

    const filteredFaqs = faqs.filter(
        (f) => f.q.toLowerCase().includes(searchTerm.toLowerCase()) || f.a.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#030712] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300 flex flex-col justify-between">
            <Navbar />

            <main className="max-w-4xl mx-auto px-6 py-16 text-left space-y-10 animate-in fade-in duration-300 flex-1">
                <div className="space-y-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-600 dark:text-blue-400 text-[10px] font-extrabold uppercase tracking-widest">
                        System Knowledge Base
                    </div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Frequently Asked Questions</h1>
                    <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">Understand how AI routing, citizen badges, and operations center telemetry interact.</p>
                </div>

                {/* Search Bar */}
                <div className="max-w-xl">
                    <Input
                        type="text"
                        placeholder="Search system documentation or keywords..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        icon={<Search size={16} />}
                        className="shadow-md"
                    />
                </div>

                {/* FAQ Accordion List */}
                <div className="space-y-4">
                    {filteredFaqs.length === 0 ? (
                        <div className="panel-cyber-glass p-8 text-center text-slate-500">
                            <HelpCircle size={36} className="mx-auto mb-2 text-slate-400" />
                            <p className="text-xs font-bold">No documentation matching "{searchTerm}"</p>
                        </div>
                    ) : (
                        filteredFaqs.map((faq, i) => {
                            const isOpen = openIdx === i;
                            return (
                                <div key={i} className="panel-cyber-glass overflow-hidden shadow-sm rounded-2xl border border-slate-200 dark:border-slate-800">
                                    <button
                                        onClick={() => toggleFaq(i)}
                                        className="w-full p-5 flex justify-between items-center text-left font-bold text-xs md:text-sm text-slate-900 dark:text-white focus:outline-none hover:bg-slate-100/50 dark:hover:bg-slate-900/30 transition-colors"
                                    >
                                        <span>{faq.q}</span>
                                        {isOpen ? <ChevronUp size={16} className="text-blue-500 shrink-0" /> : <ChevronDown size={16} className="text-slate-400 shrink-0" />}
                                    </button>
                                    {isOpen && (
                                        <div className="p-5 pt-2 text-xs text-slate-600 dark:text-slate-400 border-t border-slate-200 dark:border-slate-900 bg-slate-100/30 dark:bg-slate-955/20 leading-relaxed font-medium">
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
