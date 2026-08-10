import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Building2, LayoutDashboard, LogIn, FilePlus, Bell, Menu, X } from 'lucide-react';
import ThemeToggle from '../ui/ThemeToggle';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import NotificationDrawer from './NotificationDrawer';
import platformConfig from '../../config/platformConfig';

const Navbar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const user = (() => {
        try {
            const raw = localStorage.getItem('user');
            return raw && raw !== 'undefined' ? JSON.parse(raw) : null;
        } catch {
            return null;
        }
    })();

    const navLinks = [
        { label: 'How It Works', path: '/#how-it-works' },
        { label: 'Features', path: '/#features' },
        { label: 'About', path: '/about' },
        { label: 'FAQ', path: '/faq' },
        { label: 'Rankings', path: '/leaderboard' },
    ];

    const handleAnchorClick = (path: string) => {
        setMobileMenuOpen(false);
        if (path.startsWith('/#')) {
            const sectionId = path.replace('/#', '');
            if (location.pathname === '/') {
                const el = document.getElementById(sectionId);
                if (el) el.scrollIntoView({ behavior: 'smooth' });
            } else {
                navigate('/');
                setTimeout(() => {
                    const el = document.getElementById(sectionId);
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            }
        } else {
            navigate(path);
        }
    };

    return (
        <nav className="sticky top-0 w-full z-50 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-[#030712]/90 backdrop-blur-md transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center text-left">
                {/* Brand Logo */}
                <div className="flex items-center gap-4">
                    <Link to="/" className="flex items-center space-x-2.5 group">
                        <div className="h-9 w-9 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-blue-500/20 border border-blue-400/30 group-hover:scale-105 transition-transform">
                            <Building2 className="h-5 w-5" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white uppercase leading-none">{platformConfig.appName}</span>
                            <span className="text-[9px] font-mono font-bold text-blue-600 dark:text-blue-400 tracking-wider uppercase">MUNICIPAL CIVIC PLATFORM</span>
                        </div>
                    </Link>
                </div>

                {/* Navigation Links - Desktop */}
                <div className="hidden md:flex items-center space-x-1 text-xs font-bold">
                    {navLinks.map((link) => {
                        const isActive = location.pathname === link.path;
                        return (
                            <button
                                key={link.label}
                                onClick={() => handleAnchorClick(link.path)}
                                className={`px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                                    isActive
                                        ? 'bg-blue-600/10 text-blue-600 dark:text-blue-400 font-extrabold'
                                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50'
                                }`}
                            >
                                {link.label}
                            </button>
                        );
                    })}
                </div>

                {/* Action Controls & User Identity */}
                <div className="flex items-center gap-3">
                    <ThemeToggle />

                    {user ? (
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setIsNotifOpen(true)}
                                className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white relative cursor-pointer"
                                title="Notifications"
                            >
                                <Bell size={18} />
                                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-blue-500"></span>
                            </button>
                            <Badge variant={user.role === 'ADMIN' ? 'danger' : user.role === 'WORKER' ? 'warning' : 'primary'}>
                                {user.role}
                            </Badge>
                            <Button
                                size="sm"
                                onClick={() => navigate('/dashboard')}
                                className="font-bold flex items-center gap-1.5 shadow-sm rounded-xl"
                            >
                                <LayoutDashboard size={14} /> Console
                            </Button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link to="/login">
                                <Button size="sm" variant="outline" className="hidden sm:inline-flex font-extrabold rounded-xl">
                                    <LogIn size={14} className="mr-1.5" /> Sign In
                                </Button>
                            </Link>
                            <Link to={user ? "/create-report" : "/login"}>
                                <Button size="sm" className="font-extrabold shadow-sm rounded-xl">
                                    <FilePlus size={14} className="mr-1.5" /> Report an Issue
                                </Button>
                            </Link>
                        </div>
                    )}

                    {/* Mobile Menu Toggle Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                    >
                        {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation Drawer */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-white dark:bg-[#030712] border-b border-slate-200 dark:border-slate-800 px-6 py-4 space-y-3 text-left">
                    {navLinks.map((link) => (
                        <button
                            key={link.label}
                            onClick={() => handleAnchorClick(link.path)}
                            className="block w-full text-left py-2 text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400"
                        >
                            {link.label}
                        </button>
                    ))}
                    {!user && (
                        <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2">
                            <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                                <Button size="sm" variant="outline" className="w-full font-bold">
                                    <LogIn size={14} className="mr-1.5" /> Sign In
                                </Button>
                            </Link>
                            <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                                <Button size="sm" className="w-full font-bold">
                                    <FilePlus size={14} className="mr-1.5" /> Report an Issue
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            )}

            {/* Notification Drawer Modal */}
            <NotificationDrawer isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
        </nav>
    );
};

export default Navbar;
