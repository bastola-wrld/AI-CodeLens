import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, History, Settings, Sparkles, LogOut, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen = true, onClose }) => {
    const { logout, user } = useAuth();
    const navItems = [
        { icon: <MessageSquare size={18} />, label: 'Conversations' },
        { icon: <History size={18} />, label: 'History' },
        { icon: <Settings size={18} />, label: 'Settings' },
    ];

    // Mobile overlay
    const Overlay = () => (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-20"
        />
    );

    const sidebarContent = (
        <aside className={`
            fixed md:relative inset-y-0 left-0 z-30
            w-64 h-full bg-white dark:bg-[#020617] border-r border-gray-100 dark:border-white/5 
            flex flex-col transition-transform duration-300 md:translate-x-0
            ${isOpen ? 'translate-x-0' : '-translate-x-full'}
            md:flex
        `}>
            <div className="p-8 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-600/30">
                        <Sparkles className="text-white" size={20} />
                    </div>
                    <span className="font-display font-bold text-xl tracking-tight">Antigravity</span>
                </div>
                {onClose && (
                    <button onClick={onClose} className="md:hidden p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                        <X size={20} />
                    </button>
                )}
            </div>

            <nav className="flex-1 px-4 space-y-2">
                {navItems.map((item, idx) => (
                    <motion.button
                        key={idx}
                        whileHover={{ x: 4 }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-white hover:bg-primary-50 dark:hover:bg-white/5 rounded-2xl transition-all font-semibold text-sm"
                    >
                        {item.icon}
                        <span>{item.label}</span>
                    </motion.button>
                ))}
            </nav>

            <div className="p-6 mt-auto">
                <div className="p-4 glass rounded-3xl mb-4">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-full bg-accent-rose flex items-center justify-center text-[10px] font-bold text-white uppercase">
                            {user?.email[0]}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-xs font-bold truncate">{user?.email}</p>
                            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Elite Member</p>
                        </div>
                    </div>
                </div>
                <button
                    onClick={logout}
                    className="w-full flex items-center gap-2 px-4 py-3 text-accent-rose hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-2xl transition-all font-bold text-xs uppercase tracking-wider"
                >
                    <LogOut size={16} />
                    <span>Disconnect</span>
                </button>
            </div>
        </aside>
    );

    return (
        <>
            <AnimatePresence>
                {isOpen && onClose && <Overlay />}
            </AnimatePresence>
            {sidebarContent}
        </>
    );
};

export default Sidebar;
