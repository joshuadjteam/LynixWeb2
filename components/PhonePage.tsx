import React, { useState, useEffect } from 'react';
import { User, CallStatus } from '../types';
import { useCall } from './CallProvider';
import { LargeUserIcon, MuteIcon, UnmuteIcon } from './icons';

const formatDuration = (seconds: number): string => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
};


const InCallView: React.FC<{ user: User }> = ({ user }) => {
    const { activeCall, endCall } = useCall();
    const [duration, setDuration] = useState(0);
    const [isMuted, setIsMuted] = useState(false);

    useEffect(() => {
        if (activeCall?.status !== CallStatus.Answered || !activeCall.start_time) {
            setDuration(0);
            return;
        }

        const interval = setInterval(() => {
            const startTime = new Date(activeCall.start_time!).getTime();
            const now = Date.now();
            setDuration(Math.floor((now - startTime) / 1000));
        }, 1000);

        return () => clearInterval(interval);
    }, [activeCall]);

    if (!activeCall) return null;

    const otherUserUsername = activeCall.caller_id === user.id ? activeCall.receiver_username : activeCall.caller_username;
    
    const getStatusText = () => {
        switch (activeCall.status) {
            case CallStatus.Ringing:
                return activeCall.caller_id === user.id ? `ringing ${otherUserUsername}...` : 'Incoming call...';
            case CallStatus.Answered:
                return `Connected | ${formatDuration(duration)}`;
            case CallStatus.Ended:
                return 'Call Ended';
            default:
                return '...';
        }
    };

    return (
        <div className="w-full h-full bg-blue-400 dark:bg-blue-600 rounded-xl flex flex-col p-8 text-black">
            <div className="flex justify-between items-start">
                <LargeUserIcon />
                <div className="text-right">
                    <h2 className="text-5xl font-bold">{otherUserUsername}</h2>
                    <p className="text-lg mt-2">{getStatusText()}</p>
                </div>
            </div>
            <div className="flex-grow"></div>
            <div className="flex justify-between items-end">
                <div className="space-y-3">
                    <button className="px-6 py-3 bg-gray-300 dark:bg-gray-500 text-black font-semibold rounded-lg shadow-md transition transform hover:scale-105 opacity-50 cursor-not-allowed">Add this user</button>
                    <button className="px-6 py-3 bg-gray-300 dark:bg-gray-500 text-black font-semibold rounded-lg shadow-md transition transform hover:scale-105 opacity-50 cursor-not-allowed">Message User</button>
                    <button onClick={() => setIsMuted(prev => !prev)} className="px-6 py-3 bg-gray-300 dark:bg-gray-500 text-black font-semibold rounded-lg shadow-md transition transform hover:scale-105 flex items-center gap-2">
                        {isMuted ? <UnmuteIcon /> : <MuteIcon />}
                        {isMuted ? 'Unmute' : 'Mute'}
                    </button>
                </div>
                <button onClick={endCall} className="px-16 py-6 bg-red-600 hover:bg-red-700 text-white text-4xl font-bold rounded-2xl shadow-lg transition transform hover:scale-105">
                    End
                </button>
            </div>
        </div>
    );
};


const Dialer: React.FC<{ currentUser: User }> = ({ currentUser }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { makeCall } = useCall();

    useEffect(() => {
        const fetchUsers = async () => {
            setIsLoading(true);
            try {
                const res = await fetch('/api/phone/users');
                if (res.ok) {
                    const data = await res.json();
                    setUsers(data.filter((u: User) => u.id !== currentUser.id));
                }
            } catch (error) {
                console.error("Failed to fetch users:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchUsers();
    }, [currentUser.id]);

    return (
         <div className="w-full h-full">
            <h2 className="text-3xl font-bold text-center mb-6">Dialer</h2>
            {isLoading ? <p>Loading users...</p> : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {users.map(user => (
                        <div key={user.id} className="bg-gray-100/50 dark:bg-gray-800/50 p-4 rounded-lg flex justify-between items-center">
                            <span className="font-semibold">{user.username}</span>
                            <button onClick={() => makeCall(user.id)} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition">
                                Call
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};


const PhonePage: React.FC<{ currentUser: User }> = ({ currentUser }) => {
    const { activeCall } = useCall();

    return (
        <div className="w-full h-[calc(100vh-150px)] max-w-7xl mx-auto bg-white/70 dark:bg-black/30 p-4 sm:p-6 rounded-xl shadow-2xl border-2 border-purple-500/50 backdrop-blur-sm text-gray-800 dark:text-white flex flex-col">
            {activeCall ? <InCallView user={currentUser} /> : <Dialer currentUser={currentUser} />}
        </div>
    );
};

export default PhonePage;