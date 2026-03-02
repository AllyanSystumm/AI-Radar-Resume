"use client";

import React from 'react';
import Sidebar from '@/components/Sidebar';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { ChatProvider } from '@/context/ChatContext';
import { useEffect } from 'react';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, router]);

    if (!isAuthenticated) return null;

    return (
        <ChatProvider>
            <div className="min-h-screen bg-[#F8FAFC]">
                <Sidebar />
                <main className="pl-[352px] min-h-screen">
                    <div className="max-w-7xl mx-auto p-12">
                        {children}
                    </div>
                </main>
            </div>
        </ChatProvider>
    );
}
