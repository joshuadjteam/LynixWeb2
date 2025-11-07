
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode, useRef } from 'react';
import { Call, CallStatus, User } from '../types';
import IncomingCallModal from './IncomingCallModal';

interface CallContextType {
    activeCall: Call | null;
    makeCall: (receiverId: string) => Promise<void>;
    answerCall: () => Promise<void>;
    declineCall: () => Promise<void>;
    endCall: () => Promise<void>;
}

const CallContext = createContext<CallContextType | undefined>(undefined);

export const useCall = (): CallContextType => {
    const context = useContext(CallContext);
    if (!context) {
        throw new Error('useCall must be used within a CallProvider');
    }
    return context;
};

export const CallProvider: React.FC<{ children: ReactNode; user: User | null }> = ({ children, user }) => {
    const [activeCall, setActiveCall] = useState<Call | null>(null);
    const [incomingCall, setIncomingCall] = useState<Call | null>(null);
    const pollIntervalRef = useRef<number | null>(null);

    const updateCallStatus = useCallback(async (call: Call, status: CallStatus) => {
        try {
            const response = await fetch(`/api/phone?type=call-update&id=${call.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status }),
            });
            if (response.ok) {
                const updatedCall = await response.json();
                setActiveCall(updatedCall);
                return updatedCall;
            }
        } catch (error) {
            console.error(`Failed to update call status to ${status}:`, error);
        }
        return null;
    }, []);

    const pollForStatus = useCallback(async () => {
        if (!user || (activeCall && activeCall.status !== 'ringing')) {
             // If we are in an active, answered call, we still need to poll
             // in case the other user hangs up.
             if(activeCall && activeCall.status === 'answered') {
                // Let's do nothing for now and let the user hang up.
                // A more advanced implementation might check if the call still exists.
             } else {
                return;
             }
        }
       
        try {
            const response = await fetch('/api/phone?type=status', {
                headers: { 'x-user-id': user.id }
            });

            if (response.ok) {
                const data = await response.json();
                if (data) {
                    // This is an incoming call
                    if (data.receiver_id === user.id && data.status === 'ringing' && !incomingCall && !activeCall) {
                        setIncomingCall(data);
                    } else if (data.id === activeCall?.id && data.status !== activeCall.status) {
                        // The status of our active call has changed (e.g., answered by other party, or ended)
                        setActiveCall(data);
                    } else if (data.status === 'ended' || data.status === 'declined') {
                        // The call is over, clear our state
                        setActiveCall(null);
                        setIncomingCall(null);
                    }
                } else {
                     // No active or incoming calls found for the user
                    if (activeCall && activeCall.status !== 'ended') {
                         // The call was active but now it's gone from the server, meaning it ended.
                        setActiveCall(null);
                    }
                    if (incomingCall) {
                        setIncomingCall(null);
                    }
                }
            }
        } catch (error) {
            console.error("Polling error:", error);
        }
    }, [user, activeCall, incomingCall]);


    useEffect(() => {
        if (user) {
            pollIntervalRef.current = window.setInterval(pollForStatus, 3000); // Poll every 3 seconds
        } else {
            if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
            setActiveCall(null);
            setIncomingCall(null);
        }
        return () => {
            if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
        };
    }, [user, pollForStatus]);

    const makeCall = async (receiverId: string) => {
        if (!user) return;
        try {
            const response = await fetch('/api/phone?type=call', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-user-id': user.id },
                body: JSON.stringify({ receiverId }),
            });
            if (response.ok) {
                const newCall = await response.json();
                setActiveCall(newCall);
            }
        } catch (error) {
            console.error("Failed to make call:", error);
        }
    };

    const answerCall = async () => {
        if (!incomingCall) return;
        const call = await updateCallStatus(incomingCall, CallStatus.Answered);
        if (call) {
            setActiveCall(call);
            setIncomingCall(null);
        }
    };

    const declineCall = async () => {
        if (!incomingCall) return;
        await updateCallStatus(incomingCall, CallStatus.Declined);
        setIncomingCall(null);
    };
    
    const endCall = async () => {
        if (!activeCall) return;
        await updateCallStatus(activeCall, CallStatus.Ended);
        setActiveCall(null);
    };

    return (
        <CallContext.Provider value={{ activeCall, makeCall, answerCall, declineCall, endCall }}>
            {children}
            {incomingCall && <IncomingCallModal call={incomingCall} onAnswer={answerCall} onDecline={declineCall} />}
        </CallContext.Provider>
    );
};
