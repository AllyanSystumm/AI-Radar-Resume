"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Briefcase, Send, AlertCircle, Loader2 } from 'lucide-react';
import axios from 'axios';

const JobPostingForm: React.FC = () => {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !description.trim()) {
            setError("Please provide both a job title and description.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await axios.post('http://localhost:8001/jobs', {
                title: title.trim(),
                description: description.trim()
            });
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.detail || "Failed to create job posting.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-2xl bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden">
            <div className="p-10">
                <header className="mb-10 flex items-center gap-5">
                    <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center border border-blue-100 shadow-sm">
                        <Briefcase className="w-7 h-7 text-blue-600" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 leading-tight">Create Job Post</h2>
                        <p className="text-slate-500 font-medium text-sm">Post a job to receive AI ranked candidate resumes</p>
                    </div>
                </header>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div>
                        <label className="block text-[11px] font-black text-black mb-3 uppercase tracking-[2px]">Job Title</label>
                        <input
                            type="text"
                            className="w-full p-4 bg-white border border-black rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 focus:outline-none transition-all font-medium text-slate-900 placeholder:text-slate-300"
                            placeholder="e.g. Senior Frontend Developer"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-[11px] font-black text-black mb-3 uppercase tracking-[2px]">Job Description</label>
                        <textarea
                            className="w-full h-48 p-5 bg-white border border-black rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 focus:outline-none transition-all font-medium text-slate-900 placeholder:text-slate-300 resize-none leading-relaxed"
                            placeholder="Paste the full job requirements and role description here..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    {error && (
                        <div className="flex items-center gap-3 text-rose-500 text-xs font-bold bg-rose-50/50 p-4 rounded-xl border border-rose-100">
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-4.5 bg-[#1E5CFF] hover:bg-[#154ED9] text-white font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 group shadow-lg shadow-blue-500/20 active:scale-[0.98] ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {loading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        )}
                        <span>{loading ? 'Launching...' : 'Launch Recruitment'}</span>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default JobPostingForm;
