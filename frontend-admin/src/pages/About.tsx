import { Link } from 'react-router-dom';
import { Shield, Target, Users, ArrowRight, Activity, Globe, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const About = () => {
    return (
        <div className="min-h-screen relative overflow-x-hidden bg-[#0A0A0A] text-white font-sans selection:bg-indigo-500/30">

            {/* Ambient Background Elements */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay"></div>
                <motion.div
                    animate={{ x: [0, -30, 0], y: [0, 30, 0] }}
                    transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[120px]"
                />
                <motion.div
                    animate={{ x: [0, 40, 0], y: [0, -20, 0] }}
                    transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-cyan-600/10 rounded-full blur-[120px]"
                />
            </div>

            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/20 backdrop-blur-2xl">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="flex justify-between h-20 items-center">
                        <Link to="/" className="flex items-center space-x-3 group">
                            <div className="h-10 w-10 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                                <Shield className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-xl font-bold tracking-tight text-white">CivicConnect</span>
                        </Link>

                        <div className="flex items-center space-x-6">
                            <Link to="/login" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Log in</Link>
                            <Link to="/signup" className="px-5 py-2.5 bg-white text-black font-semibold text-sm hover:bg-gray-100 transition-all rounded-full">
                                Get Started
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="relative pt-40 pb-20 lg:pt-56 lg:pb-32 border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/10 text-indigo-400 text-xs font-semibold tracking-wide mb-8"
                    >
                        Our Mission
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-[1.1] text-white"
                    >
                        Building better <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">cities together.</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="max-w-3xl mx-auto text-xl text-gray-400 leading-relaxed mb-12"
                    >
                        CivicConnect empowers citizens to report issues effortlessly, bridging the gap between communities and local governments for rapid, transparent resolution.
                    </motion.p>
                </div>
            </header>

            {/* Core Values / Pillars */}
            <section className="py-32 relative z-10 bg-white/[0.01]">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Target,
                                title: 'Precision Routing',
                                desc: 'Smart categorization ensures your reports instantly reach the right department.'
                            },
                            {
                                icon: Activity,
                                title: 'Real-time Tracking',
                                desc: 'Monitor the status of your reports with complete transparency at every step.'
                            },
                            {
                                icon: Users,
                                title: 'Community Driven',
                                desc: 'Join thousands of citizens actively improving their neighborhoods every day.'
                            },
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="p-8 rounded-[2rem] bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] transition-colors"
                            >
                                <div className="h-14 w-14 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-6">
                                    <stat.icon size={26} />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3 tracking-tight">{stat.title}</h3>
                                <p className="text-gray-400 leading-relaxed">{stat.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-32 flex flex-col items-center border-t border-white/5">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">How it works.</h2>
                        <p className="text-gray-400 text-lg">A seamless experience from observation to resolution.</p>
                    </div>

                    <div className="space-y-24">
                        {[
                            {
                                step: '01',
                                title: 'Capture the issue.',
                                desc: 'See something that needs fixing? Snap a photo, add a brief description, and our system will automatically pinpoint the location.',
                                icon: Globe,
                                align: 'flex-row'
                            },
                            {
                                step: '02',
                                title: 'Smart dispatch.',
                                desc: 'We route your report directly to the relevant municipal authority, skipping the bureaucracy and accelerating response times.',
                                icon: Zap,
                                align: 'flex-row-reverse'
                            },
                            {
                                step: '03',
                                title: 'Track progress.',
                                desc: 'Receive real-time updates as your city administration reviews, assigns, and resolves the issue you reported.',
                                icon: Shield,
                                align: 'flex-row'
                            },
                        ].map((item, i) => (
                            <div key={i} className={`flex flex-col md:${item.align} items-center gap-12 lg:gap-20`}>
                                <div className="flex-1">
                                    <div className="text-indigo-400 font-medium text-sm mb-3">Step {item.step}</div>
                                    <h3 className="text-3xl font-bold tracking-tight text-white mb-4">{item.title}</h3>
                                    <p className="text-lg text-gray-400 leading-relaxed max-w-lg">{item.desc}</p>
                                </div>
                                <div className="flex-1 flex justify-center w-full">
                                    <div className="w-full max-w-sm aspect-square relative rounded-[3rem] bg-gradient-to-tr from-indigo-500/10 to-cyan-500/10 flex items-center justify-center border border-white/10 overflow-hidden">
                                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] mix-blend-overlay"></div>
                                        <item.icon size={80} className="text-white/20" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Join Section */}
            <section className="py-32 relative z-10 text-center border-t border-white/5">
                <div className="max-w-4xl mx-auto px-6">
                    <h2 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-8">
                        Ready to make <br /> a difference?
                    </h2>
                    <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
                        Join thousands of citizens improving their communities. Create an account in seconds.
                    </p>
                    <Link to="/signup" className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black rounded-full font-semibold hover:scale-105 transition-transform">
                        Get Started <ArrowRight size={18} />
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-[#0A0A0A] py-12 border-t border-white/5">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center space-x-2">
                        <Shield className="h-5 w-5 text-indigo-400" />
                        <span className="text-lg font-bold text-white tracking-tight">CivicConnect</span>
                    </div>
                    <div className="text-sm text-gray-500">
                        &copy; {new Date().getFullYear()} CivicConnect. All rights reserved.
                    </div>
                    <div className="flex gap-6 text-sm font-medium text-gray-400">
                        <Link to="/" className="hover:text-white transition-colors">Home</Link>
                        <Link to="/login" className="hover:text-white transition-colors">Log In</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default About;
