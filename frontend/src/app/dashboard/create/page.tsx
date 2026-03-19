"use client";

import React from 'react';
import JobPostingForm from '@/components/JobPostingForm';
import { useAuth } from '@/context/AuthContext';
import { LayoutDashboard, LogOut } from 'lucide-react';
import Link from 'next/link';
import Chatbot from '@/components/Chatbot';

export default function CreateJobPage() {
    const { logout } = useAuth();

    return (
        <div className="flex flex-col items-center">
            {/* Top Bar / Header */}
            <header className="w-full flex justify-end gap-3 mb-12">
                {/* <Link
                    href="/dashboard"
                    className="flex items-center gap-2 px-6 py-2.5 bg-blue-50 text-blue-600 rounded-full font-bold text-xs border border-blue-100 hover:bg-blue-100 transition-all shadow-sm"
                >
                    <LayoutDashboard className="w-4 h-4" />
                  
                </Link> */}
                <button
                    onClick={logout}
                    className="px-8 py-2.5 bg-blue-600 text-white rounded-full font-bold text-xs hover:bg-blue-700 transition-all shadow-md active:scale-95"
                >
                    Sign Out
                </button>
            </header>

            {/* Title Section */}
            <div className="text-center mb-16">
                <h1 className="text-6xl font-black text-slate-900 mb-4 tracking-tighter">
                    AI <span className="text-blue-600">Resume</span> Radar
                </h1>
                <p className="text-slate-500 font-medium">
                    Launch a specialized job post. Enter your job requirements below.
                </p>
            </div>

            {/* Form Card */}
            <JobPostingForm />

            {/* Floating background elements for premium feel */}
            <div className="fixed bottom-10 right-10 opacity-10 pointer-events-none">
                <div className="w-64 h-64 bg-blue-400 blur-3xl rounded-full" />
            </div>
            <div className="fixed top-1/4 left-72 opacity-5 pointer-events-none">
                <div className="w-96 h-96 bg-blue-300 blur-3xl rounded-full" />
            </div>
            <Chatbot />
        </div>
    );
}
