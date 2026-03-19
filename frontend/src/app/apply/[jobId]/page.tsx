"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import { Upload, CheckCircle, AlertCircle, FileText } from 'lucide-react';

interface Job {
    id: number;
    title: string;
    description: string;
}

export default function ApplyPage() {
    const router = useRouter();
    const params = useParams();
    const jobId = params.jobId;

    const [job, setJob] = useState<Job | null>(null);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchJobDetails();
    }, [jobId]);

    const fetchJobDetails = async () => {
        try {
            const response = await axios.get(`http://localhost:8001/jobs/${jobId}`);
            setJob(response.data);
        } catch (error) {
            console.error("Failed to fetch job", error);
            setError("Job not found or closed.");
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file || !name || !email) {
            setError("Please fill all fields.");
            return;
        }

        setLoading(true);
        setError("");

        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("resume", file);

        try {
            await axios.post(`http://localhost:8001/jobs/${jobId}/apply`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setSubmitted(true);
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.detail || "Application failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (error && !job) {
        return (
            <div className="min-h-screen flex items-center justify-center text-red-500 bg-slate-50">
                <div className="text-center">
                    <AlertCircle className="w-12 h-12 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold">{error}</h1>
                </div>
            </div>
        )
    }

    if (!job) return <div className="p-10 text-center">Loading Job Details...</div>;

    if (submitted) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
                <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center">
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-10 h-10" />
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 mb-2">Application Sent!</h1>
                    <p className="text-slate-500 mb-8">
                        Your resume has been successfully submitted for the position of <strong className="text-slate-900">{job.title}</strong>.
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="w-full py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors"
                    >
                        Submit Another Application
                    </button>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-slate-50 py-12 px-6">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                    <div className="bg-blue-600 p-10 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-20 -mt-20"></div>
                        <h1 className="text-3xl font-black mb-2 relative z-10">{job.title}</h1>
                        <p className="opacity-90 relative z-10">We are looking for talented individuals to join our team.</p>
                    </div>

                    <div className="p-10">
                        <div className="mb-10">
                            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-blue-600" />
                                Job Description
                            </h2>
                            <div className="text-slate-600 leading-relaxed whitespace-pre-wrap bg-slate-50 p-6 rounded-xl border border-slate-100">
                                {job.description}
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                                    placeholder="John Doe"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                                    placeholder="john@example.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Resume (PDF/DOCX)</label>
                                <div className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${file ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'}`}>
                                    <input
                                        type="file"
                                        required
                                        accept=".pdf,.docx,.doc,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                        onChange={handleFileChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    <div className="pointer-events-none">
                                        {file ? (
                                            <div className="flex flex-col items-center text-blue-600">
                                                <FileText className="w-8 h-8 mb-2" />
                                                <span className="font-bold">{file.name}</span>
                                                <span className="text-sm opacity-70">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center text-slate-400">
                                                <Upload className="w-8 h-8 mb-2" />
                                                <span className="font-medium">Click to upload or drag and drop</span>
                                                <span className="text-sm opacity-70">PDF or DOCX up to 5MB</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {error && (
                                <div className="p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-2">
                                    <AlertCircle className="w-5 h-5" />
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full py-4 text-white font-bold rounded-xl text-lg shadow-lg shadow-blue-500/30 transition-all ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-blue-500/50 hover:-translate-y-1'}`}
                            >
                                {loading ? 'Submitting Application...' : 'Submit Application'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
}
