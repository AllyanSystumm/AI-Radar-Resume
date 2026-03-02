"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, AlertTriangle, Lightbulb, HelpCircle, X } from 'lucide-react';

interface AnalysisDetailsProps {
    similarityScore: number;
    uploadSummary: string;
    scores: Record<string, number>;
    dimensionDefinitions: Record<string, string>;
    analysis: {
        circle: string;
        strengths: string[];
        weaknesses: string[];
        reasons: {
            strengths: string;
            weaknesses: string;
        };
    };
    questions: string[];
    selectedSubject: string | null;
    onClose: () => void;
}

const AnalysisDetails: React.FC<AnalysisDetailsProps> = ({
    similarityScore,
    uploadSummary,
    scores,
    dimensionDefinitions,
    analysis,
    questions,
    selectedSubject,
    onClose
}) => {
    return (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-8 relative">
            <div className="flex flex-col md:flex-row justify-between items-start mb-10 gap-6">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 mb-2">Expert Evaluation</h2>
                    <p className="text-slate-500 text-sm font-medium max-w-xl">{uploadSummary || "Advanced LLM-driven candidate profiling"}</p>
                </div>

                <div className="flex items-start gap-6">
                    <div className="flex flex-col items-end">
                        <span className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mb-1">Match Quality</span>
                        <div className="flex items-baseline gap-2">
                            <span className="text-5xl font-black text-slate-900">{Math.round(similarityScore)}%</span>
                            <span className="text-sm text-blue-600 font-black uppercase">{analysis.circle}</span>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-all text-slate-500 hover:text-slate-900"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>
            </div>

            <div className="space-y-12">
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-indigo-100 rounded-2xl">
                            <Target className="w-6 h-6 text-indigo-600" />
                        </div>
                        <h3 className="text-xl font-black text-indigo-700 uppercase tracking-tighter">Key Dimensions</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(scores || {}).map(([key, score], i) => (
                            <div key={i} className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-bold text-slate-700 capitalize">{key}</span>
                                    <span className="font-black text-indigo-600">{score}/10</span>
                                </div>
                                <p className="text-xs text-slate-500 leading-relaxed">
                                    {dimensionDefinitions?.[key] || "Key competency for this role."}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-emerald-100 rounded-2xl">
                            <Target className="w-6 h-6 text-emerald-700" />
                        </div>
                        <h3 className="text-xl font-black text-emerald-800 uppercase tracking-tighter">Core Strengths</h3>
                    </div>
                    <div className="bg-gradient-to-br from-emerald-50 via-emerald-50/80 to-emerald-100/50 rounded-3xl p-8 border border-emerald-200/50 shadow-sm">
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            {analysis.strengths && analysis.strengths.length > 0 ? (
                                analysis.strengths.map((s, i) => (
                                    <li key={i} className="flex items-start gap-3 text-slate-900 text-sm font-semibold">
                                        <span className="mt-1.5 w-2 h-2 rounded-full bg-emerald-600 flex-shrink-0" />
                                        {s}
                                    </li>
                                ))
                            ) : (
                                <li className="flex items-start gap-3 text-slate-500 text-sm font-medium italic">
                                    The candidate has no strengths and no matching with the job description
                                </li>
                            )}
                        </ul>
                        <div className="pt-6 border-t border-emerald-100">
                            <p className="text-emerald-900 text-sm font-bold flex items-start gap-3 leading-relaxed">
                                <Lightbulb className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                                {analysis.reasons.strengths || "The candidate's profile does not align with the requirements of this role."}
                            </p>
                        </div>
                    </div>
                </section>

                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-rose-100 rounded-2xl">
                            <AlertTriangle className="w-6 h-6 text-rose-700" />
                        </div>
                        <h3 className="text-xl font-black text-rose-800 uppercase tracking-tighter">Critical Skill Gaps</h3>
                    </div>
                    <div className="bg-gradient-to-br from-rose-50 via-rose-50/80 to-rose-100/50 rounded-3xl p-8 border border-rose-200/50 shadow-sm">
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            {analysis.weaknesses.map((w, i) => (
                                <li key={i} className="flex items-start gap-3 text-slate-900 text-sm font-semibold">
                                    <span className="mt-1.5 w-2 h-2 rounded-full bg-rose-600 flex-shrink-0" />
                                    {w}
                                </li>
                            ))}
                        </ul>
                        <div className="pt-6 border-t border-rose-100">
                            <p className="text-rose-900 text-sm font-bold flex items-start gap-3 leading-relaxed">
                                <Lightbulb className="w-5 h-5 text-rose-600 flex-shrink-0" />
                                {analysis.reasons.weaknesses}
                            </p>
                        </div>
                    </div>
                </section>

                {questions.length > 0 && (
                    <section className="bg-slate-50 rounded-3xl p-10 border border-slate-200">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-3 bg-blue-100 rounded-2xl">
                                <HelpCircle className="w-6 h-6 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-black text-blue-700 uppercase tracking-tighter">Targeted Probe Questions</h3>
                        </div>
                        <div className="space-y-4">
                            {questions.map((q, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all text-sm font-medium text-slate-700 flex gap-5 group"
                                >
                                    <span className="font-black text-blue-600 group-hover:scale-110 transition-transform">{String(i + 1).padStart(2, '0')}</span>
                                    {q}
                                </motion.div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div >
    );
};

export default AnalysisDetails;
