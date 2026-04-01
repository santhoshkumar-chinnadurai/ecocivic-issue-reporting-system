import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, ArrowLeft, Menu, X, LogOut, User, Activity, Users } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

interface LayoutProps {
    children: React.ReactNode;
    userRole?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, userRole }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/';
    };

    const isDashboard = location.pathname === '/dashboard';

    const getNavLinks = () => {
        const links = [];
        if (userRole === 'ADMIN') {
            links.push({ path: '/users', label: 'Users', icon: Users });
        }
        links.push({ path: '/monitor', label: 'Monitor', icon: Activity });
        links.push({ path: '/profile', label: 'Profile', icon: User });
        return links;
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#050505] text-gray-900 dark:text-white font-sans selection:bg-indigo-500/30 overflow-hidden relative flex flex-col transition-colors duration-500">

            {/* Premium Ambient Background Elements */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] dark:opacity-[0.05] mix-blend-overlay"></div>
                <motion.div
                    animate={{ scale: [1, 1.2, 1], rotate: [0, 45, 0] }}
                    transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[-20%] right-[-10%] w-[60%] h-[50vw] bg-indigo-500/10 dark:bg-indigo-600/15 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen"
                />
                <motion.div
                    animate={{ scale: [1, 1.3, 1], rotate: [0, -30, 0] }}
                    transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-[-10%] left-[-20%] w-[50%] h-[50vw] bg-cyan-500/10 dark:bg-cyan-600/15 rounded-full blur-[140px] mix-blend-multiply dark:mix-blend-screen"
                />
            </div>

            {/* Floating Glassmorphic Header */}
            <div className="w-full fixed top-0 z-50 px-4 sm:px-6 py-4 pointer-events-none">
                <header className="max-w-7xl mx-auto pointer-events-auto bg-white/70 dark:bg-white/[0.03] backdrop-blur-3xl border border-gray-200/50 dark:border-white/10 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.2)] transition-all">
                    <div className="flex justify-between items-center h-16 px-4 sm:px-6">
                        {/* Logo / Back */}
                        <div className="flex items-center">
                            {!isDashboard ? (
                                <Link to="/dashboard" className="flex items-center space-x-3 group mr-4">
                                    <div className="h-10 w-10 rounded-xl bg-gray-100 dark:bg-white/5 flex items-center justify-center group-hover:bg-gray-200 dark:group-hover:bg-white/10 transition-colors border border-gray-200 dark:border-white/5">
                                        <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />
                                    </div>
                                    <span className="text-sm font-bold tracking-tight text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors hidden sm:block uppercase">
                                        Back
                                    </span>
                                </Link>
                            ) : (
                                <Link to="/dashboard" className="flex items-center space-x-3 group">
                                    <div className="relative h-10 w-10">
                                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-xl blur-md opacity-40 dark:opacity-70 group-hover:opacity-100 transition-opacity"></div>
                                        <div className="relative h-full w-full bg-white dark:bg-black/50 backdrop-blur-md border border-gray-200 dark:border-white/10 rounded-xl flex items-center justify-center shadow-sm">
                                            <Shield className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                                        </div>
                                    </div>
                                    <div className="hidden sm:flex flex-col">
                                        <span className="text-lg font-black tracking-tight leading-tight text-gray-900 dark:text-white">CivicConnect</span>
                                        {userRole && (
                                            <span className={`text-[10px] font-bold tracking-widest uppercase leading-none mt-0.5 ${userRole === 'ADMIN' ? 'text-fuchsia-600 dark:text-fuchsia-400' : 'text-indigo-600 dark:text-indigo-400'}`}>
                                                {userRole}
                                            </span>
                                        )}
                                    </div>
                                </Link>
                            )}
                        </div>

                        {/* Desktop Nav */}
                        <nav className="hidden md:flex items-center space-x-1 border border-gray-200/50 dark:border-white/5 p-1 rounded-2xl bg-gray-50/50 dark:bg-black/20">
                            {getNavLinks().map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`relative px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                                        location.pathname === link.path
                                            ? 'text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-500/20 shadow-sm border border-indigo-100 dark:border-indigo-500/20'
                                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5'
                                    }`}
                                >
                                    <link.icon size={16} />
                                    {link.label}
                                </Link>
                            ))}
                        </nav>

                        {/* Actions */}
                        <div className="hidden md:flex items-center space-x-3">
                            <div className="h-8 w-[1px] bg-gray-200 dark:bg-white/10 mx-2"></div>
                            <ThemeToggle />
                            <button
                                onClick={handleLogout}
                                className="group flex items-center justify-center h-10 w-10 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors shadow-sm"
                                title="Logout"
                            >
                                <LogOut size={16} className="group-hover:scale-110 transition-transform" />
                            </button>
                        </div>

                        {/* Mobile Menu Toggle */}
                        <div className="flex md:hidden items-center space-x-3">
                            <ThemeToggle />
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="p-2 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400"
                            >
                                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                            </button>
                        </div>
                    </div>
                </header>

                {/* Mobile Menu Dropdown */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="absolute top-24 left-4 right-4 md:hidden pointer-events-auto"
                        >
                            <div className="bg-white/90 dark:bg-[#111]/90 backdrop-blur-3xl border border-gray-200 dark:border-white/10 rounded-3xl p-4 shadow-2xl flex flex-col gap-2">
                                {getNavLinks().map((link) => (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={`flex items-center gap-3 px-5 py-4 rounded-2xl text-sm font-bold transition-colors ${
                                            location.pathname === link.path
                                                ? 'bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-500/20'
                                                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'
                                        }`}
                                    >
                                        <link.icon size={20} />
                                        {link.label}
                                    </Link>
                                ))}
                                <div className="h-[1px] bg-gray-200 dark:bg-white/10 my-2 w-full"></div>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-3 px-5 py-4 rounded-2xl text-sm font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors text-left"
                                >
                                    <LogOut size={20} />
                                    Sign Out
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Main Content Area */}
            <main className="flex-1 w-full relative z-10 pt-28 pb-12 px-4 sm:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="max-w-7xl mx-auto h-full"
                >
                    {children}
                </motion.div>
            </main>
        </div>
    );
};

export default Layout;
