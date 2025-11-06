import React, { useState } from 'react';
import { User, ProfileTab, ChatMessage } from '../types';
import { UserIcon, BillingIcon, AIIcon, SendIcon } from './icons';
import { runChat } from '../services/geminiService';

interface ProfilePageProps {
    user: User;
    onSignOut: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user, onSignOut }) => {
    const [activeTab, setActiveTab] = useState<ProfileTab>(ProfileTab.Info);

    const TabButton: React.FC<{ tab: ProfileTab; label: string; icon: React.ReactNode; disabled?: boolean }> = ({ tab, label, icon, disabled }) => {
        const isActive = activeTab === tab;
        return (
            <button
                onClick={() => !disabled && setActiveTab(tab)}
                disabled={disabled}
                className={`flex items-center gap-3 w-full p-3 rounded-lg text-left transition ${
                    isActive
                        ? 'bg-purple-600 text-white'
                        : disabled
                        ? 'text-gray-500 cursor-not-allowed bg-gray-800'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
            >
                {icon}
                <span className="font-semibold">{label}</span>
            </button>
        );
    };
    
    const InfoTab: React.FC = () => (
        <div>
            <h3 className="text-2xl font-bold mb-6">Account Information</h3>
            <div className="space-y-4 text-lg">
                <p><span className="font-semibold text-gray-400 w-24 inline-block">Username:</span> {user.username}</p>
                <p><span className="font-semibold text-gray-400 w-24 inline-block">Email:</span> {user.email}</p>
                <p><span className="font-semibold text-gray-400 w-24 inline-block">SIP Voice:</span> {user.sip}</p>
                <p><span className="font-semibold text-gray-400 w-24 inline-block">Role:</span> <span className="capitalize">{user.role}</span></p>
            </div>
        </div>
    );

    const BillingTab: React.FC = () => {
        if (!user.billing || !user.plan) {
            return (
                 <div>
                    <h3 className="text-2xl font-bold mb-6">Billing & Plan</h3>
                    <p className="text-gray-400">Billing or plan information is not available for this account. Please contact support.</p>
                </div>
            )
        }

        const statusColor = {
            'On Time': 'text-green-400',
            'Overdue': 'text-yellow-400',
            'Suspended': 'text-red-400',
        }[user.billing.status];

        return (
            <div>
                <h3 className="text-2xl font-bold mb-6">Billing & Plan</h3>
                {user.billing.status === 'Suspended' && (
                     <div className="bg-red-900/50 border border-red-500 text-red-300 p-4 rounded-lg mb-6">
                        <h4 className="font-bold text-xl">Account Suspended</h4>
                        <p>Your account is currently suspended due to non-payment. Please contact support to resolve this issue.</p>
                    </div>
                )}
                <div className="space-y-4 text-lg">
                    <p><span className="font-semibold text-gray-400 w-32 inline-block">Current Plan:</span> {user.plan.name}</p>
                    <p><span className="font-semibold text-gray-400 w-32 inline-block">Cost:</span> {user.plan.cost}</p>
                    <p><span className="font-semibold text-gray-400 w-32 inline-block">Plan Details:</span> {user.plan.details}</p>
                    <hr className="border-gray-600 my-4" />
                    <p><span className="font-semibold text-gray-400 w-32 inline-block">Status:</span> <span className={`font-bold ${statusColor}`}>{user.billing.status}</span></p>
                    {user.billing.owes && user.billing.owes > 0 && <p><span className="font-semibold text-gray-400 w-32 inline-block">Amount Due:</span> <span className="font-bold text-yellow-400">${user.billing.owes.toFixed(2)}</span></p>}
                </div>
            </div>
        );
    };

    const AITab: React.FC = () => {
        const [messages, setMessages] = useState<ChatMessage[]>([
            { sender: 'gemini', text: `Hi ${user.username}! I'm Lyra, your personal AI assistant. How can I assist you with your project today?` }
        ]);
        const [input, setInput] = useState('');
        const [isLoading, setIsLoading] = useState(false);

        const handleSend = async () => {
            if (input.trim() === '' || isLoading) return;
            const userMessage: ChatMessage = { sender: 'user', text: input };
            setMessages(prev => [...prev, userMessage]);
            setInput('');
            setIsLoading(true);
            const responseText = await runChat(input);
            const geminiMessage: ChatMessage = { sender: 'gemini', text: responseText };
            setMessages(prev => [...prev, geminiMessage]);
            setIsLoading(false);
        };
        
         const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter') {
                handleSend();
            }
        };

        return (
            <div className="h-full flex flex-col">
                <h3 className="text-2xl font-bold mb-4">Your Personal AI Assistant</h3>
                <div className="flex-1 bg-gray-900/50 rounded-lg p-4 overflow-y-auto space-y-4">
                     {messages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-md p-3 rounded-2xl ${msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-200'}`}>
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
                </div>
                <div className="mt-4">
                    <div className="flex items-center bg-gray-700 rounded-lg">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Ask your AI assistant..."
                            className="flex-1 bg-transparent p-3 text-white focus:outline-none"
                            disabled={isLoading}
                        />
                        <button onClick={handleSend} disabled={isLoading} className="p-3 text-white disabled:text-gray-500 hover:text-blue-400 transition">
                            <SendIcon />
                        </button>
                    </div>
                </div>
            </div>
        );
    };
    
    const isTrialOrGuest = user.role === 'trial' || user.role === 'guest';

    const renderContent = () => {
        switch (activeTab) {
            case ProfileTab.Info: return <InfoTab />;
            case ProfileTab.Billing: return <BillingTab />;
            case ProfileTab.AI: return <AITab />;
            default: return <InfoTab />;
        }
    };

    return (
        <div className="w-full max-w-6xl mx-auto bg-black bg-opacity-30 p-8 rounded-xl shadow-2xl border-2 border-purple-500/50 backdrop-blur-sm text-white">
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h2 className="text-4xl font-bold">Welcome, {user.username}!</h2>
                    <p className="text-gray-300">This is your personal Lynix portal.</p>
                </div>
                <button onClick={onSignOut} className="px-4 py-2 rounded-lg text-white font-semibold transition-all duration-300 transform bg-purple-600 hover:bg-purple-700 hover:scale-105">
                    Sign Out
                </button>
            </div>
            <div className="flex flex-col md:flex-row gap-8" style={{ minHeight: '50vh' }}>
                <div className="w-full md:w-1/4">
                    <nav className="space-y-2">
                        <TabButton tab={ProfileTab.Info} label="Info" icon={<UserIcon />} />
                        <TabButton tab={ProfileTab.Billing} label="Billing" icon={<BillingIcon />} disabled={isTrialOrGuest} />
                        <TabButton tab={ProfileTab.AI} label="AI Portal" icon={<AIIcon />} disabled={user.billing?.status === 'Suspended' || isTrialOrGuest} />
                    </nav>
                </div>
                <main className="w-full md:w-3/4 bg-gray-800/50 p-6 rounded-lg">
                    <div key={activeTab} className="animate-content-fade">
                        {renderContent()}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ProfilePage;