import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import Badge from '../components/ui/Badge';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import Spinner from '../components/ui/Spinner';
import api from '../api/axios';
import { Trophy, Medal, Crown, Star, Flame, Award, Users, HardHat } from 'lucide-react';

const LeaderboardPage: React.FC = () => {
    const [tab, setTab] = useState<'citizen' | 'worker'>('citizen');
    const [citizens, setCitizens] = useState<any[]>([]);
    const [workers, setWorkers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchLeaderboardData();
    }, []);

    const fetchLeaderboardData = async () => {
        try {
            setLoading(true);
            const res = await api.get('/users');
            const allUsers = Array.isArray(res.data) ? res.data : [];

            // Citizens sorted by points
            const citizenUsers = allUsers
                .filter((u: any) => !u.role || u.role === 'CITIZEN')
                .sort((a: any, b: any) => (b.points || 0) - (a.points || 0))
                .map((u: any, idx: number) => ({
                    rank: idx + 1,
                    name: u.email ? u.email.split('@')[0] : `User #${u.user_id ? u.user_id.slice(0, 4) : '000'}`,
                    points: u.points || 0,
                    resolved: Math.floor((u.points || 0) / 50),
                    badges: (u.points || 0) >= 300 ? ['Civic Guardian', 'Top Reporter'] : (u.points || 0) >= 50 ? ['Active Neighbor'] : ['Citizen']
                }));

            // Workers sorted by points
            const workerUsers = allUsers
                .filter((u: any) => u.role === 'WORKER')
                .sort((a: any, b: any) => (b.points || 0) - (a.points || 0))
                .map((u: any, idx: number) => ({
                    rank: idx + 1,
                    name: u.email ? u.email.split('@')[0] : `Crew #${u.user_id ? u.user_id.slice(0, 4) : '000'}`,
                    rating: (u.points || 0) > 0 ? '5.0 Rating' : 'Unrated',
                    completed: Math.floor((u.points || 0) / 50),
                    points: u.points || 0
                }));

            setCitizens(citizenUsers);
            setWorkers(workerUsers);
        } catch (error) {
            console.error('Failed to load leaderboard data', error);
            setCitizens([]);
            setWorkers([]);
        } finally {
            setLoading(false);
        }
    };

    const getRankBadge = (rank: number) => {
        if (rank === 1) return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-xs font-black"><Crown size={14} /> 1st</span>;
        if (rank === 2) return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-300/40 text-slate-700 dark:text-slate-300 border border-slate-400/30 text-xs font-black"><Medal size={14} /> 2nd</span>;
        if (rank === 3) return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-500/15 text-orange-600 dark:text-orange-400 border border-orange-500/30 text-xs font-black"><Medal size={14} /> 3rd</span>;
        return <span className="font-mono font-black text-slate-500 dark:text-slate-400 text-sm">#{rank}</span>;
    };

    const content = (
        <div className="space-y-6 text-left animate-in fade-in duration-300">
            {/* Header */}
            <div className="pb-6 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-3">
                    <span className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                        <Trophy size={24} />
                    </span>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">Community Rankings</h1>
                        <p className="text-slate-600 dark:text-slate-400 mt-1 text-xs font-medium">Monitoring civic participation XP and municipal worker crew resolution achievements.</p>
                    </div>
                </div>
            </div>

            {/* Tab Selectors */}
            <div className="flex gap-2 p-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm max-w-md text-xs font-extrabold">
                <button
                    onClick={() => setTab('citizen')}
                    className={`flex-1 py-2.5 px-4 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
                        tab === 'citizen'
                            ? 'bg-blue-600 text-white shadow-md font-black'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                >
                    <Users size={15} /> Citizen Reporters
                </button>
                <button
                    onClick={() => setTab('worker')}
                    className={`flex-1 py-2.5 px-4 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
                        tab === 'worker'
                            ? 'bg-blue-600 text-white shadow-md font-black'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                >
                    <HardHat size={15} /> Worker Crews
                </button>
            </div>

            {/* Leaderboard Card & Table */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm max-w-4xl">
                <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Flame className="h-5 w-5 text-amber-500 animate-pulse" />
                        <h3 className="text-xs font-black uppercase tracking-widest text-slate-800 dark:text-slate-200">
                            {tab === 'citizen' ? 'Top Active Citizen Reporters' : 'Top Performing Municipal Crews'}
                        </h3>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400">Live XP Leaderboard</span>
                </div>

                <div className="overflow-x-auto">
                    {tab === 'citizen' ? (
                        <table className="w-full text-left text-xs border-collapse">
                            <thead>
                                <tr className="bg-slate-100/80 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-extrabold uppercase tracking-wider">
                                    <th className="p-4 w-20 text-center">Rank</th>
                                    <th className="p-4">Reporter Name</th>
                                    <th className="p-4 text-center">Reports Verified</th>
                                    <th className="p-4">Earned Badges</th>
                                    <th className="p-4 text-right">XP Points</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/80 font-medium">
                                {citizens.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="p-8 text-center text-slate-500 font-bold">
                                            No registered citizen rankings logged
                                        </td>
                                    </tr>
                                ) : (
                                    citizens.map((item) => (
                                        <tr key={item.rank} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                                            <td className="p-4 text-center">{getRankBadge(item.rank)}</td>
                                            <td className="p-4 font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                                                <div className="h-8 w-8 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 font-black flex items-center justify-center uppercase text-xs">
                                                    {item.name.slice(0, 2)}
                                                </div>
                                                <span>{item.name}</span>
                                            </td>
                                            <td className="p-4 text-center font-mono font-black text-slate-700 dark:text-slate-300">{item.resolved}</td>
                                            <td className="p-4 flex gap-1.5 flex-wrap">
                                                {item.badges.map((b: string, i: number) => (
                                                    <Badge key={i} variant={i === 0 ? 'primary' : 'gray'}>{b}</Badge>
                                                ))}
                                            </td>
                                            <td className="p-4 text-right font-black text-blue-600 dark:text-blue-400 text-sm">{item.points} XP</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    ) : (
                        <table className="w-full text-left text-xs border-collapse">
                            <thead>
                                <tr className="bg-slate-100/80 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-extrabold uppercase tracking-wider">
                                    <th className="p-4 w-20 text-center">Rank</th>
                                    <th className="p-4">Crew Lead</th>
                                    <th className="p-4 text-center">Crew Rating</th>
                                    <th className="p-4 text-center">Tasks Completed</th>
                                    <th className="p-4 text-right">Earned Points</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/80 font-medium">
                                {workers.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="p-8 text-center text-slate-500 font-bold">
                                            No municipal worker crew rankings logged
                                        </td>
                                    </tr>
                                ) : (
                                    workers.map((item) => (
                                        <tr key={item.rank} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                                            <td className="p-4 text-center">{getRankBadge(item.rank)}</td>
                                            <td className="p-4 font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                                                <div className="h-8 w-8 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-black flex items-center justify-center uppercase text-xs">
                                                    {item.name.slice(0, 2)}
                                                </div>
                                                <span>{item.name}</span>
                                            </td>
                                            <td className="p-4 text-center text-amber-500 font-black">{item.rating}</td>
                                            <td className="p-4 text-center font-mono font-black text-slate-700 dark:text-slate-300">{item.completed}</td>
                                            <td className="p-4 text-right font-black text-blue-600 dark:text-blue-400 text-sm">{item.points} XP</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );

    if (token) {
        return <DashboardLayout>{content}</DashboardLayout>;
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#030712] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300 flex flex-col justify-between">
            <Navbar />
            <main className="max-w-6xl mx-auto px-6 py-12 flex-1 w-full">
                {content}
            </main>
            <Footer />
        </div>
    );
};

export default LeaderboardPage;
