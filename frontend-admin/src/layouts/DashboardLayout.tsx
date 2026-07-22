import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
    LayoutDashboard, PlusCircle, MessageSquare, Trophy, User, 
    Map, Users, LogOut, Shield, Bell, RefreshCw
} from 'lucide-react';
import ThemeToggle from '../components/ui/ThemeToggle';
import Badge from '../components/ui/Badge';
import NotificationDrawer from '../components/common/NotificationDrawer';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    
    const user = (() => {
        try {
            const raw = localStorage.getItem('user');
            return raw && raw !== 'undefined' ? JSON.parse(raw) : {};
        } catch {
            return {};
        }
    })();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    // macOS Floating bottom dock items based on user role clearance
    const getDockItems = () => {
        const items = [
            { icon: LayoutDashboard, path: '/dashboard', label: 'Console' }
        ];

        if (user.role === 'CITIZEN') {
            items.push({ icon: PlusCircle, path: '/create-report', label: 'New Issue' });
        }

        if (user.role === 'ADMIN' || user.role === 'OFFICIAL') {
            items.push({ icon: Map, path: '/monitor', label: 'Map Live' });
            items.push({ icon: Users, path: '/users', label: 'Accounts' });
        }

        if (user.role === 'WORKER' || user.role === 'OFFICIAL') {
            items.push({ icon: Map, path: '/reports', label: 'Queue' });
        }

        items.push({ icon: MessageSquare, path: '/chat', label: 'Chat' });
        items.push({ icon: Trophy, path: '/leaderboard', label: 'Rankings' });
        items.push({ icon: User, path: '/profile', label: 'Profile' });

        return items;
    };

    const dockItems = getDockItems();

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#030712] text-slate-900 dark:text-slate-100 font-sans selection:bg-blue-500/20 overflow-x-hidden flex flex-col relative transition-colors duration-300">
            {/* Top Telemetries Telemetry Bar */}
            <header className="sticky top-0 w-full z-40 border-b border-slate-200 dark:border-slate-900 bg-white/80 dark:bg-[#030712]/80 backdrop-blur-md text-left">
                <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <Link to="/" className="flex items-center space-x-2.5">
                            <div className="h-9 w-9 bg-blue-600 rounded-xl flex items-center justify-center text-white border border-blue-500/25">
                                <Shield className="h-4.5 w-4.5" />
                            </div>
                            <span className="text-sm font-black tracking-tight text-slate-900 dark:text-white uppercase">CivicConnect</span>
                        </Link>
                        <Badge variant={user.role === 'ADMIN' ? 'danger' : user.role === 'WORKER' ? 'warning' : 'primary'}>
                            {user.role} Nodes
                        </Badge>
                    </div>

                    <div className="flex items-center gap-4">
                        <ThemeToggle />
                        <button
                            onClick={() => setIsNotifOpen(true)}
                            className="p-2 rounded-full text-slate-500 hover:text-slate-900 dark:hover:text-white relative cursor-pointer"
                            title="Notifications"
                        >
                            <Bell size={16} />
                            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-blue-500 animate-ping"></span>
                        </button>
                        <button 
                            onClick={handleLogout}
                            className="p-2 rounded-full text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                            title="Log Out"
                        >
                            <LogOut size={16} />
                        </button>
                    </div>
                </div>
            </header>

            {/* Notification Drawer Modal */}
            <NotificationDrawer isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />

            {/* Main view container */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-6 pt-8 pb-32 relative z-10">
                {children}
            </main>

            {/* macOS Floating Dock at the bottom */}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
                <div className="flex items-center gap-3 px-4 py-3 bg-white/80 dark:bg-[#090d16]/70 backdrop-blur-xl border border-slate-200 dark:border-slate-800/80 rounded-3xl shadow-[0_10px_35px_rgba(0,0,0,0.1)] dark:shadow-[0_10px_35px_rgba(0,0,0,0.6)]">
                    {dockItems.map((item, idx) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <button
                                key={idx}
                                onClick={() => navigate(item.path)}
                                className={`h-11 w-11 rounded-2xl flex items-center justify-center relative cursor-pointer dock-item-bounce ${
                                    isActive 
                                        ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]' 
                                        : 'bg-slate-100 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-700'
                                }`}
                                title={item.label}
                            >
                                <Icon size={18} />
                                {isActive && (
                                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 bg-blue-400 rounded-full"></span>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default DashboardLayout;
