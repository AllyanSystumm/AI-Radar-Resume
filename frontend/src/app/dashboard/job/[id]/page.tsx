"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import { ChevronLeft, ExternalLink, Briefcase, Copy, Check } from 'lucide-react';

interface Job {
    id: number;
    title: string;
    description: string;
    created_at: string;
}

export default function JobDetailsPage() {
    const { isAuthenticated } = useAuth();
    const router = useRouter();
    const params = useParams();
    const jobId = params.id;

    const [job, setJob] = useState<Job | null>(null);
    const [candidates, setCandidates] = useState<any[]>([]);
    const [copied, setCopied] = useState(false);
    const [loadingCandidates, setLoadingCandidates] = useState(false);

    useEffect(() => {
        fetchJobDetails();
        fetchCandidates();
    }, [jobId]);

    const fetchJobDetails = async () => {
        try {
            const response = await axios.get(`http://localhost:8001/jobs/${jobId}`);
            setJob(response.data);
        } catch (error) {
            console.error("Failed to fetch job", error);
        }
    };

    const fetchCandidates = async () => {
        try {
            setLoadingCandidates(true);
            const response = await axios.get(`http://localhost:8001/jobs/${jobId}/candidates`);
            setCandidates(response.data);
        } catch (error) {
            console.error("Failed to fetch candidates", error);
        } finally {
            setLoadingCandidates(false);
        }
    };

    const getPublicLink = () => {
        if (typeof window !== 'undefined') {
            return `${window.location.origin}/apply/${jobId}`;
        }
        return `/apply/${jobId}`;
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(getPublicLink());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!job) return <div className="p-10 text-center text-slate-400 uppercase font-black tracking-widest text-xs">Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <button
                onClick={() => router.push('/dashboard')}
                className="mb-8 flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors group"
            >
                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                Back to Dashboard
            </button>

            {/* Job Title Card */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden mb-8">
                <div className="p-10 relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full -mr-32 -mt-32 z-0" />
                    <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center border border-blue-100">
                                <Briefcase className="w-7 h-7 text-blue-600" />
                            </div>
                            <div>
                                {/* <p className="text-[11px] font-black text-slate-400 uppercase tracking-[2px] mb-1">Job Title</p> */}

                                <h1 className="text-3xl font-black text-black uppercase tracking-tight">{job.title}</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Full Job Description */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden mb-8">
                <div className="px-10 py-6 border-b border-slate-100">
                    <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[2px]">Job Description</h2>
                </div>
                <div className="p-10">
                    <p className="text-black leading-relaxed whitespace-pre-wrap text-[15px] font-medium">
                        {job.description}
                    </p>
                </div>
            </div>



            {/* Candidate List Section */}
            <div className="mt-12 mb-20 bg-white rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden">
                <div className="px-10 py-8 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Applied Candidates</h2>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">{candidates.length} Total Applicants</p>
                    </div>
                </div>

                <div className="p-4">
                    {loadingCandidates ? (
                        <div className="p-12 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">
                            Loading candidates...
                        </div>
                    ) : candidates.length === 0 ? (
                        <div className="p-16 text-center">
                            <p className="text-slate-400 font-bold uppercase tracking-widest text-sm mb-4">No candidates yet</p>
                            <p className="text-slate-500 text-xs">Share the public link to start receiving applications.</p>
                        </div>
                    ) : (
                        <div className="grid gap-3">
                            {candidates.map((candidate) => (
                                <div
                                    key={candidate.id}
                                    className="flex items-center justify-between p-6 bg-white border border-slate-100 rounded-3xl hover:border-blue-500 hover:shadow-lg transition-all group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center border border-blue-100 text-blue-600 font-black">
                                            {candidate.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <h4 className="font-black text-slate-900 uppercase tracking-tight group-hover:text-blue-600 transition-colors">{candidate.name}</h4>
                                            <p className="text-slate-400 text-xs font-medium">{candidate.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="text-right">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] mb-1">Match Score</p>
                                            <div className="flex items-center gap-2">
                                                <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-blue-600 rounded-full"
                                                        style={{ width: `${candidate.score}%` }}
                                                    />
                                                </div>
                                                <span className="font-black text-slate-900 text-sm">{Math.round(candidate.score)}%</span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => router.push(`/dashboard/candidate/${candidate.id}`)}
                                            className="px-6 py-3 bg-slate-900 text-white text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-blue-600 transition-all shadow-lg shadow-slate-900/10 hover:shadow-blue-500/20"
                                        >
                                            View Analysis by Radar
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
