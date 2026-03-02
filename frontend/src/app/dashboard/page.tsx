"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import { Briefcase, Users, ChevronRight, Trash2 } from 'lucide-react';

interface Job {
    id: number;
    title: string;
    description: string;
    created_at: string;
    candidate_count?: number;
}

function DashboardContent() {
    const { isAuthenticated } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [jobs, setJobs] = useState<Job[]>([]);
    const [filterTab, setFilterTab] = useState<'all' | 'active'>('active');

    useEffect(() => {
        const tab = searchParams.get('tab');
        if (tab === 'all') {
            setFilterTab('all');
        } else {
            setFilterTab('active');
        }
    }, [searchParams]);

    useEffect(() => {
        if (isAuthenticated) {
            fetchJobs();
        }
    }, [isAuthenticated]);

    const fetchJobs = async () => {
        try {
            const response = await axios.get('http://localhost:8000/jobs');
            const jobsData = response.data;
            // Ensure jobs are sorted by ID descending (most recent first)
            const sortedJobs = [...jobsData].sort((a, b) => b.id - a.id);
            setJobs(sortedJobs);

            // Only auto-switch if no tab param is explicitly provided
            const tabParam = searchParams.get('tab');
            if (!tabParam) {
                setFilterTab('active');
            }
        } catch (error) {
            console.error("Failed to fetch jobs", error);
        }
    };

    const handleDeleteJob = async (jobId: number, e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm("Are you sure you want to delete this job post?")) {
            try {
                await axios.delete(`http://localhost:8000/jobs/${jobId}`);
                fetchJobs();
            } catch (error) {
                console.error("Failed to delete job", error);
            }
        }
    };



    return (
        <div className="space-y-10">
            <header className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase mb-2">My Job Posts</h2>
                    <p className="text-slate-500 font-medium text-sm">Manage and track your active job postings</p>
                </div>
                <div className="flex bg-slate-100/80 p-1 rounded-2xl border border-slate-200 shadow-sm">
                    <button
                        onClick={() => {
                            setFilterTab('active');
                            router.push('/dashboard?tab=active');
                        }}
                        className={`px-6 py-2.5 text-xs font-black rounded-xl transition-all flex items-center gap-2 uppercase tracking-wide ${filterTab === 'active' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        <Users className="w-4 h-4" />
                        Active ({jobs.length > 0 ? 1 : 0})
                    </button>
                    <button
                        onClick={() => {
                            setFilterTab('all');
                            router.push('/dashboard?tab=all');
                        }}
                        className={`px-6 py-2.5 text-xs font-black rounded-xl transition-all flex items-center gap-2 uppercase tracking-wide ${filterTab === 'all' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        <Briefcase className="w-4 h-4" />
                        Posted Jobs ({jobs.length})
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {(() => {
                    const filteredJobs = filterTab === 'active'
                        ? (jobs.length > 0 ? jobs.slice(0, 1) : [])
                        : jobs;

                    if (filteredJobs.length === 0) {
                        return (
                            <div className="col-span-full py-32 text-center bg-white rounded-[2.5rem] border-2 border-slate-100 border-dashed">
                                <Users className="w-20 h-20 text-slate-200 mx-auto mb-6" />
                                <h3 className="text-2xl font-black text-slate-900 mb-2 italic uppercase">No Job Posts Found</h3>
                                <p className="text-slate-400 max-w-sm mx-auto font-medium">
                                    {filterTab === 'active'
                                        ? 'You haven\'t created any job posts yet or none are active.'
                                        : 'You haven\'t created any job posts yet.'}
                                </p>
                            </div>
                        );
                    }

                    return filteredJobs.map((job) => (
                        <div
                            key={job.id}
                            onClick={() => router.push(`/dashboard/job/${job.id}`)}
                            className="bg-white p-8 rounded-[2.5rem] border border-black hover:border-blue-500 hover:shadow-[0_25px_60px_-15px_rgba(59,130,246,0.12)] transition-all cursor-pointer group relative overflow-hidden flex flex-col h-[280px]"
                        >
                            <div className="absolute top-4 right-4 p-8 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all pointer-events-none">
                                <Briefcase className="w-36 h-36 text-blue-600" />
                            </div>

                            <button
                                onClick={(e) => handleDeleteJob(job.id, e)}
                                className="absolute top-6 right-6 p-2.5 bg-rose-50 text-rose-500 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-500 hover:text-white z-20 shadow-sm border border-rose-100"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>

                            <div className="relative z-10 pr-12">
                                <h3 className="text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors uppercase italic mb-3 leading-tight tracking-tight">{job.title}</h3>
                                <p className="text-slate-400 text-sm font-medium line-clamp-3 leading-relaxed">
                                    AI / Machine Learning Engineer — {job.description}
                                </p>
                            </div>

                            <div className="mt-auto flex items-center justify-between relative z-10">
                                <div className="flex items-center gap-3 bg-blue-50/50 px-4 py-2.5 rounded-full border border-blue-100/50">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                                    <span className="text-[11px] font-black text-blue-700 uppercase tracking-wider">
                                        {job.candidate_count || 0} Applicants
                                    </span>
                                </div>
                                {filterTab === 'active' ? (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            window.open(`/apply/${job.id}`, '_blank');
                                        }}
                                        className="px-4 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-blue-600 transition-all shadow-lg shadow-slate-900/10 hover:shadow-blue-500/20"
                                    >
                                        Public Apply Link
                                    </button>
                                ) : (
                                    <div className="w-11 h-11 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm border border-slate-100 group-hover:border-blue-600 group-hover:shadow-lg group-hover:shadow-blue-500/20">
                                        <ChevronRight className="w-5 h-5" />
                                    </div>
                                )}
                            </div>
                        </div>
                    ));
                })()}
            </div>
        </div>
    );
}

export default function DashboardPage() {
    return (
        <Suspense fallback={<div className="p-10 text-center text-slate-400 uppercase font-black tracking-widest text-xs">Loading Dashboard...</div>}>
            <DashboardContent />
        </Suspense>
    );
}
