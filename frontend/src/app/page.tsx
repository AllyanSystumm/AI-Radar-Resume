"use client";

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Home() {
    const { isAuthenticated, logout } = useAuth();

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            {/* Navbar Line */}
            <nav className="w-full bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm sticky top-0 z-50">
                <div className="flex items-center gap-2">
                    <span className="text-xl font-black tracking-tight text-blue-600">AI Resume Radar</span>
                </div>
                <div className="flex items-center gap-4">
                    {isAuthenticated ? (
                        <>
                            <Link href="/dashboard/create" className="px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                                Go to Dashboard
                            </Link>
                            <button onClick={logout} className="text-sm font-semibold text-slate-600 hover:text-red-600 transition-colors">
                                Sign Out
                            </button>
                        </>
                    ) : (
                        <Link href="/login" className="px-5 py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-lg hover:bg-slate-800 transition-colors shadow-sm">
                            Sign In / Sign Up
                        </Link>
                    )}
                </div>
            </nav>
            
            {/* Hero Section */}
            <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                <div className="max-w-3xl">
                    <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-6 tracking-tight leading-tight">
                        The Future of <span className="text-blue-600">Recruitment</span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-600 mb-10 leading-relaxed font-medium">
                        AI Resume Radar leverages advanced machine learning to instantly analyze, score, and match candidate resumes to your job descriptions. Finding the perfect candidate has never been easier.
                    </p>
                    <div className="flex items-center justify-center gap-4">
                        <Link href={isAuthenticated ? "/dashboard/create" : "/login"} className="px-8 py-4 bg-blue-600 text-white text-lg font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/25">
                            {isAuthenticated ? "Enter Dashboard" : "Get Started Now"}
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
