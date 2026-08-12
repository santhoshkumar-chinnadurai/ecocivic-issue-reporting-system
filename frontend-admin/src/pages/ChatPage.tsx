import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import ChatWindow from '../components/common/ChatWindow';

const ChatPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="pb-6 border-b border-slate-200 dark:border-slate-900 text-left flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all active:scale-95 shadow-sm cursor-pointer"
                    >
                        <ArrowLeft size={18} />
                    </button>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Live Chat</h1>
                        <p className="text-slate-600 dark:text-slate-400 mt-1.5 text-xs font-medium">Real-time encryption channel interfaces between Citizens, Ward Officials, and Crew Workers.</p>
                    </div>
                </div>
                <ChatWindow />
            </div>
        </DashboardLayout>
    );
};

export default ChatPage;
