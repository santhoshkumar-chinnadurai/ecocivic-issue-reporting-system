import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Shield, ArrowRight, Activity, Users, Settings, BarChart3, Play, MapPin, CheckCircle2 } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';



const Landing = () => {
    const { scrollYProgress } = useScroll();
    const mapY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);

    const features = [
        { title: "AI Categorization", desc: "Automagic routing to correct departments.", icon: Settings, color: "text-indigo-500", glow: "from-indigo-500/20" },
        { title: "Live Tracking", desc: "Real-time updates on your reported cases.", icon: Activity, color: "text-cyan-500", glow: "from-cyan-500/20" },
        { title: "Open Analytics", desc: "Monitor city-wide issue resolutions.", icon: BarChart3, color: "text-emerald-500", glow: "from-emerald-500/20" },
        { title: "Worker Network", desc: "Directly dispatching ground crews.", icon: Users, color: "text-fuchsia-500", glow: "from-fuchsia-500/20" },
    ];

    const workflowSteps = [
        { role: "Citizen", action: "Capture & report with GPS.", icon: MapPin },
        { role: "AI System", action: "Diagnose & assign priority.", icon: Settings },
        { role: "Civil Official", action: "Approve & dispatch crew.", icon: Activity },
        { role: "Ground Worker", action: "Resolve & upload proof.", icon: CheckCircle2 },
    ];

    return (
        <div className="min-h-screen relative overflow-x-hidden bg-white dark:bg-[#050505] text-gray-900 dark:text-white font-sans selection:bg-indigo-500/30 transition-colors duration-500">
            {/* Ambient Background Elements */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] dark:opacity-[0.04] mix-blend-overlay"></div>
                
                <motion.div
                    animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
                    transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[-20%] right-[-10%] w-[60%] h-[70vw] bg-indigo-500/10 dark:bg-indigo-600/20 rounded-full blur-[120px] dark:mix-blend-screen"
                />
                <motion.div
                    animate={{ scale: [1, 1.3, 1], rotate: [0, -90, 0] }}
                    transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-[-10%] left-[-20%] w-[50%] h-[60vw] bg-cyan-500/10 dark:bg-cyan-600/15 rounded-full blur-[140px] dark:mix-blend-screen"
                />
            </div>

            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 border-b border-gray-200/50 dark:border-white/5 bg-white/70 dark:bg-black/40 backdrop-blur-2xl transition-all duration-300">
                <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
                    <Link to="/" className="flex items-center space-x-3 group">
                        <div className="h-10 w-10 relative flex items-center justify-center">
                            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-cyan-400 rounded-xl blur-md opacity-40 dark:opacity-70 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="relative h-full w-full bg-white dark:bg-black/50 backdrop-blur-md rounded-xl border border-gray-200 dark:border-white/20 flex items-center justify-center shadow-sm">
                                <Shield className="h-5 w-5 text-indigo-500 dark:text-white" />
                            </div>
                        </div>
                        <span className="text-xl font-bold tracking-tight">CivicConnect</span>
                    </Link>

                    <div className="hidden md:flex items-center space-x-8 text-sm font-semibold text-gray-600 dark:text-gray-300">
                        <a href="#features" className="hover:text-black dark:hover:text-white transition-colors">Platform</a>
                        <a href="#workflow" className="hover:text-black dark:hover:text-white transition-colors">Workflow</a>
                        <Link to="/about" className="hover:text-black dark:hover:text-white transition-colors">About</Link>
                    </div>

                    <div className="flex items-center space-x-4">
                        <ThemeToggle />
                        <Link to="/login" className="hidden sm:block text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">Sign in</Link>
                        <Link to="/signup" className="group relative px-5 py-2 overflow-hidden rounded-full font-bold text-sm bg-black dark:bg-white text-white dark:text-black shadow-lg hover:shadow-xl hover:scale-105 transition-all">
                            Get Started
                        </Link>
                    </div>
                </div>
            </nav>

            <main className="relative z-10 pt-32">
                {/* Hero Section */}
                <section className="min-h-[90vh] flex flex-col items-center justify-center px-6 relative pb-20">
                    <div className="max-w-6xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}
                            className="inline-flex items-center gap-2 px-4 py-1.5 mx-auto rounded-full border border-indigo-500/20 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 text-xs font-bold tracking-widest uppercase mb-10 shadow-sm"
                        >
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                            </span>
                            Next-gen Infrastructure
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
                            className="text-6xl md:text-8xl lg:text-[7rem] font-black tracking-tighter mb-8 leading-[0.95]"
                        >
                            Smart Cities.<br />
                            <span className="relative inline-block mt-2">
                                <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 blur-2xl opacity-20 dark:opacity-40 animate-pulse mix-blend-multiply dark:mix-blend-screen"></span>
                                <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-500 to-cyan-500 dark:from-indigo-300 dark:via-purple-300 dark:to-cyan-300">Powered by You.</span>
                            </span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                            className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-12 max-w-3xl mx-auto font-medium leading-relaxed"
                        >
                            Report issues instantly, track municipal resolutions in real-time, and help build a stronger, more connected community.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                            className="flex flex-col sm:flex-row justify-center gap-6"
                        >
                            <Link to="/signup" className="group relative flex items-center justify-center gap-3 px-10 py-5 bg-black dark:bg-white text-white dark:text-black rounded-full font-bold text-lg shadow-[0_10px_30px_rgba(0,0,0,0.1)] dark:shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:scale-105 transition-transform overflow-hidden">
                                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-black via-gray-800 to-black dark:from-white dark:via-gray-200 dark:to-white group-hover:bg-[length:200%_auto] bg-[length:100%_auto] transition-all duration-500" />
                                <span className="relative z-10 flex items-center gap-2">Report an Issue <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" /></span>
                            </Link>

                            <a href="#workflow" className="flex items-center justify-center gap-3 px-10 py-5 bg-white shadow-sm dark:shadow-none dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-full font-bold text-lg hover:bg-gray-50 dark:hover:bg-white/10 transition-colors hover:scale-[1.02]">
                                <Play fill="currentColor" size={16} className="text-indigo-600 dark:text-indigo-400" />
                                See How It Works
                            </a>
                        </motion.div>
                    </div>
                </section>



                {/* Features Bento Grid */}
                <section id="features" className="py-32 px-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="mb-20">
                            <h2 className="text-5xl md:text-6xl font-black tracking-tight mb-4">The Platform.</h2>
                            <p className="text-gray-500 dark:text-gray-400 text-xl max-w-2xl font-medium">A unified, intelligent ecosystem connecting citizens directly to the mechanisms of their city administration.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {features.map((feature, i) => (
                                <motion.div
                                    key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.6 }}
                                    className="relative group p-8 rounded-[2rem] bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 transition-all overflow-hidden block md:hover:-translate-y-2 shadow-sm"
                                >
                                    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${feature.glow} to-transparent rounded-bl-full opacity-50 block transition-transform group-hover:scale-110`}></div>
                                    <div className="relative z-10">
                                        <div className="w-16 h-16 rounded-2xl bg-white dark:bg-black/50 border border-gray-200 dark:border-white/10 flex items-center justify-center mb-6 shadow-sm">
                                            <feature.icon className={feature.color} size={30} />
                                        </div>
                                        <h3 className="text-2xl font-bold mb-3 tracking-tight">{feature.title}</h3>
                                        <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed">{feature.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Vertical Workflow Section */}
                <section id="workflow" className="py-32 px-6 relative border-t border-gray-200/50 dark:border-white/5 bg-gray-50 dark:bg-transparent">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-20">
                            <h2 className="text-5xl md:text-6xl font-black tracking-tight mb-6">How it Flows.</h2>
                            <p className="text-gray-500 text-xl font-medium">From observation to completion, every step is fully transparent.</p>
                        </div>

                        <div className="relative">
                            {/* Line connecting steps */}
                            <div className="absolute left-8 md:left-1/2 top-4 bottom-4 w-1 bg-gray-200 dark:bg-white/10 -translate-x-1/2 rounded-full hidden sm:block">
                                <motion.div style={{ scaleY: mapY, originY: 0 }} className="w-full h-full bg-gradient-to-b from-indigo-500 via-purple-500 to-cyan-400 rounded-full"></motion.div>
                            </div>

                            <div className="space-y-16 relative">
                                {workflowSteps.map((step, i) => (
                                    <motion.div
                                        key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6 }}
                                        className={`relative flex flex-col md:flex-row items-center gap-10 group ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                                    >
                                        <div className="hidden sm:flex absolute left-8 md:relative md:left-auto items-center justify-center w-16 h-16 rounded-3xl bg-white dark:bg-[#111] border-2 border-gray-200 dark:border-white/10 shrink-0 z-10 shadow-sm transition-colors group-hover:border-indigo-500 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-500/10">
                                            <step.icon size={24} className="text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
                                        </div>

                                        <div className={`w-full md:w-1/2 p-8 rounded-[2rem] bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm transition-all hover:shadow-lg dark:hover:bg-white/10 ${i % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                                            <div className="text-sm font-black text-indigo-500 tracking-widest uppercase mb-3 text-left md:text-inherit">Step 0{i+1}</div>
                                            <h4 className="font-black text-3xl mb-3">{step.role}</h4>
                                            <p className="text-xl text-gray-500 dark:text-gray-400 font-medium">{step.action}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-white dark:bg-black border-t border-gray-200 dark:border-white/10 pt-24 pb-12 px-6 relative z-10 transition-colors duration-300">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-black dark:bg-white rounded-xl flex items-center justify-center">
                            <Shield className="text-white dark:text-black" size={20} />
                        </div>
                        <span className="font-black text-2xl tracking-tight text-gray-900 dark:text-white">CivicConnect</span>
                    </div>
                    <div className="flex gap-8 text-sm font-bold tracking-widest uppercase text-gray-500">
                        <Link to="/about" className="hover:text-black dark:hover:text-white transition-colors">About</Link>
                        <a href="#" className="hover:text-black dark:hover:text-white transition-colors">Privacy</a>
                        <Link to="/admin/login" className="hover:text-black dark:hover:text-white transition-colors">Admin Portal</Link>
                    </div>
                    <div className="text-sm font-semibold text-gray-400">
                        &copy; {new Date().getFullYear()} Civic Connect. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
