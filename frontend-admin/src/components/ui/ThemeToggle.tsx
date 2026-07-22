import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';

const ThemeToggle: React.FC = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="p-2 sm:p-2.5 rounded-full bg-slate-200 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors relative overflow-hidden flex items-center justify-center cursor-pointer active:scale-95 shadow-sm"
            aria-label="Toggle Theme"
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
            <motion.div
                initial={false}
                animate={{
                    rotate: theme === 'dark' ? 0 : 90,
                    scale: theme === 'dark' ? 1 : 0,
                    opacity: theme === 'dark' ? 1 : 0
                }}
                transition={{ duration: 0.2 }}
                className="absolute"
            >
                <Moon size={16} />
            </motion.div>
            <motion.div
                initial={false}
                animate={{
                    rotate: theme === 'light' ? 0 : -90,
                    scale: theme === 'light' ? 1 : 0,
                    opacity: theme === 'light' ? 1 : 0
                }}
                transition={{ duration: 0.2 }}
            >
                <Sun size={16} />
            </motion.div>
        </button>
    );
};

export default ThemeToggle;
