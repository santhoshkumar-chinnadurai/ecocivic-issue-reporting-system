import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, MapPin, Mail, Phone, ExternalLink, Heart } from 'lucide-react';

const Footer: React.FC = () => {
    return (
        <footer className="border-t border-slate-200 dark:border-slate-900 bg-white/90 dark:bg-[#030712]/90 backdrop-blur-md pt-12 pb-8 text-left font-sans transition-colors duration-300 relative z-10">
            <div className="max-w-7xl mx-auto px-6 space-y-10">
                {/* Main 4-Column Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Brand Column */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2.5">
                            <div className="h-9 w-9 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-md border border-blue-400/30">
                                <Shield className="h-5 w-5" />
                            </div>
                            <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white uppercase">CivicConnect TN</span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                            Government of Tamil Nadu Municipal Administration & Water Supply Dept — Next-generation civic triage, AI incident classification, and smart infrastructure matrix for Coimbatore and all TN Corporations.
                        </p>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full w-fit">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            System Telemetry 100% Operational
                        </div>
                    </div>

                    {/* Quick Access Portals */}
                    <div className="space-y-3">
                        <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">Quick Portals</h4>
                        <ul className="space-y-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
                            <li>
                                <Link to="/login" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1">
                                    Citizen Core Gate <ExternalLink size={10} />
                                </Link>
                            </li>
                            <li>
                                <Link to="/government/login" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1">
                                    Dispatch Terminal <ExternalLink size={10} />
                                </Link>
                            </li>
                            <li>
                                <Link to="/admin/login" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1">
                                    Root Matrix Terminal <ExternalLink size={10} />
                                </Link>
                            </li>
                            <li>
                                <Link to="/leaderboard" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                    Community Rankings
                                </Link>
                            </li>
                            <li>
                                <Link to="/faq" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                    System Documentation
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Departments */}
                    <div className="space-y-3">
                        <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">Municipal Divisions</h4>
                        <ul className="space-y-2 text-xs font-medium text-slate-600 dark:text-slate-400">
                            <li>• Roads & Infrastructure Maintenance</li>
                            <li>• Sanitation & Waste Management</li>
                            <li>• Electrical & Streetlight Grid</li>
                            <li>• Water Supply & Hydrant Networks</li>
                            <li>• Traffic Signal & Public Safety</li>
                        </ul>
                    </div>

                    {/* Operational Contacts */}
                    <div className="space-y-3">
                        <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">Command Telemetries</h4>
                        <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400 font-medium">
                            <div className="flex items-start gap-2">
                                <MapPin size={14} className="text-blue-500 shrink-0 mt-0.5" />
                                <span>Corporation Office Building, Coimbatore, TN 641001</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Mail size={14} className="text-emerald-500 shrink-0" />
                                <span>support@coimbatore-municipal.gov.in</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Phone size={14} className="text-amber-500 shrink-0" />
                                <span>+91 (422) 230-0000 / 1800-425-0000</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Divider & Copyright Bar */}
                <div className="pt-6 border-t border-slate-200 dark:border-slate-900 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500 dark:text-slate-400 font-medium">
                    <p className="flex items-center gap-1">
                        &copy; {new Date().getFullYear()} CivicConnect Matrix. Engineered with <Heart size={12} className="text-rose-500 fill-rose-500 inline" /> for Coimbatore Smart City.
                    </p>
                    <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-wider">
                        <Link to="/about" className="hover:text-slate-900 dark:hover:text-white transition-colors">About</Link>
                        <Link to="/contact" className="hover:text-slate-900 dark:hover:text-white transition-colors">Contact</Link>
                        <Link to="/faq" className="hover:text-slate-900 dark:hover:text-white transition-colors">FAQ</Link>
                        <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded font-mono text-blue-600 dark:text-blue-400">
                            v2.4.0-SPATIAL
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
