import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, MapPin, Mail, Phone, ExternalLink } from 'lucide-react';
import platformConfig from '../../config/platformConfig';

const Footer: React.FC = () => {
    return (
        <footer className="border-t border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-[#030712]/90 backdrop-blur-md pt-12 pb-8 text-left font-sans transition-colors duration-300 relative z-10">
            <div className="max-w-7xl mx-auto px-6 space-y-10">
                {/* Main 4-Column Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
                    {/* Brand Column */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="flex items-center space-x-2.5">
                            <div className="h-9 w-9 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-md border border-blue-400/30">
                                <Building2 className="h-5 w-5" />
                            </div>
                            <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white uppercase">{platformConfig.appName}</span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium max-w-sm">
                            {platformConfig.orgName} — Next-generation civic triage, AI incident classification, and smart infrastructure management for municipal public services.
                        </p>
                        <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 font-medium">
                            <div className="flex items-center gap-2">
                                <MapPin size={13} className="text-blue-500 shrink-0" />
                                <span>{platformConfig.officeAddress}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Mail size={13} className="text-emerald-500 shrink-0" />
                                <span>{platformConfig.supportEmail}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Phone size={13} className="text-amber-500 shrink-0" />
                                <span>{platformConfig.supportPhone}</span>
                            </div>
                        </div>
                    </div>

                    {/* Section 1: Platform */}
                    <div className="space-y-3">
                        <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">Platform</h4>
                        <ul className="space-y-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
                            <li>
                                <Link to="/login" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                    Report an Issue
                                </Link>
                            </li>
                            <li>
                                <Link to="/login" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                    Track an Issue
                                </Link>
                            </li>
                            <li>
                                <a href="/#how-it-works" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                    How It Works
                                </a>
                            </li>
                            <li>
                                <Link to="/leaderboard" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                    Community Rankings
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Section 2: Resources */}
                    <div className="space-y-3">
                        <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">Resources</h4>
                        <ul className="space-y-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
                            <li>
                                <Link to="/faq" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                    FAQ
                                </Link>
                            </li>
                            <li>
                                <Link to="/about" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                    About
                                </Link>
                            </li>
                            <li>
                                <Link to="/contact" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Section 3: Legal & Account */}
                    <div className="space-y-3">
                        <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">Account & Legal</h4>
                        <ul className="space-y-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
                            <li>
                                <Link to="/login" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                    Sign In
                                </Link>
                            </li>
                            <li>
                                <Link to="/signup" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                    Register
                                </Link>
                            </li>
                            <li>
                                <span className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer">
                                    Privacy Policy
                                </span>
                            </li>
                            <li>
                                <span className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer">
                                    Terms of Service
                                </span>
                            </li>
                            <li>
                                <span className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer">
                                    Accessibility Statement
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Divider & Copyright Bar */}
                <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500 dark:text-slate-400 font-medium">
                    <p>
                        &copy; {new Date().getFullYear()} {platformConfig.appName}. Designed for Modern Municipal Governance.
                    </p>
                    <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-wider">
                        <Link to="/about" className="hover:text-slate-900 dark:hover:text-white transition-colors">About</Link>
                        <Link to="/contact" className="hover:text-slate-900 dark:hover:text-white transition-colors">Contact</Link>
                        <Link to="/faq" className="hover:text-slate-900 dark:hover:text-white transition-colors">FAQ</Link>
                        <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded font-mono text-blue-600 dark:text-blue-400">
                            v3.0.0
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
