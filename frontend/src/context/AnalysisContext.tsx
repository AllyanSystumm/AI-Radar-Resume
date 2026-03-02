"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AnalysisData {
    similarity_score: number;
    upload_summary: string;
    scores: Record<string, number>;
    dimension_definitions: Record<string, string>;
    analysis: {
        circle: string;
        strengths: string[];
        weaknesses: string[];
        reasons: {
            strengths: string;
            weaknesses: string;
        };
    };
    interview_questions: {
        easy: string[];
        medium: string[];
        hard: string[];
    };
    resume_text?: string;
    jd_text?: string;
}

interface AnalysisContextType {
    analysisData: AnalysisData | null;
    setAnalysisData: (data: AnalysisData | null) => void;
}

const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined);

export const AnalysisProvider = ({ children }: { children: ReactNode }) => {
    const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);

    return (
        <AnalysisContext.Provider value={{ analysisData, setAnalysisData }}>
            {children}
        </AnalysisContext.Provider>
    );
};

export const useAnalysis = () => {
    const context = useContext(AnalysisContext);
    if (context === undefined) {
        throw new Error('useAnalysis must be used within an AnalysisProvider');
    }
    return context;
};
