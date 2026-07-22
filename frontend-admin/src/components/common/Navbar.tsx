import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Shield, LayoutDashboard, LogIn, UserPlus, Bell } from 'lucide-react';
import ThemeToggle from '../ui/ThemeToggle';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import NotificationDrawer from './NotificationDrawer';

const Navbar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isNotifOpen, setIsNotifOpen] = useState(false);

    const user = (() => {
        try {
            const raw = localStorage.getItem('user');
            return raw && raw !== 'undefined' ? JSON.parse(raw) : null;
        } catch {
            return null;
        }
    })();

    const navLinks = [
        { label: 'Home', path: '/' },
        { label: 'About', path: '/about' },
        { label: 'Contact', path: '/contact' },
        { label: 'FAQ', path: '/faq' },
        { label: 'Rankings', path: '/leaderboard' },
    ];

    return (
        <nav className="sticky top-0 w-full z-50 border-b border-slate-200 dark:border-slate-900 bg-white/85 dark:bg-[#030712]/85 backdrop-blur-md transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center text-left">
                {/* Brand Logo & Telemetry Indicator */}
                <div className="flex items-center gap-4">
                    <Link to="/" className="flex items-center space-x-2.5 group">
                        <div className="h-9 w-9 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-blue-500/20 border border-blue-400/30 group-hover:scale-105 transition-transform">
                            <Shield className="h-5 w-5" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white uppercase leading-none">CivicConnect TN</span>
                            <span className="text-[9px] font-mono font-bold text-blue-600 dark:text-blue-400 tracking-wider">TAMIL NADU • COIMBATORE HUB</span>
                        </div>
                    </Link>

                    <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        TN Municipal Grid Active
                    </div>
                </div>

                {/* Navigation Links */}
                <div className="hidden md:flex items-center space-x-1 text-xs font-bold">
                    {navLinks.map((link) => {
                        const isActive = location.pathname === link.path;
                        return (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`px-3 py-1.5 rounded-lg transition-colors ${
                                    isActive
                                        ? 'bg-blue-600/10 text-blue-600 dark:text-blue-400 font-extrabold'
                                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900/40'
                                }`}
                            >
                                {link.label}
                            </Link>
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
                                className="p-2 rounded-full text-slate-500 hover:text-slate-900 dark:hover:text-white relative cursor-pointer mr-1"
                                title="Notifications"
                            >
                                <Bell size={16} />
                                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-blue-500 animate-ping"></span>
                            </button>
                            <Badge variant={user.role === 'ADMIN' ? 'danger' : user.role === 'WORKER' ? 'warning' : 'primary'}>
                                {user.role}
                            </Badge>
                            <Button
                                size="sm"
                                onClick={() => navigate('/dashboard')}
                                className="font-bold flex items-center gap-1.5 shadow-sm"
                            >
                                <LayoutDashboard size={14} /> Console
                            </Button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link to="/login">
                                <Button size="sm" variant="outline" className="hidden sm:inline-flex font-bold">
                                    <LogIn size={13} className="mr-1" /> Log In
                                </Button>
                            </Link>
                            <Link to="/signup">
                                <Button size="sm" className="font-bold shadow-[0_0_15px_rgba(59,130,246,0.25)]">
                                    <UserPlus size={13} className="mr-1" /> Register
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Notification Drawer Modal */}
            <NotificationDrawer isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
        </nav>
    );
};

export default Navbar;
