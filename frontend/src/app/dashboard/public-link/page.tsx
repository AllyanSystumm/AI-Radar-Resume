"use client";

import React from 'react';
import { Globe, Copy, ExternalLink, Link as LinkIcon } from 'lucide-react';

export default function PublicLinkPage() {
    const handleCopy = () => {
        const dummyUrl = "http://localhost:3000/apply/sample-job-id";
        navigator.clipboard.writeText(dummyUrl);
        alert("Public apply link copied to clipboard!");
    };

    return (
        <div className="space-y-10">
            <header>
                <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase mb-2">Public Apply Links</h2>
                <p className="text-slate-500 font-medium text-sm">Generate and manage links for candidates to apply directly</p>
            </header>

            <div className="bg-white rounded-[2.5rem] border border-slate-100 p-12 shadow-sm">
                <div className="max-w-2xl mx-auto text-center">
                    <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-blue-100 shadow-sm">
                        <Globe className="w-10 h-10 text-blue-600" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 mb-4 uppercase italic">Your Public Careers Page</h3>
                    <p className="text-slate-500 font-medium mb-10 leading-relaxed">
                        Share this link with candidates or post it on social media.
                        Candidates who apply through this link will automatically appear in your dashboard.
                    </p>

                    <div className="flex items-center gap-4 bg-slate-50 p-6 rounded-2xl border border-slate-100 mb-8">
                        <code className="flex-1 text-sm font-bold text-slate-700 truncate">
                            http://localhost:3000/apply/portal
                        </code>
                        <button
                            onClick={handleCopy}
                            className="p-3 bg-white text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm border border-slate-200"
                        >
                            <Copy className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                            onClick={handleCopy}
                            className="w-full sm:w-auto px-8 py-4 bg-[#1E5CFF] text-white font-bold text-sm rounded-xl hover:bg-[#154ED9] transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
                        >
                            <LinkIcon className="w-4 h-4" />
                            Copy Main Portal Link
                        </button>
                        <button className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 font-bold text-sm rounded-xl border border-slate-200 hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                            <ExternalLink className="w-4 h-4" />
                            View Portal
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                <div className="bg-blue-600 p-8 rounded-[2rem] text-white relative overflow-hidden group shadow-xl shadow-blue-500/10">
                    <div className="relative z-10">
                        <h4 className="text-lg font-black uppercase mb-2 tracking-tight">QR Code Access</h4>
                        <p className="text-blue-100 text-sm font-medium mb-6">
                            Generate a QR code for your physical hiring events or office receptions.
                        </p>
                        <button className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold text-xs transition-all backdrop-blur-md border border-white/20">
                            Download QR Code
                        </button>
                    </div>
                    <Globe className="absolute -bottom-10 -right-10 w-48 h-48 text-white opacity-5 group-hover:scale-110 transition-transform" />
                </div>

                <div className="bg-slate-900 p-8 rounded-[2rem] text-white relative overflow-hidden group shadow-xl shadow-slate-900/10">
                    <div className="relative z-10">
                        <h4 className="text-lg font-black uppercase mb-2 tracking-tight">Custom Domains</h4>
                        <p className="text-slate-400 text-sm font-medium mb-6">
                            Connect your company domain to provide a seamless branded experience.
                        </p>
                        <button className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold text-xs transition-all backdrop-blur-md border border-white/10">
                            Upgrade to Pro
                        </button>
                    </div>
                    <LinkIcon className="absolute -bottom-10 -right-10 w-48 h-48 text-white opacity-5 group-hover:scale-110 transition-transform" />
                </div>
            </div>
        </div>
    );
}
