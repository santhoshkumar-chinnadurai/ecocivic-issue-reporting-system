import React, { useState, useEffect, useRef } from 'react';
import { Send, MessageSquare, Circle, Image, Paperclip } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import api from '../../api/axios';

interface Message {
    id: number;
    sender: string;
    text: string;
    time: string;
    isSelf: boolean;
}

interface Contact {
    id: string;
    name: string;
    role: string;
    avatar: string;
    online: boolean;
    dept?: string;
}

const ChatWindow: React.FC = () => {
    const user = (() => {
        try {
            const raw = localStorage.getItem('user');
            return raw && raw !== 'undefined' ? JSON.parse(raw) : {};
        } catch {
            return {};
        }
    })();
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchChatUsers();
    }, [user.role]);

    const fetchChatUsers = async () => {
        try {
            const res = await api.get('/users');
            const allUsers = Array.isArray(res.data) ? res.data : [];
            const otherUsers = allUsers.filter((u: any) => u.email !== user.email && u.user_id !== user.user_id && u.id !== user.id);
            
            const contactList: Contact[] = otherUsers.map((u: any) => ({
                id: u.user_id || u.id || u.email,
                name: u.email ? u.email.split('@')[0] : `User #${u.user_id?.slice(0, 4)}`,
                role: u.role || 'CITIZEN',
                avatar: u.email ? u.email.substring(0, 2).toUpperCase() : 'US',
                online: true,
                dept: u.role === 'OFFICIAL' ? 'Ward Dispatcher' : u.role === 'WORKER' ? 'Field Crew' : 'Citizen Reporter'
            }));

            setContacts(contactList);
            if (contactList.length > 0) {
                setSelectedContact(contactList[0]);
            }
        } catch (error) {
            console.error('Failed to load chat contacts', error);
            setContacts([]);
        }
    };

    useEffect(() => {
        if (!selectedContact) return;
        setMessages([
            { id: 1, sender: selectedContact.name, text: `Channel established with ${selectedContact.name} (${selectedContact.dept || selectedContact.role}).`, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), isSelf: false }
        ]);
    }, [selectedContact]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputText.trim() || !selectedContact) return;

        const newMsg: Message = {
            id: Date.now(),
            sender: 'You',
            text: inputText,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isSelf: true
        };

        setMessages(prev => [...prev, newMsg]);
        setInputText('');

        setIsTyping(true);
        setTimeout(() => {
            setIsTyping(false);
            const replies = [
                `Received! forwarding this note to the ward engineering team.`,
                `Acknowledged. The operations matrix has updated logs.`,
                `Understood. I will verify the GPS telemetry coordinate tracking now.`
            ];
            const randomReply = replies[Math.floor(Math.random() * replies.length)];
            const replyMsg: Message = {
                id: Date.now() + 1,
                sender: selectedContact.name,
                text: randomReply,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                isSelf: false
            };
            setMessages(prev => [...prev, replyMsg]);
        }, 1800);
    };

    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl h-[70vh] flex flex-col md:flex-row overflow-hidden shadow-sm text-left">
            {/* Contacts Column */}
            <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 flex flex-col">
                <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
                        <MessageSquare size={15} className="text-emerald-600 dark:text-emerald-400" /> Contacts Directory
                    </h3>
                </div>
                <div className="flex-1 overflow-y-auto divide-y divide-slate-200 dark:divide-slate-800/80">
                    {contacts.map((contact) => (
                        <div
                            key={contact.id}
                            onClick={() => setSelectedContact(contact)}
                            className={`p-3.5 flex items-center gap-3 cursor-pointer transition-colors ${
                                selectedContact?.id === contact.id
                                    ? 'bg-emerald-500/10 dark:bg-slate-800/80 border-l-4 border-emerald-600'
                                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                            }`}
                        >
                            <div className="h-9 w-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-black text-xs uppercase relative shrink-0">
                                {contact.avatar}
                                {contact.online && (
                                    <span className="absolute -bottom-0.5 -right-0.5 block h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900" />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-black text-slate-900 dark:text-white truncate">{contact.name}</p>
                                <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate font-medium mt-0.5">{contact.dept || contact.role}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat Area */}
            {selectedContact ? (
                <div className="flex-1 flex flex-col h-full bg-slate-50/50 dark:bg-slate-950/40">
                    {/* Header */}
                    <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-black text-xs uppercase">
                                {selectedContact.avatar}
                            </div>
                            <div>
                                <p className="text-xs font-black text-slate-900 dark:text-white leading-tight">{selectedContact.name}</p>
                                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1 font-medium">
                                    <Circle size={6} className={selectedContact.online ? 'fill-emerald-500 text-emerald-500' : 'fill-slate-400 text-slate-400'} />
                                    {selectedContact.online ? 'Active Channel' : 'Offline'} • {selectedContact.dept || selectedContact.role}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Messages Board */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex ${msg.isSelf ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`max-w-[70%] p-4 rounded-2xl shadow-sm text-xs leading-relaxed ${
                                    msg.isSelf
                                        ? 'bg-emerald-600 text-white rounded-tr-none font-medium'
                                        : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-tl-none border border-slate-200 dark:border-slate-700 font-medium'
                                }`}>
                                    <p>{msg.text}</p>
                                    <span className={`block text-[9px] mt-1.5 text-right font-mono ${msg.isSelf ? 'text-emerald-100' : 'text-slate-400 dark:text-slate-400'}`}>
                                        {msg.time}
                                    </span>
                                </div>
                            </div>
                        ))}

                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3.5 rounded-2xl rounded-tl-none flex items-center gap-1 shadow-sm">
                                    <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-bounce"></span>
                                    <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                                    <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                                </div>
                            </div>
                        )}
                        <div ref={scrollRef} />
                    </div>

                    {/* Input */}
                    <form onSubmit={handleSendMessage} className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex gap-2">
                        <Input
                            type="text"
                            placeholder="Type encryption message..."
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            className="flex-1 text-xs"
                            rightIcon={
                                <div className="flex items-center gap-1">
                                    <button type="button" className="p-1 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg cursor-pointer">
                                        <Image size={15} />
                                    </button>
                                    <button type="button" className="p-1 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg mr-1 cursor-pointer">
                                        <Paperclip size={15} />
                                    </button>
                                </div>
                            }
                        />
                        <Button type="submit" className="px-5 py-3 shrink-0 font-extrabold shadow-[0_0_20px_rgba(16, 185, 129,0.25)] rounded-2xl">
                            <Send size={15} />
                        </Button>
                    </form>
                </div>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-400 dark:text-slate-600 bg-slate-50 dark:bg-slate-950/40">
                    <MessageSquare size={48} className="mb-3" />
                    <p className="text-xs font-black uppercase tracking-widest text-slate-600 dark:text-slate-400">Select a contact to open channel</p>
                </div>
            )}
        </div>
    );
};

export default ChatWindow;
