"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import { BarChart3, Users, Briefcase } from 'lucide-react';

interface Job {
    id: number;
    title: string;
    description: string;
    created_at: string;
    candidate_count?: number;
}

// Vibrant random colors for middle-range bars
const RANDOM_COLORS = [
    '#3B82F6', // blue
    '#F59E0B', // amber
    '#8B5CF6', // violet
    '#EC4899', // pink
    '#06B6D4', // cyan
    '#F97316', // orange
    '#6366F1', // indigo
    '#14B8A6', // teal
];

export default function ReportsPage() {
    const { isAuthenticated } = useAuth();
    const router = useRouter();
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isAuthenticated) {
            fetchJobs();
        }
    }, [isAuthenticated]);

    const fetchJobs = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:8001/jobs');
            const jobsData = response.data;
            const sortedJobs = [...jobsData].sort((a, b) => b.id - a.id);
            setJobs(sortedJobs);
        } catch (error) {
            console.error("Failed to fetch jobs", error);
        } finally {
            setLoading(false);
        }
    };

    // Determine min, max, and assign colors
    const candidateCounts = jobs.map(j => j.candidate_count || 0);
    const maxCount = Math.max(...candidateCounts, 0);
    const minCount = Math.min(...candidateCounts, 0);
    const totalCandidates = candidateCounts.reduce((s, c) => s + c, 0);

    // Chart scale: ensure at least 1 for visual purposes
    const chartMax = Math.max(maxCount, 1);

    const getBarColor = (count: number, index: number) => {
        if (jobs.length <= 1) return '#3B82F6'; // single job, blue
        if (count === maxCount && maxCount > minCount) return '#22C55E'; // green for highest
        if (count === minCount && maxCount > minCount) return '#EF4444'; // red for lowest
        return RANDOM_COLORS[index % RANDOM_COLORS.length]; // random vibrant color
    };

    const getBarLabel = (count: number) => {
        if (jobs.length <= 1) return '';
        if (count === maxCount && maxCount > minCount) return 'Highest';
        if (count === minCount && maxCount > minCount) return 'Lowest';
        return '';
    };

    return (
        <div className="space-y-10">
            {/* Header */}
            <header>
                <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase mb-2">Reports</h2>
                <p className="text-slate-500 font-medium text-sm">Visual analytics of applicants across your job postings</p>
            </header>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-5">
                    <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center border border-blue-100">
                        <Briefcase className="w-7 h-7 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Jobs</p>
                        <p className="text-3xl font-black text-slate-900 tracking-tight">{jobs.length}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-5">
                    <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center border border-emerald-100">
                        <Users className="w-7 h-7 text-emerald-600" />
                    </div>
                    <div>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Applicants</p>
                        <p className="text-3xl font-black text-slate-900 tracking-tight">{totalCandidates}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-5">
                    <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center border border-rose-100">
                        <BarChart3 className="w-7 h-7 text-rose-600" />
                    </div>
                    <div>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Most Popular</p>
                        <p className="text-lg font-black text-slate-900 tracking-tight truncate max-w-[160px]">
                            {jobs.length > 0 ? jobs.reduce((best, j) => (j.candidate_count || 0) > (best.candidate_count || 0) ? j : best, jobs[0]).title : '—'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Bar Chart */}
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Applicants per Job</h3>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded-sm bg-[#22C55E]" />
                            <span className="text-[10px] font-bold text-slate-400 uppercase">Highest</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded-sm bg-[#EF4444]" />
                            <span className="text-[10px] font-bold text-slate-400 uppercase">Lowest</span>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="p-16 text-center">
                        <p className="text-slate-400 uppercase font-black tracking-widest text-xs">Loading report data...</p>
                    </div>
                ) : jobs.length === 0 ? (
                    <div className="p-16 text-center">
                        <BarChart3 className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                        <h4 className="text-xl font-black text-slate-900 uppercase italic mb-2">No Data Yet</h4>
                        <p className="text-slate-400 text-sm font-medium">Create job posts to view analytics.</p>
                    </div>
                ) : (
                    <div className="p-8">
                        {/* Y-axis scale + bars */}
                        <div className="flex items-end gap-0" style={{ minHeight: '320px' }}>
                            {/* Y-axis labels */}
                            <div className="flex flex-col justify-between h-[280px] pr-4 pb-10">
                                {[...Array(6)].map((_, i) => {
                                    const val = Math.round((chartMax / 5) * (5 - i));
                                    return (
                                        <span key={i} className="text-[10px] font-bold text-slate-300 text-right w-6">
                                            {val}
                                        </span>
                                    );
                                })}
                            </div>

                            {/* Bars */}
                            <div className="flex-1 flex items-end justify-around gap-4 h-[280px] border-l border-b border-slate-100 pl-2 pb-0 relative">
                                {/* Horizontal grid lines */}
                                {[...Array(5)].map((_, i) => (
                                    <div
                                        key={`grid-${i}`}
                                        className="absolute left-0 right-0 border-t border-slate-50"
                                        style={{ bottom: `${((i + 1) / 5) * 100}%` }}
                                    />
                                ))}

                                {jobs.map((job, index) => {
                                    const count = job.candidate_count || 0;
                                    const heightPercent = chartMax > 0 ? (count / chartMax) * 100 : 0;
                                    const color = getBarColor(count, index);
                                    const label = getBarLabel(count);

                                    return (
                                        <div
                                            key={job.id}
                                            className="flex flex-col items-center flex-1 max-w-[120px] group cursor-pointer"
                                            onClick={() => router.push(`/dashboard/job/${job.id}`)}
                                        >
                                            {/* Count label above bar */}
                                            <div className="mb-2 text-center">
                                                <span className="text-lg font-black" style={{ color }}>
                                                    {count}
                                                </span>
                                                {label && (
                                                    <span
                                                        className="block text-[9px] font-bold uppercase tracking-wider mt-0.5"
                                                        style={{ color }}
                                                    >
                                                        {label}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Bar */}
                                            <div
                                                className="w-full rounded-t-xl transition-all duration-700 ease-out group-hover:opacity-80 relative"
                                                style={{
                                                    height: `${Math.max(heightPercent * 2.4, 8)}px`,
                                                    backgroundColor: color,
                                                    maxHeight: '240px',
                                                    boxShadow: `0 4px 20px ${color}30`,
                                                }}
                                            />

                                            {/* Job name below */}
                                            <p className="mt-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center leading-tight max-w-[100px] truncate group-hover:text-slate-900 transition-colors">
                                                {job.title}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
