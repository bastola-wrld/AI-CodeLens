import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
    email: string;
    isPremium: boolean;
}

interface AuthContextType {
    user: User | null;
    login: (email: string) => void;
    signup: (email: string) => void;
    logout: () => void;
    credits: number;
    useCredit: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [credits, setCredits] = useState(5);

    useEffect(() => {
        // Check for existing session
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

        // Check credits refresh
        const lastReset = localStorage.getItem('lastReset');
        const today = new Date().toDateString();

        if (lastReset !== today) {
            localStorage.setItem('credits', '5');
            localStorage.setItem('lastReset', today);
            setCredits(5);
        } else {
            const storedCredits = localStorage.getItem('credits');
            if (storedCredits) {
                setCredits(parseInt(storedCredits, 10));
            }
        }
    }, []);

    const login = (email: string) => {
        const newUser = { email, isPremium: false };
        setUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser));
    };

    const signup = (email: string) => {
        const newUser = { email, isPremium: false };
        setUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser));
        // Bonus credits for signup? Or standard. Let's stick to standard 5.
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    const useCredit = (): boolean => {
        if (user?.isPremium) return true; // Premium has unlimited
        if (credits > 0) {
            const newCredits = credits - 1;
            setCredits(newCredits);
            localStorage.setItem('credits', newCredits.toString());
            return true;
        }
        return false;
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, credits, useCredit }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};
