"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Message {
    role: 'user' | 'bot';
    content: string;
}

interface ChatContextType {
    messages: Message[];
    isOpen: boolean;
    toggleChat: () => void;
    addMessage: (message: Message) => void;
    setIsOpen: (isOpen: boolean) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: 'bot', content: 'Hello! I am your AI Support Assistant. How can I help you with the Radar Resume Parser today?' }
    ]);

    const toggleChat = () => setIsOpen(prev => !prev);

    const addMessage = (message: Message) => {
        setMessages(prev => [...prev, message]);
    };

    return (
        <ChatContext.Provider value={{ messages, isOpen, toggleChat, addMessage, setIsOpen }}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error('useChat must be used within a ChatProvider');
    }
    return context;
};
