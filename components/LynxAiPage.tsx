import React, { useState, useRef, useEffect } from 'react';
import { User, ChatMessage } from '../types';
import { runChat } from '../services/geminiService';
import { LynxAiLogo, SimpleUserIcon, SendIcon } from './icons';

interface LynxAiPageProps {
    user: User;
}

const LynxAiPage: React.FC<LynxAiPageProps> = ({ user }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const hasStartedChat = messages.length > 0;

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        // Initial greeting from Mason
        const fetchGreeting = async () => {
            setIsLoading(true);
            const greeting = await runChat(`Please introduce yourself to ${user.username}.`);
            setMessages([{ sender: 'gemini', text: greeting }]);
            setIsLoading(false);
        };
        fetchGreeting();
    }, [user.username]);

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
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="w-full h-[calc(100vh-150px)] bg-black flex flex-col text-white font-sans">
            {/* Header */}
            <header className="w-full p-4 bg-gray-900/50 flex justify-between items-center">
                <div className="text-gray-400">INSERT MENU BAR HERE</div>
                 <div className="flex items-center gap-3">
                    <span className="font-semibold">{user.username}</span>
                    <SimpleUserIcon />
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex flex-col items-center justify-center p-4 overflow-hidden">
                {!hasStartedChat ? (
                    <div className="text-center animate-content-fade">
                        <LynxAiLogo />
                        <h1 className="text-5xl font-bold mt-4">LynxAI</h1>
                    </div>
                ) : (
                    <div className="w-full max-w-4xl h-full overflow-y-auto space-y-4 pr-2">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex items-start gap-4 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {msg.sender === 'gemini' && <div className="w-8 h-8 bg-purple-600 rounded-full flex-shrink-0"></div>}
                                <div className={`max-w-xl p-4 rounded-2xl ${msg.sender === 'user' ? 'bg-blue-600' : 'bg-gray-800'}`}>
                                    <p className="whitespace-pre-wrap">{msg.text}</p>
                                </div>
                            </div>
                        ))}
                         {isLoading && (
                            <div className="flex items-start gap-4 justify-start">
                                <div className="w-8 h-8 bg-purple-600 rounded-full flex-shrink-0"></div>
                                <div className="max-w-xl p-4 rounded-2xl bg-gray-800">
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
                )}
            </main>

            {/* Footer Input */}
            <footer className="w-full p-4 flex justify-center">
                <div className="w-full max-w-4xl flex items-center bg-gray-800 rounded-xl p-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder="Type to message LynxAI"
                        className="flex-1 bg-transparent p-3 text-white focus:outline-none placeholder-gray-400"
                        disabled={isLoading}
                    />
                    <button onClick={handleSend} disabled={isLoading || input.trim() === ''} className="p-3 text-white disabled:text-gray-500 hover:text-blue-400 transition rounded-full bg-gray-700 disabled:bg-gray-800">
                        <SendIcon />
                    </button>
                </div>
            </footer>
        </div>
    );
};

export default LynxAiPage;