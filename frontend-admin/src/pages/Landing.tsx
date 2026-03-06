import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Shield, ArrowRight, Activity, Users, Settings, BarChart3, Play } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';

const AnimatedCounter = ({ value, duration = 2 }: { value: number, duration?: number }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let startTime: number | null = null;
        let animationFrame: number;

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const percentage = Math.min(progress / (duration * 1000), 1);

            const easeProgress = percentage === 1 ? 1 : 1 - Math.pow(2, -10 * percentage);
            setCount(Math.floor(easeProgress * value));

            if (percentage < 1) {
                animationFrame = requestAnimationFrame(animate);
            }
        };

        animationFrame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrame);
    }, [value, duration]);

    return <span>{count.toLocaleString()}</span>;
};

const Landing = () => {
    const { scrollYProgress } = useScroll();
    const yHero = useTransform(scrollYProgress, [0, 1], [0, 300]);
    const opacityHero = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

    const features = [
        { title: "AI Allocation", desc: "Smart routing of issues to the right department.", icon: Settings, color: "text-indigo-400" },
        { title: "Live Tracking", desc: "Real-time updates on your reported civic issues.", icon: Activity, color: "text-cyan-400" },
        { title: "Worker App", desc: "Dedicated interfaces for ground staff efficiency.", icon: Users, color: "text-purple-400" },
        { title: "Analytics", desc: "Transparent governance with public data.", icon: BarChart3, color: "text-emerald-400" },
    ];

    const workflowSteps = [
        { role: "Citizen", action: "Reports an issue with photo & GPS." },
        { role: "AI System", action: "Categorizes & assigns priority." },
        { role: "Official", action: "Approves & dispatches worker." },
        { role: "Worker", action: "Resolves & uploads proof." },
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0A0A0A] text-gray-900 dark:text-white font-sans selection:bg-indigo-500/30 overflow-hidden relative transition-colors duration-300">
            {/* Parallax Background Noise & Blobs */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay"></div>

                <motion.div
                    animate={{ x: [0, 50, 0], y: [0, -50, 0] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/20 rounded-full blur-[120px]"
                />
                <motion.div
                    animate={{ x: [0, -50, 0], y: [0, 50, 0] }}
                    transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan-600/20 rounded-full blur-[120px]"
                />
            </div>

            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 border-b border-gray-200 dark:border-white/5 bg-white/80 dark:bg-black/20 backdrop-blur-xl transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2 cursor-pointer group">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                            <Shield size={18} className="text-white" />
                        </div>
                        <span className="font-semibold text-lg tracking-tight">Civic</span>
                    </div>
                    <div className="hidden md:flex items-center gap-8 text-sm text-gray-600 dark:text-gray-400">
                        <a href="#features" className="hover:text-gray-900 dark:hover:text-white transition-colors">Features</a>
                        <a href="#workflow" className="hover:text-gray-900 dark:hover:text-white transition-colors">Workflow</a>
                        <Link to="/about" className="hover:text-gray-900 dark:hover:text-white transition-colors">About</Link>
                    </div>
                    <div className="flex items-center gap-4">
                        <ThemeToggle />
                        <Link to="/admin/login" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors hidden sm:block">Admin</Link>
                        <Link to="/signup" className="text-sm px-4 py-2 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 transition-all border border-gray-200 dark:border-white/10">Sign In</Link>
                    </div>
                </div>
            </nav>

            <main className="relative z-10 pt-32">
                {/* Hero Section */}
                <section className="min-h-[80vh] flex flex-col items-center justify-center px-6 relative">
                    <motion.div style={{ y: yHero, opacity: opacityHero }} className="text-center max-w-4xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gray-200 dark:border-white/10 bg-white/50 dark:bg-white/5 backdrop-blur-md mb-8"
                        >
                            <span className="flex h-2 w-2 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            <span className="text-xs font-medium text-gray-700 dark:text-gray-300 tracking-wide">System Online</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
                            className="text-5xl md:text-8xl font-bold tracking-tighter mb-6 leading-tight"
                        >
                            Smart Cities.<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Powered by You.</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
                            className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed"
                        >
                            Report issues, track resolutions, and build a better community with our AI-driven civic reporting platform.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}
                            className="flex flex-col sm:flex-row justify-center gap-4"
                        >
                            <Link to="/signup" className="group relative flex items-center justify-center gap-2 px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-black rounded-full font-medium transition-transform hover:scale-105 overflow-hidden shadow-lg shadow-gray-400/20 dark:shadow-none">
                                <span>Report an Issue</span>
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                <div className="absolute inset-0 bg-white/10 dark:bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity blur-md"></div>
                            </Link>
                            <Link to="/login" className="flex items-center justify-center gap-2 px-8 py-4 bg-black/5 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-full font-medium hover:bg-black/10 dark:hover:bg-white/10 transition-all hover:scale-105">
                                <Play size={16} className="text-indigo-500 dark:text-gray-400" />
                                Track Complaint
                            </Link>
                        </motion.div>
                    </motion.div>
                </section>

                {/* Dashboard Preview Section */}
                <section className="py-24 px-6 relative">
                    <div className="max-w-5xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1 }}
                            className="relative rounded-2xl md:rounded-[2.5rem] p-2 md:p-6 bg-white/60 dark:bg-white/5 backdrop-blur-2xl border border-gray-200 dark:border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-2xl overflow-hidden group hover:shadow-[0_40px_80px_rgba(79,70,229,0.15)] transition-shadow duration-700"
                        >
                            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 to-cyan-500/5 dark:from-indigo-500/10 dark:to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                            <div className="bg-white dark:bg-[#0A0A0A] rounded-xl md:rounded-3xl border border-gray-200 dark:border-white/10 overflow-hidden relative shadow-[0_0_50px_rgba(0,0,0,0.1)] dark:shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                                {/* Mac OS Window controls */}
                                <div className="h-10 bg-gray-50 dark:bg-white/5 border-b border-gray-200 dark:border-white/10 flex items-center px-4 gap-2">
                                    <div className="w-3 h-3 rounded-full bg-[#FF5F56]"></div>
                                    <div className="w-3 h-3 rounded-full bg-[#FFBD2E]"></div>
                                    <div className="w-3 h-3 rounded-full bg-[#27C93F]"></div>
                                    <div className="flex-1 text-center text-xs text-gray-500 font-medium">Dashboard Preview</div>
                                </div>

                                <div className="p-6 md:p-10 grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="col-span-1 md:col-span-2 space-y-6">
                                        <div className="flex gap-4">
                                            <div className="flex-1 p-6 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/5 hover:border-indigo-500/50 transition-colors">
                                                <div className="text-gray-500 dark:text-gray-400 text-sm mb-2">Total Complaints</div>
                                                <div className="text-4xl font-bold"><AnimatedCounter value={12489} /></div>
                                            </div>
                                            <div className="flex-1 p-6 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/5 hover:border-cyan-500/50 transition-colors">
                                                <div className="text-gray-500 dark:text-gray-400 text-sm mb-2">Resolved</div>
                                                <div className="text-4xl font-bold text-cyan-600 dark:text-cyan-400"><AnimatedCounter value={11204} /></div>
                                            </div>
                                            <div className="flex-1 p-6 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/5 hover:border-purple-500/50 transition-colors hidden sm:block">
                                                <div className="text-gray-500 dark:text-gray-400 text-sm mb-2">Active Workers</div>
                                                <div className="text-4xl font-bold text-purple-600 dark:text-purple-400"><AnimatedCounter value={342} /></div>
                                            </div>
                                        </div>
                                        <div className="h-48 rounded-2xl bg-gradient-to-r from-gray-100 dark:from-white/5 to-transparent border border-gray-200 dark:border-white/5 p-6 flex items-end gap-2 overflow-hidden">
                                            {[40, 70, 45, 90, 65, 85, 100].map((h, i) => (
                                                <motion.div
                                                    key={i}
                                                    initial={{ height: 0 }}
                                                    whileInView={{ height: `${h}%` }}
                                                    viewport={{ once: true }}
                                                    transition={{ delay: i * 0.1, duration: 0.8 }}
                                                    className="flex-1 bg-indigo-500/50 hover:bg-indigo-400 transition-colors rounded-t-sm"
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Recent Activity</div>
                                        {[
                                            { title: "Pothole Fixed", time: "2m ago", status: "success" },
                                            { title: "Streetlight Broken", time: "15m ago", status: "pending" },
                                            { title: "Water Leak Reported", time: "1h ago", status: "progress" },
                                            { title: "Garbage Cleared", time: "3h ago", status: "success" },
                                        ].map((item, i) => (
                                            <div key={i} className="p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/5 flex items-center justify-between hover:bg-gray-100 dark:hover:bg-white/10 hover:scale-[1.02] transition-all">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-2 h-2 rounded-full ${item.status === 'success' ? 'bg-green-500 dark:bg-green-400' : item.status === 'pending' ? 'bg-amber-500 dark:bg-amber-400' : 'bg-blue-500 dark:bg-blue-400'} ${item.status === 'progress' ? 'animate-pulse' : ''}`} />
                                                    <div className="text-sm font-medium text-gray-700 dark:text-gray-200">{item.title}</div>
                                                </div>
                                                <div className="text-xs text-gray-500">{item.time}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="py-32 px-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-20">
                            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Intelligent Infrastructure</h2>
                            <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">A unified ecosystem connecting citizens directly to the mechanisms of their city.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {features.map((feature, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1, duration: 0.8 }}
                                    whileHover={{ y: -5 }}
                                    className="p-8 rounded-3xl bg-white/80 dark:bg-white/[0.03] backdrop-blur-lg border border-gray-200 dark:border-white/5 hover:border-gray-300 dark:hover:border-white/20 hover:bg-white dark:hover:bg-white/[0.05] shadow-sm hover:shadow-xl transition-all group"
                                >
                                    <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                        <feature.icon className={feature.color} size={24} />
                                    </div>
                                    <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Workflow Section */}
                <section id="workflow" className="py-32 px-6 bg-gradient-to-b from-transparent via-indigo-900/10 to-transparent relative">
                    <div className="max-w-3xl mx-auto">
                        <div className="text-center mb-20">
                            <h2 className="text-4xl font-bold tracking-tight mb-4">Transparent Workflow</h2>
                            <p className="text-gray-600 dark:text-gray-400">Seamless resolution from report to completion.</p>
                        </div>

                        <div className="relative border-l border-gray-200 dark:border-white/10 ml-6 md:mx-auto md:border-l-0">
                            {/* Desktop Line */}
                            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gray-300 dark:via-white/10 to-transparent -translate-x-1/2"></div>

                            <div className="space-y-12 relative">
                                {workflowSteps.map((step, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true, margin: "-100px" }}
                                        transition={{ duration: 0.8 }}
                                        className={`relative flex flex-col md:flex-row items-center gap-8 ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                                    >
                                        <div className="absolute left-[-29px] md:relative md:left-auto flex items-center justify-center w-14 h-14 rounded-full border-4 border-[#f8fafc] dark:border-[#0A0A0A] bg-white dark:bg-white/10 backdrop-blur-md text-gray-900 dark:text-white shadow shrink-0 z-10 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                                            <span className="text-lg font-bold">{i + 1}</span>
                                        </div>

                                        <div className={`w-full md:w-1/2 p-6 rounded-3xl bg-white/80 dark:bg-white/5 border border-gray-200 dark:border-white/5 hover:border-gray-400 dark:hover:border-white/20 shadow-sm transition-all backdrop-blur-md ${i % 2 === 0 ? 'md:text-right hover:-translate-x-1' : 'md:text-left hover:translate-x-1'}`}>
                                            <h4 className="font-semibold text-xl text-indigo-600 dark:text-indigo-400 mb-2">{step.role}</h4>
                                            <p className="text-gray-500 dark:text-gray-400 text-base">{step.action}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="border-t border-gray-200 dark:border-white/5 bg-white/40 dark:bg-black/40 pt-20 pb-10 px-6 relative z-10 transition-colors duration-300">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-2">
                        <Shield className="text-indigo-600 dark:text-indigo-400" size={24} />
                        <span className="font-semibold text-xl tracking-tight text-gray-900 dark:text-white">CivicConnect</span>
                    </div>
                    <div className="flex gap-8 text-sm text-gray-500 font-medium">
                        <Link to="/about" className="hover:text-gray-900 dark:hover:text-white transition-colors">About</Link>
                        <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Privacy</a>
                        <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Terms</a>
                    </div>
                    <div className="text-sm text-gray-600">
                        &copy; 2026 Civic Connect. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
