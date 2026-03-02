"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Sparkles, Mail, Lock, LogIn } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
    const router = useRouter();
    const { login, isAuthenticated } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isAuthenticated) {
            router.push('/');
        }
    }, [isAuthenticated, router]);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        
        setTimeout(() => {
            setIsLoading(false);
            login();
            router.push('/');
        }, 2000);
    };

    return (
        <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6 selection:bg-blue-500/30 overflow-hidden relative">
            {}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                {}
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        x: [0, 50, 0],
                        y: [0, -30, 0]
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 blur-[150px] rounded-full"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.3, 1],
                        x: [0, -60, 0],
                        y: [0, 40, 0]
                    }}
                    transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/20 blur-[150px] rounded-full"
                />

                {}
                <div className="absolute inset-0 opacity-20">
                    {[...Array(20)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute bg-white rounded-full blur-[1px]"
                            style={{
                                top: `${Math.random() * 100}%`,
                                left: `${Math.random() * 100}%`,
                                width: `${Math.random() * 4}px`,
                                height: `${Math.random() * 4}px`,
                                animation: `float ${10 + Math.random() * 10}s linear infinite`,
                                animationDelay: `${-Math.random() * 20}s`
                            }}
                        />
                    ))}
                </div>
            </div>

            <div className="relative z-10 w-full max-w-md flex flex-col items-center gap-10">

                {}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="flex flex-col items-center gap-6 text-center"
                >

                    <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
                        <span className="animated-gradient-text">Recruiter Intelligence Portal</span>
                    </h1>
                </motion.div>

                {}
                <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="w-full bg-slate-900/50 backdrop-blur-3xl border border-slate-800 p-8 md:p-12 rounded-[40px] shadow-3xl relative overflow-hidden group"
                >
                    {}
                    <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 blur-3xl -z-10 group-hover:bg-blue-500/20 transition-all duration-1000" />


                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-300 ml-1">Enter Email</label>
                            <div className="relative group/input">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="w-5 h-5 text-slate-500 group-focus-within/input:text-blue-400 transition-colors" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-slate-800/50 border border-slate-700/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all font-medium text-white placeholder:text-slate-600"
                                    placeholder="recruiter@company.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-300">Password</label>
                            </div>
                            <div className="relative group/input">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="w-5 h-5 text-slate-500 group-focus-within/input:text-blue-400 transition-colors" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-slate-800/50 border border-slate-700/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all font-medium text-white placeholder:text-slate-600"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:from-slate-700 disabled:to-slate-700 text-white rounded-2xl py-4 font-black transition-all shadow-xl shadow-blue-500/20 flex items-center justify-center gap-3 relative overflow-hidden"
                        >
                            <AnimatePresence mode="wait">
                                {isLoading ? (
                                    <motion.div
                                        key="loading"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="w-6 h-6 border-3 border-white/20 border-t-white rounded-full animate-spin"
                                    />
                                ) : (
                                    <motion.div
                                        key="content"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex items-center gap-2"
                                    >
                                        <span>Login</span>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.button>
                    </form>

                </motion.div>
            </div>

            <style jsx global>{`
        @keyframes float {
            0% { transform: translateY(0) rotate(0deg); opacity: 0; }
            50% { opacity: 0.5; }
            100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
        }
      `}</style>

        </main>
    );
}

