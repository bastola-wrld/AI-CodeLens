import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { X, Mail, Lock, LogIn, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    mode: 'login' | 'signup';
    onSwitchMode: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, mode, onSwitchMode }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);

        try {
            if (mode === 'signup') {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (error) throw error;
                setMessage('Account created! Please check your email to confirm.');
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                onClose();
            }
        } catch (err: any) {
            console.error('Full Auth Error:', err);
            setError(err.message || JSON.stringify(err) || 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-md bg-[#121216] border border-white/10 rounded-3xl shadow-2xl p-8 overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 via-accent-cyan to-accent-pink" />

                        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors">
                            <X size={20} />
                        </button>

                        <div className="mb-8 text-center">
                            <h2 className="text-2xl font-bold bg-gradient-to-br from-white to-gray-400 bg-clip-text text-transparent">
                                {mode === 'login' ? 'Welcome Back' : 'Join AI CodeLens'}
                            </h2>
                            <p className="text-gray-500 text-xs mt-2 uppercase tracking-wider">
                                {mode === 'login' ? 'Access your architect workspace' : 'Start your journey as an elite developer'}
                            </p>
                        </div>

                        {error && (
                            <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-2 text-rose-200 text-xs">
                                <AlertCircle size={16} />
                                {error}
                            </div>
                        )}

                        {message && (
                            <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-2 text-emerald-200 text-xs">
                                <AlertCircle size={16} />
                                {message}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <div className="relative group">
                                    <Mail className="absolute left-3 top-3 text-gray-500 group-focus-within:text-primary-500 transition-colors" size={18} />
                                    <input
                                        type="email"
                                        placeholder="Email Address"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-white/5 border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:border-primary-500/50 outline-none transition-all placeholder:text-gray-600"
                                        required
                                    />
                                </div>
                                <div className="relative group">
                                    <Lock className="absolute left-3 top-3 text-gray-500 group-focus-within:text-primary-500 transition-colors" size={18} />
                                    <input
                                        type="password"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-white/5 border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:border-primary-500/50 outline-none transition-all placeholder:text-gray-600"
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-primary-600 hover:bg-primary-500 py-3 rounded-xl font-bold text-sm shadow-lg shadow-primary-600/20 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? <Loader2 size={18} className="animate-spin" /> : (mode === 'login' ? <LogIn size={18} /> : <ArrowRight size={18} />)}
                                {mode === 'login' ? 'Sign In' : 'Create Account'}
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-xs text-gray-500">
                                {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
                                <button onClick={onSwitchMode} className="text-primary-400 hover:text-primary-300 font-bold hover:underline">
                                    {mode === 'login' ? 'Sign Up' : 'Log In'}
                                </button>
                            </p>

                            {/* Debug Info */}
                            <div className="mt-8 pt-4 border-t border-white/5 text-[10px] text-gray-600 font-mono text-left">
                                <p>Debug Diagnostics:</p>
                                <p>API: {import.meta.env.VITE_SUPABASE_URL?.substring(0, 20)}...</p>
                                <p>Key Present: {import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Yes' : 'No'}</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default AuthModal;
