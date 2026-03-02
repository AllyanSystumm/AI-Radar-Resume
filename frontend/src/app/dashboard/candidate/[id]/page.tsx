"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useAnalysis } from '@/context/AnalysisContext';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Target, BrainCircuit, Rocket, BookOpen, ChevronRight, X } from 'lucide-react';
import RadarChartCustom from '@/components/RadarChartCustom';
import Chatbot from '@/components/Chatbot';

export default function CandidateAnalysisPage() {
    const { isAuthenticated } = useAuth();
    const { analysisData, setAnalysisData } = useAnalysis();
    const router = useRouter();
    const params = useParams();
    const candidateId = params.id;

    const [loading, setLoading] = useState(true);
    const [showDefinitions, setShowDefinitions] = useState(false);
    const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

    useEffect(() => {
        fetchCandidateAnalysis();
    }, [candidateId]);

    const fetchCandidateAnalysis = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:8000/candidates/${candidateId}`);
            setAnalysisData(response.data);
        } catch (error) {
            console.error("Failed to fetch candidate analysis", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading || !analysisData) {
        return <div className="min-h-screen flex items-center justify-center text-slate-500">Loading Analysis...</div>;
    }

    return (
        <div className="selection:bg-blue-500/30">
            <div className="max-w-7xl mx-auto">
                <button
                    onClick={() => router.back()}
                    className="mb-8 flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors group"
                >
                    <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    Back to List
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    {/* Left Column: Radar Chart */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                    >
                        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xl relative">
                            <div className="mb-6 px-2">
                                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Visualization of Radar</h3>
                            </div>
                            <RadarChartCustom
                                data={analysisData.scores}
                                onPointClick={(subject) => setSelectedSubject(subject)}
                                onDefinitionsClick={() => setShowDefinitions(true)}
                            />
                        </div>
                    </motion.div>

                    {/* Right Column: Score & Details */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                    >
                        {/* Overall Score Card */}
                        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-6 opacity-10">
                                <Target className="w-32 h-32 text-emerald-600" />
                            </div>
                            <div>
                                <span className="text-slate-500 text-sm font-bold uppercase tracking-widest">Overall Match</span>
                                <div className="flex items-baseline gap-2 mt-2">
                                    <span className="text-6xl font-black text-slate-900">{Math.round(analysisData.similarity_score)}%</span>
                                    <span className="text-xl font-bold text-emerald-600">{analysisData.analysis.circle} Circle</span>
                                </div>
                                <p className="mt-4 text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-4">
                                    {analysisData.upload_summary}
                                </p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="grid gap-4">
                            <button
                                onClick={() => router.push('/insights')}
                                className="group flex items-center justify-between p-6 bg-white hover:bg-slate-50 border border-slate-200 hover:border-blue-200 rounded-2xl transition-all shadow-sm hover:shadow-md"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-indigo-50 rounded-xl group-hover:bg-indigo-100 transition-colors">
                                        <BrainCircuit className="w-6 h-6 text-indigo-600" />
                                    </div>
                                    <div className="text-left">
                                        <h4 className="text-lg font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">Resume Insights</h4>
                                        <p className="text-slate-500 text-sm">View detailed strengths & weaknesses</p>
                                    </div>
                                </div>
                                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-1 transition-transform" />
                            </button>

                            <button
                                onClick={() => router.push('/questions')}
                                className="group flex items-center justify-between p-6 bg-white hover:bg-slate-50 border border-slate-200 hover:border-cyan-200 rounded-2xl transition-all shadow-sm hover:shadow-md"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-cyan-50 rounded-xl group-hover:bg-cyan-100 transition-colors">
                                        <Target className="w-6 h-6 text-cyan-600" />
                                    </div>
                                    <div className="text-left">
                                        <h4 className="text-lg font-bold text-slate-900 group-hover:text-cyan-700 transition-colors">Interview Questions</h4>
                                        <p className="text-slate-500 text-sm">10 AI-generated targeted questions</p>
                                    </div>
                                </div>
                                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Definitions Modal */}
            <AnimatePresence>
                {showDefinitions && analysisData && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                        onClick={() => setShowDefinitions(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-slate-900 border border-slate-700 rounded-3xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl relative"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setShowDefinitions(false)}
                                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            <div className="flex items-center gap-3 mb-6">
                                <BookOpen className="w-6 h-6 text-blue-400" />
                                <h2 className="text-2xl font-bold text-white">Dimension Definitions</h2>
                            </div>

                            <div className="grid gap-4">
                                {Object.entries(analysisData.dimension_definitions).map(([key, def], i) => (
                                    <div key={i} className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                                        <h3 className="text-blue-300 font-bold capitalize mb-1">{key}</h3>
                                        <p className="text-slate-300 text-sm leading-relaxed">
                                            {def as string}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Selected Subject Context Modal */}
            <AnimatePresence>
                {selectedSubject && analysisData && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                        onClick={() => setSelectedSubject(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl relative border border-slate-200"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setSelectedSubject(null)}
                                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            <h3 className="text-2xl font-black text-slate-900 mb-2 capitalize pr-8">
                                {selectedSubject}
                            </h3>

                            <div className="flex items-center gap-3 mb-6">
                                <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-lg font-bold shadow-blue-500/30 shadow-lg">
                                    {analysisData.scores[selectedSubject]}/10
                                </div>
                                <span className="text-slate-500 font-medium text-sm border-l border-slate-300 pl-3 uppercase tracking-wide">
                                    Score Analysis
                                </span>
                            </div>

                            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                                <h4 className="text-blue-600 font-bold text-sm uppercase tracking-wider mb-2 flex items-center gap-2">
                                    <BookOpen className="w-4 h-4" />
                                    Definition & Context
                                </h4>
                                <p className="text-slate-700 leading-relaxed text-base">
                                    {analysisData.dimension_definitions[selectedSubject] || "No definition available for this dimension."}
                                </p>
                            </div>

                            <div className="mt-6 flex justify-end">
                                <button
                                    onClick={() => setSelectedSubject(null)}
                                    className="bg-slate-900 text-white px-6 py-2 rounded-xl font-bold hover:bg-slate-800 transition-colors"
                                >
                                    Close
                                </button>
                            </div>

                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <Chatbot />
        </div>
    );
}
