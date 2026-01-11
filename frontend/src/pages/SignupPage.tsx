import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { UserPlus, Mail, Lock, Loader2, Sparkles } from 'lucide-react';
import axios from 'axios';

const signupSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type SignupFormValues = z.infer<typeof signupSchema>;

interface SignupPageProps {
    onToggleAuth: () => void;
}

const SignupPage: React.FC<SignupPageProps> = ({ onToggleAuth }) => {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<SignupFormValues>({
        resolver: zodResolver(signupSchema),
    });

    const onSubmit = async (data: SignupFormValues) => {
        setIsLoading(true);
        setError(null);
        try {
            await axios.post('/api/auth/signup', {
                email: data.email,
                password: data.password,
            });
            setIsSuccess(true);
            setTimeout(onToggleAuth, 2000);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to sign up');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark p-4 font-sans">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <div className="flex flex-col items-center mb-10">
                    <div className="w-16 h-16 bg-primary-600 rounded-3xl flex items-center justify-center shadow-xl shadow-primary-600/30 mb-6">
                        <UserPlus className="text-white" size={32} />
                    </div>
                    <h1 className="text-4xl font-display font-bold tracking-tight mb-2">Join the Future</h1>
                    <p className="text-gray-500 dark:text-gray-400">Start your journey with elite AI coding tools</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 glass p-8 rounded-[2rem] shadow-2xl">
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-2xl text-red-600 dark:text-red-400 text-sm"
                        >
                            {error}
                        </motion.div>
                    )}

                    {isSuccess && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/30 rounded-2xl text-green-600 dark:text-green-400 text-sm"
                        >
                            Account created! Redirecting to login...
                        </motion.div>
                    )}

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Email Address</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary-500 transition-colors">
                                <Mail size={18} />
                            </div>
                            <input
                                {...register('email')}
                                type="email"
                                className="w-full bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-sm"
                                placeholder="name@company.com"
                            />
                        </div>
                        {errors.email && <p className="text-xs text-red-500 mt-1 ml-1">{errors.email.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Password</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary-500 transition-colors">
                                <Lock size={18} />
                            </div>
                            <input
                                {...register('password')}
                                type="password"
                                className="w-full bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-sm"
                                placeholder="••••••••"
                            />
                        </div>
                        {errors.password && <p className="text-xs text-red-500 mt-1 ml-1">{errors.password.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Confirm Password</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary-500 transition-colors">
                                <Lock size={18} />
                            </div>
                            <input
                                {...register('confirmPassword')}
                                type="password"
                                className="w-full bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-sm"
                                placeholder="••••••••"
                            />
                        </div>
                        {errors.confirmPassword && <p className="text-xs text-red-500 mt-1 ml-1">{errors.confirmPassword.message}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading || isSuccess}
                        className="w-full bg-primary-600 hover:bg-primary-500 text-white rounded-2xl py-3.5 font-semibold shadow-lg shadow-primary-600/20 transition-all flex items-center justify-center gap-2 group active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 mt-2"
                    >
                        {isLoading ? (
                            <Loader2 className="animate-spin" size={20} />
                        ) : (
                            <>
                                <span>Create Account</span>
                                <Sparkles size={20} className="group-hover:rotate-12 transition-transform" />
                            </>
                        )}
                    </button>

                    <p className="text-center text-sm text-gray-500 mt-6">
                        Already have an account?{' '}
                        <button
                            type="button"
                            onClick={onToggleAuth}
                            className="text-primary-600 font-semibold hover:text-primary-500 underline-offset-4 hover:underline"
                        >
                            Sign In
                        </button>
                    </p>
                </form>
            </motion.div>
        </div>
    );
};

export default SignupPage;
