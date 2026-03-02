"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAnalysis } from '@/context/AnalysisContext';
import { useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';
import AnalysisDetails from '@/components/AnalysisDetails';
import { ChevronLeft } from 'lucide-react';

export default function InsightsPage() {
    const { analysisData } = useAnalysis();
    const { isAuthenticated } = useAuth();
    const router = useRouter();

    const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, router]);

    if (!isAuthenticated) return null;

    if (!analysisData) {
        return (
            <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center text-slate-400 p-6">
                <p>No analysis data found. Please upload a resume first.</p>
                <button
                    onClick={() => router.push('/')}
                    className="mt-4 px-6 py-2 bg-blue-600 rounded-full text-white font-bold hover:bg-blue-500 transition-colors"
                >
                    Go Home
                </button>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-slate-50 text-slate-900 p-6">
            <button
                onClick={() => router.back()}
                className="mb-6 flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors group"
            >
                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                Back
            </button>

            <div className="max-w-5xl mx-auto">
                <AnalysisDetails
                    similarityScore={analysisData.similarity_score}
                    uploadSummary={analysisData.upload_summary}
                    scores={analysisData.scores}
                    dimensionDefinitions={analysisData.dimension_definitions}
                    analysis={analysisData.analysis}
                    questions={[]}
                    selectedSubject={selectedSubject}
                    onClose={() => router.back()}
                />
            </div>
        </main>
    );
}
