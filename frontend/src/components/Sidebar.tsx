"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    PlusCircle,
    Briefcase,
    Users,
    BarChart3,
    HelpCircle,
    LogOut,
    LinkIcon,
    Circle
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const Sidebar = () => {
    const pathname = usePathname();
    const { logout } = useAuth();

    const menuItems = [
        { name: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, path: '/dashboard/create?view=dashboard' },
        { name: 'Create New Job Post', icon: <PlusCircle className="w-5 h-5" />, path: '/dashboard/create?view=create' },
        { name: 'Active Job Post', icon: <Briefcase className="w-5 h-5" />, path: '/dashboard?tab=active' },
        { name: 'Posted Jobs', icon: <Briefcase className="w-5 h-5" />, path: '/dashboard?tab=all' },
        { name: 'Candidates Analysis by Radar', icon: <Users className="w-5 h-5" />, path: '/dashboard/candidates' },
        { name: 'Job Analysis Chart', icon: <BarChart3 className="w-5 h-5" />, path: '/dashboard/reports' },
    ];

    const bottomItems = [
        { name: 'Help & Support', icon: <HelpCircle className="w-5 h-5" />, path: '/dashboard/help' },
    ];

    return (
        <aside className="w-[352px] bg-[#2C2F36] text-white flex flex-col h-screen fixed left-0 top-0 z-50 shadow-2xl overflow-hidden font-sans">
            <div className="p-8">
                <h1 className="text-2xl font-black tracking-tight flex items-center gap-1.5 whitespace-nowrap">
                    AI <span className="text-blue-500">Resume</span> Radar
                </h1>
            </div>

            <nav className="flex-1 mt-2 custom-scrollbar overflow-y-auto">
                <div className="space-y-0.5 px-3">
                    {menuItems.map((item, idx) => {
                        // Improved active state check to handle query params
                        let isActive = pathname === item.path;

                        if (typeof window !== 'undefined') {
                            const currentFullUrl = `${pathname}${window.location.search || ''}`;

                            // Check for exact path with query params if the menu item has any
                            if (item.path.includes('?')) {
                                isActive = currentFullUrl === item.path;
                            } else {
                                // Default dashboard logic: active if no tab or tab is 'active'
                                if (pathname === '/dashboard' && item.path === '/dashboard') {
                                    const params = new URLSearchParams(window.location.search);
                                    isActive = !params.get('tab') || params.get('tab') === 'active';
                                }
                            }
                        }

                        return (
                            <Link
                                key={`${item.name}-${idx}`}
                                href={item.path}
                                className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all group ${isActive
                                    ? 'bg-slate-700/50 text-white'
                                    : 'text-slate-400 hover:bg-slate-700/30 hover:text-white'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    {item.icon}
                                    <span className="font-semibold text-[18px] tracking-tight">{item.name}</span>
                                </div>
                                {isActive && <div className="w-1.5 h-1.5 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)]" />}
                            </Link>
                        );
                    })}
                </div>

                <div className="mt-8 px-3">
                    {bottomItems.map((item) => {
                        const isActive = pathname === item.path;
                        return (
                            <Link
                                key={item.name}
                                href={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                                    ? 'bg-slate-700/50 text-white'
                                    : 'text-slate-400 hover:bg-slate-700/30 hover:text-white'
                                    }`}
                            >
                                {item.icon}
                                <span className="font-medium text-sm">{item.name}</span>
                            </Link>
                        );
                    })}

                    <button
                        onClick={logout}
                        className="w-full flex items-center justify-center px-4 py-3 mt-4 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-all font-bold text-sm shadow-lg active:scale-95"
                    >
                        Sign Out
                    </button>
                </div>
            </nav>


        </aside>
    );
};

export default Sidebar;
