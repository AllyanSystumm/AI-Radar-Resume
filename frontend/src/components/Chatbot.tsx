"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, X, Bot, User, Loader2 } from 'lucide-react';
import axios from 'axios';
import { useChat } from '../context/ChatContext';
import { useAnalysis } from '../context/AnalysisContext';

const Chatbot: React.FC = () => {
    const { analysisData } = useAnalysis();
    const { messages, isOpen, toggleChat, addMessage, setIsOpen } = useChat();
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = input.trim();
        setInput('');
        addMessage({ role: 'user', content: userMessage });
        setLoading(true);

        try {
            const response = await axios.post('http://localhost:8001/chat', {
                message: userMessage,
                resume_text: analysisData?.resume_text || "",
                jd_text: analysisData?.jd_text || ""
            });
            addMessage({ role: 'bot', content: response.data.response });
        } catch (error) {
            addMessage({ role: 'bot', content: 'I apologize, but I am having trouble connecting to the support server right now.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-8 right-8 z-50">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="mb-4 w-96 h-[500px] bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden"
                    >
                        <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex justify-between items-center shadow-lg">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white/20 rounded-xl">
                                    <Bot className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-black text-sm uppercase tracking-widest leading-none mb-1">Support Assistant</h3>
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                                        <span className="text-[10px] font-bold text-blue-100 uppercase tracking-tighter">Online & Ready</span>
                                    </div>
                                </div>
                            </div>
                            <button onClick={toggleChat} className="hover:rotate-90 transition-transform">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-slate-50/30">
                            {messages.map((m, i) => (
                                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] p-4 rounded-2xl text-sm font-medium shadow-sm whitespace-pre-wrap ${m.role === 'user'
                                        ? 'bg-blue-600 text-white rounded-tr-none'
                                        : 'bg-white border border-slate-100 text-slate-700 rounded-tl-none'
                                        }`}>
                                        {m.content}
                                    </div>
                                </div>
                            ))}
                            {loading && (
                                <div className="flex justify-start">
                                    <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-tl-none flex items-center gap-2">
                                        <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                                        <span className="text-xs text-slate-400 font-bold uppercase tracking-tighter">Thinking...</span>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        <div className="p-4 bg-white border-t border-slate-100">
                            <div className="flex gap-2 bg-slate-100 rounded-2xl p-2 pr-4 focus-within:ring-2 ring-blue-500/20 transition-all">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Ask about the radar system..."
                                    className="flex-1 bg-transparent border-none focus:outline-none px-4 text-sm font-medium text-slate-700 placeholder:text-slate-400"
                                />
                                <button
                                    onClick={handleSend}
                                    className="p-2 bg-blue-600 rounded-xl text-white hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleChat}
                className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center shadow-2xl relative group"
            >
                <div className="absolute inset-0 bg-blue-400 rounded-full blur-xl opacity-0 group-hover:opacity-40 transition-opacity"></div>
                {isOpen ? <X className="w-8 h-8 relative z-10" /> : <MessageSquare className="w-8 h-8 relative z-10" />}
            </motion.button>
        </div>
    );
};

export default Chatbot;
