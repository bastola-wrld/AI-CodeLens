import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface User {
    email: string;
    isPremium: boolean;
    id: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string) => Promise<void>; // Magic link or handled in UI
    signup: (email: string) => Promise<void>;
    logout: () => Promise<void>;
    credits: number;
    useCredit: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [credits, setCredits] = useState(5);

    useEffect(() => {
        // Check active session
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                mapUser(session.user);
            }
            setLoading(false);
        }).catch(err => {
            console.error('Supabase Init Error:', err);
            setLoading(false);
        });

        // Listen for changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                mapUser(session.user);
            } else {
                setUser(null);
                setCredits(5); // Reset to base for non-logged in or handle differently
            }
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const mapUser = (sbUser: SupabaseUser) => {
        // You might fetch 'isPremium' or 'credits' from a 'profiles' table here
        // For now, we'll default isPremium to false unless metadata says otherwise
        setUser({
            id: sbUser.id,
            email: sbUser.email || '',
            isPremium: false,
        });

        // Example: load credits from DB if you have a table, else default
        // loadCredits(sbUser.id);
    };

    const login = async (_email: string) => {
        // This is just a placeholder type signature change for the Context
        // The actual UI handles the signInWithPassword call usually, 
        // or we can expose performLogin here. 
        // Let's keep it simple: the Modal will call supabase directly or we simply re-expose
    };

    const signup = async (_email: string) => {
        // Same as above
    };

    const logout = async () => {
        await supabase.auth.signOut();
        setUser(null);
    };

    const useCredit = async (): Promise<boolean> => {
        if (user?.isPremium) return true;

        if (credits > 0) {
            setCredits(prev => prev - 1);
            // TODO: Sync with DB
            return true;
        }
        return false;
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, signup, logout, credits, useCredit }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};
