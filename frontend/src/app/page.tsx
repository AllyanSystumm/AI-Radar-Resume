"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import JobPostingForm from '@/components/JobPostingForm';
import { BrainCircuit, Rocket, Target, LogIn, Briefcase } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';

export default function Home() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard/create');
    } else {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  return <div className="min-h-screen bg-slate-50 flex items-center justify-center font-bold text-slate-400 uppercase tracking-widest text-xs">Initializing...</div>;
}
