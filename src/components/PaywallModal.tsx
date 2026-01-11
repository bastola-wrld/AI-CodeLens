import React from 'react';
import { X, Crown, Check, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PaywallModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const PaywallModal: React.FC<PaywallModalProps> = ({ isOpen, onClose }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/80 backdrop-blur-md"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="relative w-full max-w-lg bg-[#0a0a0c] border border-accent-cyan/30 rounded-[2rem] shadow-[0_0_50px_-12px_rgba(0,242,255,0.2)] p-8 overflow-hidden text-center"
                    >
                        {/* Decorative Background */}
                        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-accent-cyan/10 to-transparent pointer-events-none" />
                        <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary-500/20 rounded-full blur-3xl pointer-events-none" />
                        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-accent-pink/20 rounded-full blur-3xl pointer-events-none" />

                        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors z-10">
                            <X size={20} />
                        </button>

                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="relative mb-6 mx-auto w-20 h-20 bg-gradient-to-br from-gray-800 to-black rounded-2xl border border-white/10 flex items-center justify-center shadow-2xl"
                        >
                            <Crown className="text-accent-cyan" size={40} />
                        </motion.div>

                        <h2 className="text-3xl font-bold text-white mb-2">Upgrade to Pro</h2>
                        <p className="text-gray-400 text-sm mb-8">You've reached your daily free limit. Unlock unlimited AI power and elevate your code to the next level.</p>

                        <div className="grid gap-4 mb-8 text-left">
                            <div className="bg-white/5 rounded-xl p-4 border border-white/5 flex items-center justify-between group hover:border-accent-cyan/50 transition-colors cursor-pointer">
                                <div>
                                    <h3 className="font-bold text-white">Monthly Pass</h3>
                                    <p className="text-xs text-gray-400">Perfect for heavy sprints</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-xl font-bold text-accent-cyan">$19</span>
                                    <span className="text-xs text-gray-500">/mo</span>
                                </div>
                            </div>
                            <div className="bg-gradient-to-r from-primary-900/50 to-primary-800/50 rounded-xl p-4 border border-primary-500/50 flex items-center justify-between relative overflow-hidden group hover:shadow-[0_0_20px_-5px_rgba(124,58,237,0.3)] transition-all cursor-pointer">
                                <div className="absolute top-0 right-0 px-3 py-1 bg-primary-500 text-[10px] font-bold text-white rounded-bl-xl">BEST VALUE</div>
                                <div>
                                    <h3 className="font-bold text-white">Annual Pro</h3>
                                    <p className="text-xs text-gray-300">Save 40% yearly</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-xl font-bold text-white">$12</span>
                                    <span className="text-xs text-primary-200">/mo</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3 mb-8">
                            <div className="flex items-center gap-3 text-sm text-gray-300">
                                <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500"><Check size={12} /></div>
                                <span>Unlimited Code Reviews</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-300">
                                <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500"><Check size={12} /></div>
                                <span>Instant Fix Applications</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-300">
                                <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500"><Check size={12} /></div>
                                <span>Priority Access to GPT-4o</span>
                            </div>
                        </div>

                        <button className="w-full bg-white text-black py-4 rounded-xl font-bold text-sm hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
                            <Zap size={18} className="fill-black" />
                            Unlock Unlimited Access
                        </button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default PaywallModal;
