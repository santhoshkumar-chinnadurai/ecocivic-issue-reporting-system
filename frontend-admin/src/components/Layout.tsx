import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, ArrowLeft, Menu, X, LogOut } from 'lucide-react';
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

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0A0A0A] text-gray-900 dark:text-white font-sans selection:bg-indigo-500/30 overflow-hidden relative flex flex-col transition-colors duration-300">

            {/* Parallax Background Noise & Blobs */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay"></div>
                <motion.div
                    animate={{ x: [0, -30, 0], y: [0, 30, 0] }}
                    transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[0%] right-[0%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px]"
                />
                <motion.div
                    animate={{ x: [0, 40, 0], y: [0, -20, 0] }}
                    transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-[0%] left-[0%] w-[40%] h-[40%] bg-cyan-600/10 rounded-full blur-[120px]"
                />
            </div>

            {/* Header */}
            <header className="relative z-50 bg-white/60 dark:bg-black/20 backdrop-blur-2xl border-b border-gray-200 dark:border-white/5 transition-colors">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        {/* Logo / Back Button */}
                        <div className="flex items-center">
                            {!isDashboard ? (
                                <Link to="/dashboard" className="flex items-center space-x-3 mr-8 group">
                                    <div className="h-10 w-10 rounded-xl bg-black/5 dark:bg-white/5 flex items-center justify-center group-hover:bg-black/10 dark:group-hover:bg-white/10 transition-colors border border-gray-200 dark:border-white/5">
                                        <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />
                                    </div>
                                    <span className="text-lg font-semibold tracking-tight text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                                        Back
                                    </span>
                                </Link>
                            ) : (
                                <Link to="/dashboard" className="flex items-center space-x-3 mr-8 group">
                                    <div className="h-10 w-10 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                                        <Shield className="h-5 w-5 text-white" />
                                    </div>
                                    <span className="text-xl font-bold tracking-tight hidden sm:block">
                                        CivicConnect{userRole === 'ADMIN' && <span className="text-indigo-600 dark:text-indigo-400 font-medium ml-1 text-sm bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">ADMIN</span>}
                                    </span>
                                </Link>
                            )}
                        </div>

                        {/* Desktop Nav & Actions */}
                        <div className="hidden md:flex items-center space-x-6">
                            {isDashboard && (
                                <nav className="flex space-x-1 mr-2">
                                    {userRole === 'ADMIN' && (
                                        <Link to="/users" className="px-4 py-2 rounded-full text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                                            Users
                                        </Link>
                                    )}
                                    <Link to="/profile" className="px-4 py-2 rounded-full text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                                        Profile
                                    </Link>
                                    <Link to="/monitor" className="px-4 py-2 rounded-full text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                                        Monitor
                                    </Link>
                                </nav>
                            )}

                            <ThemeToggle />

                            <button
                                onClick={handleLogout}
                                className="p-2.5 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 hover:text-red-700 dark:hover:text-red-300 transition-colors"
                                aria-label="Logout"
                                title="Logout"
                            >
                                <LogOut size={18} />
                            </button>
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="flex md:hidden items-center space-x-4">
                            <ThemeToggle />
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                            >
                                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="md:hidden border-t border-gray-200 dark:border-white/5 bg-white/80 dark:bg-black/40 backdrop-blur-3xl overflow-hidden shadow-2xl"
                        >
                            <div className="px-4 py-4 space-y-2">
                                {userRole === 'ADMIN' && (
                                    <Link to="/users" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-3 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                                        Users
                                    </Link>
                                )}
                                <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-3 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                                    Profile
                                </Link>
                                <Link to="/monitor" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-3 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                                    Monitor
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left flex items-center px-4 py-3 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-500/10 transition-colors"
                                >
                                    <LogOut size={18} className="mr-3" />
                                    Logout
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>

            {/* Main Content */}
            <main className="flex-1 w-full relative z-10 px-4 sm:px-6 py-8 overflow-y-auto">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="max-w-7xl mx-auto"
                >
                    {children}
                </motion.div>
            </main>
        </div>
    );
};

export default Layout;
