import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, CheckCircle2 } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import platformConfig from '../config/platformConfig';

const ContactPage: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setTimeout(() => {
            setSubmitting(false);
            setSubmitted(true);
        }, 1200);
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#030712] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300 flex flex-col justify-between">
            <Navbar />

            <main className="max-w-6xl mx-auto px-6 py-16 text-left space-y-10 animate-in fade-in duration-300 flex-1">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-600 dark:text-blue-400 text-[10px] font-extrabold uppercase tracking-widest mb-3">
                        24/7 Operations Support
                    </div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Contact Operations Command</h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-1.5 text-sm font-medium">Reach out to our municipal operations team regarding routing errors, platform assistance, or ward emergencies.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Contact Form */}
                    <div className="panel-cyber-glass p-8 rounded-3xl shadow-lg">
                        {submitted ? (
                            <div className="text-center py-12 space-y-4">
                                <div className="h-16 w-16 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-500 flex items-center justify-center mx-auto">
                                    <CheckCircle2 className="h-8 w-8 animate-bounce" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Transmission Received</h3>
                                <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm mx-auto">Our engineering dispatch team will review your inquiry payload and reply within 24 hours.</p>
                                <Button size="sm" onClick={() => setSubmitted(false)} variant="outline" className="font-bold">
                                    Send Another Inquiry
                                </Button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <Input
                                    label="Name"
                                    placeholder="Enter your full name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    icon={<Mail size={16} />}
                                />
                                <Input
                                    label="Email Address"
                                    type="email"
                                    placeholder="your_email@civic.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    icon={<Mail size={16} />}
                                />
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Inquiry Payload</label>
                                    <textarea
                                        rows={4}
                                        placeholder="Describe your issue or feedback in detail..."
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        required
                                        className="w-full px-4 py-2.5 bg-white dark:bg-slate-950/60 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 text-xs shadow-inner"
                                    />
                                </div>
                                <Button type="submit" loading={submitting} className="w-full flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(59,130,246,0.2)] font-bold py-3">
                                    <Send size={15} /> Send Transmission
                                </Button>
                            </form>
                        )}
                    </div>

                    {/* Operational Details Cards */}
                    <div className="space-y-6 flex flex-col justify-between">

                        <div className="panel-cyber-glass p-6 rounded-2xl space-y-4">
                            <div className="flex items-start gap-4">
                                <div className="h-10 w-10 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-500 flex items-center justify-center shrink-0">
                                    <MapPin size={20} />
                                </div>
                                <div className="text-left space-y-1">
                                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Municipal Command Center</h4>
                                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">{platformConfig.officeAddress}</p>
                                </div>
                            </div>
                        </div>

                        <div className="panel-cyber-glass p-6 rounded-2xl space-y-4">
                            <div className="flex items-start gap-4">
                                <div className="h-10 w-10 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-500 flex items-center justify-center shrink-0">
                                    <Mail size={20} />
                                </div>
                                <div className="text-left space-y-1">
                                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Email Communications</h4>
                                    <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">{platformConfig.supportEmail}</p>
                                </div>
                            </div>
                        </div>

                        <div className="panel-cyber-glass p-6 rounded-2xl space-y-4">
                            <div className="flex items-start gap-4">
                                <div className="h-10 w-10 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-500 flex items-center justify-center shrink-0">
                                    <Phone size={20} />
                                </div>
                                <div className="text-left space-y-1">
                                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Command Hotline</h4>
                                    <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">+91 (422) 230-0000 / Toll Free: 1800-425-0000</p>
                                    <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider mt-1">● Lines Active 24 Hours</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default ContactPage;
