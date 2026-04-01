import { Link } from 'react-router-dom';
import { 
    Shield, 
    Target, 
    Users, 
    ArrowRight, 
    Activity, 
    Globe, 
    Zap, 
    CheckCircle2, 
    MapPin, 
    Award
} from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import ThemeToggle from '../components/ThemeToggle';

const StatCard = ({ value, label, delay = 0 }: { value: string, label: string, delay?: number }) => (
    <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay }}
        className="relative group p-6 rounded-[2rem] bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 overflow-hidden backdrop-blur-xl hover:bg-gray-100 dark:hover:bg-white/[0.04] transition-all"
    >
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 dark:from-indigo-500/10 dark:to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity blur-xl"></div>
        <div className="relative z-10 flex flex-col items-center justify-center text-center">
            <h4 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 via-gray-900 to-purple-600 dark:from-indigo-300 dark:via-white dark:to-purple-300 mb-2 tracking-tight">
                {value}
            </h4>
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest">{label}</p>
        </div>
    </motion.div>
);

const About = () => {
    const { scrollYProgress } = useScroll();
    const mapY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

    const fadeInUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen relative overflow-x-hidden bg-white dark:bg-[#050505] text-gray-900 dark:text-white font-sans selection:bg-indigo-500/30 transition-colors duration-500">

            {/* Premium Ambient Background Elements */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                {/* Grain overlay */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] dark:opacity-[0.04] mix-blend-overlay"></div>
                
                {/* Dynamic Glowing Orbs */}
                <motion.div
                    animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [0.05, 0.1, 0.05],
                        rotate: [0, 90, 0]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[-20%] right-[-10%] w-[60%] h-[70vw] bg-indigo-600/20 dark:bg-indigo-600/30 rounded-full blur-[140px] mix-blend-multiply dark:mix-blend-screen"
                />
                <motion.div
                    animate={{ 
                        scale: [1, 1.5, 1],
                        opacity: [0.05, 0.1, 0.05],
                        rotate: [0, -90, 0]
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-[-10%] left-[-20%] w-[60%] h-[60vw] bg-fuchsia-600/10 dark:bg-fuchsia-600/20 rounded-full blur-[140px] mix-blend-multiply dark:mix-blend-screen"
                />
            </div>

            {/* Transparent Navigation */}
            <nav className="fixed top-0 w-full z-50 border-b border-gray-200/50 dark:border-white/5 bg-white/70 dark:bg-black/40 backdrop-blur-3xl transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="flex justify-between h-20 items-center border-b border-transparent">
                        <Link to="/" className="flex items-center space-x-3 group cursor-pointer">
                            <div className="h-10 w-10 relative flex items-center justify-center">
                                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-fuchsia-500 rounded-xl blur-md opacity-40 dark:opacity-70 group-hover:opacity-100 transition-opacity duration-500" />
                                <div className="relative h-full w-full bg-white dark:bg-black/50 backdrop-blur-md rounded-xl border border-gray-200 dark:border-white/20 flex items-center justify-center overflow-hidden shadow-sm">
                                     <Shield className="h-5 w-5 text-indigo-600 dark:text-white drop-shadow-sm dark:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                                </div>
                            </div>
                            <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">CivicConnect</span>
                        </Link>

                        <div className="flex items-center space-x-4 sm:space-x-6">
                            <ThemeToggle />
                            <Link to="/login" className="hidden sm:block text-sm font-bold text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">Log in</Link>
                            <Link to="/signup" className="group relative px-5 py-2.5 overflow-hidden rounded-full font-bold text-sm bg-black dark:bg-white text-white dark:text-black shadow-lg">
                                <span className="absolute inset-0 w-full h-full bg-black dark:bg-white group-hover:bg-gray-800 dark:group-hover:bg-gray-200 transition-colors" />
                                <span className="relative text-white dark:text-black">Get Started</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="relative pt-48 pb-32 lg:pt-64 lg:pb-40 border-b border-gray-200 dark:border-white/5 overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 text-center">
                    
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="inline-flex items-center gap-2 px-5 py-2 mx-auto rounded-full border border-fuchsia-500/20 dark:border-fuchsia-500/30 bg-fuchsia-50 dark:bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-300 text-xs font-bold tracking-widest uppercase mb-12 backdrop-blur-md shadow-sm dark:shadow-[0_0_30px_rgba(217,70,239,0.15)]"
                    >
                        <Zap size={14} className="animate-pulse" />
                        Our Mission
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
                        className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-8 leading-[0.95] text-gray-900 dark:text-white"
                    >
                        Building <br/>
                        <span className="relative inline-block mt-2">
                             <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-cyan-400 blur-2xl opacity-20 dark:opacity-40 mix-blend-multiply dark:mix-blend-screen animate-pulse"></span>
                             <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-fuchsia-500 to-cyan-500 dark:from-indigo-300 dark:via-fuchsia-300 dark:to-cyan-300">better cities.</span>
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                        className="max-w-2xl mx-auto text-xl md:text-2xl text-gray-600 dark:text-gray-400 leading-relaxed font-medium"
                    >
                        CivicConnect empowers citizens to report issues effortlessly, bridging the gap between communities and local governments.
                    </motion.p>
                </div>
                
                {/* Parallax elements */}
                <motion.div style={{ y: mapY }} className="absolute bottom-[-20%] left-[10%] opacity-10 dark:opacity-20 hidden lg:block">
                    <Globe size={300} strokeWidth={0.5} className="text-blue-600 dark:text-blue-500 blur-[2px]" />
                </motion.div>
                <motion.div style={{ y: mapY }} className="absolute top-[20%] right-[5%] opacity-5 dark:opacity-10 hidden lg:block">
                    <Activity size={200} strokeWidth={1} className="text-fuchsia-600 dark:text-fuchsia-500" />
                </motion.div>
            </header>

            {/* Impact Statistics */}
            <section className="relative z-10 py-12 border-b border-gray-200 dark:border-white/5 bg-gray-50/50 dark:bg-black/20 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                         <StatCard value="25k+" label="Issues Resolved" delay={0.1} />
                         <StatCard value="120+" label="Neighborhoods" delay={0.2} />
                         <StatCard value="48h" label="Avg Response Time" delay={0.3} />
                         <StatCard value="10k+" label="Active Citizens" delay={0.4} />
                     </div>
                </div>
            </section>

            {/* Bento Grid layout for Core Values */}
            <section className="py-32 relative z-10">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="mb-20">
                        <motion.h2 
                            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
                            className="text-4xl md:text-6xl font-black tracking-tight text-gray-900 dark:text-white mb-6"
                        >
                            The pillars of <br/> <span className="text-gray-400 dark:text-gray-500">our platform.</span>
                        </motion.h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-6 md:grid-rows-2 gap-6 auto-rows-[300px]">
                        {/* Large Block */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                            className="group md:col-span-4 md:row-span-2 relative rounded-[2rem] bg-gradient-to-br from-indigo-50 dark:from-indigo-500/10 to-transparent border border-gray-200 dark:border-white/10 p-10 overflow-hidden backdrop-blur-md flex flex-col justify-end"
                        >
                            <div className="absolute top-10 right-10 p-4 bg-indigo-100 dark:bg-indigo-500/20 rounded-2xl backdrop-blur-xl border border-indigo-200 dark:border-indigo-500/30">
                                <Target size={40} className="text-indigo-600 dark:text-indigo-300" />
                            </div>
                            <div className="relative z-10 w-full md:w-2/3">
                                <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 tracking-tighter">Precision Routing to Authorities</h3>
                                <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 leading-relaxed group-hover:text-gray-900 dark:group-hover:text-gray-300 transition-colors">Our AI-assisted categorization ensures that your reports instantly bypass the bureaucracy and reach the exact department responsible for resolving them.</p>
                            </div>
                            {/* Abstract visual */}
                            <div className="absolute -bottom-20 -right-20 w-[400px] h-[400px] bg-indigo-200/50 dark:bg-indigo-500/20 rounded-full blur-3xl group-hover:bg-indigo-300/50 dark:group-hover:bg-indigo-500/30 transition-colors" />
                        </motion.div>

                        {/* Top Right Block */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
                            className="group md:col-span-2 md:row-span-1 relative rounded-[2rem] bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 p-8 overflow-hidden backdrop-blur-md flex flex-col justify-between hover:bg-gray-100 dark:hover:bg-white/[0.05] transition-colors"
                        >
                             <div className="h-12 w-12 rounded-xl bg-cyan-100 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/20 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mb-4">
                                <Activity size={24} />
                             </div>
                             <div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">Real-time Tracking</h3>
                                <p className="text-gray-500 dark:text-gray-400 leading-relaxed font-medium">Monitor status updates with complete transparency at every step.</p>
                             </div>
                        </motion.div>

                        {/* Bottom Right Block */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
                            className="group md:col-span-2 md:row-span-1 relative rounded-[2rem] bg-gradient-to-br from-fuchsia-50 dark:from-fuchsia-500/10 to-transparent border border-gray-200 dark:border-white/10 p-8 overflow-hidden backdrop-blur-md flex flex-col justify-between hover:bg-fuchsia-100/50 dark:hover:bg-white/[0.05] transition-colors"
                        >
                             <div className="h-12 w-12 rounded-xl bg-fuchsia-100 dark:bg-fuchsia-500/10 border border-fuchsia-200 dark:border-fuchsia-500/20 text-fuchsia-600 dark:text-fuchsia-400 flex items-center justify-center mb-4">
                                <Users size={24} />
                             </div>
                             <div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">Community Driven</h3>
                                <p className="text-gray-500 dark:text-gray-400 leading-relaxed font-medium">Join thousands actively improving their neighborhoods every day.</p>
                             </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* How It Works (Glassmorphic Timeline) */}
            <section className="py-32 relative z-10 border-t border-gray-200 dark:border-white/5 bg-gradient-to-b from-transparent to-gray-50 dark:to-black/50">
                <div className="max-w-5xl mx-auto px-6 lg:px-8 w-full">
                    <div className="text-center mb-32">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-200 dark:border-cyan-500/20 bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-xs font-bold tracking-widest uppercase mb-6"
                        >
                            Workflow
                        </motion.div>
                        <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-gray-900 dark:text-white mb-6">How it <span className="text-cyan-600 dark:text-cyan-400">works.</span></h2>
                        <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto font-medium">A seamless experience from observation to ultimate resolution.</p>
                    </div>

                    <div className="space-y-12">
                        {[
                            {
                                step: '01',
                                title: 'Capture the issue',
                                desc: 'See something that needs fixing? Snap a photo, add a brief description, and our system will automatically pinpoint the location using GPS.',
                                icon: MapPin,
                                color: 'from-indigo-400 to-cyan-400 dark:from-indigo-500 dark:to-cyan-500'
                            },
                            {
                                step: '02',
                                title: 'Smart dispatch',
                                desc: 'We route your report directly to the relevant municipal authority, skipping the bureaucracy and accelerating response times significantly.',
                                icon: Zap,
                                color: 'from-fuchsia-400 to-rose-400 dark:from-fuchsia-500 dark:to-rose-500'
                            },
                            {
                                step: '03',
                                title: 'Track progress',
                                desc: 'Receive real-time push updates as your city administration reviews, assigns workers, and ultimately resolves the issue you reported.',
                                icon: CheckCircle2,
                                color: 'from-green-400 to-emerald-400 dark:from-green-500 dark:to-emerald-400'
                            },
                        ].map((item, i) => (
                            <motion.div 
                                key={i} 
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1, duration: 0.6 }}
                                className="relative group"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-100 dark:via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity blur-md rounded-[2.5rem]"></div>
                                <div className="relative p-10 md:p-14 flex flex-col md:flex-row items-center gap-10 bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/10 rounded-[2.5rem] backdrop-blur-2xl hover:bg-gray-50 dark:hover:bg-white/[0.04] transition-colors shadow-sm dark:shadow-none">
                                    
                                    <div className="flex-shrink-0 relative">
                                        <div className={`absolute inset-0 bg-gradient-to-br ${item.color} rounded-3xl blur-xl opacity-20 dark:opacity-40 group-hover:opacity-40 dark:group-hover:opacity-60 transition-opacity`} />
                                        <div className={`h-24 w-24 relative bg-gradient-to-br ${item.color} rounded-3xl p-[2px] shadow-lg dark:shadow-2xl`}>
                                            <div className="h-full w-full bg-white/50 dark:bg-black/50 backdrop-blur-sm rounded-[22px] flex items-center justify-center">
                                                <item.icon size={36} className="text-gray-900 dark:text-white drop-shadow-md" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex-1 text-center md:text-left">
                                        <div className="text-indigo-600 dark:text-indigo-400 font-bold tracking-widest text-sm mb-3">STEP {item.step}</div>
                                        <h3 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white mb-4">{item.title}</h3>
                                        <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed font-medium">{item.desc}</p>
                                    </div>

                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Premium Join Section */}
            <section className="py-40 relative z-10 border-t border-gray-200 dark:border-white/5 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/50 dark:from-indigo-900/20 to-white dark:to-black/80 pointer-events-none"></div>
                <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex justify-center items-center h-20 w-20 bg-gradient-to-br from-indigo-500 to-fuchsia-500 rounded-2xl mb-10 shadow-[0_0_30px_rgba(139,92,246,0.2)] dark:shadow-[0_0_50px_rgba(139,92,246,0.3)]">
                            <Award size={40} className="text-white" />
                        </div>
                        <h2 className="text-6xl md:text-8xl font-black tracking-tighter text-gray-900 dark:text-white mb-8">
                            Ready to make <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-indigo-500 dark:from-fuchsia-400 dark:to-indigo-400">a difference?</span>
                        </h2>
                        <p className="text-2xl text-gray-600 dark:text-gray-400 mb-14 max-w-2xl mx-auto font-medium">
                            Join thousands of citizens improving their communities. Create an account in seconds.
                        </p>
                        
                        <Link to="/signup" className="group relative inline-flex items-center gap-4 px-10 py-5 bg-black dark:bg-white text-white dark:text-black rounded-full font-bold text-lg overflow-hidden lg:hover:scale-[1.02] transition-transform shadow-[0_0_20px_rgba(0,0,0,0.1)] dark:shadow-[0_0_40px_rgba(255,255,255,0.2)]">
                            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-black via-gray-800 to-black dark:from-white dark:via-gray-200 dark:to-white group-hover:bg-[length:200%_auto] bg-[length:100%_auto] transition-all duration-500 animate-gradient-x" />
                            <span className="relative z-10 flex items-center gap-3">
                                Get Started <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </span>
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-50 dark:bg-black py-16 border-t border-gray-200 dark:border-white/10 relative z-10 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 bg-indigo-500 rounded-lg flex items-center justify-center shadow-md">
                            <Shield className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">CivicConnect</span>
                    </div>
                    <div className="text-gray-500 font-medium text-sm">
                        &copy; {new Date().getFullYear()} CivicConnect. All rights reserved.
                    </div>
                    <div className="flex gap-8 text-sm font-bold tracking-wide uppercase text-gray-400">
                        <Link to="/" className="hover:text-gray-900 dark:hover:text-white transition-colors">Home</Link>
                        <Link to="/login" className="hover:text-gray-900 dark:hover:text-white transition-colors">Log In</Link>
                        <Link to="/admin/login" className="hover:text-gray-900 dark:hover:text-white transition-colors">Portal</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default About;
