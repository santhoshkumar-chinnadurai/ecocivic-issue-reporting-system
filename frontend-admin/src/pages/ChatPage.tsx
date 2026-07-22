import React from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import ChatWindow from '../components/common/ChatWindow';

const ChatPage: React.FC = () => {
    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="pb-6 border-b border-slate-200 dark:border-slate-900 text-left">
                    <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Live Chat</h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-1.5 text-xs font-medium">Real-time encryption channel interfaces between Citizens, Ward Officials, and Crew Workers.</p>
                </div>
                <ChatWindow />
            </div>
        </DashboardLayout>
    );
};

export default ChatPage;
