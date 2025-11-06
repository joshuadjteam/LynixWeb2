
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { runChat } from '../services/geminiService';
import { SendIcon, CloseIcon } from './icons';

interface GeminiChatProps {
    isOpen: boolean;
    onClose: () => void;
}

const GeminiChat: React.FC<GeminiChatProps> = ({ isOpen, onClose }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([
        { sender: 'gemini', text: "Hello! I'm Lyra, your AI assistant from Lynix. How can I help you today?" }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (input.trim() === '' || isLoading) return;

        const userMessage: ChatMessage = { sender: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const responseText = await runChat(input);
            const geminiMessage: ChatMessage = { sender: 'gemini', text: responseText };
            setMessages(prev => [...prev, geminiMessage]);
        } catch (error) {
            const errorMessage: ChatMessage = { sender: 'gemini', text: "Sorry, I'm having trouble connecting right now." };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };
    
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div 
                className="bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg h-[80vh] flex flex-col relative transform transition-all duration-300 scale-95 animate-fade-in"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center p-4 border-b border-gray-700">
                    <h3 className="text-xl font-bold text-white">Lynix AI Assistant</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <CloseIcon />
                    </button>
                </div>
                <div className="flex-1 p-4 overflow-y-auto space-y-4">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-xs md:max-w-md p-3 rounded-2xl ${msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-200'}`}>
                                <p className="whitespace-pre-wrap">{msg.text}</p>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                         <div className="flex justify-start">
                            <div className="max-w-xs md:max-w-md p-3 rounded-2xl bg-gray-700 text-gray-200">
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-75"></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-150"></div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
                <div className="p-4 border-t border-gray-700">
                    <div className="flex items-center bg-gray-700 rounded-lg">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Ask something..."
                            className="flex-1 bg-transparent p-3 text-white focus:outline-none"
                            disabled={isLoading}
                        />
                        <button onClick={handleSend} disabled={isLoading} className="p-3 text-white disabled:text-gray-500 hover:text-blue-400 transition">
                            <SendIcon />
                        </button>
                    </div>
                </div>
            </div>
            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: scale(0.9); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
            `}</style>
        </div>
    );
};

export default GeminiChat;
