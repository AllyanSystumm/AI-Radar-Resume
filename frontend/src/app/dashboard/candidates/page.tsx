"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import { Users, Briefcase, ChevronRight, UserCheck, TrendingUp } from 'lucide-react';

interface Job {
    id: number;
    title: string;
    description: string;
    created_at: string;
    candidate_count?: number;
}

export default function CandidatesPage() {
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

    const totalCandidates = jobs.reduce((sum, job) => sum + (job.candidate_count || 0), 0);

    return (
        <div className="space-y-10">
            {/* Header */}
            <header>
                <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase mb-2">Candidates</h2>
                <p className="text-slate-500 font-medium text-sm">View all applicants across your job postings</p>
            </header>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            </div>

            {/* Job-wise Applicant List */}
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Applicants by Job</h3>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{jobs.length} Jobs</span>
                </div>

                {loading ? (
                    <div className="p-16 text-center">
                        <p className="text-slate-400 uppercase font-black tracking-widest text-xs">Loading candidates...</p>
                    </div>
                ) : jobs.length === 0 ? (
                    <div className="p-16 text-center">
                        <Users className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                        <h4 className="text-xl font-black text-slate-900 uppercase italic mb-2">No Jobs Found</h4>
                        <p className="text-slate-400 text-sm font-medium">Create a job post first to start receiving candidates.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-50">
                        {jobs.map((job, index) => (
                            <div
                                key={job.id}
                                className="flex items-center justify-between px-8 py-5 hover:bg-slate-50/50 transition-all group"
                            >
                                <div className="flex items-center gap-5">
                                    <div className="w-11 h-11 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all font-black text-sm">
                                        {index + 1}
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight group-hover:text-blue-600 transition-colors">
                                            {job.title}
                                        </h4>
                                        <p className="text-xs text-slate-400 font-medium mt-0.5 line-clamp-1 max-w-md">
                                            {job.description}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2 bg-blue-50/80 px-4 py-2 rounded-full border border-blue-100/60">
                                        <UserCheck className="w-4 h-4 text-blue-600" />
                                        <span className="text-xs font-black text-blue-700 uppercase tracking-wider">
                                            {job.candidate_count || 0} {(job.candidate_count || 0) === 1 ? 'Candidate' : 'Candidates'} Applied
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => router.push(`/dashboard/job/${job.id}`)}
                                        className="px-4 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-blue-600 transition-all shadow-lg shadow-slate-900/10 hover:shadow-blue-500/20"
                                    >
                                        View Analysis by Radar
                                    </button>
                                    <button
                                        onClick={() => router.push(`/dashboard/job/${job.id}`)}
                                        className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all border border-slate-100 group-hover:border-blue-600 hover:cursor-pointer"
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
