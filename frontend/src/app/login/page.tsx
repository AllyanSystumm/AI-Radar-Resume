"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
    const router = useRouter();
    const { login, isAuthenticated } = useAuth();
    const [isSignUp, setIsSignUp] = useState(true);
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isAuthenticated) {
            router.push('/dashboard/create');
        }
    }, [isAuthenticated, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const endpoint = isSignUp ? '/auth/signup' : '/auth/login';
            const payload = isSignUp 
                ? { full_name: fullName, email, password }
                : { email, password };

            const response = await fetch(`http://localhost:8001${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || 'Authentication failed');
            }

            login(data.access_token);
            router.push('/dashboard/create');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-slate-900 bg-[url('/login-bg.png')] bg-cover bg-center flex items-center justify-center p-6 selection:bg-blue-500/30 overflow-hidden relative font-sans">
            
            {/* Dark Overlay with blue tint */}
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] z-0"></div>

            {/* Title Background Text (Premium Metallic Style) */}
            <div className="absolute top-12 flex justify-center w-full z-10 pointer-events-none drop-shadow-[0_20px_20px_rgba(0,0,0,0.8)]">
                <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-200 to-slate-400 tracking-tight flex items-center gap-4 text-center px-4" 
                    style={{ 
                        textShadow: "0 1px 0 #ccc, 0 2px 0 #c9c9c9, 0 3px 0 #bbb, 0 4px 0 #b9b9b9, 0 5px 0 #aaa, 0 6px 1px rgba(0,0,0,.1), 0 0 5px rgba(0,0,0,.1), 0 1px 3px rgba(0,0,0,.3), 0 3px 5px rgba(0,0,0,.2), 0 5px 10px rgba(0,0,0,.25), 0 10px 10px rgba(0,0,0,.2), 0 20px 20px rgba(0,0,0,.15)" 
                    }}>
                    AI Resume Radar
                </h1>
            </div>

            <div className="relative z-20 w-full max-w-[460px] flex flex-col items-center mt-24">
                
                {/* Auth Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="w-full bg-white/95 backdrop-blur-2xl px-10 py-12 rounded-[2.5rem] shadow-[0_25px_60px_rgba(0,0,0,0.4)] border border-white/40"
                >
                    {/* Tabs */}
                    <div className="flex border-b border-slate-100 mb-10 w-full relative">
                        <button
                            type="button"
                            onClick={() => { setIsSignUp(false); setError(''); }}
                            className={`flex-1 pb-4 text-center text-[15px] font-bold transition-all ${!isSignUp ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            Sign In
                            {!isSignUp && (
                                <motion.div layoutId="underline" className="absolute bottom-[-1px] left-0 w-1/2 h-[3px] bg-blue-900 rounded-full" />
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={() => { setIsSignUp(true); setError(''); }}
                            className={`flex-1 pb-4 text-center text-[15px] font-bold transition-all ${isSignUp ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            Sign Up
                            {isSignUp && (
                                <motion.div layoutId="underline" className="absolute bottom-[-1px] right-0 w-1/2 h-[3px] bg-blue-900 rounded-full" />
                            )}
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <AnimatePresence mode="popLayout">
                            {isSignUp && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="space-y-2 overflow-hidden"
                                >
                                    <label className="text-sm font-bold text-slate-800 ml-1">Full Name</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            required={isSignUp}
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            className="w-full px-5 py-4 bg-[#f1f5f9] border border-transparent rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white focus:border-blue-200 transition-all font-medium text-slate-900 placeholder:text-slate-400/80"
                                            placeholder="Full Name."
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-800 ml-1">Email Address</label>
                            <div className="relative">
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-5 py-4 bg-[#f1f5f9] border border-transparent rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white focus:border-blue-200 transition-all font-medium text-slate-900 placeholder:text-slate-400/80"
                                    placeholder="youremail@example.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-800 ml-1">Password</label>
                            <div className="relative group/input">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-5 py-4 bg-[#f1f5f9] border border-transparent rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white focus:border-blue-200 transition-all font-medium text-slate-900 placeholder:text-slate-400/80 pr-14"
                                    placeholder="Five dots"
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-5 flex items-center text-slate-400 hover:text-slate-600 transition-colors">
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-xs font-bold text-center bg-red-50 py-2.5 rounded-xl border border-red-100">
                                {error}
                            </motion.div>
                        )}

                        <motion.button
                            whileHover={{ scale: 1.01, boxShadow: "0 10px 25px rgba(29, 78, 216, 0.4)" }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-blue-700 hover:bg-blue-800 disabled:bg-slate-400 text-white rounded-2xl py-4.5 font-bold text-[17px] transition-all flex items-center justify-center mt-4 shadow-lg shadow-blue-500/20"
                        >
                            {isLoading ? (
                                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
                            )}
                        </motion.button>
                        
                        <div className="text-center mt-6">
                            <span className="text-[14px] text-slate-500 font-medium">
                                {isSignUp ? "Already have an account? " : "Don't have an account? "}
                                <button type="button" onClick={() => setIsSignUp(!isSignUp)} className="text-blue-900 font-bold hover:underline">
                                    {isSignUp ? "Sign in" : "Sign up"}
                                </button>
                            </span>
                        </div>

                        <div className="relative flex items-center py-6">
                            <div className="flex-grow border-t border-slate-100"></div>
                            <span className="flex-shrink-0 mx-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">or sign in with</span>
                            <div className="flex-grow border-t border-slate-100"></div>
                        </div>

                        <div className="flex gap-4 w-full">
                            <button type="button" className="flex-1 flex items-center justify-center gap-3 py-3.5 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-all shadow-sm">
                                <svg width="20" height="20" viewBox="0 0 48 48">
                                    <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4C13 4 4 13 4 24s9 20 20 20s20-9 20-20c0-1.3-0.1-2.7-0.4-3.9z"/>
                                    <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4C16.3 4 9.7 8.3 6.3 14.7z"/>
                                    <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.4 35.3 26.8 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z"/>
                                    <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-0.7 2.1-2 3.9-3.7 5.1l6.2 5.2c3.3-3.1 5.2-7.8 5.2-13.6c0-1.3-0.1-2.7-0.4-3.9z"/>
                                </svg>
                                <span className="text-sm font-bold text-slate-700">Google</span>
                            </button>
                            <button type="button" className="flex-1 flex items-center justify-center gap-3 py-3.5 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-all shadow-sm">
                                <svg width="18" height="18" viewBox="0 0 21 21">
                                    <path fill="#f25022" d="M1 1h9v9H1z"/>
                                    <path fill="#00a4ef" d="M1 11h9v9H1z"/>
                                    <path fill="#7fba00" d="M11 1h9v9h-9z"/>
                                    <path fill="#ffb900" d="M11 11h9v9h-9z"/>
                                </svg>
                                <span className="text-sm font-bold text-slate-700">Microsoft</span>
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </main>
    );
}
