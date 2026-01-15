'use client';

import { useState } from 'react';
import { Technology } from '../lib/supabase';

interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

interface ChatBotProps {
    technologies: Technology[];
}

// Basic markdown-lite formatter for cleaner chat output
function FormattedMessage({ content }: { content: string }) {
    // Split into lines to process lists and blocks specifically
    const lines = content.split('\n');
    const result: React.ReactNode[] = [];
    let currentList: React.ReactNode[] = [];

    const flushList = (key: number) => {
        if (currentList.length > 0) {
            result.push(<ul key={`list-${key}`} className="list-disc pl-5 mt-2 mb-4 space-y-2">{currentList}</ul>);
            currentList = [];
        }
    };

    lines.forEach((line, idx) => {
        const trimmed = line.trim();

        // Handle numbered "headers" or items (e.g., "1. Topic")
        // We match "1. ", "2. ", etc. at the start of the line
        if (/^\d+\.\s/.test(trimmed)) {
            flushList(idx);
            result.push(
                <div key={idx} className="font-bold text-gray-900 mt-4 mb-2">
                    {formatText(trimmed)}
                </div>
            );
        }
        // Handle bullet points
        else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
            currentList.push(
                <li key={idx} className="text-gray-700">
                    {formatText(trimmed.replace(/^[-*]\s/, ''))}
                </li>
            );
        }
        // Handle regular paragraphs
        else if (trimmed) {
            flushList(idx);
            result.push(
                <p key={idx} className="leading-relaxed mb-3">
                    {formatText(trimmed)}
                </p>
            );
        } else {
            flushList(idx);
        }
    });
    flushList(lines.length);

    return <div>{result}</div>;
}

// Helper to handle bolding and spacing in text
function formatText(text: string) {
    if (!text) return null;

    // Handle **bold** text
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={i} className="font-bold text-green-800">{part.slice(2, -2)}</strong>;
        }
        return part;
    });
}

export default function ChatBot({ technologies }: ChatBotProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            role: 'assistant',
            content: 'Hi! I can help you find the right agrifood technology. What are you looking for?'
        }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const sendMessage = async () => {
        if (!input.trim() || loading) return;

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userMessage,
                    technologies: technologies
                })
            });

            const data = await response.json();

            if (data.error) {
                throw new Error(data.error);
            }

            setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
        } catch (error: any) {
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: `Sorry, I encountered an error: ${error.message}`
            }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Floating Chat Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 transition-all z-50 hover:scale-110 active:scale-95 cursor-pointer flex items-center justify-center w-14 h-14"
                aria-label="Toggle Chat"
            >
                {isOpen ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                        <path d="m5 3 1 1" /><path d="m19 3-1 1" /><path d="m5 21 1-1" /><path d="m19 21-1-1" />
                    </svg>
                )}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-24 top-5 left-4 right-4 sm:left-auto sm:right-6 sm:w-[480px] sm:max-h-[800px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-gray-100 overflow-hidden animate-slide-up">
                    {/* Header */}
                    <div className="bg-green-600 text-white p-5 flex-shrink-0 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-xl">🤖</div>
                            <div>
                                <h3 className="font-bold text-lg leading-tight">ATIO Assistant</h3>
                                <p className="text-xs text-green-100 opacity-90">Expert Agrifood Guidance</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-colors cursor-pointer active:scale-95"
                            aria-label="Close Chat"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-gray-50/50">
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[85%] p-4 rounded-2xl shadow-sm ${msg.role === 'user'
                                        ? 'bg-green-600 text-white rounded-tr-none'
                                        : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                                        }`}
                                >
                                    {msg.role === 'assistant' ? (
                                        <FormattedMessage content={msg.content} />
                                    ) : (
                                        <p className="whitespace-pre-wrap">{msg.content}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-white border border-gray-100 p-4 rounded-2xl rounded-tl-none shadow-sm">
                                    <div className="flex gap-1.5">
                                        <div className="w-2 h-2 bg-green-300 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce delay-100"></div>
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce delay-200"></div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input */}
                    <div className="p-4 bg-white border-t">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                placeholder="Ask about technologies..."
                                className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800 text-sm"
                                disabled={loading}
                            />
                            <button
                                onClick={sendMessage}
                                disabled={loading || !input.trim()}
                                className="bg-green-600 text-white px-5 py-3 rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all active:scale-95 font-bold text-sm"
                            >
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}