"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAnalysis } from '@/context/AnalysisContext';
import { useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';
import { ChevronLeft, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function QuestionsPage() {
    const { analysisData } = useAnalysis();
    const { isAuthenticated } = useAuth();
    const router = useRouter();

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
                className="mb-8 flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors group"
            >
                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                Back
            </button>

            <div className="max-w-4xl mx-auto">
                <header className="flex items-center gap-4 mb-10">
                    <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                        <HelpCircle className="w-8 h-8 text-blue-600" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 mb-2">Interview Questions</h1>
                        <p className="text-slate-500">Targeted questions based on identified candidate weaknesses.</p>
                    </div>
                </header>

                <div className="space-y-12">
                    {/* Easy Questions */}
                    <div>
                        <h2 className="text-2xl font-bold text-emerald-600 mb-6 flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                            Easy Questions
                        </h2>
                        <div className="space-y-4">
                            {analysisData.interview_questions.easy?.map((q, i) => (
                                <QuestionCard key={`easy-${i}`} question={q} index={i + 1} color="emerald" />
                            ))}
                        </div>
                    </div>

                    {/* Medium Questions */}
                    <div>
                        <h2 className="text-2xl font-bold text-amber-600 mb-6 flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                            Medium Questions
                        </h2>
                        <div className="space-y-4">
                            {analysisData.interview_questions.medium?.map((q, i) => (
                                <QuestionCard key={`medium-${i}`} question={q} index={i + 1} color="amber" />
                            ))}
                        </div>
                    </div>

                    {/* Hard Questions */}
                    <div>
                        <h2 className="text-2xl font-bold text-rose-600 mb-6 flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                            Hard Questions
                        </h2>
                        <div className="space-y-4">
                            {analysisData.interview_questions.hard?.map((q, i) => (
                                <QuestionCard key={`hard-${i}`} question={q} index={i + 1} color="rose" />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

function QuestionCard({ question, index, color }: { question: string, index: number, color: string }) {
    const colorClasses = {
        emerald: "text-emerald-600 border-emerald-100 hover:border-emerald-300 hover:shadow-emerald-500/10",
        amber: "text-amber-600 border-amber-100 hover:border-amber-300 hover:shadow-amber-500/10",
        rose: "text-rose-600 border-rose-100 hover:border-rose-300 hover:shadow-rose-500/10"
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`bg-white p-6 rounded-2xl border transition-all group flex gap-5 items-start hover:shadow-lg ${colorClasses[color as keyof typeof colorClasses]}`}
        >
            <span className={`font-black text-lg opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all ${colorClasses[color as keyof typeof colorClasses].split(' ')[0]}`}>
                {String(index).padStart(2, '0')}
            </span>
            <p className="text-slate-700 font-medium text-lg leading-relaxed">{question}</p>
        </motion.div>
    );
}
