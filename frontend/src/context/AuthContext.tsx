"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
    isAuthenticated: boolean;
    login: () => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    useEffect(() => {
        const storedAuth = localStorage.getItem('isLoggedIn');
        if (storedAuth === 'true') {
            setIsAuthenticated(true);
        }
    }, []);

    const login = () => {
        localStorage.setItem('isLoggedIn', 'true');
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem('isLoggedIn');
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
