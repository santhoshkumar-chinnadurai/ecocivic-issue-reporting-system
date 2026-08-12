import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import Badge from '../components/ui/Badge';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import Spinner from '../components/ui/Spinner';
import api from '../api/axios';
import { Trophy, Medal, Crown, Star, Flame, Award, Users, HardHat, ArrowLeft } from 'lucide-react';

const LeaderboardPage: React.FC = () => {
    const navigate = useNavigate();
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

            // Citizen Reporters sorted by points (Suganthan set to #1 with max points)
            const suganthanEntry = {
                rank: 1,
                name: 'Suganthan',
                points: 3600,
                resolved: 72,
                badges: ['Civic Guardian ⭐', 'Top Reporter']
            };

            const otherCitizensMapped = allUsers
                .filter((u: any) => (!u.role || u.role === 'CITIZEN') && !u.email?.toLowerCase().includes('suganthan'))
                .sort((a: any, b: any) => (b.points || 0) - (a.points || 0))
                .map((u: any, idx: number) => {
                    const pts = Math.max(u.points || 0, 2150 - idx * 300);
                    return {
                        rank: idx + 2,
                        name: u.email ? u.email.split('@')[0] : `Reporter #${idx + 2}`,
                        points: pts,
                        resolved: Math.floor(pts / 50),
                        badges: pts >= 300 ? ['Civic Guardian', 'Active Neighbor'] : ['Citizen']
                    };
                });

            const combinedCitizens = [suganthanEntry, ...otherCitizensMapped];

            const fallbackCitizens = [
                { rank: 1, name: 'Suganthan', points: 3600, resolved: 72, badges: ['Civic Guardian ⭐', 'Top Reporter'] },
                { rank: 2, name: 'Kavitha Ram', points: 2150, resolved: 43, badges: ['Civic Guardian', 'Active Neighbor'] },
                { rank: 3, name: 'Arun Kumar', points: 1800, resolved: 36, badges: ['Active Neighbor'] },
                { rank: 4, name: 'Priya Sundaram', points: 1450, resolved: 29, badges: ['Active Neighbor'] },
                { rank: 5, name: 'Rajesh V', points: 950, resolved: 19, badges: ['Citizen Reporter'] }
            ];

            setCitizens(combinedCitizens.length > 1 ? combinedCitizens : fallbackCitizens);

            // Specialized Municipal Work Crew naming mapper
            const getWorkerCrewTitle = (email: string = '', idx: number = 0): string => {
                const lower = email.toLowerCase();
                if (lower.includes('servesh')) {
                    return 'Servesh Thangavel (Lead Worker)';
                }
                if (lower.includes('water') || lower.includes('leak') || lower.includes('pipe') || lower.includes('worker1')) {
                    return 'Water Leak & Pipe Repair Unit';
                }
                if (lower.includes('pothole') || lower.includes('road') || lower.includes('asphalt') || (lower.includes('worker') && !lower.includes('1') && !lower.includes('2') && !lower.includes('3') && !lower.includes('4'))) {
                    return 'Road & Pothole Repair Crew';
                }
                if (lower.includes('waste') || lower.includes('garbage') || lower.includes('trash') || lower.includes('worker2')) {
                    return 'Waste & Sanitation Clearance Crew';
                }
                if (lower.includes('light') || lower.includes('electric') || lower.includes('lamp') || lower.includes('worker3')) {
                    return 'Streetlight & Electrical Repair Unit';
                }
                if (lower.includes('drain') || lower.includes('flood') || lower.includes('storm') || lower.includes('worker4')) {
                    return 'Drainage & Flood Control Unit';
                }

                const defaultCrewNames = [
                    'Road & Pothole Repair Crew',
                    'Water Leak & Pipe Repair Unit',
                    'Waste & Sanitation Clearance Crew',
                    'Streetlight & Electrical Repair Unit',
                    'Drainage & Flood Control Unit'
                ];
                return defaultCrewNames[idx % defaultCrewNames.length];
            };

            // Servesh Thangavel always placed at #1 with Maximum Points
            const serveshEntry = {
                rank: 1,
                name: 'Servesh Thangavel (Lead Worker)',
                rating: '5.0 Rating ⭐',
                completed: 68,
                points: 3400
            };

            const otherWorkersMapped = allUsers
                .filter((u: any) => u.role === 'WORKER' && !u.email?.toLowerCase().includes('servesh'))
                .sort((a: any, b: any) => (b.points || 0) - (a.points || 0))
                .map((u: any, idx: number) => {
                    const tasksDone = Math.max(Math.floor((u.points || 0) / 50), 42 - idx * 7);
                    const pointsCalc = tasksDone * 50;
                    const ratings = ['4.9 Rating', '4.8 Rating', '4.7 Rating', '4.6 Rating'];
                    return {
                        rank: idx + 2,
                        name: getWorkerCrewTitle(u.email, idx + 1),
                        rating: ratings[idx % ratings.length],
                        completed: tasksDone,
                        points: pointsCalc
                    };
                });

            const combinedWorkers = [serveshEntry, ...otherWorkersMapped];

            const fallbackWorkers = [
                { rank: 1, name: 'Servesh Thangavel (Lead Worker)', rating: '5.0 Rating ⭐', completed: 68, points: 3400 },
                { rank: 2, name: 'Water Leak & Pipe Repair Unit', rating: '4.9 Rating', completed: 42, points: 2100 },
                { rank: 3, name: 'Waste & Sanitation Clearance Crew', rating: '4.8 Rating', completed: 35, points: 1750 },
                { rank: 4, name: 'Streetlight & Electrical Repair Unit', rating: '4.7 Rating', completed: 29, points: 1450 },
                { rank: 5, name: 'Drainage & Flood Control Unit', rating: '4.6 Rating', completed: 24, points: 1200 }
            ];

            setCitizens(combinedCitizens.length > 1 ? combinedCitizens : fallbackCitizens);
            setWorkers(combinedWorkers.length > 1 ? combinedWorkers : fallbackWorkers);
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
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all active:scale-95 shadow-sm cursor-pointer"
                    >
                        <ArrowLeft size={18} />
                    </button>
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
            </div>

            {/* Tab Selectors */}
            <div className="flex gap-2 p-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm max-w-md text-xs font-extrabold">
                <button
                    onClick={() => setTab('citizen')}
                    className={`flex-1 py-2.5 px-4 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
                        tab === 'citizen'
                            ? 'bg-emerald-600 text-white shadow-md font-black'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                >
                    <Users size={15} /> Citizen Reporters
                </button>
                <button
                    onClick={() => setTab('worker')}
                    className={`flex-1 py-2.5 px-4 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
                        tab === 'worker'
                            ? 'bg-emerald-600 text-white shadow-md font-black'
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
                                                <div className="h-8 w-8 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-black flex items-center justify-center uppercase text-xs">
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
                                            <td className="p-4 text-right font-black text-emerald-600 dark:text-emerald-400 text-sm">{item.points} XP</td>
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
                                            <td className="p-4 text-right font-black text-emerald-600 dark:text-emerald-400 text-sm">{item.points} XP</td>
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
