import React, { useState, useEffect } from 'react';
import { Bell, X, CheckCheck, Trash2, AlertTriangle, CheckCircle2, Info, Clock } from 'lucide-react';
import Button from '../ui/Button';

export interface NotificationItem {
    id: string;
    title: string;
    message: string;
    timestamp: string;
    read: boolean;
    type: 'info' | 'success' | 'warning' | 'danger';
}

interface NotificationDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [];

const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen, onClose }) => {
    const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
        try {
            const stored = localStorage.getItem('civic_notifications');
            return stored ? JSON.parse(stored) : [];
        } catch {
            return [];
        }
    });

    const [filter, setFilter] = useState<'all' | 'unread'>('all');

    useEffect(() => {
        localStorage.setItem('civic_notifications', JSON.stringify(notifications));
    }, [notifications]);

    if (!isOpen) return null;

    const unreadCount = notifications.filter(n => !n.read).length;
    const displayedNotifications = notifications.filter(n => filter === 'all' || !n.read);

    const markAsRead = (id: string) => {
        setNotifications(prev =>
            prev.map(n => (n.id === id ? { ...n, read: true } : n))
        );
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const clearAll = () => {
        setNotifications([]);
    };

    const getIcon = (type: NotificationItem['type']) => {
        switch (type) {
            case 'success':
                return <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />;
            case 'warning':
                return <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />;
            case 'danger':
                return <AlertTriangle className="h-4 w-4 text-rose-500 shrink-0" />;
            case 'info':
            default:
                return <Info className="h-4 w-4 text-blue-500 shrink-0" />;
        }
    };

    return (
        <div className="fixed inset-0 z-50 overflow-hidden text-left font-sans animate-in fade-in duration-200">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Slide-over panel */}
            <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
                <div className="w-screen max-w-md bg-white dark:bg-[#090d16] shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col justify-between">
                    
                    {/* Drawer Header */}
                    <div className="p-6 border-b border-slate-200 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-950/40">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <div className="h-9 w-9 bg-blue-600/10 border border-blue-500/20 rounded-xl text-blue-600 dark:text-blue-400 flex items-center justify-center relative">
                                    <Bell size={18} />
                                    {unreadCount > 0 && (
                                        <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-blue-500 border-2 border-white dark:border-slate-900" />
                                    )}
                                </div>
                                <div>
                                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">System Alerts</h3>
                                    <p className="text-[10px] text-slate-500 font-medium">{unreadCount} unread transmissions</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Filter Tabs & Quick Actions */}
                        <div className="flex justify-between items-center pt-4 text-xs font-bold">
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setFilter('all')}
                                    className={`px-3 py-1 rounded-lg transition-all ${
                                        filter === 'all'
                                            ? 'bg-blue-600 text-white shadow-sm'
                                            : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                                    }`}
                                >
                                    All ({notifications.length})
                                </button>
                                <button
                                    onClick={() => setFilter('unread')}
                                    className={`px-3 py-1 rounded-lg transition-all ${
                                        filter === 'unread'
                                            ? 'bg-blue-600 text-white shadow-sm'
                                            : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                                    }`}
                                >
                                    Unread ({unreadCount})
                                </button>
                            </div>

                            {notifications.length > 0 && (
                                <div className="flex items-center gap-2 text-[10px]">
                                    <button
                                        onClick={markAllAsRead}
                                        className="text-blue-500 hover:underline flex items-center gap-1"
                                    >
                                        <CheckCheck size={12} /> Mark Read
                                    </button>
                                    <span className="text-slate-300 dark:text-slate-800">|</span>
                                    <button
                                        onClick={clearAll}
                                        className="text-slate-500 hover:text-rose-500 transition-colors flex items-center gap-1"
                                    >
                                        <Trash2 size={12} /> Clear
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Notification List Body */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 divide-y divide-slate-100 dark:divide-slate-900/50">
                        {displayedNotifications.length === 0 ? (
                            <div className="h-64 flex flex-col items-center justify-center text-slate-400 dark:text-slate-600 space-y-2">
                                <Bell size={40} className="stroke-[1.5]" />
                                <p className="text-xs font-bold uppercase tracking-wider">No Alerts Active</p>
                            </div>
                        ) : (
                            displayedNotifications.map((notif) => (
                                <div
                                    key={notif.id}
                                    onClick={() => markAsRead(notif.id)}
                                    className={`pt-3 first:pt-0 cursor-pointer group transition-colors p-3 rounded-2xl ${
                                        !notif.read
                                            ? 'bg-blue-500/5 dark:bg-blue-500/10 border border-blue-500/20'
                                            : 'hover:bg-slate-100/60 dark:hover:bg-slate-900/30'
                                    }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="mt-0.5">{getIcon(notif.type)}</div>
                                        <div className="flex-1 space-y-1">
                                            <div className="flex justify-between items-start">
                                                <h4 className={`text-xs font-bold ${!notif.read ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>
                                                    {notif.title}
                                                </h4>
                                                <span className="text-[9px] text-slate-400 font-mono flex items-center gap-1">
                                                    <Clock size={9} /> {notif.timestamp}
                                                </span>
                                            </div>
                                            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                                                {notif.message}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Footer Close Button */}
                    <div className="p-4 border-t border-slate-200 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-950/40">
                        <Button variant="outline" className="w-full text-xs font-bold" onClick={onClose}>
                            Close Drawer
                        </Button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default NotificationDrawer;
