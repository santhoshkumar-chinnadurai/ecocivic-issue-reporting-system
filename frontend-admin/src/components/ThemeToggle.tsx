import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';

const ThemeToggle: React.FC = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="p-2 sm:p-2.5 rounded-full bg-gray-200 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-white/20 transition-colors border border-gray-300 dark:border-white/5 relative overflow-hidden flex items-center justify-center"
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
                <Moon size={18} />
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
                <Sun size={18} />
            </motion.div>
        </button>
    );
};

export default ThemeToggle;
