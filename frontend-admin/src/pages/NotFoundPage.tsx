import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import Button from '../components/ui/Button';

const NotFoundPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#030712] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300 flex flex-col justify-between">
            <Navbar />
            <main className="max-w-4xl mx-auto px-6 py-20 flex-1 flex flex-col items-center justify-center text-center">
                <div className="p-4 rounded-3xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 mb-6">
                    <ShieldAlert size={56} className="stroke-[1.5]" />
                </div>
                
                <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight">
                    404 — Page Not Found
                </h1>
                
                <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base font-medium max-w-md mt-4 leading-relaxed">
                    The municipal route or page address you requested does not exist or has been relocated in the system matrix.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-3 mt-8">
                    <Button 
                        onClick={() => navigate(-1)} 
                        variant="outline" 
                        className="w-full sm:w-auto px-6 py-3 font-extrabold rounded-2xl flex items-center gap-2"
                    >
                        <ArrowLeft size={16} /> Go Back
                    </Button>
                    
                    <Link to="/dashboard" className="w-full sm:w-auto">
                        <Button className="w-full sm:w-auto px-6 py-3 font-extrabold shadow-[0_0_20px_rgba(16, 185, 129,0.25)] rounded-2xl flex items-center gap-2">
                            <Home size={16} /> Return to Dashboard
                        </Button>
                    </Link>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default NotFoundPage;
